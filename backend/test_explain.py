import requests
import json

# We will test using a public URL related to finance or dark patterns
url_to_test = "https://www.hdfcbank.com/personal/pay/cards/credit-cards/hdfc-bank-millennia-credit-card"

print(f"Fetching content from {url_to_test}...")
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}
try:
    page_content = requests.get(url_to_test, headers=headers, timeout=10).text
    
    print("Sending content to Vaayu Backend for analysis...")
    response = requests.post(
        "http://127.0.0.1:8000/api/explain",
        json={
            "url": url_to_test,
            "content": page_content[:4000], # Send first 4000 chars to avoid huge payload
            "language": "hi"
        }
    )
    
    print(f"Status Code: {response.status_code}")
    with open("test_output.json", "w", encoding="utf-8") as f:
        json.dump(response.json(), f, indent=2, ensure_ascii=False)
    print("Output saved to test_output.json")
except Exception as e:
    print("Error:", e)
