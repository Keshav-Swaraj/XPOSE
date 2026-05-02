import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// ─── Dark Pattern Definitions ──────────────────────────────────────────────────
const DARK_PATTERNS = [
  // --- Original 3 ---
  {
    regex: /only \d+ (units|seats|tickets|loans|offers|items?) (left|remaining)/i,
    type: "Artificial Scarcity",
    message: "This page is creating false urgency by claiming limited availability to pressure you into a quick decision."
  },
  {
    regex: /(convenience fee|processing fee|platform fee|service charge|handling fee)[\s\S]{0,30}?\d+/i,
    type: "Hidden Fee",
    message: "We detected additional fees that may not have been shown in the headline price."
  },
  {
    regex: /insurance included|auto-renewal|automatically (added|renewed|charged)|auto renew/i,
    type: "Pre-ticked/Hidden Add-on",
    message: "Check for pre-selected add-ons like insurance or auto-renewal that you may not need."
  },

  // --- New: Fake Urgency / Countdown ---
  {
    regex: /(offer ends|deal expires|expires in|hurry|limited time|today only|last \d+ (hours?|minutes?|days?))/i,
    type: "Fake Urgency",
    message: "This page uses time pressure tactics. These deadlines are often artificial and reset when you revisit."
  },

  // --- New: Guilt-tripping (Confirmshaming) ---
  {
    regex: /(no,? thanks?.*i (don'?t|do not) want|i'?ll? (pass|miss out)|no,? i prefer (to pay more|losing)|skip saving)/i,
    type: "Guilt-Tripping (Confirmshaming)",
    message: "This page uses shaming language on the 'decline' button to manipulate your choice."
  },

  // --- New: Bait Pricing (asterisk / fine print pricing) ---
  {
    regex: /(starting (from|at)|from just|as low as|₹\s*\d[\d,]*\*)/i,
    type: "Bait Pricing",
    message: "The advertised price may have conditions. Check the fine print — the actual price you pay could be higher."
  },

  // --- New: Auto-renewal / Subscription trap ---
  {
    regex: /(cancel anytime|will be charged|recurring (charge|billing|payment)|subscription (renews|auto-renews))/i,
    type: "Subscription Trap",
    message: "This service has recurring charges. Make sure you know how and when to cancel."
  },

  // --- New: Roach Motel (easy in, hard out) ---
  {
    regex: /(cancel (online|anytime).*call|to cancel.*contact (us|support|helpline)|cancellation.*fee|cancellation.*charge)/i,
    type: "Roach Motel",
    message: "Signing up looks easy, but cancellation may require extra steps, calls, or fees."
  },

  // --- New: Forced Continuity ---
  {
    regex: /(free (trial|period).*then|after (the )?trial.*charged|first (month|year) free then)/i,
    type: "Forced Continuity",
    message: "A free trial that silently converts to a paid subscription. Set a reminder to cancel before the trial ends."
  },

  // --- New: Misdirection / Disguised Ads ---
  {
    regex: /(sponsored|advertisement|promoted)\s*(result|listing|plan|offer)/i,
    type: "Disguised Advertisement",
    message: "Some results on this page are paid ads, not neutral recommendations."
  },

  // --- New: Privacy Zuckering ---
  {
    regex: /(share (your|our) data with (partner|third.party|affiliate)|marketing (consent|preferences)|opt.?out)/i,
    type: "Privacy Zuckering",
    message: "This page may be attempting to collect consent to share your data with third parties."
  },

  // --- New: Fine Print Burial (ALL CAPS hiding key terms) ---
  {
    regex: /\*\s*(terms? (and|&) conditions?|t&c|conditions? apply|see details)/i,
    type: "Fine Print Burial",
    message: "Important conditions are buried in asterisked fine print. Always expand the full terms before agreeing."
  }
]

const alertedPatterns = new Set<string>()

// ─── Alert Dispatcher ──────────────────────────────────────────────────────────
function alertDarkPattern(type: string, message: string) {
  if (alertedPatterns.has(type)) return

  console.warn(`[XPOSE] Dark pattern detected: ${type}`)

  chrome.runtime.sendMessage({
    action: "ALERT_DARK_PATTERN",
    payload: { type, message }
  }).catch(err => console.warn("Failed to send alert to background", err))

  window.dispatchEvent(new CustomEvent("XPOSE_DARK_PATTERN_DETECTED", {
    detail: { type, message }
  }))

  alertedPatterns.add(type)
}

// ─── Text Scanner ──────────────────────────────────────────────────────────────
function scanNodeForDarkPatterns(text: string) {
  for (const pattern of DARK_PATTERNS) {
    if (alertedPatterns.has(pattern.type)) continue
    if (text.match(pattern.regex)) {
      alertDarkPattern(pattern.type, pattern.message)
    }
  }
}

// ─── Pre-ticked Checkbox Scanner ──────────────────────────────────────────────
function scanDOMForPreTickedBoxes() {
  if (alertedPatterns.has("Pre-ticked Checkbox")) return

  const checkboxes = document.querySelectorAll('input[type="checkbox"]')
  for (const cb of Array.from(checkboxes)) {
    const checkbox = cb as HTMLInputElement
    if (!checkbox.checked) continue

    let labelText = ""
    if (checkbox.labels && checkbox.labels.length > 0) {
      labelText = Array.from(checkbox.labels).map(l => l.innerText).join(" ")
    } else if (checkbox.parentElement) {
      labelText = checkbox.parentElement.innerText
    }

    labelText = labelText.toLowerCase()

    if (
      labelText.includes("whatsapp") ||
      labelText.includes("terms & conditions") ||
      labelText.includes("terms and conditions") ||
      labelText.includes("newsletter") ||
      labelText.includes("promotions") ||
      labelText.includes("marketing") ||
      labelText.includes("offers") ||
      labelText.includes("updates")
    ) {
      alertDarkPattern(
        "Pre-ticked Checkbox",
        "We found pre-ticked checkboxes for marketing, updates, or terms. Ensure you actually want to opt-in."
      )
      break
    }
  }
}

// ─── Fake Countdown Timer Scanner ─────────────────────────────────────────────
// Looks for DOM elements styled as countdown timers (e.g., 00:23:47)
function scanDOMForFakeCountdowns() {
  if (alertedPatterns.has("Fake Countdown Timer")) return

  const timerRegex = /\b\d{1,2}:\d{2}(:\d{2})?\b/
  const allElements = document.querySelectorAll("span, div, p, strong, b")

  for (const el of Array.from(allElements)) {
    const text = (el as HTMLElement).innerText?.trim() || ""
    if (timerRegex.test(text) && text.length < 20) {
      // Check parent/nearby text for urgency keywords
      const nearby = (el.parentElement?.innerText || "").toLowerCase()
      if (
        nearby.includes("offer") ||
        nearby.includes("expires") ||
        nearby.includes("ends") ||
        nearby.includes("hurry") ||
        nearby.includes("left") ||
        nearby.includes("deal")
      ) {
        alertDarkPattern(
          "Fake Countdown Timer",
          "A countdown timer was detected near promotional content. These timers are often fake and reset on page reload."
        )
        break
      }
    }
  }
}

// ─── Initial Scan ──────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  scanNodeForDarkPatterns(document.body.innerText)
  scanDOMForPreTickedBoxes()
  scanDOMForFakeCountdowns()
})

// Also scan immediately in case DOMContentLoaded already fired
if (document.readyState !== "loading") {
  scanNodeForDarkPatterns(document.body.innerText)
  scanDOMForPreTickedBoxes()
  scanDOMForFakeCountdowns()
}

// ─── Mutation Observer (dynamic content) ──────────────────────────────────────
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList" || mutation.type === "characterData") {
      const target = mutation.target as HTMLElement
      const text = target.innerText || target.textContent || ""
      if (text) scanNodeForDarkPatterns(text)

      if (!alertedPatterns.has("Pre-ticked Checkbox")) scanDOMForPreTickedBoxes()
      if (!alertedPatterns.has("Fake Countdown Timer")) scanDOMForFakeCountdowns()
    }
  }
})

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true
})
