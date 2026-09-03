import { Router } from 'express'
import { getFiles, uploadFile, deleteFile } from './controller.js'
import { requireAuth } from '../../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getFiles)
router.post('/upload', requireAuth, uploadFile)
router.delete('/:id', requireAuth, deleteFile)

export default router
