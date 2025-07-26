import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const conversationId = params.id

    // Mock conversation data
    const conversation = {
      id: conversationId,
      messages: [
        {
          id: "1",
          role: "user",
          content: "I need help with my recent order",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: "2",
          role: "system",
          content: "Query Type: Order Status",
          timestamp: new Date(Date.now() - 3599000),
        },
        {
          id: "3",
          role: "ai",
          content: "I'd be happy to help you with your order! Could you please provide your order number?",
          timestamp: new Date(Date.now() - 3598000),
        },
      ],
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Conversation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
