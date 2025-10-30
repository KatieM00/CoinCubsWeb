# Security Guidelines for CoinCubs

## Critical Security Principles

### 1. Environment Variables

#### ✅ DO:
- Store all sensitive data in `.env` files
- Use `VITE_` prefix for frontend environment variables
- Keep `.env` in `.gitignore`
- Commit `.env.example` with placeholder values
- Use Supabase **anon key** for frontend (it's designed to be public)

#### ❌ DON'T:
- **NEVER** commit `.env` files to Git
- **NEVER** use `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- **NEVER** hardcode API keys in source code
- **NEVER** expose database passwords
- **NEVER** commit credentials or secrets

### 2. Supabase Keys

#### Anon Key (Public) ✅
- **Safe to use in frontend**
- Protected by Row Level Security (RLS)
- Can be exposed in browser
- Limited by RLS policies

```typescript
// ✅ CORRECT - Use anon key
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY  // Safe!
);
```

#### Service Role Key (Secret) ❌
- **NEVER use in frontend**
- Bypasses all RLS policies
- Should only be used in secure backend environments
- Grants full database access

```typescript
// ❌ WRONG - Never do this in frontend!
const supabase = createClient(
  url,
  serviceRoleKey  // DANGEROUS!
);
```

### 3. Row Level Security (RLS)

#### Why RLS is Critical:
- Protects data even if anon key is compromised
- Enforces authorization at database level
- Prevents unauthorized data access
- Works automatically with Supabase Auth

#### RLS Best Practices:

1. **Always enable RLS on tables:**
   ```sql
   ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
   ```

2. **Create specific policies:**
   ```sql
   -- Users can only view their own data
   CREATE POLICY "Users view own data"
   ON public.user_profiles
   FOR SELECT
   USING (auth.uid() = id);
   ```

3. **Test policies thoroughly:**
   - Test as different user roles
   - Try to access unauthorized data
   - Verify policies block correctly

### 4. Authentication Security

#### Google OAuth:
- Use official Google OAuth flow
- Never store passwords
- Let Supabase handle token management
- Use secure session storage

#### Session Management:
```typescript
// ✅ CORRECT - Let Supabase manage sessions
supabase.auth.getSession()

// ✅ CORRECT - Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state
})
```

### 5. API Security

#### Client-Side API Calls:
```typescript
// ✅ CORRECT - Auth user is automatically attached
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', user.id);  // RLS enforces this
```

#### Never Trust Client Input:
```typescript
// ❌ WRONG - Trusting role from client
const role = req.body.role;  // Can be manipulated!

// ✅ CORRECT - Get role from database
const { data } = await supabase
  .from('user_profiles')
  .select('role')
  .eq('id', user.id)
  .single();
```

### 6. Git Security

#### Before Every Commit:

```bash
# 1. Check status
git status

# 2. Verify .env is NOT listed
# If you see .env, STOP! Don't commit.

# 3. Check .gitignore
cat .gitignore | grep .env
# Should show: .env, .env.local, etc.

# 4. Check for secrets in staged files
git diff --cached | grep -i "key\|secret\|password"
# Should return nothing

# 5. Only then commit
git commit -m "Your message"
```

#### If You Accidentally Commit Secrets:

1. **Immediately rotate all keys:**
   - Generate new Supabase anon key
   - Update Google OAuth credentials
   - Change all passwords

2. **Remove from Git history:**
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # Or delete and recreate repository
   ```

3. **Update all deployments**

### 7. Deployment Security (Netlify)

#### Environment Variables:
1. Go to Site Settings → Build & Deploy → Environment
2. Add variables individually (never in `netlify.toml`)
3. Mark as "Sensitive" if available
4. Never log environment variables

#### Build Configuration:
```toml
# netlify.toml
# ✅ CORRECT - Reference env vars, don't include values
[build.environment]
  NODE_VERSION = "18"

# ❌ WRONG - Never put real values here!
# VITE_SUPABASE_ANON_KEY = "real-key-here"
```

### 8. Database Security

#### Password Requirements:
- Use Supabase's generated strong passwords
- Store passwords in secure password manager
- Never share database passwords
- Rotate passwords periodically

#### Connection Security:
- Only connect via Supabase client
- Use connection pooling
- Enable SSL/TLS
- Restrict IP access if needed

### 9. Code Security

#### Input Validation:
```typescript
// ✅ CORRECT - Validate all inputs
if (!name.trim() || name.length > 100) {
  throw new Error('Invalid name');
}

// ✅ CORRECT - Sanitize user input
const sanitizedName = name.trim().slice(0, 100);
```

#### SQL Injection Prevention:
```typescript
// ✅ CORRECT - Use Supabase query builder (prevents injection)
await supabase
  .from('users')
  .select('*')
  .eq('name', userInput);  // Automatically sanitized

// ❌ WRONG - Raw SQL with user input
await supabase.rpc('raw_sql', {
  query: `SELECT * FROM users WHERE name = '${userInput}'`
});
```

### 10. Error Handling

#### Don't Expose Sensitive Info:
```typescript
// ❌ WRONG - Exposing error details
catch (error) {
  alert(error.message);  // May contain sensitive info
}

// ✅ CORRECT - Generic user message
catch (error) {
  console.error('Error:', error);  // Log for debugging
  toast.error('Something went wrong');  // Generic message
}
```

### 11. Frontend Security

#### XSS Prevention:
```tsx
// ✅ CORRECT - React escapes by default
<div>{userName}</div>

// ❌ WRONG - dangerouslySetInnerHTML with user content
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ CORRECT - Sanitize if HTML needed
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userContent)
}} />
```

#### CSRF Protection:
- Supabase handles CSRF tokens automatically
- Use SameSite cookies
- Verify origin in sensitive operations

### 12. Access Control

#### Role Verification:
```typescript
// ✅ CORRECT - Check role before sensitive operations
if (userProfile.role !== 'admin') {
  throw new Error('Unauthorized');
}

// ✅ CORRECT - Let RLS enforce at database level
// Policy will prevent non-admins automatically
```

## Security Checklist

Use this before every deployment:

- [ ] `.env` is in `.gitignore`
- [ ] No `.env` files committed to Git
- [ ] Only anon key used in frontend
- [ ] All tables have RLS enabled
- [ ] RLS policies tested for all roles
- [ ] Google OAuth configured correctly
- [ ] Environment variables set in Netlify
- [ ] No hardcoded secrets in code
- [ ] Input validation on all user inputs
- [ ] Error messages don't expose sensitive data
- [ ] Session management handled by Supabase
- [ ] HTTPS enabled in production
- [ ] Database password is strong
- [ ] Regular security audits scheduled

## Incident Response

If you discover a security issue:

1. **Immediately:**
   - Revoke compromised credentials
   - Generate new keys
   - Update all deployments

2. **Investigate:**
   - Check Supabase logs
   - Review database access logs
   - Identify scope of compromise

3. **Remediate:**
   - Patch vulnerabilities
   - Update security policies
   - Document incident

4. **Prevent:**
   - Add tests for the issue
   - Update documentation
   - Train team on prevention

## Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Google OAuth Security](https://developers.google.com/identity/protocols/oauth2/security-best-practices)

## Contact

For security concerns, please review this document and the Supabase security documentation.

---

**Remember: Security is everyone's responsibility!** 🔒
