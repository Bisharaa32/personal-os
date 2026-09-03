# ARCHITECTURE.md - Technical Design

## System Overview

Personal OS is built as a modular, layered architecture with strict separation between frontend, backend, and data layer.

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Browser)                   │
│  React + TypeScript + Tailwind CSS                           │
│  ├─ Auth Module (Login, Signup, Recovery)                    │
│  ├─ Dashboard Module                                         │
│  ├─ Calendar Module                                          │
│  ├─ Reminders Module                                         │
│  ├─ Tasks Module                                             │
│  ├─ Notes Module                                             │
│  ├─ Files Module                                             │
│  ├─ Images Module                                            │
│  ├─ Study Assistant Module (NEW)                             │
│  │   ├─ PDF Upload & Parsing                                 │
│  │   ├─ AI Study Assistant                                   │
│  │   ├─ Flashcard Generation                                 │
│  │   ├─ Quiz Generation                                      │
│  │   └─ Study Notes from PDFs                                │
│  ├─ AI Chat Module                                           │
│  ├─ AI Image Generator Module                                │
│  ├─ Video Editor Module                                      │
│  ├─ Settings Module                                          │
│  └─ Search Module                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓ (HTTPS)
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER (Backend)                       │
│  Node.js + Express + TypeScript                              │
│  ├─ Auth Service (Supabase Auth)                             │
│  ├─ Users Service                                            │
│  ├─ Calendar Service                                         │
│  ├─ Reminders Service                                        │
│  ├─ Tasks Service                                            │
│  ├─ Notes Service                                            │
│  ├─ Files Service                                            │
│  ├─ AI Service                                               │
│  │   ├─ Chat (Hugging Face)                                  │
│  │   ├─ Image Generation (Stable Diffusion)                  │
│  │   └─ Study Assistant (NEW)                                │
│  │       ├─ PDF Processing (PDFKit, pdf-parse)               │
│  │       ├─ Flashcard Generation                             │
│  │       ├─ Quiz Generation                                  │
│  │       └─ Study Material Synthesis                         │
│  ├─ Search Service                                           │
│  ├─ Video Service (FFmpeg.wasm wrapper)                      │
│  └─ Middleware (Auth, Validation, CORS, Rate Limit)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER (Database)                      │
│  PostgreSQL (Supabase) + Row-Level Security (RLS)            │
│  ├─ users table                                              │
│  ├─ sessions table (for auth)                                │
│  ├─ calendar_events table                                    │
│  ├─ reminders table                                          │
│  ├─ tasks table                                              │
│  ├─ notes table                                              │
│  ├─ files table                                              │
│  ├─ images table                                             │
│  ├─ study_materials table (NEW)                              │
│  │   ├─ study_pdfs                                           │
│  │   ├─ study_flashcards                                     │
│  │   ├─ study_quizzes                                        │
│  │   └─ study_notes                                          │
│  ├─ ai_conversations table                                   │
│  ├─ ai_images table                                          │
│  ├─ audit_logs table                                         │
│  └─ RLS Policies (user_id enforcement)                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES (Free Tier)               │
│  ├─ Supabase (Auth + DB + Storage)                           │
│  ├─ Hugging Face (LLM Chat + Image Generation)               │
│  ├─ Cloudinary OR Supabase Storage (File Storage)            │
│  └─ Web APIs (Push Notifications, Local Storage)             │
└─────────────────────────────────────────────────────────────┘
```

---

## Module Architecture

### Frontend Modules Structure

```
src/modules/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── PasswordRecovery.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useSession.ts
│   └── services/
│       └── authService.ts
│
├── dashboard/
│   ├── components/
│   │   ├── DashboardLayout.tsx
│   │   ├── EventPreview.tsx
│   │   ├── RemindersPreview.tsx
│   │   └── QuickAccess.tsx
│   └── services/
│       └── dashboardService.ts
│
├── calendar/
│   ├── components/
│   │   ├── CalendarView.tsx
│   │   ├── EventForm.tsx
│   │   └── EventDetail.tsx
│   └── services/
│       └── calendarService.ts
│
├── study-assistant/  # NEW MODULE
│   ├── components/
│   │   ├── StudyHub.tsx
│   │   ├── PDFUpload.tsx
│   │   ├── PDFViewer.tsx
│   │   ├── StudyChat.tsx
│   │   ├── FlashcardGenerator.tsx
│   │   ├── QuizGenerator.tsx
│   │   ├── StudyNotes.tsx
│   │   └── StudyMaterials.tsx
│   ├── hooks/
│   │   ├── usePDFUpload.ts
│   │   ├─ useStudyChat.ts
│   │   └── useFlashcards.ts
│   └── services/
│       └── studyAssistantService.ts
│
├── ai-chat/
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   ├── ConversationList.tsx
│   │   └── MessageBubble.tsx
│   └── services/
│       └── chatService.ts
│
├── ai-image-generator/
│   ├── components/
│   │   ├── ImageGenerator.tsx
│   │   ├── PromptInput.tsx
│   │   └── ImageGallery.tsx
│   └── services/
│       └── imageGenService.ts
│
├── files/
│   ├── components/
│   │   ├── FileManager.tsx
│   │   ├── FileUpload.tsx
│   │   └── FilePreview.tsx
│   └── services/
│       └── fileService.ts
│
├── video-editor/
│   ├── components/
│   │   ├── VideoEditor.tsx
│   │   ├── Timeline.tsx
│   │   └── Effects.tsx
│   └── services/
│       └── videoService.ts
│
└── settings/
    ├── components/
    │   ├── ProfileSettings.tsx
    │   ├── PreferencesSettings.tsx
    │   └── PrivacySettings.tsx
    └── services/
        └── settingsService.ts
