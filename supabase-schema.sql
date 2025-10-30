-- CoinCubs Database Schema for Supabase
-- This file contains the SQL commands to set up your database structure

-- ============================================================================
-- 1. USER PROFILES TABLE
-- ============================================================================
-- Stores user profile information for teachers and parents
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- 2. STUDENT ACCOUNTS TABLE
-- ============================================================================
-- Stores student information and balances
CREATE TABLE IF NOT EXISTS public.student_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  personal_balance INTEGER DEFAULT 0 CHECK (personal_balance >= 0),
  total_contributions INTEGER DEFAULT 0 CHECK (total_contributions >= 0),
  is_active BOOLEAN DEFAULT true,
  private_notes TEXT DEFAULT '',
  student_id SERIAL UNIQUE,
  wallet_address TEXT DEFAULT '',
  created_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.student_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_accounts
-- Admins can do everything with student accounts
CREATE POLICY "Admins can manage student accounts"
  ON public.student_accounts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Parents can view student accounts (read-only)
CREATE POLICY "Parents can view student accounts"
  ON public.student_accounts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'user'
    )
  );

-- ============================================================================
-- 3. CLASS FUND TABLE
-- ============================================================================
-- Stores class-wide fund information
CREATE TABLE IF NOT EXISTS public.class_funds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_balance INTEGER DEFAULT 0 CHECK (total_balance >= 0),
  goal_amount INTEGER DEFAULT 0,
  goal_description TEXT DEFAULT '',
  created_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.class_funds ENABLE ROW LEVEL SECURITY;

-- RLS Policies for class_funds
-- Admins can manage class funds
CREATE POLICY "Admins can manage class funds"
  ON public.class_funds
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Parents can view class funds (read-only)
CREATE POLICY "Parents can view class funds"
  ON public.class_funds
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'user'
    )
  );

-- ============================================================================
-- 4. TRANSACTIONS TABLE
-- ============================================================================
-- Stores all CubCoin transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.student_accounts(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('award', 'spend', 'contribution', 'undo')),
  description TEXT NOT NULL,
  split_type TEXT CHECK (split_type IN ('personal', 'class', 'both', NULL)),
  created_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
-- Admins can manage transactions
CREATE POLICY "Admins can manage transactions"
  ON public.transactions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Parents can view transactions (read-only)
CREATE POLICY "Parents can view transactions"
  ON public.transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'user'
    )
  );

-- ============================================================================
-- 5. REWARDS CATALOG TABLE
-- ============================================================================
-- Stores available rewards students can redeem
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cost INTEGER NOT NULL CHECK (cost >= 0),
  description TEXT DEFAULT '',
  is_available BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rewards
-- Admins can manage rewards
CREATE POLICY "Admins can manage rewards"
  ON public.rewards
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Parents can view rewards (read-only)
CREATE POLICY "Parents can view rewards"
  ON public.rewards
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'user'
    )
  );

-- ============================================================================
-- 6. CLASS GOALS TABLE
-- ============================================================================
-- Stores class-wide goals
CREATE TABLE IF NOT EXISTS public.class_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  target_amount INTEGER NOT NULL CHECK (target_amount > 0),
  current_amount INTEGER DEFAULT 0 CHECK (current_amount >= 0),
  description TEXT DEFAULT '',
  is_completed BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.class_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for class_goals
-- Admins can manage class goals
CREATE POLICY "Admins can manage class goals"
  ON public.class_goals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Parents can view class goals (read-only)
CREATE POLICY "Parents can view class goals"
  ON public.class_goals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'user'
    )
  );

-- ============================================================================
-- 7. VOTING PROPOSALS TABLE
-- ============================================================================
-- Stores class voting proposals
CREATE TABLE IF NOT EXISTS public.voting_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  options JSONB NOT NULL, -- Array of {name: string, votes: number}
  is_active BOOLEAN DEFAULT true,
  total_votes INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.voting_proposals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for voting_proposals
-- Admins can manage voting proposals
CREATE POLICY "Admins can manage voting proposals"
  ON public.voting_proposals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Parents can view voting proposals (read-only)
CREATE POLICY "Parents can view voting proposals"
  ON public.voting_proposals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'user'
    )
  );

-- ============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_student_accounts_created_by ON public.student_accounts(created_by);
CREATE INDEX IF NOT EXISTS idx_student_accounts_is_active ON public.student_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_transactions_student_id ON public.transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_class_goals_is_completed ON public.class_goals(is_completed);
CREATE INDEX IF NOT EXISTS idx_voting_proposals_is_active ON public.voting_proposals(is_active);

-- ============================================================================
-- 9. TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_student_accounts
  BEFORE UPDATE ON public.student_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_class_funds
  BEFORE UPDATE ON public.class_funds
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_rewards
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_class_goals
  BEFORE UPDATE ON public.class_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_voting_proposals
  BEFORE UPDATE ON public.voting_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Enable Google OAuth in Authentication > Providers
-- 3. Set up your environment variables in .env
-- 4. Deploy your app!
