import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// 🔥 attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =====================
// AUTH APIs
// =====================
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const googleLogin = async (credential) => {
  const res = await API.post("/auth/google-login", {
    credential,
  });
  return res.data;
};

// =====================
// PREDICT
// =====================
export const predictLoan = async (data) => {
  const res = await API.post("/predict", data);
  return res.data;
};

// =====================
// HISTORY (PROTECTED)
// =====================
export const getHistory = async () => {
  const res = await API.get("/history");
  return res.data;
};

export default API;