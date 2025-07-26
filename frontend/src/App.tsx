"use client"
import { Toaster } from "react-hot-toast"
import { ChatProvider } from "./context/ChatContext"
import ConversationPanel from "./components/ConversationPanel"
import ChatWindow from "./components/ChatWindow"
import InputArea from "./components/InputArea"

function App() {
  return (
    <ChatProvider>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
        {/* Header */}
        <header style={{
            background: "var(--panel-bg)",
            borderBottom: "1px solid var(--border)",
            padding: "1rem 1.5rem",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
                width: "2rem",
                height: "2rem",
                background: "#6366F1",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              {/* Cart Icon */}
              <svg
                className="icon"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--fg)" }}>
              E-Commerce Customer Support Chatbot
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Sidebar */}
          <div style={{ display: "none" }} className="lg:block">
            <ConversationPanel />
          </div>
          <div style={{ display: "block" }} className="lg:hidden">
            <ConversationPanel />
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <ChatWindow />
            <InputArea />
          </div>
        </div>

        <Toaster position="top-right" />
      </div>
    </ChatProvider>
  )
}

export default App
