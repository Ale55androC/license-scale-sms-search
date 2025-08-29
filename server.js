const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'SMS Search API Running', version: '2.0' });
});

// Main search endpoint for n8n/Slack
app.post('/api/slack-text', async (req, res) => {
    try {
        console.log('📨 Search request:', req.body);
        
        const query = req.body.query || req.body.text || req.body.message || '';
        
        if (!query || query.trim().length === 0) {
            return res.json({
                response: "❌ Please provide a search query."
            });
        }
        
        console.log(`🔍 Searching for: "${query}"`);
        
        // Call Supabase Edge Function
        const response = await fetch('https://vqwpvjddptzdgpcuvvye.supabase.co/functions/v1/hybrid-search-fixed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxd3B2amRkcHR6ZGdwY3V2dnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTQ2MTIsImV4cCI6MjA3MTM3MDYxMn0.9yYJD0A72NYW4meF0_CX3Wkl-MHgUWmob1QwokK421U'}`
            },
            body: JSON.stringify({ query })
        });
        
        const searchData = await response.json();
        console.log('🔍 Edge function found:', searchData.results?.length || 0, 'results');
        
        // Format response for Slack
        let slackResponse = '';
        
        if (searchData.results && searchData.results.length > 0) {
            const firstResult = searchData.results[0];
            slackResponse = `🎯 *${firstResult.title}*\n\n`;
            
            // Show actual content
            if (firstResult.content_full) {
                const content = firstResult.content_full.substring(0, 800);
                slackResponse += `📄 ${content}${firstResult.content_full.length > 800 ? '...' : ''}\n\n`;
            }
            
            slackResponse += `🔗 Resource: \`${firstResult.resource_id || firstResult.title}\`\n`;
            slackResponse += `📊 Relevance: ${Math.round((firstResult.relevance_score || 0.8) * 100)}%`;
        } else {
            slackResponse = `❌ No resources found for: "${query}"`;
        }
        
        slackResponse += '\n\n_License & Scale Content Finder_ 🚀';
        
        res.json({
            response: slackResponse
        });
        
    } catch (error) {
        console.error('❌ Search error:', error);
        res.json({
            response: "❌ Sorry, I encountered an error while searching. Please try again."
        });
    }
});

// Alternative endpoint format for different integrations
app.post('/api/search', async (req, res) => {
    try {
        const query = req.body.query || req.body.text || '';
        
        if (!query) {
            return res.json({
                text: "❌ Please provide a search query.",
                response_type: "in_channel"
            });
        }
        
        // Call Supabase Edge Function
        const response = await fetch('https://vqwpvjddptzdgpcuvvye.supabase.co/functions/v1/hybrid-search-fixed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxd3B2amRkcHR6ZGdwY3V2dnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTQ2MTIsImV4cCI6MjA3MTM3MDYxMn0.9yYJD0A72NYW4meF0_CX3Wkl-MHgUWmob1QwokK421U'}`
            },
            body: JSON.stringify({ query })
        });
        
        const searchData = await response.json();
        
        let slackResponse = '';
        if (searchData.results && searchData.results.length > 0) {
            const result = searchData.results[0];
            slackResponse = `🎯 *${result.title}*\n\n📄 ${result.content_full?.substring(0, 400)}...\n\n🔗 \`${result.resource_id}\``;
        } else {
            slackResponse = `❌ No results found for: "${query}"`;
        }
        
        slackResponse += '\n\n_License & Scale Content Finder_ 🚀';
        
        res.json({
            text: slackResponse,
            response_type: "in_channel"
        });
        
    } catch (error) {
        console.error('❌ Search error:', error);
        res.json({
            text: "❌ Search failed. Please try again.",
            response_type: "in_channel"
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 SMS Search API running on port ${PORT}`);
    console.log(`📍 Main endpoint: POST /api/slack-text`);
    console.log(`📍 Alt endpoint: POST /api/search`);
});