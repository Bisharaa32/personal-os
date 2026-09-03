import { Request, Response, NextFunction } from 'express'
import { supabase } from '../server.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

export async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = {
      id: user.id,
      email: user.email || '',
    }

    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}
