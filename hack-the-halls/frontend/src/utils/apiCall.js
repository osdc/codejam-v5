import { toast } from "react-toastify";
import axios from "axios";
import { getItem, removeItem } from "./storage";

const handleApiError = (error) => {
  if (error.response?.data?.message) {
    if (
      error.response.data.message === "Unauthorized Access" ||
      error.response.data.message === "invalid token" ||
      error.response.data.message === "Invalid JWT Token"
    ) {
      removeItem("token"); // Use chrome.storage.local instead of localStorage
      toast.error("Please Login Again");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      toast.error(error.response.data.message);
    }
  } else {
    toast.error("Something went wrong, Please try again later.");
  }
};

const getAuthHeaders = async () => {
  try {
    const token = await getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (error) {
    console.error("Error getting auth headers:", error);
    return {};
  }
};

export const GetApiCall = async (url) => {
  try {
    const { data } = await axios.get(url, { headers: await getAuthHeaders() });
    return data;
  } catch (error) {
    handleApiError(error);
    return { success: false };
  }
};

export const PostApiCall = async (url, formData) => {
  try {
    const { data } = await axios.post(url, formData, {
      headers: await getAuthHeaders(),
    });
    return data;
  } catch (error) {
    handleApiError(error);
    return { success: false };
  }
};

export const PutApiCall = async (url, formData) => {
  try {
    const { data } = await axios.put(url, formData, {
      headers: await getAuthHeaders(),
    });
    return data;
  } catch (err) {
    handleApiError(err);
    return { success: false };
  }
};

export const DeleteApiCall = async (url) => {
  try {
    const { data } = await axios.delete(url, {
      headers: await getAuthHeaders(),
    });
    return data;
  } catch (err) {
    handleApiError(err);
    return { success: false };
  }
};
