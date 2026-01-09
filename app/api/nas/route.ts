import { type NextRequest, NextResponse } from "next/server"
import { nasEngine } from "@/lib/ai-engines/nas-engine"

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json()

    switch (action) {
      case "start_search":
        const candidates = nasEngine.evolveArchitectures(params.populationSize || 20)
        return NextResponse.json({
          candidates: candidates.slice(0, 10), // 상위 10개만 반환
          generation: nasEngine.getGeneration(),
          bestArchitecture: nasEngine.getBestArchitecture(),
        })

      case "get_best":
        return NextResponse.json({
          bestArchitecture: nasEngine.getBestArchitecture(),
          generation: nasEngine.getGeneration(),
        })

      case "generate_random":
        const randomArch = nasEngine.generateRandomArchitecture()
        return NextResponse.json({ architecture: randomArch })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("NAS API error:", error)
    return NextResponse.json({ error: "NAS operation failed" }, { status: 500 })
  }
}
