# 🛡️ XPOSE — Your Personal Financial Guardian

> **"XPOSE decodes, shields & exposes."**

XPOSE is a free **Chrome browser extension + AI-powered web platform** that protects everyday Indians from financial manipulation on the internet. It detects dark patterns in real-time, explains complex financial pages in 10 Indian languages, enables conversational Q&A, provides voice narration, and helps users file regulatory complaints — all in one tool.

---

## 📌 The Problem

Indian financial websites (loan portals, insurance aggregators, credit card pages, investment platforms) frequently use **dark patterns** — hidden fees, pre-ticked checkboxes, fake urgency timers, guilt-tripping language, and confusing jargon — that cost the average user thousands of rupees every year.

**XPOSE exists to level this playing field.**

---

## ✨ Features

### 🔍 Smart Explain Mode (The Killer Feature)
- Click the XPOSE icon or open the sidebar on any financial page.
- The AI reads the entire page and returns a **plain-language summary** in your chosen Indian language.
- **Color-coded highlights** mark key clauses directly on the webpage:
  - 🟢 **Green** = Safe
  - 🟡 **Yellow** = Needs Attention
  - 🔴 **Red** = Risky / Hidden Risk

### 🛡️ Passive Real-Time Protection
- XPOSE **automatically scans** every webpage for dark patterns in the background.
- When manipulation is detected, a **pulsing red border** flashes around the page, toast notifications appear, and a **persistent floating shield badge** stays in the bottom-left corner.
- Click the floating badge to instantly open the full XPOSE analysis panel.

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

### 🗣️ Voice Mode
- Tap **"Listen"** to hear the AI summary spoken aloud in your selected language.
- Uses the Web Speech API with the correct BCP-47 locale (e.g., `hi-IN`, `ta-IN`, `kn-IN`) for natural-sounding narration.

### 🧠 Conversational Q&A (AI Chat)
- Ask follow-up questions in the chat box — in any language.
- Examples: *"What happens if I miss an EMI?"*, *"Is this insurance worth it?"*
- The AI answers **strictly based on the page content** — no hallucinations, grounded responses only.

### 🚨 Dark Pattern Detection
Automatically identifies **12+ dark pattern types**:
- Hidden/buried fees & bait pricing
- Pre-ticked consent checkboxes
- Fake urgency / countdown timers
- Guilt-tripping opt-out language (Confirmshaming)
- Subscription traps & forced continuity
- Disguised advertisements
- Privacy Zuckering (data harvesting)
- Roach Motel (easy signup, hard cancellation)
- Fine print burial

### ⚖️ One-Tap Regulatory Action
- Lists all **regulatory violations** mapped to specific Indian regulations (SEBI, IRDAI, RBI, Consumer Protection Act).
- **One-tap SEBI/IRDAI complaint**: Opens a pre-filled report with the page URL and extracted violations auto-populated.

### 📊 Safety Score
Every page gets an **XPOSE Safety Score out of 100**:
- **95/100** — Safe ✅
- **70/100** — Attention ⚠️
- **45/100** — Risky 🔴
- **0/100** — Neutral (non-financial site) ⬜

### 😴 Graceful Neutral State
On non-financial websites (Wikipedia, blogs, news), XPOSE detects the context and enters a **"Resting" state** — showing a grey score ring with "No Financial Data" instead of awkwardly trying to scan for hidden fees.

---

## 🌐 XPOSE Web Platform (`xpose.in`)

A standalone companion website that extends the extension's capabilities:

### 🏆 Financial Manipulation Leaderboard
- India's first **dark pattern ranking system** for financial websites.
- Each site is scored by its **Pressure Score** — computed from community scans.
- Filter by category: Insurance, Loans & Credit, Investments, Payments.

### 📋 Shareable Score Pages
- Click any site on the Leaderboard to open a **public, shareable scorecard**.
- Shows the exact dark patterns found, regulations violated, and score trends.
- **Copy Link** button to share on social media and hold companies accountable.

### 🧮 Reality Check Calculator
- See the **true cost** of any loan or EMI — including hidden processing fees, insurance add-ons, and GST.
- Compare the advertised EMI vs. the actual EMI you'll pay.