```

### Backend Modules Structure

```
src/modules/
├── auth/
│   ├── routes.ts
│   ├── controller.ts
│   ├── service.ts
│   └── middleware.ts
│
├── users/
│   ├── routes.ts
│   ├── controller.ts
│   ├── service.ts
│   └── repository.ts
│
├── calendar/
│   ├── routes.ts
│   ├── controller.ts
│   ├── service.ts
│   └── repository.ts
│
├── study-assistant/  # NEW MODULE
│   ├── routes.ts
│   ├── controller.ts
│   ├── service.ts
│   │   ├─ pdfProcessingService.ts
│   │   ├─ aiStudyService.ts
│   │   ├─ flashcardService.ts
│   │   ├─ quizService.ts
│   │   └─ studyNotesService.ts
│   ├── repository.ts
│   └── middleware/
│       └── pdfValidator.ts
│
├── ai/
│   ├── routes.ts
│   ├── controller.ts
│   ├── service.ts
│   │   ├─ chatService.ts
│   │   ├─ imageGenService.ts
│   │   └─ huggingFaceClient.ts
│   └── middleware/
│       └── rateLimiter.ts
│
├── files/
│   ├── routes.ts
│   ├── controller.ts
│   ├── service.ts
│   └── repository.ts
│
├── middleware/
│   ├── auth.ts
│   ├── errorHandler.ts
│   ├── validation.ts
│   └── cors.ts
│
└── config/
    ├── database.ts
    ├── supabase.ts
    ├── env.ts
    └── constants.ts
```

---

## Data Privacy & Security

### Row-Level Security (RLS) in PostgreSQL

Every table has RLS policies enforcing that users can only access their own data:

```sql
-- Example policy for notes table
CREATE POLICY "Users can only see their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);
```

### Backend Authorization Checks

Every endpoint must verify the authenticated user:

```typescript
// Example: Get user's notes
app.get('/api/notes', authenticateUser, async (req, res) => {
  const userId = req.user.id; // From JWT token
  
  // Database query ONLY returns notes owned by this user
  const notes = await db.query(
    'SELECT * FROM notes WHERE user_id = $1',
    [userId]
  );
  
  res.json(notes);
});
```

---

## Study Assistant Module - Detailed Design

### Features

1. **PDF Upload & Processing**
   - Upload PDF documents
   - Extract text from PDFs
   - Parse document structure
   - Support for scanned PDFs (OCR via Tesseract.js - free)

2. **AI Study Assistant Chat**
   - Ask questions about uploaded PDF
   - Get explanations in simple language
   - AI summarizes key concepts
   - Uses Hugging Face free tier LLM

3. **Flashcard Generation**
   - AI auto-generates flashcards from PDF
   - Front (question) + Back (answer)
   - Categorized by topics
   - Study mode with spaced repetition

4. **Quiz Generation**
   - AI creates multiple-choice quizzes
   - Difficulty levels
   - Timed quizzes
   - Score tracking

5. **Study Notes Generator**
   - Convert PDF content into organized study notes
   - Bullet points, summaries, key terms
   - Export as markdown or PDF

### Database Schema for Study Materials

```sql
-- Store uploaded PDFs
CREATE TABLE study_pdfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  extracted_text TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Store flashcards
CREATE TABLE study_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pdf_id UUID REFERENCES study_pdfs(id) ON DELETE CASCADE,
  front VARCHAR(1000) NOT NULL,
  back TEXT NOT NULL,
  difficulty VARCHAR(20), -- easy, medium, hard
  created_at TIMESTAMP DEFAULT NOW()
);

