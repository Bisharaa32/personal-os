# API.md - API Endpoints Documentation

## Base URL

```
Local: http://localhost:5000
Production: https://personal-os-api.onrender.com (example)
```

## Authentication

All endpoints (except `/auth/*`) require:

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

Get `access_token` from login response.

---

## Auth Endpoints

### POST /api/auth/signup
Create new account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "Signup successful. Please verify your email.",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### POST /api/auth/login
Login to account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "...",
    "expires_in": 3600
  }
}
```

### POST /api/auth/logout
Logout (clear session).

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### POST /api/auth/refresh
Refresh access token.

**Request:**
```json
{
  "refresh_token": "..."
}
```

**Response (200):**
```json
{
  "access_token": "new_token",
  "refresh_token": "new_refresh_token",
  "expires_in": 3600
}
```

---

## Users Endpoints

### GET /api/users/profile
Get current user profile.

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar_url": "https://...",
  "preferences": {
    "theme": "dark",
    "notifications_enabled": true
  },
  "created_at": "2024-01-01T00:00:00Z"
}
```

### PUT /api/users/profile
Update user profile.

**Request:**
```json
{
  "name": "Jane Doe",
  "avatar_url": "https://...",
  "preferences": {
    "theme": "dark",
    "notifications_enabled": true
  }
}
```

**Response (200):**
Updated user object.

---

## Calendar Endpoints

### GET /api/calendar
List events.

**Query Params:**
- `start_date` (ISO string, optional)
- `end_date` (ISO string, optional)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Team Meeting",
    "description": "...",
    "start_date": "2024-01-15T10:00:00Z",
    "end_date": "2024-01-15T11:00:00Z",
    "location": "Conference Room A",
    "priority": "high",
    "recurrence": "weekly",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST /api/calendar
Create event.

**Request:**
```json
{
  "title": "Doctor Appointment",
  "description": "Annual checkup",
  "start_date": "2024-02-15T14:00:00Z",
  "end_date": "2024-02-15T15:00:00Z",
  "location": "Medical Center",
  "priority": "normal",
  "recurrence": "none"
}
```

**Response (201):**
Created event object.

### PUT /api/calendar/:id
Update event.

**Request:**
Any fields to update.

**Response (200):**
Updated event.

### DELETE /api/calendar/:id
Delete event.

**Response (200):**
```json
{ "message": "Event deleted" }
```

---

## Reminders Endpoints

### GET /api/reminders
List reminders.

**Query Params:**
- `completed` (true/false, optional)

### POST /api/reminders
Create reminder.

**Request:**
```json
{
  "title": "Call Mom",
  "description": "Don't forget!",
  "remind_at": "2024-01-15T19:00:00Z",
  "priority": "high",
  "recurrence": "weekly",
  "category": "personal"
}
```

### PUT /api/reminders/:id
Update reminder.

### DELETE /api/reminders/:id
Delete reminder.

---

## Tasks Endpoints

### GET /api/tasks
List tasks.

**Query Params:**
- `status` (todo, in_progress, completed)
- `category` (optional)

### POST /api/tasks
Create task.

**Request:**
```json
{
  "title": "Complete project",
  "description": "Finish by Friday",
  "due_date": "2024-01-19",
  "priority": "high",
  "category": "work",
  "status": "in_progress"
}
```

### PUT /api/tasks/:id
Update task (including status).

### DELETE /api/tasks/:id
Delete task.

---

## Notes Endpoints

### GET /api/notes
List notes.

**Query Params:**
- `category` (optional)

### GET /api/notes/search
Search notes.

**Query Params:**
- `q` (search query, required)

### POST /api/notes
Create note.

**Request:**
```json
{
  "title": "Project Ideas",
  "content": "Markdown content here...",
  "category": "brainstorm"
}
```

### PUT /api/notes/:id
Update note.

### DELETE /api/notes/:id
Delete note.

---

## Files Endpoints

### GET /api/files
List files.

**Response:**
```json
[
  {
    "id": "uuid",
    "filename": "document.pdf",
    "file_type": "pdf",
    "file_size": 2048576,
    "file_path": "user-id/document.pdf",
    "folder": "root",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST /api/files/upload
Upload file (create metadata record).

**Request:**
```json
{
  "filename": "report.pdf",
  "file_type": "pdf",
  "file_size": 2048576,
  "file_path": "user-id/report.pdf"
}
```

### DELETE /api/files/:id
Delete file metadata.

---

## AI Endpoints

### POST /api/ai/chat
Chat with AI.

**Rate Limit:** 10 requests/minute per user

**Request:**
```json
{
  "message": "Explain quantum physics",
  "conversationId": "uuid (optional)"
}
```

**Response (200):**
```json
{
  "response": "AI response here...",
  "conversation": {
    "id": "uuid",
    "user_message": "Explain quantum physics",
    "ai_response": "...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/ai/generate-image
Generate image with AI.

**Rate Limit:** 10 requests/minute per user

**Request:**
```json
{
  "prompt": "A beautiful sunset over mountains"
}
```

**Response (200):**
```json
{
  "image": "base64_encoded_image_data",
  "id": "uuid"
}
```

---

## Study Assistant Endpoints

### POST /api/study/pdf/upload
Upload PDF for studying.

**Request:**
```json
{
  "title": "Biology Chapter 3",
  "file_path": "user-id/biology.pdf",
  "extracted_text": "Full text extracted from PDF..."
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "title": "Biology Chapter 3",
  "extracted_text": "...",
  "uploaded_at": "2024-01-01T00:00:00Z"
}
```

### GET /api/study/pdf
List study PDFs.

### GET /api/study/pdf/:id
Get PDF details.

### POST /api/study/flashcards/generate
Generate flashcards from PDF.

**Rate Limit:** 20 requests/minute per user

**Request:**
```json
{
  "pdfId": "uuid",
  "content": "Text content to generate cards from"
}
```

**Response (201):**
```json
[
  {
    "id": "uuid",
    "front": "What is photosynthesis?",
    "back": "Process by which plants convert light into chemical energy...",
    "difficulty": "medium",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/study/flashcards/:pdfId
Get flashcards for a PDF.

### POST /api/study/quiz/generate
Generate quiz from PDF.

**Request:**
```json
{
  "pdfId": "uuid",
  "content": "PDF content",
  "difficulty": "medium"
}
```

### POST /api/study/quiz/answer
Submit quiz answers.

**Request:**
```json
{
  "quizId": "uuid",
  "answers": [0, 1, 2, 1, 0]
}
```

**Response (200):**
```json
{
  "quiz": { ... },
  "score": 4,
  "total": 5,
  "percentage": 80
}
```

### POST /api/study/notes/generate
Generate study notes from PDF.

**Request:**
```json
{
  "pdfId": "uuid",
  "content": "PDF content"
}
```

### POST /api/study/chat
Chat about PDF content.

**Request:**
```json
{
  "pdfId": "uuid",
  "message": "Explain the main concept"
}
```

**Response (200):**
```json
{
  "response": "AI explanation...",
  "pdfId": "uuid"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Description of what went wrong"
}
```

### Common Status Codes

| Code | Meaning |
|------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (invalid params) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limiting

Some endpoints are rate-limited to protect free-tier resources:

- `/api/ai/*` - 10 requests/minute per user
- `/api/study/flashcards/generate` - 20 requests/minute per user
- `/api/study/quiz/generate` - 20 requests/minute per user

If you exceed limits:
```json
{
  "error": "Too many requests, please try again later"
}
```

Wait 1 minute and retry.
