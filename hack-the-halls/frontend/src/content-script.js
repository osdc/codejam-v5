import {
  createButton,
  createStatusDiv,
  updateStatus,
} from "./scripts/ui-utils.js";
import {
  getFileId,
  getDownloadLink,
  getDriveLinks,
} from "./scripts/drive-utils.js";
import { downloadFile } from "./scripts/file-utils.js";
import { getUser } from "./scripts/user-utils.js";

const init = async () => {
  if (document.getElementById("my-extension-root")) return;

  // Create root div
  const root = document.createElement("div");
  root.id = "my-extension-root";
  document.body.appendChild(root);

  // Get user details
  const user = await getUser();
  console.log("user in content script", user);

  // Wait for course title to load

  // Only proceed to create and show UI elements if we have both user and course
  if (user) {
    // Create UI elements
    const statusDiv = createStatusDiv();
    const button = createButton();

    button.addEventListener("click", async () => {
      const course = document.querySelector(
        "h1.tNGpbb.YrFhrf-ZoZQ1.YVvGBb"
      ).innerText;
      console.log("Course:", course);
      const anchorTags = getDriveLinks();
      updateStatus(statusDiv, ` Found ${anchorTags.length} files to process`);

      console.log(anchorTags);

      // Process files sequentially
      for (let i = 0; i < anchorTags.length; i++) {
        const { href, text } = anchorTags[i];

        const fileId = getFileId(href);

        console.log("href", href);
        console.log("text", text);
        console.log("fileId", fileId);

        if (fileId) {
          updateStatus(
            statusDiv,
            `Processing file ${i + 1} of ${anchorTags.length}: ${text}`
          );
          const downloadUrl = getDownloadLink(fileId);
          console.log("downloadUrl", downloadUrl);

          try {
            await downloadFile(downloadUrl, text, course);
            updateStatus(
              statusDiv,
              `Successfully processed ${i + 1} of ${anchorTags.length} files`
            );
            return;
          } catch (error) {
            updateStatus(
              statusDiv,
              `Error processing file ${i + 1}: ${error.message}`
            );
          }
        }
        break;
      }

      updateStatus(statusDiv, "All files processed");
      setTimeout(() => {
        statusDiv.style.display = "none";
      }, 3000);
    });

    // Append elements to root only after we have the course
    root.appendChild(statusDiv);
    root.appendChild(button);
  } else {
    const statusDiv = createStatusDiv();
    if (!user) {
      updateStatus(statusDiv, "Login first");
    } else if (!course) {
      updateStatus(statusDiv, "Unable to detect course");
    }
    root.appendChild(statusDiv);
  }
};

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
