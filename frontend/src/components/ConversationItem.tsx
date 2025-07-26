"use client"

import type React from "react"
import type { Conversation } from "../types"
import { formatDistanceToNow } from "date-fns"

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive, onClick }) => {
  return (
    <div
      className={`p-3 cursor-pointer border-l-4 transition-colors ${
        isActive ? "bg-indigo-50 border-indigo-500" : "bg-white border-transparent hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <p className="text-sm font-medium text-gray-900 truncate">{conversation.preview}</p>
      <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(conversation.date, { addSuffix: true })}</p>
    </div>
  )
}
