import { Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth.js'
import { supabase } from '../../server.js'

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { name, avatar_url, preferences } = req.body

    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        avatar_url,
        preferences,
        updated_at: new Date(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' })
  }
}
