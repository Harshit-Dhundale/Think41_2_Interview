"use client"

import React, { useEffect, useRef } from "react"
import { useChat } from "../context/ChatContext"
import ChatBubble from "./ChatBubble"
import styles from "./ChatWindow.module.css"

export default function ChatWindow() {
  const { messages, currentConversationId, isLoading } = useChat()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h3>
          {currentConversationId
            ? `Conversation ${currentConversationId.slice(-6)}`
            : "New Conversation"}
        </h3>
        <div className={styles.status}>
          <span className={styles.onlineDot} /> Online
        </div>
      </header>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.length === 0 && !isLoading && (
          <div className={styles.emptyState}>
            <div className={styles.welcomeIcon}>💬</div>
            <h3>Welcome to E-commerce Customer Support AI Chatbot</h3>
            <p>How can I help you with your clothing needs today?</p>
          </div>
        )}
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        {isLoading && <div className={styles.loader}>Typing…</div>}
        <div ref={endRef} />
      </div>
    </div>
  )
}
