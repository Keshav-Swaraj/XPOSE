import type { PlasmoCSConfig } from "plasmo"
import { useState, useEffect } from "react"
import cssText from "data-text:~style.css"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function ExplainPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState<any>(null)

  // Page squeezing logic
  useEffect(() => {
    if (isOpen) {
      document.body.style.transition = "width 0.3s ease-in-out"
      document.body.style.width = "calc(100% - 400px)"
      document.body.style.overflowX = "hidden"
    } else {
      document.body.style.width = "100%"
      setTimeout(() => {
        if (!isOpen) document.body.style.overflowX = ""
      }, 300)
    }
  }, [isOpen])

  const handleExplain = async () => {
    setLoading(true)
    try {
      const pageContent = document.body.innerText
      const response = await fetch("http://localhost:8000/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: window.location.href,
          content: pageContent,
          language: language === "en" ? "English" : "Hindi"
        })
      })
      const data = await response.json()
      if (data.status === "success") {
        setExplanation(data.data)
      }
    } catch (e) {
      console.error("Vaayu Explain Error:", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="font-sans antialiased text-[#e3e3e3]">
      {/* Floating Action Button - Only visible when panel is closed */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[999998] bg-[#1e1e1e] border border-[#3c4043] text-[#e3e3e3] rounded-2xl py-3 px-5 shadow-2xl hover:bg-[#2d2e30] transition-all flex items-center space-x-2 group"
        >
          <span className="text-xl">🌬️</span>
          <span className="font-semibold tracking-wide">Ask Vaayu</span>
        </button>
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[400px] bg-[#131314] z-[999999] shadow-2xl p-6 flex flex-col border-l border-[#3c4043] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#3c4043]">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🌬️</span>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Vaayu Explain
            </h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#2d2e30] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-[#3c4043]">
          
          <div className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded-xl border border-[#3c4043]">
            <label className="text-sm text-gray-300 font-medium">Translation Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#2d2e30] text-white border-none rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
            </select>
          </div>

          {!explanation && (
            <div className="flex flex-col items-center justify-center h-48 text-center space-y-4">
              <p className="text-gray-400 text-sm">Decode the hidden fees and risks on this page instantly.</p>
              <button 
                onClick={handleExplain}
                disabled={loading}
                className="w-full bg-[#c2e7ff] text-[#001d35] py-3.5 rounded-xl font-bold hover:bg-[#a8d6f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(194,231,255,0.2)]"
              >
                {loading ? "Analyzing Fine Print..." : "Scan & Explain"}
              </button>
            </div>
          )}

          {explanation && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Status Box */}
              <div className={`p-4 rounded-xl border ${
                explanation.status === 'Safe' ? 'bg-[#0f291e] border-[#1d4f3b] text-[#4ade80]' :
                explanation.status === 'Risky' ? 'bg-[#311116] border-[#651c27] text-[#f87171]' :
                'bg-[#2d230e] border-[#5e481c] text-[#fbbf24]'
              }`}>
                <h3 className="font-bold mb-2 flex items-center space-x-2">
                  <span>{
                    explanation.status === 'Safe' ? '🟢' :
                    explanation.status === 'Risky' ? '🔴' : '🟡'
                  }</span>
                  <span>Status: {explanation.status}</span>
                </h3>
                <p className="text-[#e3e3e3] leading-relaxed text-sm">{explanation.summary}</p>
              </div>

              {/* True Cost */}
              {explanation.true_cost && (
                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#3c4043]">
                  <h3 className="font-medium text-gray-400 text-xs uppercase tracking-wider mb-1">Calculated True Cost</h3>
                  <p className="text-xl font-mono text-[#c2e7ff]">{explanation.true_cost}</p>
                </div>
              )}

              {/* Risks */}
              {explanation.risks && explanation.risks.length > 0 && (
                <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#3c4043]">
                  <h3 className="font-medium text-gray-400 text-xs uppercase tracking-wider mb-3">Detected Risks & Clauses</h3>
                  <ul className="space-y-3">
                    {explanation.risks.map((risk: string, i: number) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-[#f87171] mt-0.5">•</span>
                        <span className="text-[#e3e3e3] text-sm leading-relaxed">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {explanation && (
           <div className="pt-4 border-t border-[#3c4043] mt-4">
              <button 
                onClick={handleExplain}
                disabled={loading}
                className="w-full bg-[#1e1e1e] text-white py-3 rounded-xl border border-[#3c4043] hover:bg-[#2d2e30] transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <span>🔄</span>
                <span>{loading ? "Re-Analyzing..." : "Re-Analyze Page"}</span>
              </button>
           </div>
        )}

      </div>
    </div>
  )
}
