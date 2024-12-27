import { handleDownload } from "./services/download-service.js";
import { handleUserRequest } from "./services/user-service.js";

// Initialize message listeners
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle different types of messages
  switch (request.action) {
    case "download":
      handleDownload(request, sender, sendResponse);
      return true; // Keep the message channel open for async response

    case "getUser":
      handleUserRequest(request, sender, sendResponse);
      return true; // Keep the message channel open for async response

    default:
      console.warn("Unknown action received:", request.action);
      sendResponse({ success: false, error: "Unknown action" });
  }
});

// Optional: Add any other background script initialization here
console.log("Background script initialized");

// chrome.storage.local
//   .remove("token")
//   .then(() => {
//     console.log("Token removed from local storage");
//   })
//   .catch((error) => {
//     console.error("Error removing token from local storage:", error);
//   });
