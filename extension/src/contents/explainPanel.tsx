import type { PlasmoCSConfig } from "plasmo"
import { useState, useEffect, useRef } from "react"
import cssText from "data-text:~style.css"
import logo from "data-base64:~../assets/icon.png"

export const config: PlasmoCSConfig = { matches: ["<all_urls>"] }
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const LANGUAGES: { code: string; label: string; bcp47: string }[] = [
  { code: "English", label: "English", bcp47: "en-IN" },
  { code: "Hindi", label: "Hindi (हिन्दी)", bcp47: "hi-IN" },
  { code: "Kannada", label: "Kannada (ಕನ್ನಡ)", bcp47: "kn-IN" },
  { code: "Tamil", label: "Tamil (தமிழ்)", bcp47: "ta-IN" },
  { code: "Telugu", label: "Telugu (తెలుగు)", bcp47: "te-IN" },
  { code: "Marathi", label: "Marathi (मराठी)", bcp47: "mr-IN" },
  { code: "Bengali", label: "Bengali (বাংলা)", bcp47: "bn-IN" },
  { code: "Gujarati", label: "Gujarati (ગુજરાતી)", bcp47: "gu-IN" },
  { code: "Punjabi", label: "Punjabi (ਪੰਜਾਬੀ)", bcp47: "pa-IN" },
  { code: "Malayalam", label: "Malayalam (മലയാളം)", bcp47: "ml-IN" },
]

type ChatMsg = { role: "user" | "assistant"; content: string }
type Explanation = {
  status: string; summary: string; risks: string[]
  true_cost: string | null; highlights?: { text: string; level: string }[]
  dark_patterns_count?: number
  est_yearly_impact?: string
}
type Tab = "decode" | "shield" | "fight"

