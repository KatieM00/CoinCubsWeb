# Dual-Role Implementation Guide

## Overview
CoinCubs now supports users having BOTH Teacher AND Parent roles on the same Google account. This allows a teacher who is also a parent to easily switch between viewing their classroom and viewing their child's progress.

---

## What Was Changed

### 1. Database Schema Migration (`supabase-migration-dual-roles.sql`)

**IMPORTANT: You MUST run this SQL migration in your Supabase SQL Editor before deploying the new code!**

#### Key Changes:
- ✅ Renamed `user_profiles` → `profiles` (to match code)
- ✅ Changed PRIMARY KEY from `(id)` to `(id, role)` to allow multiple profiles per user
- ✅ Updated role constraint from `'admin'/'user'` to `'teacher'/'parent'`
- ✅ Created missing `classes` table
- ✅ Created `parent_class_enrollments` table to link parents to classes
- ✅ Updated all foreign key constraints to reference `auth.users` instead of profiles
- ✅ Updated all RLS policies to use new role values

#### To Run the Migration:
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `/supabase-migration-dual-roles.sql`
4. Click "Run"
5. Verify all tables were created successfully

---

### 2. TypeScript Types (No changes needed)

The types in `frontend/src/lib/supabase.ts` were already correct:
```typescript
export type UserRole = 'teacher' | 'parent'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name: string | null
  created_at: string
}
```

---

### 3. Authentication Hook (`frontend/src/hooks/useAuth.ts`)

#### Changes Made:
**Old Interface:**
```typescript
interface UseAuthReturn {
  user: User | null
  profile: UserProfile | null  // Single profile
  isLoading: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}
```

**New Interface:**
```typescript
interface UseAuthReturn {
  user: User | null
  profile: UserProfile | null  // Currently active profile
  profiles: UserProfile[]  // ALL profiles for this user
  activeRole: 'teacher' | 'parent' | null
  hasMultipleRoles: boolean
  isLoading: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  switchRole: (role: 'teacher' | 'parent') => void  // NEW
}
```

#### New Functionality:
- **Loads all profiles** for a user (not just one)
- **Tracks active role** - which role the user is currently viewing as
- **`switchRole()` function** - allows toggling between teacher and parent views
- **`hasMultipleRoles` flag** - true when user has both roles
- **Automatically sets first role** as active when loading profiles

---

### 4. Role Selection (`frontend/src/pages/RoleSelection.tsx`)

#### Changes Made:
- ✅ Now checks if teacher/parent profile already exists before creating
- ✅ Shows appropriate message: "Teacher account created" vs "Joined class successfully"
- ✅ Creates parent-class enrollment when parent joins a class
- ✅ Won't error if trying to add a role that already exists

#### User Flows:

**First-Time Teacher:**
1. Sign in with Google
2. Choose "Teacher"
3. Enter class name → Creates teacher profile + class

**First-Time Parent:**
1. Sign in with Google
2. Choose "Parent"
3. Enter class code → Creates parent profile + enrollment

**Teacher Adding Parent Role:**
1. Already has teacher account
2. Signs out and back in
3. Choose "Parent"
4. Enter class code → Adds parent profile (keeps teacher)

**Parent Adding Teacher Role:**
1. Already has parent account
2. Signs out and back in
3. Choose "Teacher"
4. Enter class name → Adds teacher profile (keeps parent)

---

### 5. Role Switcher Component (`frontend/src/components/RoleSwitcher.tsx`)

#### NEW Component!

**When it Shows:**
- User has both teacher AND parent roles
- No active role is selected yet
- Or user navigates to role switcher from settings

**What it Does:**
- Shows two cards: "View as Teacher" and "View as Parent"
- Highlights currently active role
- Allows instant switching without re-authentication
- Remembers choice in session

**Design:**
- Teacher card: Amber/orange theme with graduation cap icon
- Parent card: Blue theme with users icon
- Responsive grid layout

---

### 6. App Routing (`frontend/src/App.tsx`)

#### Changes Made:

**Old Flow:**
```
1. Loading
2. Not authenticated → LoginScreen
3. Authenticated but no profile → RoleSelection
4. Authenticated with profile → Main App
```

