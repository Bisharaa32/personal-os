import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Import routes
import authRoutes from './modules/auth/routes.js'
import usersRoutes from './modules/users/routes.js'
import calendarRoutes from './modules/calendar/routes.js'
import remindersRoutes from './modules/reminders/routes.js'
import tasksRoutes from './modules/tasks/routes.js'
import notesRoutes from './modules/notes/routes.js'
import filesRoutes from './modules/files/routes.js'
import aiRoutes from './modules/ai/routes.js'
import studyRoutes from './modules/study/routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Initialize Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/reminders', remindersRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/files', filesRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/study', studyRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Personal OS API running on http://localhost:${PORT}`)
  console.log(`📝 Supabase: ${process.env.SUPABASE_URL}`)
})
