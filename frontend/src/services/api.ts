import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: { mobileOrEmail: string; pin: string }) => {
    return api.post("/auth/login", data);
  },

  signup: async (data: {
    name: string;
    email: string;
    mobile: string;
    nid: string;
    pin: string;
    accountType: "user" | "agent";
  }) => {
    return api.post("/auth/register", data);
  },

  forgotPin: async (data: { mobileOrEmail: string; nid: string }) => {
    return api.post("/auth/forgot-pin", data);
  },

  verifyAccount: async (data: { code: string }) => {
    return api.post("/auth/verify", data);
  },
};

export default api;
