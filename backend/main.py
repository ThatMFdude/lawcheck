from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
from legal_fetcher import fetch_federal_laws, fetch_missouri_statutes, get_missouri_statute_text

load_dotenv()

app = FastAPI(title="Legal Research API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Configure Google Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})

FRONTEND_BUILD = os.path.join(os.path.dirname(__file__), "../frontend/build")


class ScenarioRequest(BaseModel):
    scenario: str
    state: str = "Missouri"


class LegalAnalysis(BaseModel):
    verdict: str
    summary: str
    explanation: str
    federal_analysis: str
    state_analysis: str
    statutes: list
    warnings: list
    disclaimer: str


@app.get("/health")
def health_check():
    return {"status": "healthy", "api": "Legal Research API v1.0 - Using Google Gemini"}


@app.post("/analyze", response_model=LegalAnalysis)
async def analyze_scenario(request: ScenarioRequest):
    try:
        # Step 1: Fetch relevant laws from sources
        federal_laws = fetch_federal_laws(request.scenario)
        state_laws = fetch_missouri_statutes(request.scenario)

        # Step 2: Get statute texts for Missouri results
        statute_texts = []
        for law in state_laws[:3]:
            section = law.get("section", "")
            if section:
                text = get_missouri_statute_text(section)
                if text:
                    statute_texts.append({
                        "section": section,
                        "title": law.get("title", ""),
                        "text": text[:500]
                    })

        # Build context from fetched laws
        federal_context = "\n".join([
            f"- {law.get('title', '')} ({law.get('number', '')})"
            for law in federal_laws
        ]) or "No specific federal statutes found for this query."

        state_context = "\n".join([
            f"- {law.get('title', '')} | URL: {law.get('url', '')}"
            for law in state_laws
        ]) or "No specific Missouri statutes found for this query."

        statute_text_context = "\n".join([
            f"Section {s['section']} - {s['title']}:\n{s['text']}"
            for s in statute_texts
        ]) or ""

        # Step 3: Send to Gemini for analysis
        system_prompt = """You are an expert legal research assistant specializing in United States federal law and Missouri state law.

Your job is to analyze a scenario and determine its legality based on actual laws and statutes.

You MUST respond with a valid JSON object in this exact format:
{
    "verdict": "LEGAL" or "ILLEGAL" or "GRAY AREA",
    "summary": "One sentence verdict summary",
    "explanation": "Detailed 2-4 paragraph explanation of why this is legal/illegal/gray area",
    "federal_analysis": "Analysis of how federal law applies to this scenario",
    "state_analysis": "Analysis of how Missouri state law applies to this scenario",
    "statutes": [
        {
            "jurisdiction": "Federal" or "Missouri",
            "citation": "Exact statute citation e.g. RSMo 571.030 or 18 U.S.C. § 922",
            "title": "Name of the law",
            "relevance": "How this specific law applies to the scenario",
            "url": "URL to the statute if available"
        }
    ],
    "warnings": ["Any important warnings, caveats, or considerations the person should know"]
}

Be thorough, accurate, and cite specific statutes. If something is a gray area, explain the competing factors clearly.
Always reference actual Missouri Revised Statutes (RSMo) numbers and federal US Code (U.S.C.) citations."""

        user_prompt = f"""Please analyze the following scenario for legality under Missouri state law and US federal law:

SCENARIO: {request.scenario}

RELEVANT MISSOURI STATUTES FOUND:
{state_context}

RELEVANT FEDERAL LAWS FOUND:
{federal_context}

STATUTE TEXT EXCERPTS:
{statute_text_context}

Provide a comprehensive legal analysis with exact statute citations."""

        response = model.generate_content(
            f"{system_prompt}\n\n{user_prompt}"
        )
        
        result = json.loads(response.text)

        # Merge fetched statutes with AI-identified ones
        all_statutes = result.get("statutes", [])

        # Add any fetched statutes not already included
        cited_citations = [s.get("citation", "").lower() for s in all_statutes]
        for law in state_laws:
            section = law.get("section", "")
            if section and section.lower() not in " ".join(cited_citations):
                all_statutes.append({
                    "jurisdiction": "Missouri",
                    "citation": f"RSMo {section}",
                    "title": law.get("title", ""),
                    "relevance": "Referenced from Missouri Revisor of Statutes",
                    "url": law.get("url", "")
                })

        return LegalAnalysis(
            verdict=result.get("verdict", "GRAY AREA"),
            summary=result.get("summary", ""),
            explanation=result.get("explanation", ""),
            federal_analysis=result.get("federal_analysis", ""),
            state_analysis=result.get("state_analysis", ""),
            statutes=all_statutes,
            warnings=result.get("warnings", []),
            disclaimer="⚠️ DISCLAIMER: This tool is for informational purposes only and does NOT constitute legal advice. Laws change frequently and vary by jurisdiction. Always consult a licensed attorney for legal guidance specific to your situation."
        )

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# Serve React frontend - must be LAST
if os.path.exists(FRONTEND_BUILD):
    app.mount("/static", StaticFiles(directory=os.path.join(FRONTEND_BUILD, "static")), name="static")

    @app.get("/")
    def serve_root():
        return FileResponse(os.path.join(FRONTEND_BUILD, "index.html"))

    @app.get("/{full_path:path}")
    def serve_react(full_path: str):
        file_path = os.path.join(FRONTEND_BUILD, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_BUILD, "index.html"))