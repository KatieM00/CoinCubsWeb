# CoinCubs Migration Guide: Internet Identity → Supabase + Google OAuth

This guide walks you through the complete migration from Internet Computer (Internet Identity) to Supabase authentication with Google OAuth.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Security Checklist](#security-checklist)
3. [Supabase Project Setup](#supabase-project-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Install Dependencies](#install-dependencies)
7. [Testing the Migration](#testing-the-migration)
8. [Deploying to Netlify](#deploying-to-netlify)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- [ ] A Supabase account (free tier is fine)
- [ ] A Google Cloud Platform account for OAuth setup
- [ ] A Netlify account for deployment
- [ ] Node.js 18+ installed
- [ ] Git installed

---

## Security Checklist

### ✅ CRITICAL: Verify Before ANY Git Commits

1. **Check `.gitignore` exists and contains:**
   ```gitignore
   .env
   .env.local
   .env.*.local
   node_modules/
   dist/
   build/
   .DS_Store
   ```

2. **NEVER commit these files:**
   - `.env` (contains secrets)
   - `node_modules/`
   - Any files with API keys or passwords

3. **Only commit `.env.example`** (no real keys)

4. **Verify before pushing:**
   ```bash
   git status
   # Ensure .env is NOT listed
   ```

---

## Supabase Project Setup

### Step 1: Create a New Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - **Name:** CoinCubs
   - **Database Password:** Generate a strong password (save it securely!)
   - **Region:** Choose closest to your users
4. Click "Create new project" (takes ~2 minutes)

### Step 2: Get Your API Keys

1. Once the project is created, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

⚠️ **IMPORTANT:**
- The `anon` key is safe to use in frontend code
- **NEVER** use the `service_role` key in frontend code
- The `anon` key is protected by Row Level Security (RLS)

### Step 3: Enable Google OAuth

1. Go to **Authentication** → **Providers**
2. Find **Google** and click "Enable"
3. You'll need to set up Google OAuth credentials:

#### Set Up Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen if prompted
6. Select **Application type:** Web application
7. Add **Authorized redirect URIs:**
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   (Replace `YOUR_PROJECT_REF` with your actual Supabase project reference)

8. Click **Create**
9. Copy the **Client ID** and **Client Secret**
10. Return to Supabase and paste them into the Google provider settings
11. Click **Save**

---

## Environment Configuration

### Step 1: Create Your `.env` File

1. In the root of your project, create a `.env` file:
   ```bash
   cd /Users/katie/Documents/GitHub/CoincubsWeb
   cp .env.example .env
   ```

2. Edit `.env` and add your real values:
   ```bash
   # .env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Verify `.env` is git-ignored:**
   ```bash
   git status
   # .env should NOT appear in the output
   ```

---

## Database Setup

### Step 1: Run the Database Schema

1. Open your Supabase project
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql`
5. Paste into the SQL editor
6. Click **Run** (bottom right)
7. Verify success (you should see "Success. No rows returned")

### Step 2: Verify Tables Were Created

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `user_profiles`
   - `student_accounts`
   - `class_funds`
   - `transactions`
   - `rewards`
   - `class_goals`
   - `voting_proposals`

### Step 3: Verify RLS is Enabled

1. Click on any table (e.g., `user_profiles`)
2. Click the **RLS** tab
3. You should see policies like:
   - "Users can view own profile"
   - "Users can insert own profile"
   - "Admins can view all profiles"

---

## Install Dependencies

### Step 1: Install Node Modules

```bash
cd /Users/katie/Documents/GitHub/CoincubsWeb
npm install

cd frontend
npm install
```

### Step 2: Verify Installation

```bash
cd frontend
npm list @supabase/supabase-js
# Should show @supabase/supabase-js@2.39.0 or similar
```

---

## Testing the Migration

### Step 1: Start Development Server

```bash
cd frontend
npm run dev
```

The app should open at `http://localhost:3000`

### Step 2: Test Authentication Flow

1. **Test Login:**
   - Click "I'm a Teacher" or "I'm a Parent"
   - You should be redirected to Google OAuth
   - Sign in with your Google account
   - You should be redirected back to CoinCubs

2. **Test Profile Setup:**
   - After first login, you should see the profile setup screen
   - Enter your name
   - Select "Teacher" or "Parent"
   - Click "Get Started"

3. **Verify Profile in Database:**
   - Go to Supabase → Table Editor → `user_profiles`
   - You should see your profile with:
     - `id`: Your user UUID
     - `name`: The name you entered
     - `role`: Either "admin" or "user"
     - `email`: Your Google email

4. **Test Logout:**
   - Click the "Logout" button
   - You should be returned to the login screen
   - Your session should be cleared

### Step 3: Test Role-Based Access

1. **As a Teacher (admin role):**
   - You should see teacher navigation (Quick Award, Class Display, Lessons, Settings)
   - Header should be amber/orange themed

2. **As a Parent (user role):**
   - You should see parent portal
   - Header should be blue/indigo themed

### Step 4: Verify RLS is Working

Test that users can only access their own data:

1. Open browser DevTools → Network tab
2. Try to access data
3. Verify API calls to Supabase succeed
4. Try to manually query another user's data (should fail)

---

## Deploying to Netlify

### Step 1: Prepare for Deployment

1. **Create a `netlify.toml` configuration file:**
   ```bash
   cd /Users/katie/Documents/GitHub/CoincubsWeb
   ```

   Create `netlify.toml`:
   ```toml
   [build]
     base = "frontend"
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Verify build works locally:**
   ```bash
   cd frontend
   npm run build
   ```

   Should create a `dist/` folder with your built app.

### Step 2: Push to GitHub

1. **Verify security before committing:**
   ```bash
   git status
   # Ensure .env is NOT listed
   ```

2. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Migrate from Internet Identity to Supabase auth"
   git push origin main
   ```

### Step 3: Deploy on Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize Netlify
4. Select your `CoincubsWeb` repository
5. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
6. Click "Show advanced" → "New variable"
7. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
8. Click "Deploy site"

### Step 4: Update Google OAuth Redirect URLs

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth credentials
3. Add your Netlify domain to **Authorized redirect URIs:**
   ```
   https://your-app-name.netlify.app
   https://your-app-name.netlify.app/*
   ```
4. Also add it to **Authorized JavaScript origins:**
   ```
   https://your-app-name.netlify.app
   ```
5. Save changes

### Step 5: Update Supabase Redirect URLs

1. Go to Supabase → Authentication → URL Configuration
2. Add your Netlify URL to **Site URL:**
   ```
   https://your-app-name.netlify.app
   ```
3. Add to **Redirect URLs:**
   ```
   https://your-app-name.netlify.app
   https://your-app-name.netlify.app/**
   ```
4. Save changes

### Step 6: Test Production Deployment

1. Visit your Netlify URL: `https://your-app-name.netlify.app`
2. Test login flow end-to-end
3. Verify authentication works
4. Test role-based access

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Cause:** `.env` file not found or variables not set

**Solution:**
1. Verify `.env` exists in project root
2. Check variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart dev server after changing `.env`

---

### Issue: "Failed to sign in. Please try again."

**Cause:** Google OAuth not configured correctly

**Solution:**
1. Verify Google OAuth is enabled in Supabase
2. Check Client ID and Client Secret are correct
3. Verify redirect URIs in Google Cloud Console
4. Check browser console for specific error messages

---

### Issue: "Error fetching user profile"

**Cause:** Database tables not created or RLS policies blocking access

**Solution:**
1. Verify `supabase-schema.sql` was run successfully
2. Check Table Editor to ensure tables exist
3. Check RLS policies are enabled
4. Review Supabase logs: Dashboard → Logs → Postgres Logs

---

### Issue: "Cannot read properties of null"

**Cause:** User profile not created after authentication

**Solution:**
1. Check if profile setup screen appears after login
2. Verify `user_profiles` table has an entry for your user
3. Check browser console for API errors
4. Verify RLS policies allow user to insert their own profile

---

### Issue: Build fails on Netlify

**Cause:** Environment variables not set or build configuration incorrect

**Solution:**
1. Verify environment variables are set in Netlify dashboard
2. Check build logs for specific errors
3. Ensure `netlify.toml` is in project root
4. Verify `base` directory is set to `frontend`

---

### Issue: "Access denied" or "Forbidden" errors

**Cause:** Row Level Security policies blocking access

**Solution:**
1. Verify you're logged in
2. Check your user role in `user_profiles` table
3. Verify RLS policies in Supabase
4. Check browser Network tab for API response details

---

### Issue: OAuth redirect loop

**Cause:** Redirect URLs misconfigured

**Solution:**
1. Verify ALL redirect URLs in Google Cloud Console match exactly:
   - Local: `http://localhost:3000`
   - Supabase: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Production: `https://your-app-name.netlify.app`
2. Ensure Supabase Site URL is set correctly
3. Clear browser cache and cookies
4. Try incognito/private browsing mode

---

## Code Changes Summary

### Files Added:
- `frontend/src/lib/supabase.ts` - Supabase client configuration
- `frontend/src/hooks/useSupabaseAuth.tsx` - Authentication context/hook
- `frontend/src/hooks/useUserQueries.ts` - User profile queries
- `supabase-schema.sql` - Database schema and RLS policies
- `.gitignore` - Security exclusions
- `.env.example` - Environment variable template
- `netlify.toml` - Netlify configuration
- `MIGRATION_GUIDE.md` - This file

### Files Modified:
- `frontend/src/main.tsx` - Changed provider from InternetIdentity to Supabase
- `frontend/src/App.tsx` - Updated auth logic to use Supabase
- `frontend/src/pages/LoginScreen.tsx` - Changed to Google OAuth
- `frontend/src/pages/ProfileSetup.tsx` - Updated to use Supabase
- `frontend/src/components/Header.tsx` - Updated logout logic
- `frontend/src/components/ParentHeader.tsx` - Updated logout logic
- `frontend/src/hooks/useQueries.ts` - Replaced with Supabase queries

### Files Removed/Deprecated:
- Internet Identity related code (backed up to `.backup` files)
- Motoko backend integration code
- Internet Computer canister dependencies

---

## Migration Checklist

Use this checklist to track your migration progress:

- [ ] Created Supabase project
- [ ] Copied API keys to `.env`
- [ ] Enabled Google OAuth in Supabase
- [ ] Set up Google Cloud OAuth credentials
- [ ] Ran `supabase-schema.sql` in SQL Editor
- [ ] Verified tables created in Table Editor
- [ ] Verified RLS policies enabled
- [ ] Installed npm dependencies
- [ ] Tested local development
- [ ] Tested authentication flow
- [ ] Tested profile creation
- [ ] Tested logout
- [ ] Tested role-based access
- [ ] Committed code to GitHub (verified .env excluded)
- [ ] Deployed to Netlify
- [ ] Added environment variables to Netlify
- [ ] Updated Google OAuth redirect URLs
- [ ] Updated Supabase redirect URLs
- [ ] Tested production deployment

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Netlify Deployment](https://docs.netlify.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## Support

If you encounter issues not covered in this guide:

1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Check Network tab for API responses
4. Review Supabase documentation
5. Check GitHub issues: https://github.com/supabase/supabase/issues

---

**Migration Complete!** 🎉

Your CoinCubs app is now running on Supabase with Google OAuth authentication!
