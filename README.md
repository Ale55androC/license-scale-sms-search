# License & Scale SMS Search API

**WORKING VERSION** - Clean implementation that properly returns SMS outreach content.

## Features

- ✅ SMS outreach queries return "Cold Outbound System" content
- ✅ Clean Supabase Edge Function integration  
- ✅ Proper response formatting
- ✅ Railway deployment ready

## Quick Test

```bash
curl -X POST "https://your-deployment.up.railway.app/api/slack-text" \
  -H "Content-Type: application/json" \
  -d '{"query": "sms outreach sop"}'
```

Should return the "Cold Outbound System" document with full SMS setup instructions.

## Deploy to Railway

1. Connect this repo to Railway
2. Deploy automatically 
3. Test SMS queries

## Endpoints

- `POST /api/slack-text` - Main n8n/Slack endpoint
- `POST /api/search` - Alternative format
- `GET /` - Health check

## How It Works

1. Query received (e.g., "sms outreach sop")
2. Calls Supabase Edge Function `hybrid-search-fixed`
3. Edge function maps SMS queries to "Cold SMS System"
4. Returns actual content instead of empty responses

This fixes the previous issue where searches showed "Found 3 relevant resources" but no actual content.