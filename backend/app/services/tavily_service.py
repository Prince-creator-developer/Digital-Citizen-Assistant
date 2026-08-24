import httpx
from app.config import settings

class TavilyService:
    def __init__(self):
        self.api_key = settings.TAVILY_API_KEY
        self.search_url = "https://api.tavily.com/search"

    def search_live_schemes_sync(self, query: str, state: str = "All India") -> list:
        """Executes real-time web retrieval via Tavily API for fresh Indian government circulars and scheme updates."""
        if self.api_key == "mock_tavily_key" or not self.api_key:
            return [
                {
                    "title": f"PM-KISAN Samman Nidhi Yojana 17th Installment ({state})",
                    "url": "https://pmkisan.gov.in/",
                    "content": "Eligible landholding farmer families get ₹6,000 per year paid in three equal installments directly into DBT bank accounts.",
                    "score": 0.95
                },
                {
                    "title": f"PM Vishwakarma Yojana - Support for Artisans ({state})",
                    "url": "https://pmvishwakarma.gov.in/",
                    "content": "Provides collateral-free loans up to ₹3 Lakh at 5% interest rate, skill training, toolkit incentive of ₹15,000, and digital transaction rewards.",
                    "score": 0.91
                }
            ]

        headers = {"Content-Type": "application/json"}
        payload = {
            "api_key": self.api_key,
            "query": f"latest government welfare schemes for {query} in {state} India 2026",
            "search_depth": "basic",
            "include_domains": ["gov.in", "nic.in", "myscheme.gov.in", "pib.gov.in"],
            "max_results": 5
        }

        try:
            import requests
            response = requests.post(self.search_url, headers=headers, json=payload, timeout=5.0)
            if response.status_code == 200:
                results = response.json().get("results", [])
                return [
                    {
                        "title": item.get("title", ""),
                        "url": item.get("url", ""),
                        "content": item.get("content", ""),
                        "score": item.get("score", 0.8)
                    } for item in results
                ]
        except Exception as e:
            print(f"Tavily Search Error: {e}")

        return []

tavily_service = TavilyService()

def fetch_latest_scheme_updates(query: str, state: str = "All India") -> list:
    return tavily_service.search_live_schemes_sync(query, state)
