import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import cssText from "data-text:~style.css"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function RedBanner() {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState("")
  const [trueCost, setTrueCost] = useState<string | null>(null)

  useEffect(() => {
    // Listen for dark pattern events from the detector script
    const handleDarkPattern = (event: Event) => {
      const customEvent = event as CustomEvent
      setMessage(customEvent.detail.message)
      setTrueCost(customEvent.detail.trueCost)
      setShow(true)
    }

    window.addEventListener("XPOSE_DARK_PATTERN_DETECTED", handleDarkPattern)
    return () => window.removeEventListener("XPOSE_DARK_PATTERN_DETECTED", handleDarkPattern)
  }, [])

  if (!show) return null

  return (
    <div className="fixed top-0 left-0 w-full z-[999999] bg-red-600 text-white p-4 shadow-xl flex items-center justify-between font-sans">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <h1 className="font-bold text-lg">XPOSE Alert: Potential Dark Pattern Detected</h1>
          <p className="text-sm">{message}</p>
          {trueCost && <p className="font-semibold mt-1">Estimated True Cost: {trueCost}</p>}
        </div>
      </div>
      <button 
        onClick={() => setShow(false)} 
        className="bg-white text-red-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors"
      >
        Dismiss
      </button>
    </div>
  )
}
