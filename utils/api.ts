import axios from "axios";

// Backend base URL
const API_BASE_URL = "http://192.168.6.83:8000/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

export default api;
