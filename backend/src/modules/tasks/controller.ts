import { Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth.js'
import { supabase } from '../../server.js'

export async function getTasks(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { status, category } = req.query

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true })

    if (status) query = query.eq('status', status)
    if (category) query = query.eq('category', category)

    const { data, error } = await query

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
}

export async function createTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { title, description, due_date, priority, category, status } = req.body

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: userId,
          title,
          description,
          due_date,
          priority,
          category,
          status: status || 'todo',
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' })
  }
}

export async function updateTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' })
  }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'Task deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' })
  }
}
