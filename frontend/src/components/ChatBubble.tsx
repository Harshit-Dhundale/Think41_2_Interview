"use client"
import React from "react"
import type { Message } from "../types"
import styles from "./ChatBubble.module.css"

export default function ChatBubble({ message }: { message: Message }) {
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(message.timestamp))

  if (message.role === "system") {
    return (
      <div className={styles.system}>
        {message.content}
      </div>
    )
  }

  const isUser = message.role === "user"
  return (
    <div className={isUser ? styles.userRow : styles.aiRow}>
      <div className={isUser ? styles.userBubble : styles.aiBubble}>
        <p>{message.content}</p>
        <span className={styles.timestamp}>{time}</span>
      </div>
    </div>
  )
}
