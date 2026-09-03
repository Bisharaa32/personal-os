import { Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth.js'
import { supabase } from '../../server.js'

export async function getEvents(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { start_date, end_date } = req.query

    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true })

    if (start_date && end_date) {
      query = query
        .gte('start_date', start_date)
        .lte('start_date', end_date)
    }

    const { data, error } = await query

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' })
  }
}

export async function createEvent(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { title, description, start_date, end_date, location, priority, recurrence } = req.body

    const { data, error } = await supabase
      .from('calendar_events')
      .insert([
        {
          user_id: userId,
          title,
          description,
          start_date,
          end_date,
          location,
          priority,
          recurrence,
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' })
  }
}

export async function updateEvent(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('calendar_events')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' })
  }
}

export async function deleteEvent(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params

    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'Event deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' })
  }
}
