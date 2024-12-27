export const downloadFile = async (url, filename, course) => {
  try {
    // Send message to background script to handle download
    const response = await chrome.runtime.sendMessage({
      action: "download",
      url: url,
      filename: filename,
      course: course,
    });

    if (!response.success) {
      throw new Error(response.error || "Download failed");
    }

    return true;
  } catch (error) {
    console.error(`Error downloading ${filename}:`, error);
    throw error;
  }
};

export const sendToServer = async (blob, filename) => {
  try {
    const formData = new FormData();
    formData.append("file", blob, filename);

    const response = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error uploading ${filename}:`, error);
    throw error;
  }
};
