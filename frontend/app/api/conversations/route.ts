import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id parameter" }, { status: 400 })
    }

    // Mock conversations data
    const conversations = [
      {
        id: `conv_${Date.now() - 86400000}_${userId}`,
        preview: "I need help with my recent order...",
        date: new Date(Date.now() - 86400000),
        messages: [],
      },
      {
        id: `conv_${Date.now() - 172800000}_${userId}`,
        preview: "Do you have this jacket in size medium?",
        date: new Date(Date.now() - 172800000),
        messages: [],
      },
    ]

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Conversations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
