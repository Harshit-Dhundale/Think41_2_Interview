import { type NextRequest, NextResponse } from "next/server"

// Mock function to simulate AI response
const generateAIResponse = (message: string, userId: string) => {
  // Simple query type detection
  const queryType = detectQueryType(message)

  // Mock responses based on query type
  const responses = {
    "Order Status": `I'd be happy to help you check your order status! Could you please provide your order number? You can find it in your confirmation email or account dashboard.`,
    "Inventory Check": `I can help you check product availability. Which specific item are you looking for? Please provide the product name or SKU.`,
    "Shipping Help": `I'm here to help with shipping questions! Are you asking about shipping costs, delivery times, or tracking an existing shipment?`,
    "General Inquiry": `Thank you for contacting E-commerce_Chatbot! I'm here to help with any questions about our clothing, orders, or services. How can I assist you today?`,
  }

  return {
    message: responses[queryType as keyof typeof responses] || responses["General Inquiry"],
    queryType,
    conversationId: `conv_${Date.now()}_${userId}`,
  }
}

const detectQueryType = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("order") || lowerMessage.includes("tracking") || lowerMessage.includes("status")) {
    return "Order Status"
  }
  if (lowerMessage.includes("stock") || lowerMessage.includes("available") || lowerMessage.includes("inventory")) {
    return "Inventory Check"
  }
  if (lowerMessage.includes("shipping") || lowerMessage.includes("delivery") || lowerMessage.includes("ship")) {
    return "Shipping Help"
  }

  return "General Inquiry"
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, conversation_id, message } = await request.json()

    if (!user_id || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = generateAIResponse(message, user_id)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
