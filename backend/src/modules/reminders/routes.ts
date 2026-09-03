import { Router } from 'express'
import { getReminders, createReminder, updateReminder, deleteReminder } from './controller.js'
import { requireAuth } from '../../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getReminders)
router.post('/', requireAuth, createReminder)
router.put('/:id', requireAuth, updateReminder)
router.delete('/:id', requireAuth, deleteReminder)

export default router
