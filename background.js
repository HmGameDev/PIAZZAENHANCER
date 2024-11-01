// No changes needed here; the background file works as expected for messaging.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received from content script:", request);
    if (request.action === 'openPopup') {
        chrome.action.openPopup();
    }
});
