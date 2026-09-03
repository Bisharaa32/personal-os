import { Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth.js'
import { supabase } from '../../server.js'

export async function getNotes(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { category } = req.query

    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (category) query = query.eq('category', category)

    const { data, error } = await query

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
}

export async function searchNotes(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { q } = req.query

    if (!q) {
      return res.status(400).json({ error: 'Search query required' })
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${q}%,content.ilike.%${q}%`)

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: 'Search failed' })
  }
}

export async function createNote(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { title, content, category } = req.body

    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          user_id: userId,
          title,
          content,
          category,
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' })
  }
}

export async function updateNote(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params
    const { title, content, category } = req.body

    const { data, error } = await supabase
      .from('notes')
      .update({ title, content, category, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' })
  }
}

export async function deleteNote(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'Note deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' })
  }
}
