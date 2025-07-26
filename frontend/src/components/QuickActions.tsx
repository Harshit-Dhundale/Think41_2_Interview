"use client"
import React from "react"
import styles from "./QuickActions.module.css"

export default function QuickActions({
  onActionClick,
}: {
  onActionClick: (query: string) => void
}) {
  const actions = [
    { label: "Order Status", query: "What’s the status of order ID 12345?" },
    { label: "Check Stock", query: "How many Classic T-Shirts are left in stock?" },
    { label: "Top Products", query: "Top 5 most sold products?" },
    { label: "Shipping Help", query: "When will my order arrive?" },
  ]

  return (
    <div className={styles.container}>
      {actions.map((a) => (
        <button
          key={a.label}
          className={styles.btn}
          onClick={() => onActionClick(a.query)}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}
