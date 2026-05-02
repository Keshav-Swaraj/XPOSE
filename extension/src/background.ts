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
