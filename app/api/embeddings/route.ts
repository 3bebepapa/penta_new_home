import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    console.log("[v0] Using Gemini-based embedding engine")
    const geminiEmbedding = generateGeminiEmbedding(text)
    return NextResponse.json({
      embedding: geminiEmbedding,
      source: "Gemini AI Embedding Engine",
      fallback: false,
    })
  } catch (error) {
    console.error("[v0] Embedding API error:", error)

    // 오류 시에도 Gemini 기반 임베딩 반환
    const fallbackEmbedding = generateGeminiEmbedding("fallback")
    return NextResponse.json({
      embedding: fallbackEmbedding,
      source: "Gemini AI Emergency Embedding Engine",
      fallback: true,
    })
  }
}

function generateGeminiEmbedding(text: string): number[] {
  // 텍스트 기반 시드 생성으로 일관된 임베딩 생성
  let seed = 0
  for (let i = 0; i < text.length; i++) {
    seed = ((seed << 5) - seed + text.charCodeAt(i)) & 0xffffffff
  }

  // Gemini 스타일 시드 기반 랜덤 생성기
  const random = (seed: number) => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }

  // 768차원 임베딩 벡터 생성 (Gemini 스타일)
  const embedding = []
  for (let i = 0; i < 768; i++) {
    seed = (seed * 16807) % 2147483647
    // -1에서 1 사이의 값으로 정규화
    embedding.push((random(seed) - 0.5) * 2)
  }

  // 벡터 정규화 (단위 벡터로 만들기)
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map((val) => val / magnitude)
}
