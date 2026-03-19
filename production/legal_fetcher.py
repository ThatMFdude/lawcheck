import requests
from bs4 import BeautifulSoup
import httpx
import re

CONGRESS_API_KEY = "DEMO_KEY"  # Free tier, no key needed for basic use

def fetch_federal_laws(query: str) -> list:
    """Fetch relevant federal laws from Congress.gov"""
    results = []
    try:
        # Search Congress.gov for relevant legislation
        url = f"https://api.congress.gov/v3/law/118?format=json&limit=5&api_key={CONGRESS_API_KEY}"
        response = requests.get(url, timeout=10)
        
        # Also search using the search endpoint
        search_url = f"https://api.congress.gov/v3/bill?format=json&limit=5&api_key={CONGRESS_API_KEY}&query={query}"
        search_response = requests.get(search_url, timeout=10)
        
        if search_response.status_code == 200:
            data = search_response.json()
            bills = data.get("bills", [])
            for bill in bills[:3]:
                results.append({
                    "source": "Federal",
                    "title": bill.get("title", "Unknown"),
                    "number": f"{bill.get('type', '')}{bill.get('number', '')}",
                    "congress": bill.get("congress", ""),
                    "url": bill.get("url", ""),
                    "origin": "Congress.gov"
                })
    except Exception as e:
        print(f"Federal law fetch error: {e}")
    
    return results


def fetch_missouri_statutes(query: str) -> list:
    """Fetch relevant Missouri statutes from Missouri Revisor of Statutes"""
    results = []
    try:
        # Missouri Revisor search
        search_url = f"https://revisor.mo.gov/main/Search.aspx"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        # Try Missouri statutes search
        params = {
            "q": query,
            "searchtype": "all"
        }
        
        response = requests.get(
            f"https://revisor.mo.gov/main/Search.aspx?searchtype=all&q={query}",
            headers=headers,
            timeout=15
        )
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "lxml")
            
            # Parse search results
            result_links = soup.find_all("a", href=re.compile(r"OneSection"))
            
            for link in result_links[:5]:
                title = link.get_text(strip=True)
                href = link.get("href", "")
                full_url = f"https://revisor.mo.gov/main/{href}" if href else ""
                
                # Extract section number if available
                section_match = re.search(r"(\d+\.\d+)", title)
                section_num = section_match.group(1) if section_match else ""
                
                if title:
                    results.append({
                        "source": "Missouri",
                        "title": title,
                        "section": section_num,
                        "url": full_url,
                        "origin": "Missouri Revisor of Statutes"
                    })
        
        # Also try direct statute text fetch for common categories
        if not results:
            results = get_missouri_fallback(query)
            
    except Exception as e:
        print(f"Missouri statute fetch error: {e}")
        results = get_missouri_fallback(query)
    
    return results


def get_missouri_statute_text(section: str) -> str:
    """Fetch the actual text of a specific Missouri statute"""
    try:
        url = f"https://revisor.mo.gov/main/OneSection.aspx?section={section}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "lxml")
            content = soup.find("div", {"id": "statuteText"}) or soup.find("div", class_="statute")
            if content:
                return content.get_text(strip=True)[:2000]
    except Exception as e:
        print(f"Statute text fetch error: {e}")
    
    return ""


def get_missouri_fallback(query: str) -> list:
    """Return common Missouri statute references based on query keywords"""
    keyword_statutes = {
        "weapon": [{"source": "Missouri", "title": "RSMo 571.030 - Unlawful use of weapons", "section": "571.030", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=571.030", "origin": "Missouri Revisor of Statutes"}],
        "gun": [{"source": "Missouri", "title": "RSMo 571.030 - Unlawful use of weapons", "section": "571.030", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=571.030", "origin": "Missouri Revisor of Statutes"}],
        "drug": [{"source": "Missouri", "title": "RSMo 195.202 - Possession of controlled substance", "section": "195.202", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=195.202", "origin": "Missouri Revisor of Statutes"}],
        "marijuana": [{"source": "Missouri", "title": "RSMo 579.015 - Possession of marijuana", "section": "579.015", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=579.015", "origin": "Missouri Revisor of Statutes"}],
        "cannabis": [{"source": "Missouri", "title": "RSMo 579.015 - Possession of marijuana/cannabis", "section": "579.015", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=579.015", "origin": "Missouri Revisor of Statutes"}],
        "trespass": [{"source": "Missouri", "title": "RSMo 569.140 - Trespassing", "section": "569.140", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=569.140", "origin": "Missouri Revisor of Statutes"}],
        "theft": [{"source": "Missouri", "title": "RSMo 570.030 - Stealing", "section": "570.030", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=570.030", "origin": "Missouri Revisor of Statutes"}],
        "steal": [{"source": "Missouri", "title": "RSMo 570.030 - Stealing", "section": "570.030", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=570.030", "origin": "Missouri Revisor of Statutes"}],
        "assault": [{"source": "Missouri", "title": "RSMo 565.050 - Assault in the first degree", "section": "565.050", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=565.050", "origin": "Missouri Revisor of Statutes"}],
        "drive": [{"source": "Missouri", "title": "RSMo 302.020 - License required to operate motor vehicle", "section": "302.020", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=302.020", "origin": "Missouri Revisor of Statutes"}],
        "alcohol": [{"source": "Missouri", "title": "RSMo 311.325 - Sale of intoxicating liquor to minors", "section": "311.325", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=311.325", "origin": "Missouri Revisor of Statutes"}],
        "business": [{"source": "Missouri", "title": "RSMo 347.010 - Missouri LLC Act", "section": "347.010", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=347.010", "origin": "Missouri Revisor of Statutes"}],
        "employ": [{"source": "Missouri", "title": "RSMo 290.010 - Employment regulations", "section": "290.010", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=290.010", "origin": "Missouri Revisor of Statutes"}],
        "privacy": [{"source": "Missouri", "title": "RSMo 565.252 - Invasion of privacy", "section": "565.252", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=565.252", "origin": "Missouri Revisor of Statutes"}],
        "record": [{"source": "Missouri", "title": "RSMo 565.252 - Invasion of privacy / recording", "section": "565.252", "url": "https://revisor.mo.gov/main/OneSection.aspx?section=565.252", "origin": "Missouri Revisor of Statutes"}],
    }
    
    query_lower = query.lower()
    found = []
    for keyword, statutes in keyword_statutes.items():
        if keyword in query_lower:
            found.extend(statutes)
    
    return found