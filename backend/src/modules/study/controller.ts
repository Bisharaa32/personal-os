import { Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth.js'
import { supabase } from '../../server.js'
import axios from 'axios'

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
const HF_API_URL = 'https://api-inference.huggingface.co/models'

export async function uploadPDF(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { title, file_path, extracted_text } = req.body

    const { data, error } = await supabase
      .from('study_pdfs')
      .insert([
        {
          user_id: userId,
          title,
          file_path,
          extracted_text,
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload PDF' })
  }
}

export async function getPDFs(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('study_pdfs')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false })

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PDFs' })
  }
}

export async function getPDFContent(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params

    const { data, error } = await supabase
      .from('study_pdfs')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PDF' })
  }
}

export async function generateFlashcards(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { pdfId, content } = req.body

    // Use AI to generate flashcards
    const prompt = `Generate study flashcards from this content. Format as JSON array with 'front' and 'back' fields:\n\n${content}`

    const response = await axios.post(
      `${HF_API_URL}/mistralai/Mistral-7B-Instruct-v0.1`,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    )

    const generatedText = response.data[0]?.generated_text || ''
    const flashcards = parseFlashcards(generatedText)

    // Save flashcards
    const cardsToInsert = flashcards.map((card: any) => ({
      user_id: userId,
      pdf_id: pdfId,
      front: card.front,
      back: card.back,
      difficulty: 'medium',
    }))

    const { data, error } = await supabase
      .from('study_flashcards')
      .insert(cardsToInsert)
      .select()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error('Flashcard generation error:', error)
    res.status(500).json({ error: 'Failed to generate flashcards' })
  }
}

export async function getFlashcards(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { pdfId } = req.params

    const { data, error } = await supabase
      .from('study_flashcards')
      .select('*')
      .eq('user_id', userId)
      .eq('pdf_id', pdfId)

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flashcards' })
  }
}

export async function generateQuiz(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { pdfId, content, difficulty = 'medium' } = req.body

    const prompt = `Generate a quiz with 5 multiple choice questions about this content. Format as JSON with 'question', 'options' (array), and 'correct_answer' fields:\n\nContent:\n${content}`

    const response = await axios.post(
      `${HF_API_URL}/mistralai/Mistral-7B-Instruct-v0.1`,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    )

    const generatedText = response.data[0]?.generated_text || ''
    const questions = parseQuizQuestions(generatedText)

    const { data, error } = await supabase
      .from('study_quizzes')
      .insert([
        {
          user_id: userId,
          pdf_id: pdfId,
          title: `Quiz - ${new Date().toLocaleString()}`,
          questions,
          total_questions: questions.length,
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error('Quiz generation error:', error)
    res.status(500).json({ error: 'Failed to generate quiz' })
  }
}

export async function submitQuizAnswer(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { quizId, answers } = req.body

    const { data: quiz, error: quizError } = await supabase
      .from('study_quizzes')
      .select('*')
      .eq('id', quizId)
      .eq('user_id', userId)
      .single()

    if (quizError) throw quizError

    let score = 0
    quiz.questions.forEach((q: any, index: number) => {
      if (answers[index] === q.correct_answer) score++
    })

    const { data, error } = await supabase
      .from('study_quizzes')
      .update({
        score,
        completed_at: new Date(),
      })
      .eq('id', quizId)
      .select()
      .single()

    if (error) throw error

    res.json({
      quiz: data,
      score,
      total: quiz.total_questions,
      percentage: (score / quiz.total_questions) * 100,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit quiz' })
  }
}

export async function generateStudyNotes(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { pdfId, content } = req.body

    const prompt = `Create organized study notes from this content. Include headings, bullet points, and key terms. Format as markdown:\n\n${content}`

    const response = await axios.post(
      `${HF_API_URL}/mistralai/Mistral-7B-Instruct-v0.1`,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    )

    const notesContent = response.data[0]?.generated_text || ''

    const { data, error } = await supabase
      .from('study_notes')
      .insert([
        {
          user_id: userId,
          pdf_id: pdfId,
          content: notesContent,
          format: 'markdown',
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error('Study notes error:', error)
    res.status(500).json({ error: 'Failed to generate study notes' })
  }
}

export async function studyChat(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { pdfId, message } = req.body

    const { data: pdf } = await supabase
      .from('study_pdfs')
      .select('extracted_text')
      .eq('id', pdfId)
      .eq('user_id', userId)
      .single()

    const context = pdf?.extracted_text || ''
    const prompt = `You are a study assistant. Based on this document:\n\n${context}\n\nAnswer this question: ${message}`

    const response = await axios.post(
      `${HF_API_URL}/mistralai/Mistral-7B-Instruct-v0.1`,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    )

    const aiResponse = response.data[0]?.generated_text || ''

    res.json({
      response: aiResponse,
      pdfId,
    })
  } catch (error) {
    console.error('Study chat error:', error)
    res.status(500).json({ error: 'Failed to process study chat' })
  }
}

function parseFlashcards(text: string) {
  try {
    const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    // Fallback parsing
  }
  return []
}

function parseQuizQuestions(text: string) {
  try {
    const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (e) {
    // Fallback parsing
  }
  return []
}
