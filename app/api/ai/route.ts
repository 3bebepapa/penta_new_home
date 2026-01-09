import { type NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const { query, context, imageData, audioData, agentId } = await request.json()

    let result: any

    // 멀티모달 처리
    if (imageData || audioData) {
      const response = await aiService.processMultimodal(query, imageData, audioData)
      result = {
        response,
        selectedModel: "gemini-2.0-flash",
        reasoning: "멀티모달 입력으로 Gemini 사용",
      }
    } else {
      // 일반 텍스트 처리
      result = await aiService.routeQuery(query, context)
    }

    return NextResponse.json({
      ...result,
      agentId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI API error:", error)
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 })
  }
}
