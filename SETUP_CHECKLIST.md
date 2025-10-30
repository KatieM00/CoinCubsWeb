# CoinCubs Setup Checklist

Use this checklist to ensure you complete all necessary steps for your demo deployment.

## Pre-Flight Security Check

Before doing ANYTHING else:

- [x] ✅ `.gitignore` exists and includes `.env*` files
- [x] ✅ `.env.example` created (safe to commit)
- [ ] ⚠️  **Verify `.env` is NOT in git** - Run: `git status` (should NOT show .env)
- [ ] ⚠️  **Never commit real API keys**

---

## Phase 1: Supabase Setup (15 minutes)

### Create Supabase Project
- [ ] Go to https://supabase.com/dashboard
- [ ] Click "New Project"
- [ ] Name: "CoinCubs"
- [ ] Generate strong database password (save it!)
- [ ] Choose closest region
- [ ] Wait for project to be created (~2 min)

### Get API Credentials
- [ ] Navigate to Settings → API
- [ ] Copy "Project URL"
- [ ] Copy "anon public" key
- [ ] Paste both into your local `.env` file

### Run Database Schema
- [ ] Open Supabase → SQL Editor
- [ ] Click "New Query"
- [ ] Copy entire `supabase-schema.sql` file
- [ ] Paste and click "Run"
- [ ] Verify "Success. No rows returned"
- [ ] Go to Table Editor
- [ ] Confirm 7 tables exist (user_profiles, student_accounts, etc.)

---

## Phase 2: Google OAuth Setup (10 minutes)

### Google Cloud Console
- [ ] Go to https://console.cloud.google.com/
- [ ] Create new project or select existing
- [ ] Navigate to APIs & Services → Credentials
- [ ] Click "Create Credentials" → "OAuth client ID"
- [ ] Configure OAuth consent screen (if needed)
- [ ] Application type: "Web application"
- [ ] Name it: "CoinCubs"

### Add Redirect URLs (Local Dev)
- [ ] Authorized JavaScript origins:
  - `http://localhost:3000`
- [ ] Authorized redirect URIs:
  - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
  - (Get YOUR_PROJECT_REF from your Supabase URL)

