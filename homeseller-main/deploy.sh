#!/bin/bash
# Deploy script for Seller Consultation landing page

echo "🚀 Deploying to Netlify..."
echo ""
echo "Choose deployment method:"
echo "1. Create new site (recommended for first time)"
echo "2. Deploy to existing site"
echo ""

# Build the project first
echo "📦 Building project..."
npm run build

# Deploy using Netlify CLI
echo ""
echo "🌐 Deploying to Netlify..."
echo "Follow the prompts to create or link your site..."
npx netlify-cli deploy --prod --dir dist

echo ""
echo "✅ Deployment complete!"












