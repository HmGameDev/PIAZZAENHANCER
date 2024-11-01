document.getElementById("saveBtn").addEventListener("click", () => {
  const fontStyle = document.getElementById("fontStyle").value;
  const themeColor = document.getElementById("themeColor").value;
  const darkMode = document.getElementById("darkModeToggle").checked;
  const transparency = parseFloat(document.getElementById("transparency").value);

  const bgImageInput = document.getElementById("bgImage");
  let bgImage = '';
  if (bgImageInput.files && bgImageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
          bgImage = e.target.result;
          chrome.storage.sync.set({ fontStyle, themeColor, darkMode, bgImage, transparency }, () => {
              console.log("Settings saved successfully!");
              alert("Settings saved! Refresh Piazza to see changes.");
          });
      };
      reader.readAsDataURL(bgImageInput.files[0]);
  } else {
      chrome.storage.sync.set({ fontStyle, themeColor, darkMode, transparency }, () => {
          console.log("Settings saved successfully!");
          alert("Settings saved! Refresh Piazza to see changes.");
      });
  }
});

// Load the current settings when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(["fontStyle", "themeColor", "darkMode", "bgImage", "transparency"], 
  ({ fontStyle, themeColor, darkMode, bgImage, transparency }) => {
      document.getElementById("fontStyle").value = fontStyle || "default";
      document.getElementById("themeColor").value = themeColor || "#0056b3";
      document.getElementById("darkModeToggle").checked = darkMode || false;
      document.getElementById("transparency").value = transparency || 1;
  });
});
