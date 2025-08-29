# Supabase Quick Start - 5 Minutes to Live Database

## Step 1: Create Supabase Project (2 minutes)

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (sign up with GitHub)
3. Create new organization: `AI Capital Defender`
4. New project settings:
   - **Project name**: `aicapitaldefender-prod`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users (e.g., US East)
   - **Pricing Plan**: Free tier is fine to start

## Step 2: Run Database Setup (1 minute)

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy ALL content from `supabase-quick-setup.sql`
4. Paste and click **Run** (or press F5)
5. You should see: "Supabase setup complete!"

## Step 3: Get Your API Keys (1 minute)

1. Click **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL**: `https://[your-project].supabase.co`
   - **Service Role Key**: `eyJhbG...` (keep this SECRET!)

## Step 4: Add to Vercel (1 minute)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `ai-pentest-platform`
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
SUPABASE_URL = [paste your Project URL]
SUPABASE_SERVICE_KEY = [paste your Service Role Key]
```

5. Click **Save**

## Step 5: Redeploy (30 seconds)

```bash
cd public-marketing-site
vercel --prod
```

## That's It! Your Forms Now Save to Database!

### Test It:
1. Go to https://aicapitaldefender.com/signup
2. Fill out the form
3. Check Supabase dashboard → **Table Editor** → **leads**
4. You'll see your submission!

### Monitor Submissions:

In Supabase SQL Editor, run:
```sql
-- See all leads
SELECT * FROM leads ORDER BY created_at DESC;

-- See stats
SELECT * FROM lead_stats;

-- See top companies
SELECT * FROM company_insights LIMIT 10;
```

### Troubleshooting:

**Forms still not saving?**
- Check Vercel logs: `vercel logs --follow`
- Verify environment variables are set
- Make sure you used SERVICE_KEY not ANON_KEY

**Need help?**
- Supabase Discord: https://discord.supabase.com
- Check API logs in Supabase dashboard

## Next Steps:

1. **Email Notifications**: Set up email alerts for new leads
2. **Zapier Integration**: Connect to CRM/Slack
3. **Analytics Dashboard**: Build real-time metrics
4. **Lead Scoring**: Auto-qualify leads based on criteria

Total Setup Time: **5 minutes** ⚡