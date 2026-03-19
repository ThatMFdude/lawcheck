# ⚖️ LawCheck - Legal Research App

A mobile-first legal research tool that analyzes scenarios for legality under Missouri state law and US federal law.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 🚀 Live Demo

**Try it now:** [https://00l4o.app.super.myninja.ai](https://00l4o.app.super.myninja.ai)

## ✨ Features

- **🤖 AI-Powered Analysis** - Uses Google Gemini 2.5 Flash for intelligent legal reasoning
- **📜 Real Statutes** - Fetches actual laws from Missouri Revisor of Statutes and Congress.gov
- **🎯 Clear Verdicts** - Bold LEGAL/ILLEGAL/GRAY AREA badges
- **📝 Detailed Explanations** - Federal and state law analysis
- **🔗 Exact Citations** - Direct links to full statute text
- **📱 Mobile Optimized** - Designed for phone screens with touch-friendly interface
- **⚠️ Legal Disclaimer** - Automatically included on every result

## 🛠️ Tech Stack

- **Frontend:** React 18 + Tailwind CSS
- **Backend:** Python 3.11 + FastAPI
- **AI:** Google Gemini 2.5 Flash (free tier)
- **Legal Sources:** 
  - Missouri Revisor of Statutes (revisor.mo.gov)
  - Congress.gov API
- **Deployment:** Ready for Vercel, Railway, Render, or any Python hosting

## 📸 Screenshots

- Mobile-optimized interface
- Scenario input with examples
- Real-time legal analysis
- Statute citations with direct links

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Google Gemini API key (get one free at [aistudio.google.com](https://aistudio.google.com))

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ThatMFdude/lawcheck.git
cd lawcheck
```

2. **Set up the backend:**
```bash
cd backend
pip install -r requirements.txt
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

3. **Set up the frontend:**
```bash
cd ../frontend
npm install
npm run build
```

4. **Run the application:**
```bash
cd ../backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

5. **Access the app:**
Open [http://localhost:8000](http://localhost:8000) in your browser.

## 📖 How to Use

1. **Describe your scenario** - e.g., "Can I carry a concealed handgun in Missouri without a permit?"
2. **Tap "Check Legality"** - The AI analyzes your scenario
3. **Get your verdict** - See if it's LEGAL, ILLEGAL, or GRAY AREA
4. **Review the analysis** - Detailed explanation with statute citations
5. **Access full laws** - Click statute links to see the complete text

## 🌐 Deployment

### Vercel (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Add `GEMINI_API_KEY` as an environment variable
5. Deploy!

### Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Import from GitHub
4. Add `GEMINI_API_KEY` to environment variables
5. Deploy!

### Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Add `GEMINI_API_KEY` to environment variables
5. Deploy!

## 📁 Project Structure

```
lawcheck/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── legal_fetcher.py     # Legal data fetchers
│   ├── .env                 # Environment variables
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   └── components/     # React components
│   └── package.json        # Node dependencies
├── production/             # Production build files
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

### Legal Data Sources

- **Missouri Statutes:** https://revisor.mo.gov
- **Federal Laws:** https://api.congress.gov

## ⚖️ Legal Disclaimer

**This tool is for informational purposes only and does NOT constitute legal advice.** Laws change frequently and vary by jurisdiction. Always consult a licensed attorney for legal guidance specific to your situation.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**ThatMFdude** - [GitHub](https://github.com/ThatMFdude)

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Missouri Revisor of Statutes for legal data
- Congress.gov for federal law data
- Open source community

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ for legal research**