import { Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth.js'
import axios from 'axios'
import { supabase } from '../../server.js'

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
const HF_API_URL = 'https://api-inference.huggingface.co/models'

export async function chat(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { message, conversationId } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message required' })
    }

    // Call Hugging Face API for chat
    const response = await axios.post(
      `${HF_API_URL}/mistralai/Mistral-7B-Instruct-v0.1`,
      {
        inputs: message,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
      }
    )

    const aiResponse = response.data[0]?.generated_text || ''

    // Save conversation
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert([
        {
          user_id: userId,
          conversation_id: conversationId,
          user_message: message,
          ai_response: aiResponse,
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.json({
      response: aiResponse,
      conversation: data,
    })
  } catch (error) {
    console.error('AI chat error:', error)
    res.status(500).json({ error: 'AI chat failed' })
  }
}

export async function generateImage(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt required' })
    }

    // Call Hugging Face API for image generation
    const response = await axios.post(
      `${HF_API_URL}/stabilityai/stable-diffusion-xl-base-1.0`,
      {
        inputs: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
        },
        responseType: 'arraybuffer',
      }
    )

    // Save image metadata
    const { data, error } = await supabase
      .from('ai_images')
      .insert([
        {
          user_id: userId,
          prompt,
          image_data: Buffer.from(response.data).toString('base64'),
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.json({
      image: data.image_data,
      id: data.id,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    res.status(500).json({ error: 'Image generation failed' })
  }
}
