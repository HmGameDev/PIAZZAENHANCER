chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received from content script:", request);
    if (request.action === 'openPopup') {
        chrome.action.openPopup();
    }
});
