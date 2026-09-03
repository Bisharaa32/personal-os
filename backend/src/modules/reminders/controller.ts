import { Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth.js'
import { supabase } from '../../server.js'

export async function getReminders(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { completed } = req.query

    let query = supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('remind_at', { ascending: true })

    if (completed !== undefined) {
      query = query.eq('completed', completed === 'true')
    }

    const { data, error } = await query

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminders' })
  }
}

export async function createReminder(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { title, description, remind_at, priority, recurrence, category } = req.body

    const { data, error } = await supabase
      .from('reminders')
      .insert([
        {
          user_id: userId,
          title,
          description,
          remind_at,
          priority,
          recurrence,
          category,
          completed: false,
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reminder' })
  }
}

export async function updateReminder(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('reminders')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reminder' })
  }
}

export async function deleteReminder(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'Reminder deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reminder' })
  }
}
