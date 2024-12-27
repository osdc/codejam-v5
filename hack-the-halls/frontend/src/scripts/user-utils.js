export const getUser = async () => {
  try {
    console.log("getUser function called");

    const response = await chrome.runtime.sendMessage({
      action: "getUser",
    });

    if (!response.success) {
      throw new Error(response.error || "User not found");
    }
    console.log("response", response);
    return response.user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};
