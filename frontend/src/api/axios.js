import axios from "axios";

const api = axios.create({
  baseURL:  "https://gigflow-backend-a3ke.onrender.com/api",
  withCredentials: true, // HttpOnly cookies
});

export default api;
