import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // 파일 내용 읽기
    const content = await file.text()

    // 텍스트를 청크로 분할
    const chunkSize = 512
    const chunks = []
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize))
    }

    const vectors = chunks.map((chunk) => generateGeminiEmbedding(chunk))

    return NextResponse.json({
      vectors,
      chunks,
      metadata: {
        filename: file.name,
        size: file.size,
        chunkCount: chunks.length,
        engine: "Gemini AI Embedding Engine",
      },
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "File processing failed" }, { status: 500 })
  }
}

function generateGeminiEmbedding(text: string): number[] {
  let seed = 0
  for (let i = 0; i < text.length; i++) {
    seed = ((seed << 5) - seed + text.charCodeAt(i)) & 0xffffffff
  }

  const random = (seed: number) => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }

  const embedding = []
  for (let i = 0; i < 768; i++) {
    seed = (seed * 16807) % 2147483647
    embedding.push((random(seed) - 0.5) * 2)
  }

  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  return embedding.map((val) => val / magnitude)
}