**New Flow:**
```
1. Loading
2. Demo mode → Main App (with demo data)
3. Not authenticated → LoginScreen
4. Authenticated but no profiles → RoleSelection
5. Authenticated with multiple roles, no active → RoleSwitcher
6. Authenticated with profile + active role → Main App
```

**Key Logic:**
```typescript
// Step 2: No profiles yet → create first role
if (isAuthenticated && profiles.length === 0) {
  return <RoleSelection />
}

// Step 2.5: Multiple roles, need to choose → show switcher
if (isAuthenticated && hasMultipleRoles && !activeRole) {
  return <RoleSwitcher />
}

// Step 3: Has active role → show appropriate interface
return <RouterProvider router={router} />
```

---

## User Experience

### Scenario 1: Teacher Only
```
Sign in → Choose Teacher → Create class → See QuickAwardPage
```

### Scenario 2: Parent Only
```
Sign in → Choose Parent → Enter code → See ParentPortalPage
```

### Scenario 3: Teacher + Parent (First as Teacher)
```
Day 1:
  Sign in → Choose Teacher → Create class → Use teacher features

Day 2 (wants to add parent):
  Sign out → Sign in → Choose Parent → Enter code → "Joined class!"
  → See RoleSwitcher → Choose "View as Parent" → See ParentPortalPage

Day 3 (wants to switch):
  Sign in → See RoleSwitcher → Choose role → Use that interface
```

### Scenario 4: Parent + Teacher (First as Parent)
```
Day 1:
  Sign in → Choose Parent → Enter code → Use parent features

Day 2 (wants to add teacher):
  Sign out → Sign in → Choose Teacher → Create class → "Class created!"
  → See RoleSwitcher → Choose "View as Teacher" → See QuickAwardPage
```

---

## Testing Checklist

Before deploying, test these scenarios:

### ✅ Database Migration
- [ ] Run migration SQL in Supabase
- [ ] Verify `profiles` table exists (not `user_profiles`)
- [ ] Verify `classes` table exists
- [ ] Verify `parent_class_enrollments` table exists
- [ ] Check role constraint allows 'teacher' and 'parent'

### ✅ Single Role Flows
- [ ] New user → Teacher → Can create class and award students
- [ ] New user → Parent → Can enter class code and view portal
- [ ] Teacher can sign out and back in → Still sees teacher view
- [ ] Parent can sign out and back in → Still sees parent view

### ✅ Dual Role Flows
- [ ] Teacher → Sign out → Sign in → Choose Parent → Adds parent role
- [ ] Parent → Sign out → Sign in → Choose Teacher → Adds teacher role
- [ ] User with both roles → See RoleSwitcher on login
- [ ] Can switch between teacher and parent views
- [ ] Teacher view shows QuickAwardPage, Header, Settings
- [ ] Parent view shows ParentPortalPage, ParentHeader, 4 tabs

### ✅ Demo Mode
- [ ] Demo as Teacher → Shows teacher interface with fake data
- [ ] Demo as Parent → Shows parent portal with 4 tabs
- [ ] Exit demo → Returns to login screen

---

## Database Schema Reference

### `profiles` Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('teacher', 'parent')),
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, role)  -- Allows multiple roles per user!
);
```

### `classes` Table
```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id),
  class_name TEXT NOT NULL,
  class_code TEXT NOT NULL UNIQUE,
  school_year TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `parent_class_enrollments` Table
```sql
CREATE TABLE parent_class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  child_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, class_id)
);
```

---

## Technical Implementation Details

### How `switchRole()` Works
1. User clicks "View as Teacher" or "View as Parent"
2. `switchRole('teacher')` or `switchRole('parent')` is called
3. Hook checks if user has that role in `profiles` array
4. Sets `activeRole` state to the chosen role
5. `profile` computed property returns the profile matching `activeRole`
6. App.tsx `RootLayoutComponent` checks `profile.role`
7. Shows `<TeacherLayout>` or `<ParentLayout>` accordingly
8. `IndexComponent` routes to `<QuickAwardPage>` or `<ParentPortalPage>`