### Save Credentials
- [ ] Copy "Client ID"
- [ ] Copy "Client Secret"
- [ ] Keep this tab open (you'll need these values)

### Configure in Supabase
- [ ] Return to Supabase dashboard
- [ ] Go to Authentication → Providers
- [ ] Find "Google" and click toggle to enable
- [ ] Paste Client ID
- [ ] Paste Client Secret
- [ ] Click "Save"

---

## Phase 3: Local Development (10 minutes)

### Install Dependencies
```bash
cd /Users/katie/Documents/GitHub/CoincubsWeb
npm install
cd frontend
npm install
```

- [ ] Root npm install completed
- [ ] Frontend npm install completed
- [ ] No errors in installation

### Create Environment File
```bash
cd /Users/katie/Documents/GitHub/CoincubsWeb
cp .env.example .env
```

- [ ] `.env` file created
- [ ] Edit `.env` with your real values:
  ```env
  VITE_SUPABASE_URL=https://xxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc...
  ```
- [ ] Values match your Supabase project
- [ ] File saved

### Verify Security
```bash
git status
```
- [ ] Confirm `.env` does NOT appear in output
- [ ] Only see modified tracked files

### Start Development Server
```bash
cd frontend
npm run dev
```

- [ ] Server starts successfully
- [ ] Opens browser to http://localhost:3000
- [ ] No console errors

---

## Phase 4: Test Authentication (10 minutes)

### Test Teacher Login
- [ ] Click "I'm a Teacher" button
- [ ] Redirects to Google OAuth
- [ ] Sign in with Google account
- [ ] Redirects back to CoinCubs
- [ ] Shows Profile Setup screen

### Complete Profile
- [ ] Enter your name
- [ ] Select "Teacher" role
- [ ] Click "Get Started"
- [ ] Redirected to Quick Award page (teacher view)
- [ ] Header shows amber/orange theme

### Verify Database
- [ ] Go to Supabase → Table Editor → user_profiles
- [ ] Your profile appears with:
  - id (UUID)
  - name (what you entered)
  - role ("admin")
  - email (your Google email)

### Test Logout
- [ ] Click "Logout" button in header
- [ ] Returns to login screen
- [ ] Shows success toast

### Test Parent Login
- [ ] Use different Google account (or incognito)
- [ ] Click "I'm a Parent"
- [ ] Complete profile with "Parent" role
- [ ] Redirected to Parent Portal
- [ ] Header shows blue/indigo theme

---

## Phase 5: GitHub Setup (5 minutes)

### Verify Security (CRITICAL!)
```bash
git status
```
- [ ] `.env` does NOT appear
- [ ] Only see files you created/modified

```bash
cat .gitignore | grep .env
```
- [ ] Confirms .env is in .gitignore

### Initial Commit
```bash
git add .
git commit -m "Migrate to Supabase authentication for demo"
git branch -M main
```

- [ ] Commit successful
- [ ] No errors

### Create GitHub Repository
- [ ] Go to https://github.com/new
- [ ] Repository name: "CoincubsWeb"
- [ ] Description: "CoinCubs Classroom Economy Application"
- [ ] Public or Private (your choice)
- [ ] Don't initialize with README (you have one)
- [ ] Click "Create repository"

### Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/CoincubsWeb.git
git push -u origin main
```

- [ ] Push successful
- [ ] Visit GitHub repo in browser
- [ ] Verify `.env` is NOT visible
- [ ] Verify `.env.example` IS visible
- [ ] Verify all other files are there

---

## Phase 6: Netlify Deployment (15 minutes)

### Deploy to Netlify
- [ ] Go to https://app.netlify.com
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Choose "GitHub"
- [ ] Authorize Netlify to access GitHub
- [ ] Select "CoincubsWeb" repository

### Configure Build Settings
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`
- [ ] Click "Show advanced"

### Add Environment Variables
- [ ] Click "New variable"
- [ ] Variable 1:
  - Key: `VITE_SUPABASE_URL`
  - Value: Your Supabase URL
- [ ] Variable 2:
  - Key: `VITE_SUPABASE_ANON_KEY`
  - Value: Your Supabase anon key
- [ ] Both variables added

### Deploy
- [ ] Click "Deploy site"
- [ ] Wait for build to complete (~2-3 min)
- [ ] Build succeeds (green checkmark)
- [ ] Copy your Netlify URL: `https://random-name-12345.netlify.app`

---

## Phase 7: Production Configuration (10 minutes)

### Update Google OAuth (Production URLs)
- [ ] Return to Google Cloud Console → Credentials
- [ ] Edit your OAuth client
- [ ] Add to Authorized JavaScript origins:
  - `https://your-app-name.netlify.app`
- [ ] Add to Authorized redirect URIs:
  - `https://your-app-name.netlify.app`
  - `https://your-app-name.netlify.app/**`
- [ ] Save changes

### Update Supabase (Production URLs)
- [ ] Go to Supabase → Authentication → URL Configuration
- [ ] Site URL: `https://your-app-name.netlify.app`
- [ ] Add to Redirect URLs:
  - `https://your-app-name.netlify.app`
  - `https://your-app-name.netlify.app/**`
- [ ] Save

### Test Production Deployment
- [ ] Visit your Netlify URL
- [ ] Click "I'm a Teacher" or "I'm a Parent"
- [ ] OAuth flow works
- [ ] Profile creation works
- [ ] Can log out and log back in
- [ ] No console errors

---

## Phase 8: Final Verification (5 minutes)

### Security Audit
- [ ] `.env` not in GitHub repository
- [ ] `.env` in `.gitignore`
- [ ] No hardcoded API keys in code
- [ ] Only using anon key (not service_role)
- [ ] RLS enabled on all tables
- [ ] HTTPS enabled on production

### Functionality Check
- [ ] ✅ Login works (both roles)
- [ ] ✅ Profile setup works
- [ ] ✅ Logout works
- [ ] ✅ Teacher sees teacher UI
- [ ] ✅ Parent sees parent UI
- [ ] ✅ Database updates correctly
- [ ] ✅ No console errors

### Documentation Review
- [ ] Read README.md
- [ ] Bookmark MIGRATION_GUIDE.md
- [ ] Review SECURITY.md
- [ ] Understand MIGRATION_SUMMARY.md

---

## Troubleshooting

If you encounter issues:

1. **Check MIGRATION_GUIDE.md** → Troubleshooting section
2. **Review SECURITY.md** → Security best practices
3. **Check browser console** → Look for errors
4. **Check Supabase logs** → Dashboard → Logs → Postgres Logs
5. **Verify environment variables** → Netlify site settings
6. **Check RLS policies** → Supabase → Table Editor → RLS tab

---

## Success Criteria

You're ready for demo when:

- ✅ All checklist items completed
- ✅ Can login with Google OAuth
- ✅ Both teacher and parent roles work
- ✅ Production site is live on Netlify
- ✅ No security warnings
- ✅ No console errors
- ✅ Database is populated correctly

---

## Estimated Total Time: ~90 minutes

- Supabase Setup: 15 min
- Google OAuth: 10 min
- Local Dev: 10 min
- Testing: 10 min
- GitHub: 5 min
- Netlify: 15 min
- Production Config: 10 min
- Verification: 5 min
- Buffer: 10 min

---

## Next Steps After Demo

If you want to build out the full application:

1. Implement remaining query hooks (see `useQueries.ts` TODO comments)
2. Add student management features
3. Add rewards catalog functionality
4. Implement voting system
5. Add class goals tracking
6. Build curriculum integration
7. Add real-time updates with Supabase subscriptions
8. Implement file uploads (student photos)
9. Add email notifications
10. Create comprehensive test suite

---

## Questions?

Refer to:
- **Quick start:** README.md
- **Detailed setup:** MIGRATION_GUIDE.md
- **Security:** SECURITY.md
- **Overview:** MIGRATION_SUMMARY.md

---

**Ready to start? Begin with Phase 1! 🚀**
