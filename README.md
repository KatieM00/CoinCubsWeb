# CoinCubs - Classroom Economy Application

A collaborative classroom economy system where students work together to achieve collective goals while earning individual rewards. Built with React, TypeScript, and Supabase.

## Features

- **Google OAuth Authentication** - Secure login for teachers and parents
- **Role-Based Access Control** - Teachers (admins) and Parents (users) with different permissions
- **Student Account Management** - Track individual student balances and contributions
- **Class Fund System** - Collective fund that benefits the entire class
- **Rewards Catalog** - Redeemable rewards for students
- **Class Goals & Voting** - Democratic decision-making for class activities
- **Real-time Updates** - Live balance updates and transaction tracking
- **Curriculum Integration** - Built-in lesson plans and activities

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Routing:** TanStack Router
- **State Management:** TanStack React Query
- **Authentication:** Supabase Auth (Google OAuth)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Netlify

## Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Google Cloud Platform account (for OAuth)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/CoincubsWeb.git
   cd CoincubsWeb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd frontend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL in `supabase-schema.sql` to create tables and RLS policies
   - Enable Google OAuth in Authentication settings

5. **Run the development server:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## Deployment

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed deployment instructions to Netlify.

### Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/CoincubsWeb)

Remember to set environment variables in Netlify:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Project Structure

```
CoincubsWeb/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configs
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json
├── backend/                # (Deprecated - Motoko backend)
├── supabase-schema.sql     # Database schema
├── MIGRATION_GUIDE.md      # Detailed setup guide
├── netlify.toml            # Netlify configuration
└── README.md               # This file
```

## User Roles

### Teachers (Admin Role)
- Award ClassGems to students
- Manage student accounts
- Create and manage rewards
- Set up class goals
- Create voting proposals
- View all class data
- Access curriculum lessons

### Parents (User Role)
- View student progress (read-only)
- See class fund status
- View class goals and achievements
- Monitor voting proposals
- Access parent portal

## Security

- **Row Level Security (RLS)** - All database tables protected by RLS policies
- **Google OAuth** - Secure authentication through Google
- **Environment Variables** - Sensitive data stored in `.env` (never committed)
- **Role-Based Access** - Database-level permission enforcement

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database Schema

The database includes these main tables:
- `user_profiles` - User accounts with roles
- `student_accounts` - Student balances and data
- `class_funds` - Class-wide fund information
- `transactions` - All CubCoin transactions
- `rewards` - Available rewards catalog
- `class_goals` - Class goals and targets
- `voting_proposals` - Democratic voting system

All tables have Row Level Security enabled.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for setup help
- Review [Supabase Documentation](https://supabase.com/docs)
- Open an issue on GitHub

## Acknowledgments

Built with:
- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack](https://tanstack.com/)
- [Vite](https://vitejs.dev/)

---

**CoinCubs** - Growing Together, Achieving Together 🐻✨
