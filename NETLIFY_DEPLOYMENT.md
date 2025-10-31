# Netlify Deployment Guide

## Environment Variables Required

Before deploying to Netlify, you MUST configure the following environment variables in your Netlify project settings:

### Required Variables:

1. **VITE_SUPABASE_URL**
   - Description: Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`
   - Where to find: Supabase Dashboard → Project Settings → API

2. **VITE_SUPABASE_ANON_KEY**
   - Description: Your Supabase anonymous/public API key
   - Format: Long JWT token starting with `eyJ...`
   - Where to find: Supabase Dashboard → Project Settings → API → anon/public key
   - ⚠️ **IMPORTANT**: Use the `anon` key, NOT the `service_role` key!

## How to Set Environment Variables in Netlify:

### Option 1: Netlify UI
1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add each variable with its key and value
6. Click **Save**

### Option 2: Netlify CLI
```bash
netlify env:set VITE_SUPABASE_URL "https://your-project-id.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key-here"
```

### Option 3: netlify.toml (NOT RECOMMENDED - secrets will be committed)
```toml
# DO NOT USE THIS METHOD - it exposes secrets in git
[build.environment]
  VITE_SUPABASE_URL = "https://..."
  VITE_SUPABASE_ANON_KEY = "..."
```

## Build Settings

Configure these in Netlify → Site settings → Build & deploy:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`
- **Node version**: `18` or higher (set in `NODE_VERSION` env var if needed)

## Local Development

For local development, create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
cp ../.env.example .env.local
# Edit .env.local with your actual Supabase credentials
```

The `.env.local` file is already in `.gitignore` and will NOT be committed to git.

## Deployment Checklist

Before deploying to Netlify:

- [ ] Supabase project is created
- [ ] Google OAuth is configured in Supabase
- [ ] Environment variables are set in Netlify
- [ ] `.env.local` is NOT committed to git
- [ ] Build passes locally with `npm run build`
- [ ] `.gitignore` includes `.env` and `.env.local`

## Troubleshooting

### "Missing Supabase environment variables" Error

If you see this error after deployment:
1. Verify environment variables are set in Netlify
2. Ensure variable names match exactly (case-sensitive)
3. Redeploy the site after adding variables
4. Check the deploy logs for any errors

### Build Fails on Netlify

1. Check the deploy logs in Netlify
2. Verify Node version is compatible (18+)
3. Ensure `frontend` is set as the base directory
4. Try clearing the cache and redeploying

## Security Notes

⚠️ **NEVER commit the following files:**
- `.env`
- `.env.local`
- `.env.production.local`
- Any file containing actual API keys

✅ **Safe to commit:**
- `.env.example` (template with placeholder values)
- `.gitignore` (to prevent committing secrets)

The `anon` key is safe to expose publicly as it's protected by Row Level Security (RLS) in Supabase.
