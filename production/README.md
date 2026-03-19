# LawCheck - Legal Research App

A mobile-first legal research tool that analyzes scenarios for legality under Missouri state law and US federal law.

## Features

- **AI-Powered Analysis** - Uses Google Gemini 2.5 Flash for intelligent legal reasoning
- **Real Statutes** - Fetches actual laws from Missouri Revisor of Statutes and Congress.gov
- **Clear Verdicts** - Bold LEGAL/ILLEGAL/GRAY AREA badges
- **Detailed Explanations** - Federal and state law analysis
- **Exact Citations** - Direct links to full statute text
- **Mobile Optimized** - Designed for phone screens with touch-friendly interface

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Python + FastAPI
- **AI**: Google Gemini 2.5 Flash (free tier)
- **Legal Sources**: Congress.gov, Missouri Revisor of Statutes

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set your environment variables:
- Create a `.env` file with:
```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

3. Run the server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

4. Access the app at: `http://localhost:8000`

## Deployment

This app is ready for deployment on any Python hosting platform:
- Vercel
- Railway
- Render
- AWS Amplify
- Google Cloud Run

## Disclaimer

This tool is for informational purposes only and does NOT constitute legal advice. Always consult a licensed attorney for legal guidance specific to your situation.