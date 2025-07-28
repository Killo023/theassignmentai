# Supabase Setup Guide

## Why Supabase?
The current issue is that subscription data is stored in-memory and gets reset when you refresh the page. Supabase provides persistent database storage so your upgrade status will persist across page refreshes.

## Quick Setup

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com/)
2. Sign up/login and create a new project
3. Wait for the project to be ready (usually 1-2 minutes)

### 2. Get Your Credentials
1. Go to Project Settings → API
2. Copy your **Project URL** and **anon public** key
3. Add them to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Create the Subscriptions Table
In your Supabase dashboard, go to **Table Editor** and create a new table called `subscriptions` with these columns:

| Column Name | Type | Default Value | Primary Key |
|-------------|------|---------------|-------------|
| `user_id` | `text` | - | ✅ Yes |
| `plan` | `text` | `'pro'` | No |
| `status` | `text` | `'trial'` | No |
| `trial_end_date` | `timestamp with time zone` | - | No |
| `upgraded_at` | `timestamp with time zone` | `null` | No |
| `created_at` | `timestamp with time zone` | `now()` | No |

### 4. Set Row Level Security (RLS)
1. Go to **Authentication** → **Policies**
2. For the `subscriptions` table, add this policy:
   - **Policy Name**: `Enable read access for all users`
   - **Target roles**: `authenticated, anon`
   - **Using expression**: `true`
   - **Operation**: `SELECT, INSERT, UPDATE`

## Test the Integration

1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/test-supabase`
3. Try upgrading a user and refreshing the page - the status should persist!

## Fallback Mode
If you don't configure Supabase, the app will automatically fall back to in-memory storage (which resets on refresh). You'll see a warning in the console about Supabase not being configured.

## Benefits
- ✅ Subscription status persists across page refreshes
- ✅ Works across different browsers/devices
- ✅ Real-time updates via Supabase subscriptions
- ✅ Automatic backup and data safety
- ✅ Free tier includes 500MB database and 50,000 monthly active users

## Troubleshooting
- **"Error: Failed to create subscription"**: Check your Supabase credentials and table structure
- **"Supabase not configured"**: Add the environment variables to `.env.local`
- **RLS errors**: Make sure you've set up the policies correctly

Need help? Check the [Supabase documentation](https://supabase.com/docs) or ask in the community! 