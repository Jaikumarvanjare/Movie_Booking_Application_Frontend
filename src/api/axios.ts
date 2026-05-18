import axios from "axios";
import { API_BASE_URL, API_KEY_SECRET, API_TIMEOUT } from "../utils/constants";
import { storage } from "../utils/storage";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (API_KEY_SECRET) {
    config.headers["x-api-key-secret"] = API_KEY_SECRET;
  }

  return config;
});

export default apiClient;
