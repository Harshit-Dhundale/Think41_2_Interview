// src/utils/storage.ts

// Safely access localStorage only in browser
const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const getUserId = (): string => {
  if (!isBrowser) {
    // fallback ID on server
    return "unknown";
  }

  let userId = window.localStorage.getItem("userId");
  if (!userId) {
    userId = Math.random().toString(36).substr(2, 9);
    window.localStorage.setItem("userId", userId);
  }
  return userId;
};

export const saveConversations = (conversations: any[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem("conversations", JSON.stringify(conversations));
};

export const loadConversations = (): any[] => {
  if (!isBrowser) return [];
  const saved = window.localStorage.getItem("conversations");
  return saved ? JSON.parse(saved) : [];
};
