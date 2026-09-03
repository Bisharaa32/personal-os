import { Router } from 'express'
import { getNotes, createNote, updateNote, deleteNote, searchNotes } from './controller.js'
import { requireAuth } from '../../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getNotes)
router.get('/search', requireAuth, searchNotes)
router.post('/', requireAuth, createNote)
router.put('/:id', requireAuth, updateNote)
router.delete('/:id', requireAuth, deleteNote)

export default router
