import { Router } from 'express'
import { getEvents, createEvent, updateEvent, deleteEvent } from './controller.js'
import { requireAuth } from '../../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getEvents)
router.post('/', requireAuth, createEvent)
router.put('/:id', requireAuth, updateEvent)
router.delete('/:id', requireAuth, deleteEvent)

export default router
