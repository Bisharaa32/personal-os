# Personal OS 🚀

**Personal Operating System** - A modular, secure, multi-user personal app for managing your digital life.

## 📌 Overview

Personal OS is a comprehensive web application designed for personal and family use. It combines essential productivity tools into one unified platform with strong privacy guarantees and zero-cost operation.

### Core Features
- 👤 **Multi-user with Privacy** - Each user sees only their own data
- 📅 **Calendar & Events** - Full event management
- ⏰ **Reminders & Notifications** - Smart alerts
- ✅ **Tasks & To-Do Lists** - Organize your work
- 📝 **Notes** - Private note-taking
- 📁 **File Management** - Organize documents, images, PDFs
- 🎥 **Video Editor** - Basic but functional editor (client-side)
- 🤖 **AI Assistant** - Chat and assistance (100% free tier)
- 🖼️ **AI Image Generator** - Generate images (100% free)
- 🔍 **Global Search** - Find anything across your data
- ⚙️ **Settings & Customization** - Dark/light mode, preferences
- 📱 **Responsive Design** - Works on PC, Mac, iPhone
- 📦 **PWA Ready** - Install as app on home screen

## 🎯 Key Principles

✅ **100% Free** - No hidden costs, no paid APIs, no subscriptions  
✅ **Privacy First** - Backend-enforced access control, not just UI hiding  
✅ **Modular Architecture** - Add/remove features without breaking the app  
✅ **Secure** - Session management, authorization, data isolation  
✅ **Responsive** - Desktop and mobile first  
✅ **Scalable for Future** - Designed to swap storage, AI, hosting providers  

## 🛠️ Tech Stack (100% Free Tier)

| Layer | Technology | Free Tier |
|-------|-----------|-----------|
| **Frontend** | React + TypeScript + Vite | ✅ Open-source |
| **Backend** | Node.js + Express | ✅ Open-source |
| **Database** | PostgreSQL on Supabase | ✅ 500MB free |
| **Auth** | Supabase Auth | ✅ Free tier |
| **Storage** | Supabase Storage | ✅ 1GB free |
| **AI Chat** | Hugging Face Inference API | ✅ Free tier |
| **Image Gen** | Stable Diffusion (HF) | ✅ Free tier |
| **Video Edit** | FFmpeg.wasm | ✅ Browser-based |
| **Hosting** | Vercel (frontend) + Render (backend) | ✅ Free tier |
| **Notifications** | Web Push API | ✅ Native browser API |

## 📂 Project Structure

```
personal-os/
├── frontend/              # React web app
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   ├── components/    # Shared components
│   │   ├── hooks/         # React hooks
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utilities
│   │   ├── services/      # API calls
│   │   ├── styles/        # Global styles
│   │   └── App.tsx
│   └── package.json
├── backend/               # Node.js API
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   ├── middleware/    # Auth, validation, etc.
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utilities
│   │   ├── config/        # Configuration
│   │   └── server.ts
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md    # Technical architecture
│   ├── API.md             # API documentation
│   ├── SETUP.md           # Setup & installation
│   ├── DATABASE.md        # Database schema
│   └── PHASES.md          # Development phases
└── .github/
    └── workflows/         # CI/CD
```

## 🚀 Development Phases

### Phase 1: Foundation (Current)
- [ ] Authentication (login, signup, recovery)
- [ ] User management & profiles
- [ ] Database schema & privacy rules
- [ ] Dashboard
- [ ] Modular architecture setup

### Phase 2: Core Productivity
- [ ] Calendar with events
- [ ] Reminders system
- [ ] Push notifications
- [ ] Tasks/To-Do lists
- [ ] Notes management

### Phase 3: Files & Media
- [ ] File upload & management
- [ ] Image gallery
- [ ] PDF generation from images
- [ ] Document viewer
- [ ] Global search

### Phase 4: AI Integration
- [ ] AI Assistant (chat)
- [ ] Chat history & management
- [ ] AI-powered organization
- [ ] Image generation
- [ ] Natural language reminders

### Phase 5: Advanced Features
- [ ] Video editor (client-side)
- [ ] Tool center/hub
- [ ] Advanced automations
- [ ] Data export

### Phase 6+: Future Enhancements
- [ ] Collaboration features (if needed)
- [ ] Advanced AI features
- [ ] Custom integrations

## 📋 Security & Privacy Rules

### Backend Enforcement
Every database query must include the authenticated user ID. Users can ONLY access their own data.

**Example Rule:**
```
User A logs in → Backend verifies session → Only returns User A's data
User B cannot access User A's files/events/notes even with direct URL manipulation
```

### Key Safeguards
- ✅ Session validation on every request
- ✅ User ID enforcement in all queries
- ✅ No data from other users in API responses
- ✅ Audit logs for sensitive operations
- ✅ Secure password storage (bcrypt)
- ✅ HTTPS-only in production

## 🔧 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (or use Supabase)
- npm or yarn

### Quick Start

```bash
# Clone repository
git clone https://github.com/Bisharaa32/personal-os.git
cd personal-os

# Setup backend
cd backend
npm install
cp .env.example .env
# Fill in Supabase credentials
npm run dev

# Setup frontend (new terminal)
cd frontend
npm install
npm run dev
```

See [SETUP.md](./docs/SETUP.md) for detailed instructions.

## 📖 Documentation

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical design
- **[API.md](./docs/API.md)** - API endpoints
- **[DATABASE.md](./docs/DATABASE.md)** - Schema & ERD
- **[SETUP.md](./docs/SETUP.md)** - Installation guide
- **[PHASES.md](./docs/PHASES.md)** - Development roadmap

## 🤝 Contributing

This is a personal/family project. For feature requests or issues, open a GitHub issue.

## 📝 License

MIT - See LICENSE file

## 💡 Philosophy

This project exists to prove that powerful, privacy-respecting software doesn't require paid services. Every feature is implemented with free tools and APIs.

**Zero Cost. Full Control. Complete Privacy.**

---

**Made with ❤️ by Bisharaa32**
