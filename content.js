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
    const navBarInterval = setInterval(() => {
        const navBar = document.querySelector('.navbar, .navigation-bar'); // Adjusted selector to be more general
        if (navBar) {
            navBar.appendChild(button);
            console.log("Settings button added to the navigation bar.");
            clearInterval(navBarInterval); // Stop checking once button is added
        } else {
            console.error("Navigation bar not found. Retrying...");
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
        if (backgroundImage) {
            document.body.style.backgroundImage = `url(${backgroundImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
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

// Initialize the extension functionality
createSettingsButton();
applySettings();
