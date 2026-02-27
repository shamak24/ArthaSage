import requests
from bs4 import BeautifulSoup
import json

URLS = [
    "https://www.investopedia.com/terms/d/diversification.asp",
    "https://www.investopedia.com/terms/e/emergency_fund.asp",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

def scrape(url):
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Remove unwanted tags
        for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
            tag.decompose()

        # Try article body first
        article = soup.find("div", {"id": "article-body_1-0"})

        # Fallback to main content div
        if not article:
            article = soup.find("div", class_=lambda c: c and "article" in c.lower())

        # Fallback to all paragraphs
        if not article:
            paragraphs = soup.find_all("p")
        else:
            paragraphs = article.find_all("p")

        text = " ".join(p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True))

        if not text:
            print(f"⚠️  No text extracted from {url}")
        else:
            print(f"✅ Scraped {len(text)} characters from {url}")

        return text

    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to scrape {url}: {e}")
        return ""


docs = []
for url in URLS:
    text = scrape(url)
    docs.append({
        "source": url,
        "text": text
    })

with open("knowledge_raw.json", "w", encoding="utf-8") as f:
    json.dump(docs, f, ensure_ascii=False, indent=2)

print(f"\n📄 Saved {len(docs)} documents to knowledge_raw.json")