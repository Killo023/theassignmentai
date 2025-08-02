# Database Setup Guide - Fix Assignment Saving Issues

## 🚨 Current Issue
Your application is showing these errors:
- "Database connection test failed"
- "Error fetching assignments"
- "Assignments table does not exist"

This means the Supabase database tables haven't been created yet.

## 🔧 Quick Fix - Manual Setup

### Step 1: Access Your Supabase Dashboard
1. Go to [supabase.com](https://supabase.com/)
2. Sign in to your account
3. Open your project (URL: `https://ibhrkjbcpxyjfbkepgwd.supabase.co`)

### Step 2: Create the Database Tables
1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-setup.sql` file
4. Click **Run** to execute the script

### Step 3: Verify Setup
1. Go to **Table Editor** (left sidebar)
2. You should see two new tables:
   - `subscriptions`
   - `assignments`

## 🧪 Test the Fix

### Option 1: Use the Test Page
1. Start your development server: `npm run dev`
2. Visit: `http://localhost:3000/test-supabase`
3. Check if the database connection test passes

### Option 2: Try Creating an Assignment
1. Go to: `http://localhost:3000/dashboard/assignments`
2. Try creating a new assignment
3. Check if it saves successfully

## 📋 What the Setup Script Does

The `supabase-setup.sql` script creates:

### Subscriptions Table
- Tracks user subscription status
- Manages assignment limits
- Stores upgrade history

### Assignments Table
- Stores all assignment data
- Includes enhanced professional fields
- Supports visual elements (tables, charts, references)
- Has proper indexing for performance

### Security & Performance
- Row Level Security (RLS) enabled
- Proper indexes for fast queries
- Data validation constraints

## 🔍 Troubleshooting

### If you get "Permission denied" errors:
1. Go to **Authentication** → **Policies**
2. For both `subscriptions` and `assignments` tables:
   - Add policy: "Enable all operations"
   - Target roles: `authenticated, anon`
   - Using expression: `true`

### If tables don't appear:
1. Refresh the Table Editor page
2. Check the SQL Editor for any error messages
3. Make sure you're in the correct project

### If connection still fails:
1. Check your environment variables in `.env.local`
2. Verify the Supabase URL and API key are correct
3. Ensure your project is active and not paused

## ✅ Success Indicators

After successful setup, you should see:
- ✅ No more database connection errors
- ✅ Assignments save successfully
- ✅ Assignment list loads properly
- ✅ Subscription status persists across refreshes

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. **Check the console logs** in your browser's developer tools
2. **Verify your Supabase project** is active and not in maintenance
3. **Test the connection** at `http://localhost:3000/test-supabase`
4. **Check the troubleshooting guide** in `TROUBLESHOOTING_GUIDE.md`

## 🎯 Next Steps

Once the database is working:
1. Create your first assignment
2. Test the subscription upgrade flow
3. Try the export features
4. Explore the enhanced professional features

---

**Need help?** Check the console logs for specific error messages and refer to the troubleshooting guides in your project. 