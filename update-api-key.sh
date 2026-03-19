#!/bin/bash
# Easy API Key Updater for LawCheck
# Usage: bash update-api-key.sh YOUR_NEW_API_KEY

if [ -z "$1" ]; then
  echo "Usage: bash update-api-key.sh YOUR_OPENAI_API_KEY"
  exit 1
fi

echo "OPENAI_API_KEY=$1" > /workspace/legal-app/backend/.env
echo "✅ API key updated successfully!"
echo "🔄 Restarting backend..."

# Kill existing backend
pkill -f "uvicorn main:app" 2>/dev/null
sleep 2

# Restart backend
cd /workspace/legal-app/backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload > /workspace/legal-app/backend.log 2>&1 &
sleep 3

echo "✅ Backend restarted! Your app is ready to use."
echo "🌐 App URL: https://00l4o.app.super.myninja.ai"