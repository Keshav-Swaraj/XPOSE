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

export default function AlertOverlay() {
  const [alerts, setAlerts] = useState<{type: string, message: string, id: number}[]>([])
  const [showBorder, setShowBorder] = useState(false)

  useEffect(() => {
    const handleAlert = (event: Event) => {
      const customEvent = event as CustomEvent
      const newAlert = { ...customEvent.detail, id: Date.now() }
      
      setAlerts(prev => [...prev, newAlert])
      setShowBorder(true)
      
      // Auto-hide toast after 8 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== newAlert.id))
      }, 8000)

      // Hide red border after a few seconds of pulsing
      setTimeout(() => {
        setShowBorder(false)
      }, 3000)
    }

    window.addEventListener("XPOSE_DARK_PATTERN_DETECTED", handleAlert)
    return () => window.removeEventListener("XPOSE_DARK_PATTERN_DETECTED", handleAlert)
  }, [])

  if (alerts.length === 0 && !showBorder) return null

  return (
    <div className="fixed inset-0 z-[9999999] pointer-events-none font-sans">
      {/* Pulsing Red Border around the webpage */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 border-[6px] border-red-500/80 shadow-[inset_0_0_80px_rgba(239,68,68,0.4)] ${showBorder ? 'opacity-100 animate-pulse' : 'opacity-0'}`} 
      />

      {/* Floating Toasts near top right */}
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-3 pointer-events-auto">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className="bg-[#1e1e1e] border border-red-500/50 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center space-x-4 animate-in slide-in-from-top-4 fade-in duration-300 w-80 backdrop-blur-md"
          >
            <span className="text-red-500 text-2xl shrink-0">🚨</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-red-400 mb-0.5">XPOSE: Dark Pattern!</p>
              <p className="text-xs text-gray-300 leading-relaxed">{alert.message}</p>
            </div>
            <button 
              onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
              className="text-gray-500 hover:text-white shrink-0 -mt-8 -mr-2 p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
