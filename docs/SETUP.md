# SETUP.md - Installation & Configuration

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn
- Git
- Supabase account (free at https://supabase.com)
- Hugging Face API key (free at https://huggingface.co/)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/Bisharaa32/personal-os.git
cd personal-os
```

---

## Step 2: Setup Supabase (Database & Auth)

### Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Enter project name: `personal-os`
4. Choose region closest to you
5. Set database password (save it!)
6. Wait for project to initialize (5-10 minutes)

### Get Supabase Credentials

1. Go to **Settings → API**
2. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

### Create Database Tables

1. Go to **SQL Editor** in Supabase
2. Click **New Query**
3. Copy the entire SQL schema from `docs/DATABASE.md`
4. Paste it into the SQL editor
5. Click **Run**
6. Wait for tables to be created ✅

### Enable Email Authentication

1. Go to **Authentication → Providers**
2. Make sure **Email** is enabled (it's default)
3. Go to **Email Templates** and customize if needed

---

## Step 3: Setup Backend

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
# From Supabase (Step 2)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server
PORT=5000
NODE_ENV=development

# Hugging Face (Step 4)
HUGGINGFACE_API_KEY=your_hf_key_here

# JWT (generate random string)
JWT_SECRET=super_secret_random_string_change_in_production

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Personal OS API running on http://localhost:5000
📝 Supabase: https://your-project.supabase.co
```

---

## Step 4: Setup Hugging Face AI (Free Tier)

### Create Account & Get API Key

1. Go to https://huggingface.co/
2. Sign up (free)
3. Go to **Settings → Access Tokens**
4. Click **New token**
5. Set name: `personal-os`
6. Type: **Read** (minimum permission needed)
7. Copy the token

### Add to Backend `.env`

```env
HUGGINGFACE_API_KEY=hf_your_token_here
```

### Test AI is Working

```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_auth_token" \
  -d '{"message": "Hello, how are you?"}'
```

**Note on Free Tier Limits:**
- ~30 requests per minute
- Uses shared GPU (slower than paid)
- If you hit limits, wait a bit or upgrade

---

## Step 5: Setup Frontend

### Install Dependencies

```bash
cd frontend
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```env
# From Supabase (Step 2) - SAME values as backend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Backend API
VITE_API_URL=http://localhost:5000
```

### Start Frontend Server

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 234 ms

➜  Local:   http://localhost:3000
```

---

## Step 6: Test Everything

### Open Application

Go to http://localhost:3000

### Create Account

1. Click "Sign up"
2. Enter email: `test@example.com`
3. Enter password: `test123456` (min 6 chars)
4. Click "Sign Up"

You should see: "Account Created! Please check your email to confirm."

**Note:** Supabase sends confirmation emails. In development, you can:
- Check email and click link
- OR go to Supabase **Auth → Users** and manually confirm

### Login

1. Go back to login page
2. Enter same email/password
3. Should see Dashboard ✅

### Test Features

- **Create Event** → Click "Calendar" → Add event
- **Create Note** → Click "Tools" → Create note
- **AI Chat** → Type message in AI Assistant
- **Logout** → Click "Logout" button

---

## Deployment

### Deploy Frontend (Vercel)

```bash
cd frontend
npm run build
# Then push to GitHub and connect to Vercel
```

### Deploy Backend (Render)

```bash
cd backend
# Push to GitHub
# Go to render.com, connect GitHub repo, deploy
```

### Both Will Auto-Deploy on Push

Once connected, every GitHub push automatically redeploys to production! 🚀

---

## Troubleshooting

### "Cannot connect to Supabase"

- Check `SUPABASE_URL` and keys are correct
- Make sure Supabase project is active
- Verify RLS policies are enabled

### "Email confirmation not received"

- Check spam folder
- In development, go to Supabase **Auth → Users** and manually confirm

### "Hugging Face API returning errors"

- Check API key is valid
- Verify you have internet connection
- Free tier might be slow, try again in a minute

### "CORS errors in browser console"

- Make sure `CORS_ORIGIN` in backend `.env` matches frontend URL
- In dev: `http://localhost:3000`
- In prod: `https://your-frontend-url.vercel.app`

### "Port 5000 or 3000 already in use"

```bash
# Change port in vite.config.ts or .env
PORT=5001 npm run dev
```

---

## Next Steps

✅ Create account
✅ Explore dashboard
✅ Try creating events, tasks, notes
✅ Test AI features
✅ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details

---

## Free Tier Limits Summary

| Service | Free Limit | Enough for? |
|---------|-----------|-------------|
| Supabase Database | 500 MB | ~1 million records |
| Supabase Storage | 1 GB | ~1000 PDFs/videos |
| Supabase Auth | Unlimited | ✅ Yes |
| Hugging Face LLM | 30 req/min | ✅ Personal use |
| Stable Diffusion | ~10 img/day | ✅ Light use |
| Vercel Frontend | Unlimited | ✅ Yes |
| Render Backend | 750 hrs/month | ✅ Yes (always-on) |

**All free. All unlimited for personal/family use.** 💚

---

## Support

For issues, open a GitHub issue: https://github.com/Bisharaa32/personal-os/issues
