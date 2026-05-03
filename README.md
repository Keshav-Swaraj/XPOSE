# 🛡️ XPOSE — Your Personal Financial Guardian

> **"XPOSE explains, protects and fights for you."**

XPOSE is a free **Chrome browser extension + AI backend** that protects everyday Indians from financial manipulation and confusion on the internet. It detects dark patterns, simplifies complex financial fine print in regional Indian languages, enables conversational Q&A about any financial page, and helps users file regulatory complaints — all in one tool.

---

## 📌 The Problem

Indian financial websites (loan portals, insurance aggregators, credit card pages, investment platforms) frequently use **dark patterns** — hidden fees, pre-ticked checkboxes, fake urgency timers, guilt-tripping language, and confusing jargon — that cost the average user thousands of rupees every year. Complex policy documents and loan agreements are especially hard to understand, particularly for first-time users, gig workers, and non-English speakers.

**XPOSE exists to level this playing field.**

---

## ✨ Features

### 🔍 Smart Explain Mode (The Killer Feature)
- Click the XPOSE icon or open the sidebar on any financial page.
- The AI reads the entire page and returns a **plain-language summary** in your chosen Indian language.
- **Color-coded highlights** mark key clauses directly:
  - 🟢 **Green** = Safe
  - 🟡 **Yellow** = Needs Attention
  - 🔴 **Red** = Risky / Hidden Risk

### 🌐 Multilingual Support
Supports **10 Indian languages** out of the box:
| Language | Script |
|---|---|
| English | Latin |
| Hindi | हिन्दी |
| Kannada | ಕನ್ನಡ |
| Tamil | தமிழ் |
| Telugu | తెలుగు |
| Marathi | मराठी |
| Bengali | বাংলা |
| Gujarati | ગુજરાતી |
| Punjabi | ਪੰਜਾਬੀ |
| Malayalam | മലയാളം |

The AI summary, risk descriptions, and all chat responses are automatically delivered in the selected language.

### 🗣️ Voice Mode
- Tap **"Listen"** in the footer to hear the AI summary spoken aloud in your selected language.
- Uses the Web Speech API with the correct BCP-47 locale (e.g., `hi-IN`, `ta-IN`, `kn-IN`) for natural-sounding narration.
- Tap **"Stop"** to cancel at any time.

### 🧠 Conversational Q&A (AI Chat)
- After the page is explained, ask follow-up questions in the chat box — in any language.
- Examples: *"What happens if I miss an EMI?"*, *"Is this insurance worth it?"*, *"What are the hidden charges?"*
- The AI answers **strictly based on the page content** — no hallucinations, grounded responses only.
- Full conversation history is maintained for contextual follow-ups (last 10 messages sent to the model).

### 🚨 Dark Pattern Detection (Shield Tab)
- Automatically identifies **dark patterns** such as:
  - Hidden/buried fees
  - Pre-ticked consent boxes
  - Fake urgency / countdown timers
  - Guilt-tripping opt-out language
  - Data harvesting disguised as "personalisation"
- Each detected risk is shown as a **threat card** with severity level (High / Medium).
- **True Cost Calculator**: If any fees or prices are mentioned, XPOSE calculates and displays the real total cost including hidden charges.
- **Key Clauses** view: The top highlighted clauses from the page, color-coded by risk level.

### ⚖️ Regulatory Action (Fight Tab)
- Lists all **actual regulatory violations** found on the page with:
  - Pattern name (e.g., *"Consent data harvesting"*, *"Price anchoring"*)
  - Severity (Critical / Moderate)
  - Description of what is wrong
  - Specific regulation violated (e.g., *Consumer Protection Act*, *IRDAI guidelines*, *SEBI regulations*)
- **One-tap SEBI/IRDAI Report**: Opens a pre-filled complaint modal with the page URL and extracted violations auto-populated. Mock integration with SCORES (real API planned).

### 📊 Safety Score
- Every page gets an **XPOSE Safety Score out of 100**:
  - **95/100** — Safe ✅
  - **70/100** — Attention ⚠️
  - **45/100** — Risky 🔴
- Displayed as an animated circular gauge with color coding.
- Accompanied by a metrics row showing: **Estimated yearly impact**, **Dark pattern count**, and **Regulation at risk**.

---

## 🏗️ Architecture