-- Store quiz attempts
CREATE TABLE study_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pdf_id UUID REFERENCES study_pdfs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  questions JSONB NOT NULL, -- Array of questions
  score INT,
  total_questions INT,
  completed_at TIMESTAMP
);

-- Store extracted study notes
CREATE TABLE study_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pdf_id UUID REFERENCES study_pdfs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  format VARCHAR(50), -- markdown, html, pdf
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE study_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only see their own study materials"
  ON study_pdfs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only see their own flashcards"
  ON study_flashcards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only see their own quizzes"
  ON study_quizzes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only see their own study notes"
  ON study_notes FOR ALL USING (auth.uid() = user_id);
```

---

## Free AI Services Used

| Service | Purpose | Free Tier Limit |
|---------|---------|-----------------|
| **Hugging Face Inference API** | LLM for chat & study assistance | ~30 requests/minute, shared GPUs |
| **Stable Diffusion XL (HF)** | Image generation | ~10 images/day free tier |
| **Tesseract.js** | OCR for scanned PDFs | Unlimited, browser-based |
| **pdf-parse** | PDF text extraction | Unlimited, browser/server |
| **FFmpeg.wasm** | Video processing | Unlimited, browser-based |
| **Supabase Auth** | User authentication | Unlimited free tier |
| **Supabase Database** | PostgreSQL | 500MB storage free |
| **Supabase Storage** | File storage | 1GB free |
| **Web Push API** | Notifications | Native browser API |

---

## API Rate Limiting

To prevent abuse of free tier services:

```typescript
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per user
  keyGenerator: (req) => req.user.id,
  message: 'Too many AI requests. Please wait before trying again.',
});

app.use('/api/ai/*', aiRateLimiter);
app.use('/api/study-assistant/chat', aiRateLimiter);
app.use('/api/study-assistant/quiz-generate', aiRateLimiter);
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         FRONTEND DEPLOYMENT              │
│  GitHub → Vercel (auto-deploy on push)   │
│  URL: personal-os.vercel.app             │
│  Features: Auto-scaling, CDN, HTTPS      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          BACKEND DEPLOYMENT              │
│  GitHub → Render (auto-deploy on push)   │
│  URL: personal-os-api.onrender.com       │
│  Features: 750 free hours/month          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         DATABASE & STORAGE               │
│  Supabase (PostgreSQL + Auth + Storage)  │
│  500MB DB + 1GB Storage free             │
│  Location: Configurable regions          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         EXTERNAL AI SERVICES             │
│  Hugging Face (LLM + Image Gen)          │
│  Rate-limited, free tier                 │
└─────────────────────────────────────────┘
```

---

## Future Scaling Options

Without changing code:

1. **Database**: Migrate from Supabase free to Supabase Pro or self-hosted PostgreSQL
2. **AI**: Replace Hugging Face with OpenAI, Anthropic, or self-hosted models
3. **Storage**: Upgrade to AWS S3, Google Cloud Storage, or Azure Blob Storage
4. **Hosting**: Move to AWS, GCP, or DigitalOcean
5. **Video**: Integrate FFmpeg server for advanced processing

All possible with environment variable changes only.

---

## Security Checklist

- ✅ HTTPS only in production
- ✅ JWT tokens for stateless auth
- ✅ Refresh token rotation
- ✅ CORS properly configured
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (React auto-escaping)
- ✅ CSRF tokens for state-changing requests
- ✅ Rate limiting on sensitive endpoints
- ✅ Audit logs for all sensitive operations
- ✅ Secure password hashing (bcrypt via Supabase)
- ✅ Input validation on all endpoints
- ✅ Row-Level Security (RLS) in database
- ✅ No sensitive data in logs
- ✅ GDPR-ready data deletion
