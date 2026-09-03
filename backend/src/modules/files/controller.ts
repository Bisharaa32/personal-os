import { Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth.js'
import { supabase } from '../../server.js'

export async function getFiles(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' })
  }
}

export async function uploadFile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { filename, file_type, file_size, file_path } = req.body

    const { data, error } = await supabase
      .from('files')
      .insert([
        {
          user_id: userId,
          filename,
          file_type,
          file_size,
          file_path,
        },
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' })
  }
}

export async function deleteFile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id
    const { id } = req.params

    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    res.json({ message: 'File deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' })
  }
}
