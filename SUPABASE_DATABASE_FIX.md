# 🚨 Supabase Database Fix Guide

## Problem Summary
The Assignment AI application cannot save or retrieve assignments because the `assignments` table doesn't exist in the Supabase database. Users see errors when trying to create assignments.

## Root Cause
- ✅ Supabase connection is working
- ✅ `subscriptions` table exists 
- ❌ `assignments` table is **MISSING**
- ❌ Assignment operations fail with "relation does not exist" error

## Solution: Manual Database Setup

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project: `https://supabase.com/dashboard/project/ibhrkjbcpxyjfbkepgwd`

### Step 2: Open SQL Editor
1. In the left sidebar, click **"SQL Editor"**
2. Click **"New Query"** button

### Step 3: Run the Setup Script

**Option A: Full Setup (Recommended)**
1. Open the file `supabase-setup.sql` from your project root  
2. Copy ALL the contents (SQL without the final SELECT statements)
3. Paste it into the Supabase SQL editor
4. Click **"Run"** to execute the script

**Option B: Quick Fix (Assignments table only)**
1. Open the file `create-assignments-table-only.sql` from your project root
2. Copy ALL the contents
3. Paste it into the Supabase SQL editor  
4. Click **"Run"** to execute the script

> 💡 **Note**: The SQL syntax error at "UNION" has been fixed. Use the updated files.

### Step 4: Verify Setup
Run this command to test the database:
\`\`\`bash
npm run test:db
\`\`\`

Or visit: `http://localhost:3000/setup-database` in your browser

## Alternative: Web-Based Setup Tool

If you prefer a browser-based tool:

1. Start your development server: `npm run dev`
2. Go to: `http://localhost:3000/setup-database`
3. Click "Check & Setup Database"
4. Follow the on-screen instructions

## What the Setup Script Creates

### Tables Created:
- ✅ `subscriptions` (already exists)
- ✅ `assignments` (will be created)

### Assignment Table Features:
- Basic fields: id, user_id, title, subject, type, status
- Professional options: assignment_type, academic_level, quality_level
- Citation support: citation_style, include_citations
- Formatting options: font, spacing, margins, page size
- Visual elements: tables_data, charts_data, references_data
- Export options: multiple format support
- Quality metrics and preferences

### Security:
- Row Level Security (RLS) enabled
- Permissive policies for all operations
- Proper indexing for performance

## Testing After Setup

### Quick Test:
\`\`\`bash
node scripts/test-supabase-detailed.js
\`\`\`

### Expected Success Output:
\`\`\`
✅ Basic connection successful
✅ Assignments table exists and accessible
✅ Successfully fetched assignments: 0
✅ RLS test passed
\`\`\`

## If Setup Still Fails

### Check These:
1. **Permissions**: Make sure you have admin access to the Supabase project
2. **Project ID**: Verify you're in the correct project (`ibhrkjbcpxyjfbkepgwd`)
3. **SQL Execution**: Check for any error messages in the SQL editor
4. **Network**: Ensure you have internet connectivity

### Get Help:
- Check Supabase logs in the dashboard
- View SQL execution history
- Contact support if persistent issues

## Environment Configuration

Current Supabase settings (confirmed working):
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://ibhrkjbcpxyjfbkepgwd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...(working)
\`\`\`

## After Successful Setup

Once the tables are created:
- ✅ Users can save assignments
- ✅ Assignment history will work
- ✅ Favorites and search will function
- ✅ All dashboard features will be operational

## Commands for Testing

\`\`\`bash
# Test basic connection
npm run test:db

# Test assignment operations
node scripts/test-supabase-detailed.js

# Check table structure
npm run setup:db
\`\`\`

---

**Status**: Manual action required - run SQL script in Supabase dashboard
**Priority**: High - blocks core functionality
**Time**: ~5 minutes to complete setup