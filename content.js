// Existing content of content.js

// Function to set the background image, ensuring only PNG and JPEG formats are accepted
function setBackgroundImage(imageUrl) {
    if (!imageUrl || !imageUrl.match(/\.(jpeg|jpg|png)$/i)) {
        console.error("Background image must be a PNG or JPEG.");
        return;
    }

    const backgroundStyle = `
        background: url('${imageUrl}') no-repeat center center fixed;
        background-size: cover;
    `;
    document.body.style = backgroundStyle;
}

// Example call to set the background image
// Replace 'your-image-url' with the actual URL for testing
setBackgroundImage('your-image-url');


// New Code Begins Here

// Function to create settings button in the Piazza top bar
function createSettingsButton() {
    const button = document.createElement('button');
    button.innerText = 'Enhancer Settings';
    button.style.marginLeft = '10px';
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';
    button.style.backgroundColor = '#0056b3';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    
    button.onclick = () => {
        console.log("Settings button clicked.");
        chrome.runtime.sendMessage({ action: 'openPopup' });
    };

    // Check for the navigation bar after the page has loaded
    let retryCount = 0;  // Track retries to avoid infinite looping
    const navBarInterval = setInterval(() => {
        const navBar = document.querySelector('.navbar, .navigation-bar'); // Adjusted selector to be more general
        if (navBar) {
            navBar.appendChild(button);
            console.log("Settings button added to the navigation bar.");
            clearInterval(navBarInterval); // Stop checking once button is added
        } else {
            console.error("Navigation bar not found. Retrying...");
            retryCount += 1;
            if (retryCount > 10) { // Limit retries to 10
                console.warn("Stopping retry for settings button. Navigation bar not found.");
                clearInterval(navBarInterval);
            }
        }
    }, 1000); // Check every second
}

// Apply saved settings with continuous updating for dynamic content
function applySettings() {
    chrome.storage.sync.get(["fontStyle", "themeColor", "darkMode", "backgroundImage"], ({ fontStyle, themeColor, darkMode, backgroundImage }) => {
        console.log("Applying settings:", { fontStyle, themeColor, darkMode, backgroundImage });

        // Set default values if undefined
        fontStyle = fontStyle || "default";
        themeColor = themeColor || "#0056b3"; // Default color
        darkMode = darkMode !== undefined ? darkMode : false; // Default to false

        // Apply font globally
        document.body.style.fontFamily = fontStyle === "comicSans" ? "'Comic Sans MS', sans-serif" : "inherit";

        // Background image application
        if (backgroundImage && backgroundImage.match(/\.(jpeg|jpg|png)$/i)) {  // Validate URL before applying
            document.body.style.backgroundImage = `url(${backgroundImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            console.log("Background image applied.");
        } else {
            console.warn("No valid background image found in storage.");
        }

        // Apply theme color and text visibility
        function applyStyles() {
            const elements = document.querySelectorAll('*');
            elements.forEach(element => {
                element.style.color = darkMode ? 'white' : 'black';
                element.style.backgroundColor = darkMode ? '#121212' : 'white';
                element.style.borderColor = themeColor;
            });
        }
        
        // Apply dark mode styles
        if (darkMode) {
            document.body.classList.add('dark-mode');
            console.log("Dark mode enabled.");
        } else {
            document.body.classList.remove('dark-mode');
            console.log("Dark mode disabled.");
        }

        applyStyles(); // Initial application of styles

        // Observer to apply settings as new Q&A content loads
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    applyStyles();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
}

// Additional Code Begins Here

// Expanding the width of the Piazza content to make it appear less compressed
function expandContentWidth() {
    const contentContainer = document.querySelector('.main-content, .content-wrapper'); // Adjust selector based on Piazza's main content class
    if (contentContainer) {
        contentContainer.style.maxWidth = '90vw'; // Expands the content width to 90% of the viewport width
        contentContainer.style.margin = '0 auto'; // Centers the content horizontally
    }
}

// Ensure background image URL is saved and persists, handling storage quota error
function saveBackgroundImage(url) {
    if (url.match(/\.(jpeg|jpg|png)$/i)) { // Only save if it's a PNG or JPEG
        try {
            chrome.storage.sync.set({ backgroundImage: url }, () => {
                console.log("Background image URL saved.");
            });
        } catch (error) {
            console.error("Storage quota exceeded. Unable to save background image URL.");
        }
    } else {
        console.error("Invalid image format. Only PNG and JPEG are supported.");
    }
}

// Retrieve and apply the background image if saved
function loadBackgroundImage() {
    chrome.storage.sync.get("backgroundImage", ({ backgroundImage }) => {
        if (backgroundImage && backgroundImage.match(/\.(jpeg|jpg|png)$/i)) {  // Validate the URL before applying
            document.body.style.backgroundImage = `url(${backgroundImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            console.log("Background image applied.");
        } else {
            console.warn("No valid background image found in storage.");
        }
    });
}

// Call these functions to apply the enhancements
expandContentWidth();
loadBackgroundImage();

// Initialize the extension functionality
createSettingsButton();
applySettings();