### Profile Loading Logic
```typescript
const loadUserProfile = async (userId: string) => {
  // Load ALL profiles (not .single())
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)

  setProfiles(data)  // Array of profiles

  // Set first role as active if none selected
  if (!activeRole && data.length > 0) {
    setActiveRole(data[0].role)
  }
}
```

### Active Profile Computation
```typescript
// In useAuth.ts return statement:
const profile = profiles.find(p => p.role === activeRole) || profiles[0] || null
const hasMultipleRoles = profiles.length > 1
```

---

## Future Enhancements

### Potential Improvements:
1. **Role Switcher in Header** - Add dropdown to switch roles without logging out
2. **Persist Active Role** - Remember last selected role in localStorage
3. **Role-specific Settings** - Different preferences for teacher vs parent role
4. **Notification Badges** - Show alerts for each role separately
5. **Quick Role Preview** - Hover over role to see summary without switching
6. **Role Permissions** - More granular permissions within each role type

---

## Troubleshooting

### Issue: "Cannot insert duplicate key in profiles"
**Cause:** Trying to create a role that already exists
**Solution:** The code now checks `hasTeacherRole` and `hasParentRole` before inserting

### Issue: "profiles table does not exist"
**Cause:** Migration not run yet
**Solution:** Run `supabase-migration-dual-roles.sql` in Supabase SQL Editor

### Issue: "classes table does not exist"
**Cause:** Migration not run yet
**Solution:** Run `supabase-migration-dual-roles.sql` in Supabase SQL Editor

### Issue: User only sees one role but should have both
**Cause:** `loadUserProfile()` is loading profiles but active role not set correctly
**Solution:** Check browser console for `activeRole` value in useAuth debug logs

### Issue: RoleSwitcher not showing
**Cause 1:** User only has one role (working as intended)
**Cause 2:** `activeRole` is already set so App skips the switcher
**Solution:** Check `hasMultipleRoles` and `activeRole` values in console

---

## Files Changed

### Created:
- `/supabase-migration-dual-roles.sql` - Database migration
- `/frontend/src/components/RoleSwitcher.tsx` - Role switching UI
- `/DUAL-ROLE-IMPLEMENTATION.md` - This documentation

### Modified:
- `/frontend/src/hooks/useAuth.ts` - Multiple profiles support
- `/frontend/src/pages/RoleSelection.tsx` - Check existing roles
- `/frontend/src/App.tsx` - Role switcher routing logic

### Not Changed:
- `/frontend/src/lib/supabase.ts` - Types were already correct
- `/frontend/src/pages/ParentPortalPage.tsx` - Intact with 4 tabs
- `/frontend/src/pages/QuickAwardPage.tsx` - Teacher page unchanged
- All other pages and components

---

## Deployment Steps

1. **Run Database Migration**
   ```sql
   -- In Supabase SQL Editor, paste contents of:
   supabase-migration-dual-roles.sql
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Test Locally** (if possible)
   ```bash
   npm run dev
   # Test all scenarios above
   ```

4. **Deploy to Netlify**
   ```bash
   git add .
   git commit -m "feat: Implement dual teacher/parent role support"
   git push
   # Netlify will auto-deploy
   ```

5. **Test on Live Site**
   - Test single role flows
   - Test adding second role
   - Test role switching
   - Test demo mode for both roles

---

## Success Criteria

✅ **Database migration runs without errors**
✅ **Can create teacher account and class**
✅ **Can create parent account and join class**
✅ **Teacher can add parent role without losing teacher access**
✅ **Parent can add teacher role without losing parent access**
✅ **RoleSwitcher appears when user has both roles**
✅ **Can switch between roles and see correct interface**
✅ **Demo mode works for both teacher and parent**
✅ **All original features still work (QuickAward, ParentPortal, etc.)**

---

## Contact & Support

If you encounter any issues during implementation:
1. Check browser console for error messages
2. Check Supabase logs for database errors
3. Verify migration was run successfully
4. Test with a fresh Google account to rule out stale data

**Next Steps After Deployment:**
- Test all user flows thoroughly
- Gather feedback from beta users
- Monitor for any edge cases
- Consider adding role switcher to header for easier access

---

**Implementation Date:** November 1, 2025
**Status:** ✅ Complete - Ready for Testing
