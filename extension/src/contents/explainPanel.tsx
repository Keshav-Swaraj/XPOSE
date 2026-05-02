import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"
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
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[999998] bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
      >
        🌬️ Vaayu Explain
      </button>

      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white z-[999999] shadow-2xl p-6 font-sans overflow-y-auto border-l">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Vaayu</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 text-xl">&times;</button>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 mr-2">Language:</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded p-1 text-sm bg-white"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
            </select>
          </div>

          {!explanation && (
            <button 
              onClick={handleExplain}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Analyzing Page..." : "Analyze Fine Print"}
            </button>
          )}

          {explanation && (
            <div className="mt-6 space-y-4">
              <div className={`p-3 rounded-lg border ${
                explanation.status === 'Safe' ? 'bg-green-50 border-green-200' :
                explanation.status === 'Risky' ? 'bg-red-50 border-red-200' :
                'bg-yellow-50 border-yellow-200'
              }`}>
                <h3 className="font-bold mb-1">Status: {explanation.status}</h3>
                <p className="text-gray-700">{explanation.summary}</p>
              </div>

              {explanation.true_cost && (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <h3 className="font-bold text-gray-800">Calculated True Cost</h3>
                  <p className="text-xl font-mono text-blue-600">{explanation.true_cost}</p>
                </div>
              )}

              {explanation.risks && explanation.risks.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Detected Risks:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {explanation.risks.map((risk: string, i: number) => (
                      <li key={i} className="text-red-600 text-sm">{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button 
                onClick={handleExplain}
                className="w-full mt-4 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Re-Analyze
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
