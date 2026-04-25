export {}

// Open popup when clicking extension icon on dating sites
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.action.openPopup()
  }
})
