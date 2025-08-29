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

## Deploy with Docker (Recommended)

### Local Testing
```bash
docker build -t sms-search-api .
docker run -d -p 3000:8080 sms-search-api
curl -X POST "http://localhost:3000/api/slack-text" -H "Content-Type: application/json" -d '{"query": "sms outreach sop"}'
```

### Deploy to Any Platform
- **Railway**: Connect repo, will auto-detect Dockerfile
- **Render**: Docker deployment 
- **DigitalOcean**: Docker droplet
- **AWS/GCP**: Container services

## Alternative: Railway (May have compatibility issues)
1. Connect this repo to Railway  
2. Set port to 8080
3. Deploy automatically

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