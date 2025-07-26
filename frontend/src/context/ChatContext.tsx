"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"
import type {
  ChatState,
  ChatContextType,
  Message,
  Conversation,
} from "../types"
import { getUserId, saveConversations, loadConversations } from "../utils/storage"
import { chatAPI } from "../utils/api"
import toast from "react-hot-toast"

// ——— Actions ——————————————————————————————————————————————————————————————
type ChatAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "SET_USER_ID"; payload: string }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_CONVERSATIONS"; payload: Conversation[] }
  | { type: "SET_CURRENT_CONVERSATION"; payload: string | null }
  | { type: "ADD_CONVERSATION"; payload: Conversation }

const initialState: ChatState = {
  currentConversationId: null,
  messages: [],
  conversations: loadConversations(),
  isLoading: false,
  userId: "", // will be set on mount
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_MESSAGES":
      return { ...state, messages: action.payload }

    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] }

    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload }

    case "SET_CURRENT_CONVERSATION":
      return { ...state, currentConversationId: action.payload }

    case "ADD_CONVERSATION":
      return {
        ...state,
        conversations: [
          action.payload,
          ...state.conversations.filter((c) => c.id !== action.payload.id),
        ],
      }

    case "SET_USER_ID":
      return { ...state, userId: action.payload }

    default:
      return state
  }
}

// ——— Context Setup ——————————————————————————————————————————————————————
const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  // 1) On mount, load or generate userId
  useEffect(() => {
    const uid = getUserId()
    dispatch({ type: "SET_USER_ID", payload: uid })
  }, [])

  // 2) Persist conversations to localStorage whenever they change
  useEffect(() => {
    saveConversations(state.conversations)
  }, [state.conversations])

  // ——— sendMessage ————————————————————————————————————————————————
  const sendMessage = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }
    dispatch({ type: "ADD_MESSAGE", payload: userMsg })
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const res = await chatAPI.sendMessage(
        state.userId,
        state.currentConversationId,
        content
      )

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: res.answer,
        timestamp: new Date(),
      }
      dispatch({ type: "ADD_MESSAGE", payload: aiMsg })

      // update conversation ID if new
      const convoId = res.conversation_id || state.currentConversationId
      if (convoId !== state.currentConversationId) {
        dispatch({ type: "SET_CURRENT_CONVERSATION", payload: convoId })
      }

      // update conversation list preview
      const updatedConv: Conversation = {
        id: convoId!,
        preview:
          content.length > 50
            ? content.substring(0, 50) + "..."
            : content,
        date: new Date(),
        messages: [...state.messages, userMsg, aiMsg],
      }
      dispatch({ type: "ADD_CONVERSATION", payload: updatedConv })
    } catch (err) {
      toast.error("Failed to send message. Please try again.")
      console.error("Send message error:", err)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // ——— fetchConversations on userId ready ————————————————————————————
  useEffect(() => {
    if (!state.userId) return

    const fetchConversations = async () => {
      try {
        const list = await chatAPI.getConversations(state.userId)

        // For each conversation, fetch its full messages and derive a preview
        const formatted: Conversation[] = await Promise.all(
          list.map(async (c: any) => {
            const full = await chatAPI.getConversation(c.conversation_id)
            const msgs = full.messages || []
            // Use the last AI/user message as preview
            const last = msgs.length > 0 ? msgs[msgs.length - 1] : null
            const previewText = last?.content ?? "New conversation"
            return {
              id: full.conversation_id,
              preview:
                previewText.length > 50
                  ? previewText.substring(0, 50) + "..."
                  : previewText,
              date: last
                ? new Date(last.ts)
                : new Date(c.created_at),
              messages: [], // load full messages in loadConversation
            }
          })
        )

        dispatch({ type: "SET_CONVERSATIONS", payload: formatted })
      } catch (err) {
        console.error("Failed to load conversations:", err)
      }
    }

    fetchConversations()
  }, [state.userId])

  // ——— loadConversation ————————————————————————————————————————————
// … inside ChatProvider …

const loadConversation = async (id: string) => {
  dispatch({ type: "SET_LOADING", payload: true })
  try {
    // Fetch full conversation from backend
    const conv = await chatAPI.getConversation(id)

    // Map each backend message to our Message interface
    const msgs: Message[] = conv.messages.map(
      (m: { role: string; content: string; ts: string }, idx: number): Message => ({
        id: `${id}-${idx}`,            // unique per message
        role: m.role as "user" | "ai" | "system",
        content: m.content,
        timestamp: new Date(m.ts),     // convert ISO string to Date
      })
    )

    // Populate the chat window
    dispatch({ type: "SET_MESSAGES", payload: msgs })
    dispatch({ type: "SET_CURRENT_CONVERSATION", payload: id })

    // Also update this conversation’s stored messages
    const updatedConvs = state.conversations.map((c) =>
      c.id === id ? { ...c, messages: msgs } : c
    )
    dispatch({ type: "SET_CONVERSATIONS", payload: updatedConvs })
  } catch (err) {
    toast.error("Failed to load conversation.")
    console.error("loadConversation error:", err)
  } finally {
    dispatch({ type: "SET_LOADING", payload: false })
  }
}


  const createNewChat = () => {
    dispatch({ type: "SET_CURRENT_CONVERSATION", payload: null })
    dispatch({ type: "SET_MESSAGES", payload: [] })
  }

  const searchConversations = (query: string): Conversation[] => {
    if (!query.trim()) return state.conversations
    return state.conversations.filter((c) =>
      c.preview.toLowerCase().includes(query.toLowerCase())
    )
  }

  const value: ChatContextType = {
    ...state,
    sendMessage,
    loadConversation,
    createNewChat,
    searchConversations,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

// ——— hook ——————————————————————————————————————————————————————————————
export const useChat = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider")
  }
  return ctx
}
