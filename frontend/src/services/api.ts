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
      config.headers.Authorization = `${token}`;
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
    mobileNumber: string;
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
  logout: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found.");
    }

    return api.post("/auth/logout", { token });
  },
  getUser: async () => {
    return api.get("/auth/user");
  },
};

export const transactionApi = {
  sendMoney: async (data: {
    recipientMobileNumber: string;
    amount: number;
    pin: string;
  }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found.");
    }

    return api.post("/transactions/send-money", { ...data, token });
  },
  cashIn: async (data: {
    agentMobileNumber: string;
    amount: number;
    pin: string;
    userId: string;
  }) => {
    return api.post("/transactions/cash-in", data);
  },

  cashOut: async (data: {
    agentMobileNumber: string;
    amount: number;
    pin: string;
  }) => {
    return api.post("/transactions/cash-out", data);
  },

  getBalance: async () => {
    return api.get("/transactions/balance");
  },
};

export const adminApi = {
  blockUser: async (userId: string) => {
    return api.put(`/admin/block-user/${userId}`);
  },

  approveAgent: async (data: {
    agentId: string;
    status: "approve" | "reject";
  }) => {
    return api.post("/admin/approve-agent", data);
  },

  addMoneyToAgent: async (data: { agentId: string; amount: number }) => {
    return api.post("/admin/add-money-to-agent", data);
  },

  monitorTotalMoney: async () => {
    return api.get("/admin/monitor-total-money");
  },
  getAgentApprovalRequests: async () => {
    return api.get("/admin/agent-approval-requests");
  },

  getAllUsers: async () => {
    return api.get("/admin/all-users");
  },

  getAllAgents: async () => {
    return api.get("/admin/all-agents");
  },

  getAllTransactions: async () => {
    return api.get("/admin/all-transactions");
  },
};
export default api;
