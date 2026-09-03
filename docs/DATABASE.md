# DATABASE.md - Schema & Privacy Rules

## Database Overview

Personal OS uses PostgreSQL (via Supabase) with Row-Level Security (RLS) to enforce privacy at the database level. Each user can ONLY see and modify their own data.

---

## Core Tables

### 1. users
Stores user profiles and preferences.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{"theme": "light", "notifications_enabled": true}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see only their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update only their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### 2. calendar_events
Stores calendar events for each user.

```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high
  recurrence VARCHAR(50), -- daily, weekly, monthly, none
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_start_date ON calendar_events(start_date);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own events"
  ON calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own events"
  ON calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own events"
  ON calendar_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own events"
  ON calendar_events FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. reminders
Stores user reminders with dates and priorities.

```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  remind_at TIMESTAMP NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high
  recurrence VARCHAR(50), -- daily, weekly, monthly, none
  category VARCHAR(100),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_remind_at ON reminders(remind_at);
CREATE INDEX idx_reminders_completed ON reminders(completed);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own reminders"
  ON reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own reminders"
  ON reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own reminders"
  ON reminders FOR DELETE
  USING (auth.uid() = user_id);
```

### 4. tasks
Todo list and task management.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'todo', -- todo, in_progress, completed
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. notes
Private notes storage.

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_notes_updated_at ON notes(updated_at);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);
```

### 6. files
File storage metadata.

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(50), -- pdf, image, document, video, etc
  file_size INT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  folder VARCHAR(255) DEFAULT 'root',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_file_type ON files(file_type);
CREATE INDEX idx_files_folder ON files(folder);

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own files"
  ON files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own files"
  ON files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own files"
  ON files FOR DELETE
  USING (auth.uid() = user_id);
```

### 7. ai_conversations
AI chat history (private for each user).

```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_conversation_id ON ai_conversations(conversation_id);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own conversations"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own conversations"
  ON ai_conversations FOR DELETE
  USING (auth.uid() = user_id);
```

### 8. ai_images
AI-generated images.

```sql
CREATE TABLE ai_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt VARCHAR(1000) NOT NULL,
  image_data TEXT NOT NULL, -- base64 encoded or Supabase path
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_images_user_id ON ai_images(user_id);

ALTER TABLE ai_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own images"
  ON ai_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own images"
  ON ai_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own images"
  ON ai_images FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Study Assistant Tables

### 9. study_pdfs
Uploaded study PDFs.

```sql
CREATE TABLE study_pdfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size INT NOT NULL,
  extracted_text TEXT, -- Full text extracted from PDF
  uploaded_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_study_pdfs_user_id ON study_pdfs(user_id);

ALTER TABLE study_pdfs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own study PDFs"
  ON study_pdfs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only upload their own PDFs"
  ON study_pdfs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own PDFs"
  ON study_pdfs FOR DELETE
  USING (auth.uid() = user_id);
```

### 10. study_flashcards
AI-generated flashcards for studying.

```sql
CREATE TABLE study_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pdf_id UUID REFERENCES study_pdfs(id) ON DELETE CASCADE,
  front VARCHAR(1000) NOT NULL, -- Question
  back TEXT NOT NULL, -- Answer
  difficulty VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
  times_correct INT DEFAULT 0,
  times_incorrect INT DEFAULT 0,
  last_reviewed TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_study_flashcards_user_id ON study_flashcards(user_id);
CREATE INDEX idx_study_flashcards_pdf_id ON study_flashcards(pdf_id);

ALTER TABLE study_flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own flashcards"
  ON study_flashcards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own flashcards"
  ON study_flashcards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own flashcards"
  ON study_flashcards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own flashcards"
  ON study_flashcards FOR DELETE
  USING (auth.uid() = user_id);
```

### 11. study_quizzes
Generated quizzes and quiz results.

```sql
CREATE TABLE study_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pdf_id UUID REFERENCES study_pdfs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  questions JSONB NOT NULL, -- Array of quiz questions
  score INT,
  total_questions INT NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_study_quizzes_user_id ON study_quizzes(user_id);
CREATE INDEX idx_study_quizzes_pdf_id ON study_quizzes(pdf_id);

ALTER TABLE study_quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own quizzes"
  ON study_quizzes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own quizzes"
  ON study_quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own quizzes"
  ON study_quizzes FOR UPDATE
  USING (auth.uid() = user_id);
```

### 12. study_notes
Extracted and organized study notes from PDFs.

```sql
CREATE TABLE study_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pdf_id UUID REFERENCES study_pdfs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  format VARCHAR(50) DEFAULT 'markdown', -- markdown, html, pdf
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_study_notes_user_id ON study_notes(user_id);
CREATE INDEX idx_study_notes_pdf_id ON study_notes(pdf_id);

ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own study notes"
  ON study_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only create their own study notes"
  ON study_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own study notes"
  ON study_notes FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Audit Logs

### 13. audit_logs
Track sensitive operations for security.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL, -- login, logout, delete, export, etc
  resource_type VARCHAR(100), -- users, notes, files, etc
  resource_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() = user_id);
```

---

## Security Summary

### ✅ Row-Level Security (RLS)
Every table enforces that users can ONLY access their own data via `auth.uid() = user_id`.

### ✅ No Cross-User Access
- User A cannot see User B's events, even by manipulating URLs or API requests
- User A cannot see User B's notes, files, or study materials
- User A cannot modify User B's data
- The database itself prevents unauthorized access

### ✅ Cascading Deletes
When a user account is deleted, ALL their data is automatically deleted via `ON DELETE CASCADE`.

### ✅ Audit Trail
All sensitive operations are logged in `audit_logs` for compliance and security.

### ✅ Indexing
Key columns are indexed for performance (user_id, dates, status, etc.).

---

## Deployment to Supabase

1. Go to https://app.supabase.com
2. Create new project (free tier)
3. Go to SQL Editor
4. Run all SQL scripts above
5. Enable RLS policies
6. Copy URL and anon key to `.env` files

That's it! Database is secure and ready.
