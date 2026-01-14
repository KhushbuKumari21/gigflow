import axios from "axios";

const api = axios.create({
  baseURL: "https://gigflow-backend-a3ke.onrender.com/api",
  withCredentials: true,
});

export default api;