```
XPOSE/
├── extension/          # Chrome Extension (Plasmo + React + TypeScript)
│   └── src/
│       ├── contents/
│       │   └── explainPanel.tsx   # Main sidebar panel (content script)
│       ├── background.ts          # Service worker / message handler
│       └── style.css              # Panel styles
│
└── backend/            # Python AI Backend (FastAPI + Groq)
    ├── main.py         # API server with /api/explain and /api/chat
    ├── requirements.txt
    └── .env            # GROQ_API_KEY goes here
```

---

## 🔧 Tech Stack

### Browser Extension
| Layer | Technology |
|---|---|
| Framework | [Plasmo](https://www.plasmo.com/) v0.90.5 |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS 3.4 |
| Browser API | Chrome Extensions Manifest V3 |
| Voice | Web Speech API (`SpeechSynthesis`) |

### Backend
| Layer | Technology |
|---|---|
| Framework | FastAPI (Python) |
| AI Model | `llama-3.3-70b-versatile` via [Groq](https://groq.com/) |
| Server | Uvicorn (ASGI) |
| Data Validation | Pydantic v2 |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18 & pnpm
- Python ≥ 3.10
- A [Groq API Key](https://console.groq.com/) (free)

---

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the backend server:
```bash
uvicorn main:app --port 8000 --reload
```

The API will be available at `http://localhost:8000`.

---

### 2. Extension Setup

```bash
cd extension
pnpm install
pnpm dev
```

This starts Plasmo in development mode and outputs the extension to `extension/build/chrome-mv3-dev/`.

**Load the extension in Chrome:**
1. Go to `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/build/chrome-mv3-dev/` folder

---

## 🔌 API Reference

### `POST /api/explain`
Analyzes a financial page and returns structured insights.

**Request Body:**
```json
{
  "url": "https://example.com/loan-page",
  "content": "<page text content>",
  "language": "Hindi"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "summary": "...",
    "status": "Risky",
    "risks": ["Hidden processing fee of ₹2,500", "..."],
    "true_cost": "₹1,23,450 over 3 years",
    "highlights": [{ "text": "...", "level": "risky" }],
    "est_cost_value": "₹3,200",
    "est_cost_label": "Est. yearly cost",
    "violations": [
      {
        "pattern_name": "Hidden fee disclosure",
        "severity": "high",
        "description": "Processing fee buried in footnotes",
        "regulation": "Consumer Protection Act, 2019"
      }
    ]
  }
}
```

---

### `POST /api/chat`
Conversational Q&A grounded in the page content.

**Request Body:**
```json
{
  "url": "https://example.com/loan-page",
  "content": "<page text content>",
  "history": [
    { "role": "user", "content": "What is the interest rate?" },
    { "role": "assistant", "content": "The stated rate is 12% p.a." }
  ],
  "question": "Are there any hidden charges?",
  "language": "Hindi"
}
```

**Response:**
```json
{
  "status": "success",
  "answer": "हाँ, इस पेज पर ₹2,500 की प्रोसेसिंग फीस छुपी हुई है..."
}
```

---

## 🔑 Key Differentiators

| Feature | XPOSE | Generic Tools |
|---|---|---|
| Indian financial context | ✅ Specialized | ❌ Generic |
| 10 Indian languages | ✅ Full support | ❌ English only |
| Voice narration (regional) | ✅ Native BCP-47 | ❌ None |
| Dark pattern detection | ✅ Regulation-mapped | ❌ None |
| SEBI/IRDAI complaint filing | ✅ One-tap | ❌ None |
| Conversational Q&A | ✅ Page-grounded | ❌ None |
| Data collection | ❌ Zero (privacy-first) | ⚠️ Varies |

---

## 🗺️ Roadmap

- [ ] Full UI i18n — all static text switches to the selected language
- [ ] `xpose.in` web dashboard — live leaderboard & pressure scores per website
- [ ] Insurance PDF scanner — upload policy → get simplified breakdown
- [ ] SEBI SCORES real API integration
- [ ] EMI / Reality Check Calculator
- [ ] Family sharing (read-only view)
- [ ] Chrome Web Store public release

---

## 📄 License

MIT — Free forever for individual users.

---

> Built with ❤️ for India's 500M+ internet users who deserve transparent financial products.
