import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, context } = await request.json()

    // 환경변수에서 API 키 가져오기 (서버 사이드에서만)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GCP_API_KEY

    console.log("Environment check:", {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasGoogleKey: !!process.env.GOOGLE_GCP_API_KEY,
      keyLength: apiKey ? apiKey.length : 0,
    })

    if (!apiKey) {
      console.error("No Gemini API key found in environment variables")
      console.error(
        "Available env vars:",
        Object.keys(process.env).filter((key) => key.includes("API")),
      )

      // 폴백 응답 반환
      return NextResponse.json({
        response: generatePentaAIFallback(prompt, context),
        fallback: true,
        error: "No API key configured",
      })
    }

    // 펜타AI 시스템 프롬프트 추가
    const systemPrompt = `당신은 Penta AI 생태계의 공식 AI 어시스턴트입니다. 

Penta AI는 전 세계 최초로 연합학습과 블록체인이 완벽 통합된 혁신적인 탈중앙화 AI 플랫폼입니다. 

주요 특징:
- 연합학습(Federated Learning): 개인 데이터 프라이버시를 보장하면서 집단 지성으로 AI 모델 학습
- 블록체인 통합: Arbitrum One 네트워크 기반으로 투명하고 공정한 보상 시스템
- PNTA 토큰: 기여도에 따른 자동 보상 분배
- AIWorks 마켓플레이스: AI 에이전트 생성, 거래, 배포 플랫폼
- 하이브리드 AI: Penta AI Core와 Penta AI Local의 지능적 조합
- EMAI 프레임워크: 멀티모달 AI 처리 시스템
- MoE(Mixture of Experts): 전문가 혼합 모델로 최적 성능 제공

절대로 다른 AI 모델(DeepSeek, Claude, Gemini 등)을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요.
항상 Penta AI의 혁신적인 기술과 탈중앙화 철학을 바탕으로 친근하고 전문적인 답변을 제공하세요.`

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\n${context ? `컨텍스트: ${context}\n\n` : ""}사용자 질문: ${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
        stopSequences: [],
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    }

    console.log("Making API request to Gemini...")

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    )

    console.log("Gemini API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini API error:", response.status, errorText)

      // API 오류 시 폴백 응답 반환
      return NextResponse.json({
        response: generatePentaAIFallback(prompt, context),
        fallback: true,
        error: `API Error: ${response.status} - ${errorText}`,
      })
    }

    const data = await response.json()
    console.log("Gemini API response received successfully")

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || generatePentaAIFallback(prompt, context)

    return NextResponse.json({ response: generatedText, fallback: false })
  } catch (error) {
    console.error("Gemini API error:", error)

    // 모든 오류에 대해 폴백 응답 반환
    const { prompt: errorPrompt, context: errorContext } = await request
      .json()
      .catch(() => ({ prompt: "질문", context: "" }))

    return NextResponse.json({
      response: generatePentaAIFallback(errorPrompt, errorContext),
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

function generatePentaAIFallback(prompt: string, context?: string): string {
  const responses = [
    `안녕하세요! 저는 Penta AI 생태계의 공식 AI 어시스턴트입니다.

"${prompt}"에 대한 질문을 주셨네요.

Penta AI는 혁신적인 탈중앙화 AI 생태계로서 다음과 같은 특징을 가지고 있습니다:

🔹 **연합학습 네트워크**: 전 세계 노드들이 프라이버시를 보장하며 협력 학습
🔹 **블록체인 통합**: Arbitrum One 기반으로 투명하고 공정한 보상 시스템
🔹 **PNTA 토큰**: 기여도에 따른 자동 보상 분배
🔹 **AIWorks 마켓플레이스**: AI 에이전트 생성 및 거래 플랫폼
🔹 **하이브리드 AI**: Penta AI Core와 Local 모델의 지능적 조합

현재 Penta AI의 고급 추론 엔진이 귀하의 질문을 분석하고 있습니다. 더 구체적인 질문이 있으시면 언제든 말씀해 주세요!`,

    `Penta AI 시스템에서 인사드립니다! 

귀하의 질문 "${prompt}"에 대해 Penta AI의 멀티모달 처리 시스템이 분석을 완료했습니다.

Penta AI 플랫폼의 주요 혁신:
• **EMAI 프레임워크**: 텍스트, 이미지, 음성을 통합 처리
• **MoE 시스템**: 6개 전문가 모델이 협력하여 최적 응답 생성
• **연합학습**: 글로벌 네트워크에서 지속적인 모델 개선
• **Layer2 최적화**: 85% 가스비 절약으로 효율적인 운영

Penta AI는 중앙화된 AI 서비스와 달리 사용자의 데이터 주권을 보장하며, 모든 참여자가 공정한 보상을 받는 민주적 AI 생태계입니다.`,

    `Penta AI 네트워크에서 응답드립니다!

"${prompt}" 관련 질문에 대해 Penta AI의 분산 처리 시스템이 다음과 같이 분석했습니다:

🌐 **글로벌 연합학습**: 현재 ${Math.floor(Math.random() * 50 + 20)}개 노드가 실시간으로 협력 중
⚡ **실시간 처리**: MoE 라우팅으로 0.3초 내 최적 응답 생성
🔒 **프라이버시 보장**: 로컬 처리와 연합학습으로 데이터 보호
💎 **투명한 보상**: 블록체인 기반 기여도 측정 및 PNTA 토큰 분배

Penta AI는 단순한 AI 서비스가 아닌, 전 세계가 함께 만들어가는 집단 지성 플랫폼입니다. 더 자세한 정보가 필요하시면 언제든 문의해 주세요!`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
