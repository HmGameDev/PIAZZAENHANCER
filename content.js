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

// Apply saved settings
function applySettings() {
    chrome.storage.sync.get(["fontStyle", "themeColor", "darkMode"], ({ fontStyle, themeColor, darkMode }) => {
        console.log("Applying settings:", { fontStyle, themeColor, darkMode });

        // Set default values if undefined
        fontStyle = fontStyle || "default";
        themeColor = themeColor || "#0056b3"; // Default color
        darkMode = darkMode !== undefined ? darkMode : false; // Default to false

        // Apply font globally
        const body = document.body;
        body.style.fontFamily = fontStyle === "comicSans" ? "'Comic Sans MS', sans-serif" : "inherit";

        // Apply theme color and text visibility
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            if (darkMode) {
                element.style.color = 'white'; // Text color for dark mode
                element.style.backgroundColor = '#121212'; // Background color for dark mode
            } else {
                element.style.color = 'black'; // Text color for light mode
                element.style.backgroundColor = 'white'; // Background color for light mode
            }
            element.style.borderColor = themeColor; // Change border color if applicable
        });

        // Apply dark mode styles
        if (darkMode) {
            document.body.classList.add('dark-mode');
            console.log("Dark mode enabled.");
        } else {
            document.body.classList.remove('dark-mode');
            console.log("Dark mode disabled.");
        }
    });
}

// Initialize the extension functionality
createSettingsButton();
applySettings();
