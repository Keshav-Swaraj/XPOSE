export {}

// Listen for clicks on the extension icon in the Chrome toolbar
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    // Send a message to the active tab's content script to toggle the sidebar
    chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_XPOSE_SIDEBAR" }).catch((err) => {
      console.warn("Could not send message to tab. Is the content script injected?", err)
    })
  }
})

// Listen for dark pattern detections from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ALERT_DARK_PATTERN" && sender.tab?.id) {
    animateIcon(sender.tab.id);
  }
})

const activeAnimations = new Set<number>();

async function animateIcon(tabId: number) {
  if (activeAnimations.has(tabId)) return;
  activeAnimations.add(tabId);
  
  try {
    const manifest = chrome.runtime.getManifest();
    const iconPath = manifest.icons?.["128"] || manifest.action?.default_icon?.["128"];
    if (!iconPath) return;

    const response = await fetch(chrome.runtime.getURL(iconPath));
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    
    const canvas = new OffscreenCanvas(128, 128);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let radius = 10;
    let growing = true;
    let frames = 0;

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, 128, 128);
      ctx.drawImage(bitmap, 0, 0, 128, 128);
      
      // Draw pulsing red circle in top right corner
      ctx.beginPath();
      ctx.arc(108, 20, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#ef4444"; // Tailwind red-500
      ctx.fill();
      
      const imageData = ctx.getImageData(0, 0, 128, 128);
      chrome.action.setIcon({ imageData: { "128": imageData }, tabId });

      if (growing) radius += 4;
      else radius -= 4;

      if (radius > 26) growing = false;
      if (radius < 10) growing = true;

      frames++;
      if (frames > 20) {
        clearInterval(interval);
        activeAnimations.delete(tabId);
        
        // Set final static red dot state
        ctx.clearRect(0, 0, 128, 128);
        ctx.drawImage(bitmap, 0, 0, 128, 128);
        ctx.beginPath();
        ctx.arc(108, 20, 24, 0, 2 * Math.PI);
        ctx.fillStyle = "#dc2626"; // Tailwind red-600
        ctx.fill();
        chrome.action.setIcon({ imageData: { "128": ctx.getImageData(0, 0, 128, 128) }, tabId });
      }
    }, 80); // 80ms per frame for a smooth, fast pulse
    
  } catch (e) {
    console.error("Icon animation error:", e);
    activeAnimations.delete(tabId);
  }
}