### 🔬 Insurance Policy Scanner
- Upload any insurance policy PDF → get a plain-language breakdown.
- Highlights what's covered, what's excluded, and hidden traps.

### 📢 SEBI/IRDAI Complaint Center
- File regulatory complaints with auto-filled evidence.
- XPOSE generates the complaint with screenshots and violated regulations.

---

## 🏗️ Architecture

```
XPOSE/
├── extension/                  # Chrome Extension (Plasmo + React + TypeScript)
│   └── src/
│       ├── contents/
│       │   ├── explainPanel.tsx    # Main sidebar panel (Smart Explain, Chat, Voice)
│       │   ├── alertOverlay.tsx    # Floating badge + red border + toast alerts
│       │   ├── detector.ts        # Real-time dark pattern scanner (12+ patterns)
│       │   └── translations.ts    # i18n strings for 10 languages
│       ├── background.ts          # Service worker + icon animation
│       └── style.css              # Panel styles (glassmorphism, dark mode)
│
├── backend/                    # Python AI Backend (FastAPI + Groq)
│   ├── main.py                 # API server: /api/explain + /api/chat
│   ├── requirements.txt
│   └── .env                    # GROQ_API_KEY
│
└── website/                    # XPOSE Web Platform (Static HTML/CSS/JS)
    ├── index.html              # Leaderboard + hero + features
    ├── score.html              # Shareable individual scorecards
    ├── calculator.html         # EMI Reality Check Calculator
    ├── scanner.html            # Insurance PDF Scanner
    ├── reports.html            # Regulatory Complaint Center
    ├── css/main.css            # Design system (dark mode, glassmorphism)
    └── js/
        ├── main.js             # Leaderboard logic, filters, animations
        └── data.js             # Mock data for Indian financial websites
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
| Dark Pattern Engine | Custom regex + DOM scanner + MutationObserver |

### Backend
| Layer | Technology |
|---|---|
| Framework | FastAPI (Python) |
| AI Model | `llama-3.1-8b-instant` via [Groq](https://groq.com/) |
| Server | Uvicorn (ASGI) |
| Data Validation | Pydantic v2 |

### Website
| Layer | Technology |
|---|---|
| Core | HTML5 + Vanilla CSS + JavaScript |
| Design | Glassmorphism, dark mode, CSS animations |
| Fonts | Google Fonts (Inter) |
| Data | Static JSON (community-aggregated mock data) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18 & pnpm
- Python ≥ 3.10
- A [Groq API Key](https://console.groq.com/) (free tier available)

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

### 3. Website Setup

```bash
cd website
python -m http.server 8080
```

Open `http://localhost:8080` in your browser.

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
| Real-time DOM scanning | ✅ Passive + active | ❌ None |
| Dark pattern detection | ✅ 12+ types, regulation-mapped | ❌ None |
| SEBI/IRDAI complaint filing | ✅ One-tap | ❌ None |
| Conversational Q&A | ✅ Page-grounded AI | ❌ None |
| Web leaderboard | ✅ Public scorecards | ❌ None |
| Data collection | ❌ Zero (privacy-first) | ⚠️ Varies |

---

## 🗺️ Roadmap

- [x] Smart Explain Mode with multilingual AI
- [x] Voice narration in 10 Indian languages
- [x] Conversational AI Chat grounded in page content
- [x] Real-time dark pattern detection (12+ pattern types)
- [x] Passive floating warning badge on financial sites
- [x] Graceful neutral state on non-financial sites
- [x] XPOSE Web Dashboard with Leaderboard
- [x] Shareable public scorecards per website
- [x] EMI Reality Check Calculator
- [x] Insurance Policy Scanner interface
- [x] SEBI/IRDAI Complaint Center
- [ ] Chrome Web Store public release
- [ ] Full SEBI SCORES API integration
- [ ] Supabase auth + personal savings tracker
- [ ] Family sharing (read-only view)

---

## 📄 License

MIT — Free forever for individual users.

---

> Built with ❤️ in India — for India's 140 crore people who deserve transparent financial products.
