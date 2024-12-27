export const getToken = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("token", (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve(result.token);
      }
    });
  });
};
