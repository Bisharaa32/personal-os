import { Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth.js'
import { supabase } from '../../server.js'

export async function signup(req: any, res: Response) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const { data, error } = await supabase.auth.signUpWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({
      message: 'Signup successful. Please verify your email.',
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' })
  }
}

export async function login(req: any, res: Response) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    res.json({
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_in: data.session?.expires_in,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
}

export async function logout(req: AuthenticatedRequest, res: Response) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      await supabase.auth.signOut()
    }
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' })
  }
}

export async function refreshToken(req: any, res: Response) {
  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token required' })
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    res.json({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_in: data.session?.expires_in,
    })
  } catch (error) {
    res.status(500).json({ error: 'Token refresh failed' })
  }
}
