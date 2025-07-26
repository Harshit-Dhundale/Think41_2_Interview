"use client"
import React, { useState } from "react"
import { useChat } from "../context/ChatContext"
import styles from "./InputArea.module.css"

export default function InputArea() {
  const [text, setText] = useState("")
  const { sendMessage, isLoading } = useChat()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    await sendMessage(text)
    setText("")
  }

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message…"
        disabled={isLoading}
      />
      <button className={styles.button} disabled={!text.trim() || isLoading}>
        Send
      </button>
    </form>
  )
}
