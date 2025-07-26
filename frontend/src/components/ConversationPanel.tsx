"use client"
import React, { useState, useEffect } from "react"
import { useChat } from "../context/ChatContext"
import styles from "./ConversationPanel.module.css"

export default function ConversationPanel() {
  const {
    conversations,
    currentConversationId,
    loadConversation,
    createNewChat,
    userId,
    searchConversations,
  } = useChat()

  const [q, setQ] = useState("")
  const [mounted, setMounted] = useState(false)

  // Mark when we've hydrated on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  const filtered = searchConversations(q)

  return (
    <aside className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2>Conversations</h2>
          <small>{userId}</small>
        </div>
        <button onClick={createNewChat}>New Chat</button>
      </div>

      {/* Search */}
      <input
        className={styles.search}
        placeholder="Search…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* Only render the list after client mount */}
      {mounted && (
        <ul className={styles.list}>
          {filtered.length === 0 && (
            <li className={styles.empty}>No conversations</li>
          )}
          {filtered.map((c) => (
            <li
              key={c.id}
              className={c.id === currentConversationId ? styles.active : ""}
              onClick={() => loadConversation(c.id)}
            >
              <p>{c.preview}</p>
              <small>{c.date.toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
