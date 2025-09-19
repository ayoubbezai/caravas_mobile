import axios from "axios";

// Backend base URL
const API_BASE_URL = "http://10.226.58.83:8000/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
