import { Router } from 'express'
import {
  uploadPDF,
  getPDFs,
  getPDFContent,
  generateFlashcards,
  getFlashcards,
  generateQuiz,
  submitQuizAnswer,
  generateStudyNotes,
  studyChat,
} from './controller.js'
import { requireAuth } from '../../middleware/auth.js'
import rateLimit from 'express-rate-limit'

const studyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many study requests, please try again later',
})

const router = Router()

// PDF Management
router.post('/pdf/upload', requireAuth, uploadPDF)
router.get('/pdf', requireAuth, getPDFs)
router.get('/pdf/:id', requireAuth, getPDFContent)

// Flashcards
router.post('/flashcards/generate', requireAuth, studyLimiter, generateFlashcards)
router.get('/flashcards/:pdfId', requireAuth, getFlashcards)

// Quiz
router.post('/quiz/generate', requireAuth, studyLimiter, generateQuiz)
router.post('/quiz/answer', requireAuth, submitQuizAnswer)

// Study Notes
router.post('/notes/generate', requireAuth, studyLimiter, generateStudyNotes)

// Study Chat
router.post('/chat', requireAuth, studyLimiter, studyChat)

export default router
