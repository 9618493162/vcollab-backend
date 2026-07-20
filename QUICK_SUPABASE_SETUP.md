# ⚡ SUPABASE SETUP - QUICK VERSION

## 🎯 3 Simple Steps:

### 1️⃣ Create Project (2 min)
Go to: https://supabase.com/dashboard
- Click "New Project"
- Name: `vcollab-database`
- Choose region closest to you
- Set password (save it!)
- Click "Create"
- ⏳ Wait 2-3 minutes

### 2️⃣ Get Credentials (1 min)
- Click ⚙️ Settings → API
- Copy **Project URL**
- Copy **anon public** key (the LONG one)

### 3️⃣ Create Tables (1 min)
- Click "SQL Editor" → "New query"
- Copy-paste the SQL from `SUPABASE_SETUP_INSTRUCTIONS.md` (Step 3.2)
- Click "Run"
- ✅ Done!

---

## 📋 Then Paste Here:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJ... (your full key)
```

I'll update the configuration automatically!

---

## ⏱️ Total Time: ~5 minutes

---

## 🆘 Having Issues?

**"Can't find anon key"**
→ Settings → API → Project API keys → Look for "anon" "public"

**"SQL error"**
→ Make sure you're in "SQL Editor" tab
→ Paste the entire SQL script
→ Click "Run" or press Ctrl+Enter

**"Project taking too long"**
→ Normal! Supabase takes 2-3 minutes to initialize
→ Refresh the page after a few minutes

---

**Ready? Start here: https://supabase.com/dashboard** 🚀
