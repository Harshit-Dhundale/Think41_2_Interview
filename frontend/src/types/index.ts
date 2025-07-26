export interface Message {
  id: string
  role: "user" | "ai" | "system"
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  preview: string
  date: Date
  messages: Message[]
}

export interface ChatState {
  currentConversationId: string | null
  messages: Message[]
  conversations: Conversation[]
  isLoading: boolean
  userId: string
}

export interface ChatContextType extends ChatState {
  sendMessage: (content: string) => Promise<void>
  loadConversation: (id: string) => Promise<void>
  createNewChat: () => void
  searchConversations: (query: string) => Conversation[]
}
