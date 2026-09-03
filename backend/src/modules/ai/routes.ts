import { Router } from 'express'
import { chat, generateImage } from './controller.js'
import { requireAuth } from '../../middleware/auth.js'
import rateLimit from 'express-rate-limit'

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many AI requests, please try again later',
})

const router = Router()

router.post('/chat', requireAuth, aiLimiter, chat)
router.post('/generate-image', requireAuth, aiLimiter, generateImage)

export default router
