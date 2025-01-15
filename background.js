// List of blocked URLs
const blockedSites = ["youtube.com", "anotherwebsite.com"];

function getExtensionId() {
  return chrome.runtime.id;
}

async function loadBlockedSites() {
  const response = await fetch(chrome.runtime.getURL("config/blocked_sites.json"));
  const data = await response.json();
  return data.blockedSites || [];
}

async function updateBlockingRules() {
  const blockedSites = await loadBlockedSites();
  const extensionId = getExtensionId();
  const redirectUrl = `chrome-extension://${extensionId}/blocked.html`;

  // Create rules for each site
  const rules = blockedSites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { 
      type: "redirect" ,
      redirect: {
         "url": redirectUrl 
         }
      },
    condition: { urlFilter: site, resourceTypes: ["main_frame"] }
  }));

  // Clear existing rules and add new ones
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(rule => rule.id),
    addRules: rules
  });

  console.log("Blocking rules updated:", blockedSites);
}

// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
  updateBlockingRules();
  console.log("Dynamic Website Blocker Extension Installed.");
});