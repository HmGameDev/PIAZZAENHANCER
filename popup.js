document.getElementById("saveBtn").addEventListener("click", () => {
  const fontStyle = document.getElementById("fontStyle").value;
  const themeColor = document.getElementById("themeColor").value;
  const darkMode = document.getElementById("darkModeToggle").checked;

  console.log("Saving settings:", { fontStyle, themeColor, darkMode });

  chrome.storage.sync.set({ fontStyle, themeColor, darkMode }, () => {
      console.log("Settings saved successfully!");
      alert("Settings saved! Refresh Piazza to see changes.");
      applySettings(); // Immediately apply settings for testing
  });
});

// Load the current settings when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(["fontStyle", "themeColor", "darkMode"], ({ fontStyle, themeColor, darkMode }) => {
      console.log("Loaded settings:", { fontStyle, themeColor, darkMode });
      document.getElementById("fontStyle").value = fontStyle || "default";
      document.getElementById("themeColor").value = themeColor || "#0056b3";
      document.getElementById("darkModeToggle").checked = darkMode || false;
  });
});
