document.getElementById("saveButton").addEventListener("click", () => {
  const sites = document.getElementById("blockedSites").value.split("\n").map(site => site.trim());
  chrome.storage.sync.set({ blockedSites: sites }, () => {
    alert("Blocked sites updated!");
  });
});

// Load existing blocked sites
chrome.storage.sync.get("blockedSites", (data) => {
  if (data.blockedSites) {
    document.getElementById("blockedSites").value = data.blockedSites.join("\n");
  }
});