export default function ExplainPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState<Tab>("decode")
  const [language, setLanguage] = useState("English")
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState<Explanation | null>(null)

  // Voice
  const [speaking, setSpeaking] = useState(false)

  // Chat
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // SEBI modal
  const [sebiOpen, setSebiOpen] = useState(false)
  const [sebiName, setSebiName] = useState("")
  const [sebiSubmitted, setSebiSubmitted] = useState(false)

  // Page squeeze
  useEffect(() => {
    document.body.style.transition = "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
    document.body.style.width = isOpen ? "calc(100% - 360px)" : "100%"
    document.body.style.overflowX = isOpen ? "hidden" : ""
  }, [isOpen])

  // Message listener
  useEffect(() => {
    const h = (msg: any) => { if (msg.action === "TOGGLE_XPOSE_SIDEBAR") setIsOpen(p => !p) }
    chrome.runtime.onMessage.addListener(h)
    return () => chrome.runtime.onMessage.removeListener(h)
  }, [])

  // Auto scroll chat
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [chatHistory])

  // ── Explain ───────────────────────────────────────────────────────────────
  const handleExplain = async () => {
    setLoading(true)
    try {
      const currentContent = document.body.innerText
      const res = await fetch("http://localhost:8000/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: window.location.href, content: currentContent, language })
      })
      const data = await res.json()
      if (data.status === "success") { setExplanation(data.data); setTab("decode") }
    } catch (e) { console.error("XPOSE explain error", e) }
    finally { setLoading(false) }
  }

  // Initial trigger
  useEffect(() => {
    if (isOpen && !explanation && !loading) {
      handleExplain()
    }
  }, [isOpen])

  // ── Voice ─────────────────────────────────────────────────────────────────
  const handleVoice = () => {
    if (speaking) { speechSynthesis.cancel(); setSpeaking(false); return }
    if (!explanation?.summary) return
    const lang = LANGUAGES.find(l => l.code === language)?.bcp47 || "en-IN"
    const utt = new SpeechSynthesisUtterance(explanation.summary)
    utt.lang = lang
    const voices = speechSynthesis.getVoices()
    const match = voices.find(v => v.lang.startsWith(lang.split("-")[0]))
    if (match) utt.voice = match
    utt.onend = () => setSpeaking(false)
    setSpeaking(true)
    speechSynthesis.speak(utt)
  }

  // ── Chat ──────────────────────────────────────────────────────────────────
  const handleChat = async () => {
    const q = chatInput.trim()
    if (!q || chatLoading) return
    const userMsg: ChatMsg = { role: "user", content: q }
    setChatHistory(h => [...h, userMsg])
    setChatInput("")
    setChatLoading(true)
    try {
      const currentContent = document.body.innerText
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: window.location.href, content: currentContent,
          history: chatHistory, question: q, language
        })
      })
      const data = await res.json()
      if (data.status === "success") {
        setChatHistory(h => [...h, { role: "assistant", content: data.answer }])
      }
    } catch (e) { console.error("XPOSE chat error", e) }
    finally { setChatLoading(false) }
  }

  const handleSebiSubmit = () => { if (sebiName) setSebiSubmitted(true) }

  const darkPatternsCount = explanation?.dark_patterns_count || explanation?.risks?.length || 0;
  
  // Calculate score logic based on status
  let score = 100;
  let strokeDashOffset = 188.5; // 0 score
  let scoreColor = "#10B981"; // green
  if (explanation?.status === "Safe") {
    score = 95;
    strokeDashOffset = 188.5 - (188.5 * score / 100);
  } else if (explanation?.status === "Attention") {
    score = 70;
    strokeDashOffset = 188.5 - (188.5 * score / 100);
    scoreColor = "#F59E0B"; // amber
  } else if (explanation?.status === "Risky") {
    score = 45;
    strokeDashOffset = 188.5 - (188.5 * score / 100);
    scoreColor = "#E24B4A"; // red
  }

  return (
    <div className={`xpose-panel fixed top-0 right-0 h-full w-[360px] z-[999999] flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? "translate-x-0" : "translate-x-full"}`} style={{ height: '100vh', padding: 0 }}>
      <div className="frame" style={{ margin: 0, height: '100%', borderRadius: 0, border: 'none', display: 'flex', flexDirection: 'column' }}>
        <div className="header shrink-0">
          <div className="logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="#E24B4A"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span><span className="logo-x">X</span><span className="logo-pose">POSE</span></span>
          </div>
          <div className="header-r">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="lang-btn border-none"
              style={{ outline: "none" }}
            >
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <button className="close-x" onClick={() => setIsOpen(false)}>✕</button>
          </div>
        </div>

        {explanation ? (
          <>
            <div className="score-hero shrink-0">
              <div className="score-row">
                <div className="score-circle">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="30" fill="none" stroke="#f5f5f5" strokeWidth="7"/>
                    <circle cx="36" cy="36" r="30" fill="none" stroke={scoreColor} strokeWidth="7"
                      strokeDasharray="188.5" strokeDashoffset={strokeDashOffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}/>
                  </svg>
                  <div className="score-inner">
                    <div className="score-n" style={{ color: scoreColor }}>{score}</div>
                    <div className="score-d">/100</div>
                  </div>
                </div>
                <div className="score-info">
                  <div className="score-title" style={{ color: scoreColor }}>{explanation.status === "Safe" ? "Safe to proceed" : explanation.status === "Attention" ? "Moderate manipulation risk" : "High manipulation risk"}</div>
                  <div className="score-sub">Found on <strong>{new URL(window.location.href).hostname}</strong><br/>{darkPatternsCount} dark patterns · {explanation.highlights?.length || 0} risky clauses</div>
                </div>
              </div>
              <div className="metrics-row">
                <div className="metric-box">
                  <div className={`metric-val ${explanation.status === "Safe" ? "green" : explanation.status === "Attention" ? "amber" : "red"}`}>{explanation.est_yearly_impact || "₹3,200"}</div>
                  <div className="metric-label">Est. yearly impact</div>
                </div>
                <div className="metric-box">
                  <div className={`metric-val ${darkPatternsCount > 0 ? "amber" : ""}`}>{darkPatternsCount}</div>
                  <div className="metric-label">Dark patterns</div>
                </div>
                <div className="metric-box">
                  <div className="metric-val">SEBI/IRDA</div>
                  <div className="metric-label">Regulation at risk</div>
                </div>
              </div>
            </div>

            <div className="tabs shrink-0">
              <div className={`tab decode ${tab === 'decode' ? 'active' : ''}`} onClick={() => setTab('decode')}>
                <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#185FA5" strokeWidth="1.5"/><path d="M8 5v3l2 1.5" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Decode
              </div>
              <div className={`tab shield ${tab === 'shield' ? 'active' : ''}`} onClick={() => setTab('shield')}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5L2 4v4c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4L8 1.5z" stroke="#065F46" strokeWidth="1.5"/></svg>
                Shield
              </div>
              <div className={`tab fight ${tab === 'fight' ? 'active' : ''}`} onClick={() => setTab('fight')}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M4 8h8M10 5l3 3-3 3" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Fight
              </div>
            </div>

            <div className="flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
              {tab === 'decode' && (
                <div className="pane active flex-1" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="decode-pane flex-1 overflow-y-auto pb-0">
                    <div className="ai-bubble">
                      <div className="ai-bubble-label">
                        <svg viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#1E40AF" strokeWidth="1.2"/><path d="M4 6.5l1.5 1.5L8 4.5" stroke="#1E40AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        XPOSE AI Summary
                      </div>
                      <div className="ai-summary">{explanation.summary}</div>
                      {explanation.highlights && explanation.highlights.length > 0 && (
                        <div className="ai-key-points">
                          {explanation.highlights.slice(0, 3).map((h, i) => (
                            <div key={i} className="key-pt">
                              <div className={`key-dot ${h.level === "risky" ? "r" : h.level === "attention" ? "a" : "g"}`}></div>
                              {h.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="chat-hist pb-4">
                      {chatHistory.map((m, i) => (
                        <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'ai'}`}>
                          {m.content}
                        </div>
                      ))}
                      {chatLoading && <div className="msg ai animate-pulse">Typing...</div>}
                      <div ref={chatEndRef} />
                    </div>
                  </div>
                  <div className="decode-pane shrink-0 pt-0">
                    <div className="chat-in">
                      <input 
                        placeholder="Ask about anything on this page..." 
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleChat()}
                      />
                      <button className="send-btn" onClick={handleChat} disabled={chatLoading || !chatInput.trim()}>
                        <svg viewBox="0 0 16 16" fill="none"><path d="M2 8h12M9 4l5 4-5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'shield' && (
                <div className="pane active flex-1 overflow-y-auto">
                  <div className="shield-pane">
                    {explanation.true_cost && (
                      <div className="true-cost">
                        <div className="tc-label">Calculated true cost</div>
                        <div className="tc-row">
                          <div className="tc-val">{explanation.true_cost}</div>
                        </div>
                      </div>
                    )}

                    {explanation.risks && explanation.risks.length > 0 && (
                      <>
                        <div className="risk-section-label">Threats detected</div>
                        {explanation.risks.map((risk, i) => {
                          const isHigh = risk.toLowerCase().includes('hidden') || risk.toLowerCase().includes('data') || risk.toLowerCase().includes('fee');
                          const sevClass = isHigh ? 'high' : 'med';
                          return (
                            <div key={i} className={`threat-card ${sevClass}`}>
                              <div className={`threat-icon ${sevClass}`}>
                                {isHigh ? (
                                  <svg viewBox="0 0 16 16" fill="none"><path d="M8 2L1.5 13.5h13L8 2z" stroke="#DC2626" strokeWidth="1.5"/><path d="M8 6.5v3M8 11v.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                ) : (
                                  <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#D97706" strokeWidth="1.5"/><path d="M8 5v3M8 10v.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                )}
                              </div>
                              <div className="threat-body">
                                <div className="threat-title">Identified Risk</div>
                                <div className="threat-desc">{risk}</div>
                              </div>
                            </div>
                          )
                        })}
                      </>
                    )}

                    {explanation.highlights && explanation.highlights.length > 0 && (
                      <>
                        <div className="clause-label">Key clauses</div>
                        {explanation.highlights.map((h, i) => {
                          const badgeCls = h.level === "risky" ? "r" : h.level === "attention" ? "a" : "g";
                          return (
                            <div key={i} className="clause-item">
                              <div className={`clause-badge ${badgeCls}`}>
                                {h.level === "risky" ? (
                                  <svg viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                ) : h.level === "attention" ? (
                                  <svg viewBox="0 0 12 12" fill="none"><path d="M6 3v3M6 8v.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                ) : (
                                  <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 4.5-5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                )}
                              </div>
                              <div>
                                <div className="clause-text">{h.text}</div>
                              </div>
                            </div>
                          )
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}

              {tab === 'fight' && (
                <div className="pane active flex-1 overflow-y-auto">
                  <div className="fight-pane">
                    <div className="fight-intro">
                      <strong>{explanation.risks?.length || 0} violations found on this page</strong>
                      These practices likely violate regulations. You have the right to report them.
                    </div>

                    {explanation.risks && explanation.risks.map((risk, i) => (
                      <div key={i} className="pattern-card">
                        <div className="pattern-header">
                          <div className="pattern-name">Detected Violation</div>
                          <div className="pattern-sev high">Critical</div>
                        </div>
                        <div className="pattern-what">{risk}</div>
                        <div className="pattern-divider"></div>
                        <div className="law-row">
                          <div className="law-badge">Regulation</div>
                          <div className="law-text">May violate consumer protection guidelines regarding transparent disclosures.</div>
                        </div>
                      </div>
                    ))}

                    <button className="report-btn" onClick={() => setSebiOpen(true)}>
                      <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5L2 4.5v4c0 3.3 2.5 6.3 6 7 3.5-.7 6-3.7 6-7v-4L8 1.5z" stroke="white" strokeWidth="1.5"/><path d="M8 6v3M8 11v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      Report to SEBI / IRDAI
                    </button>
                    <div className="report-note">XPOSE will auto-fill the complaint with this page's screenshot, URL, and the exact regulation violated.</div>
                  </div>
                </div>
              )}
            </div>

            <div className="footer-bar shrink-0">
              <button className="f-btn" onClick={handleExplain} disabled={loading}>
                <svg viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {loading ? "Scanning..." : "Re-scan"}
              </button>
              <button className="f-btn" onClick={handleVoice}>
                <svg viewBox="0 0 14 14" fill="none"><path d="M7 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM7 4.5v2.5l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {speaking ? "Stop" : "Listen"}
              </button>
              <a href="https://xpose.in" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', flex: 1 }}>
                <button className="f-btn primary" style={{ width: '100%' }}>
                  <svg viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  XPOSE.in
                </button>
              </a>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center" style={{ height: '100%' }}>
            {loading ? (
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium text-sm">Scanning the fine print...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl border border-gray-200 flex items-center justify-center shadow-sm">
                  <span className="text-3xl">🛡️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">AI Financial Guardian</h3>
                  <p className="text-gray-500 text-sm mt-1">Automatically detect hidden fees, dark patterns, and risky fine print.</p>
                </div>
                <button
                  onClick={handleExplain}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors mt-2"
                >
                  Scan &amp; Explain Page
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SEBI MODAL ── */}
      {sebiOpen && (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-6 shadow-xl border border-gray-200">
            {!sebiSubmitted ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-xl">🚨</div>
                    <h3 className="text-lg font-bold text-gray-900">Report to SEBI</h3>
                  </div>
                  <button onClick={() => setSebiOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg transition-colors">✕</button>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">This mock integration simulates logging a complaint with SCORES using auto-extracted violations.</p>
                
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Payload Details</p>
                  <p className="text-xs text-gray-700 font-mono break-all"><span className="text-gray-500">URL:</span> {window.location.href}</p>
                  <div className="pt-2">
                    {explanation?.risks?.slice(0,2).map((r,i) => (
                      <p key={i} className="text-xs text-red-600 mt-1 flex items-start space-x-2"><span className="mt-0.5 opacity-50">•</span><span>{r.slice(0,60)}...</span></p>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={sebiName}
                    onChange={e => setSebiName(e.target.value)}
                    placeholder="Full Legal Name"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  />
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button onClick={() => setSebiOpen(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all">Cancel</button>
                  <button onClick={handleSebiSubmit} disabled={!sebiName} className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-sm">Submit Report</button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 py-6">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-2 text-emerald-600">✓</div>
                <h3 className="font-bold text-gray-900 text-xl tracking-tight">Complaint Logged</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-[280px] mx-auto">Your report has been successfully drafted. In production, this syncs with SEBI SCORES.</p>
                <button onClick={() => { setSebiOpen(false); setSebiSubmitted(false) }} className="w-full bg-white text-gray-900 border border-gray-300 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all mt-4">Close Window</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
