import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { agentId, query, context } = await request.json()

    // AI 에이전트별 특화 처리
    const agentResponse = await processAgentQuery(agentId, query, context)

    return NextResponse.json({
      response: agentResponse,
      agentId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Agent Brain error:", error)
    return NextResponse.json({ error: "Agent processing failed" }, { status: 500 })
  }
}

async function processAgentQuery(agentId: string, query: string, context?: string): Promise<string> {
  // Gemini API 키 확인
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return `[에이전트 ${agentId}] 시뮬레이션 모드에서 "${query}"에 대한 응답을 생성했습니다.`
  }

  try {
    // 실제 Gemini API 호출
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: context ? `${context}\n\n사용자 질문: ${query}` : query,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("Agent processing error:", error)
    return `[에이전트 ${agentId}] 처리 중 오류가 발생했습니다: ${query}`
  }
}
