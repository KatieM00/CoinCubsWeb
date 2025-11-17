# CoinCubs - Financial Literacy for Primary Schools

> **Hackathon Submission** - Teaching children financial literacy through gamified classroom management

---

## For Hackathon Judges - Quick Start

### Option 1: Demo Mode (Recommended)

**No setup required - instant access to all features with realistic demo data!**

1. Visit the deployed application
2. Click the **"Try Demo"** dropdown button in the top right corner
3. Select:
   - **"Demo as Teacher"** - Experience the full teacher dashboard
   - **"Demo as Parent"** - Explore the parent portal

### Option 2: Sign In with Google

1. Click **"Sign in with Google"**
2. Authenticate with your Google account
3. Select your role (Teacher or Parent)
4. Teachers: Create a class and add students
5. Parents: Link to a class using a class code

---

## What to Test - Teacher Demo

### 1. Award CubCoins (Main Feature)
**Navigate to: Award page (default)**

- Select a student from dropdown (e.g., "Emma Johnson")
- Choose a reason: "Great work", "Helped classmate", etc.
- Pick an amount: 5, 10, 15, 20, or 25 CC
- Click **"Submit"**
- **Notice the 70/30 split**: 70% to class fund, 30% to student's personal balance
- This teaches community contribution!

### 2. Whole Class Awards
- Click **"Whole Class"** button instead of selecting a student
- 100% goes to class fund
- Great for collective achievements

### 3. Class Bank (Transaction History)
**Navigate to: Class Bank**

- View complete transaction history
- Filter by: All Time, This Week, This Month
- Sort: Newest First or Oldest First
- See income (green +) and expenses (red -)
- Track running balance

### 4. Shop System with VAT
**From Class Bank: Click "Open Shop"**

- **Step 1**: Choose purchaser
  - "Whole Class" - for class rewards (pizza party, movie afternoon)
  - Individual student - for personal privileges (line leader, homework pass)
- **Step 2**: Browse and add items to basket
- **Step 3**: Review with **20% VAT calculation** (teaches taxation!)
- **Step 4**: Confirm purchase

### 5. Student Management
**Navigate to: Settings > Student Management**

- Add students manually or CSV import
- View each student's:
  - Personal balance
  - Total class contribution
- Click **"Enter Bank"** - see individual transaction history

### 6. Class Display
**Navigate to: Class Display**

- Designed for classroom projection
- Shows class fund balance and goals

### 7. Lessons & Curriculum
**Navigate to: Lessons**

- 12-week financial literacy programme
- Monday and Friday lessons each week
- Teacher scripts and discussion questions
- Mark lessons as complete

---

## What to Test - Parent Demo

### 1. Learning Progress Tab
- View your child's positive contributions
- See curriculum progress
- Track class achievements

### 2. Payments Tab
- View upcoming school expenses
- See payment history
- Secure payment setup (coming soon)

### 3. Forms Tab
- Review pending permission slips
- Click **"Review & Sign"** to see digital signature capture
- View completed forms

### 4. Profile Tab
- Update contact information
- Add additional children with class codes
- Manage notification preferences

---

## Educational Value

### Financial Literacy Concepts

1. **Earning** - Positive behaviours earn CubCoins
2. **Saving** - Accumulate for bigger rewards
3. **Spending** - Make purchasing decisions
4. **Taxation** - 20% VAT teaches tax concepts
5. **Community Contribution** - 70/30 split = collective benefit
6. **Budgeting** - Track balances and plan purchases
7. **Goal Setting** - Class works towards shared goals

### Why This Matters

UK research shows financial literacy education in primary schools significantly improves:
- Decision-making skills
- Understanding of money management
- Collaborative problem-solving
- Delayed gratification

---

## Technical Architecture

### Tech Stack

**Frontend Framework**
- **React 18** with TypeScript for type safety
- **Vite** for fast builds and hot module replacement
- **TanStack Router** for type-safe routing
- **TanStack Query (React Query)** for server state management

**UI & Styling**
- **Tailwind CSS** for utility-first styling
- **Radix UI** primitives via shadcn/ui components
- **Custom SVG icons** and emoji (no lucide-react dependency for bundle reliability)
- **Sonner** for toast notifications

**Backend & Authentication**
- **Supabase** (PostgreSQL) for database
- **Supabase Auth** with Google OAuth
- **Row Level Security (RLS)** policies for data protection

**Build & Deployment**
- **Vite** production builds with code splitting
- **Netlify** deployment with environment variables
- **TypeScript** strict mode for reliability

### Architecture Decisions

**Why TanStack Router?**
- Type-safe routing with full TypeScript support
- File-based route generation
- Built-in data loading patterns
- Better than React Router for complex apps

**Why TanStack Query?**
- Automatic caching and background refetching
- Optimistic updates for responsive UI
- Query invalidation for data consistency
- Reduces boilerplate compared to Redux

**Why Supabase?**
- PostgreSQL with real-time subscriptions
- Built-in authentication (Google OAuth)
- Row Level Security for data protection
- Auto-generated REST APIs
- Free tier suitable for hackathon

**Why No lucide-react?**
- Eliminated dependency to prevent bundle initialization issues
- Direct SVG and emoji icons for reliability
- Reduced bundle size
- No tree-shaking concerns

### Security Features
- **Row Level Security** - Database-level access control
- **Google OAuth** - No password management needed
- **Environment Variables** - Secrets never in source code
- **GDPR Compliance** - Data protection by design
- **Demo Mode** - No real student data exposed

### Performance Optimizations
- Code splitting with manual chunks (vendor-react, vendor-router, vendor-query, vendor-ui)
- Disabled minification to prevent TDZ (Temporal Dead Zone) issues
- Pre-bundled dependencies for faster startup
- Lazy loading for non-critical components
- Efficient re-rendering with React Query caching

### Design Principles
- **Mobile-first** responsive design
- **44px minimum** touch targets for accessibility
- **WCAG AAA** compliance goals
- **British English** throughout (UK primary school focus)
- **No external icon dependencies** for bundle reliability
- **Progressive enhancement** - works without JavaScript where possible

---

## Repository Structure

```
CoincubsWeb/
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── contexts/        # React contexts (Demo, Auth)
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/
│   │   │   ├── QuickAwardPage.tsx    # Teacher dashboard
│   │   │   ├── ClassBankPage.tsx     # Transactions
│   │   │   ├── SettingsPage.tsx      # Management
│   │   │   ├── LessonsPage.tsx       # Curriculum
│   │   │   └── ParentPortalPage.tsx  # Parent view
│   │   ├── data/            # Curriculum content
│   │   └── types/           # TypeScript definitions
│   └── dist/                # Production build
└── README.md
```

---

## Local Development

```bash
git clone https://github.com/yourusername/CoincubsWeb.git
cd CoincubsWeb/frontend

npm install
npm run dev     # Start dev server
npm run build   # Production build
```

---

## Future Roadmap

- Real-time transaction persistence
- Banking system with interest
- Achievement badges
- Parent-teacher messaging
- Class voting on purchases
- Admin reports and analytics
- Multi-language support

---

## The Team

Built with dedication for educators and young learners, making financial education accessible and engaging.

---

**CoinCubs - Growing Financial Literacy Together**

*"Teaching children to earn, save, and spend wisely - one CubCoin at a time"*
