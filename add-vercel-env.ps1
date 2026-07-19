# Add missing environment variables to Vercel
Write-Host "Adding JWT_SECRET to Vercel..." -ForegroundColor Cyan
echo 'Au5vQVnPI+waWC2d7irtWVjp7+evpRa1axuXq81CvqmNsc4FveKqz0UvaNTVNS5/' | vercel env add JWT_SECRET production

Write-Host "Adding SUPABASE_URL to Vercel..." -ForegroundColor Cyan
echo 'https://wwdbdstbbpcmcbzwgunj.supabase.co' | vercel env add SUPABASE_URL production

Write-Host "Adding SUPABASE_ANON_KEY to Vercel..." -ForegroundColor Cyan
echo 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZGJkc3RiYnBjbWNiendndW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTAyNzIsImV4cCI6MjA5OTc4NjI3Mn0.NC7VUoJNKM3BkP0RagRhi_FScAyP2TDOpx-crPP4OnA' | vercel env add SUPABASE_ANON_KEY production

Write-Host "`nDone! Now redeploying backend..." -ForegroundColor Green
vercel --prod
