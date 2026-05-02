import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Patterns that typically indicate dark patterns in fintech
const DARK_PATTERNS = [
  {
    regex: /only \d+ (units|seats|tickets|loans|offers) left/i,
    type: "Artificial Scarcity",
    message: "This page is using artificial scarcity to pressure you into a quick decision."
  },
  {
    regex: /(convenience fee|processing fee|hidden fee|platform fee|service charge).*?\d+/i,
    type: "Hidden Fee",
    message: "We detected additional fees that may not have been in the original price."
  },
  {
    regex: /insurance included|auto-renewal|automatically added/i,
    type: "Pre-ticked/Hidden Add-on",
    message: "Check for pre-selected add-ons like insurance that you may not need."
  }
]

let hasAlerted = false

function scanNodeForDarkPatterns(text: string) {
  if (hasAlerted) return

  for (const pattern of DARK_PATTERNS) {
    const match = text.match(pattern.regex)
    if (match) {
      console.warn(`[Vaayu] Dark pattern detected: ${pattern.type}`, match[0])
      
      // Dispatch event to RedBanner
      const event = new CustomEvent("VAAYU_DARK_PATTERN_DETECTED", {
        detail: {
          type: pattern.type,
          message: pattern.message,
          trueCost: pattern.type === "Hidden Fee" ? match[0] : null
        }
      })
      window.dispatchEvent(event)
      hasAlerted = true
      break
    }
  }
}

// Initial Scan
document.addEventListener("DOMContentLoaded", () => {
  scanNodeForDarkPatterns(document.body.innerText)
})

// Mutation Observer to catch dynamic content (e.g., React popups, countdowns)
const observer = new MutationObserver((mutations) => {
  if (hasAlerted) return
  
  for (const mutation of mutations) {
    if (mutation.type === "childList" || mutation.type === "characterData") {
      const target = mutation.target as HTMLElement
      if (target.innerText) {
        scanNodeForDarkPatterns(target.innerText)
      } else if (target.textContent) {
        scanNodeForDarkPatterns(target.textContent)
      }
    }
  }
})

// Start observing the document
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true
})
