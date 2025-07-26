import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000", // Update to FastAPI port
  timeout: 30000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)
    throw error
  },
)

export const chatAPI = {
  sendMessage: async (userId: string, conversationId: string | null, message: string) => {
    const response = await api.post("/api/chat", {
      user_id: userId,
      conversation_id: conversationId,
      message,
    });
    return response.data;
  },

  getConversations: async (userId: string) => {
    const response = await api.get(`/api/conversations`, {
      params: { user_id: userId }
    });
    return response.data;
  },

  getConversation: async (id: string) => {
    const response = await api.get(`/api/conversations/${id}`);
    return response.data;
  },
};
