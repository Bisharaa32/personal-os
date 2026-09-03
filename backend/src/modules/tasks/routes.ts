import { Router } from 'express'
import { getTasks, createTask, updateTask, deleteTask } from './controller.js'
import { requireAuth } from '../../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getTasks)
router.post('/', requireAuth, createTask)
router.put('/:id', requireAuth, updateTask)
router.delete('/:id', requireAuth, deleteTask)

export default router
