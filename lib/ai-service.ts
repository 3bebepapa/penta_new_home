import { GoogleGenerativeAI } from "@google/generative-ai"

export interface AIModelConfig {
  name: string
  type: "local" | "cloud"
  endpoint?: string
  apiKey?: string
  model: string
}

export class AIService {
  private gemini?: GoogleGenerativeAI
  private models: Map<string, AIModelConfig> = new Map()

  constructor() {
    this.initializeModels()
  }

  private initializeModels() {
    // Gemini 초기화 (서버 사이드에서만)
    if (typeof window === "undefined" && process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    }

    // 모델 등록
    this.models.set("penta-ai-core", {
      name: "Penta AI Core",
      type: "cloud",
      apiKey: process.env.GEMINI_API_KEY,
      model: "penta-ai-core-v2",
    })

    this.models.set("penta-ai-local", {
      name: "Penta AI Local",
      type: "local",
      endpoint: "http://localhost:11434",
      model: "penta-ai-local:latest",
    })
  }

  // 지능형 모델 라우팅
  async routeQuery(
    query: string,
    context?: string,
  ): Promise<{
    selectedModel: string
    response: string
    reasoning: string
  }> {
    // 쿼리 분석하여 최적 모델 선택
    const selectedModel = this.selectOptimalModel(query)

    let response: string
    let reasoning: string

    if (selectedModel === "penta-ai-core" && this.gemini) {
      response = await this.callPentaAICore(query, context)
      reasoning = "Penta AI Core 선택: 복잡한 추론 및 멀티모달 처리 최적화"
    } else {
      response = await this.callPentaAILocal(query, context)
      reasoning = "Penta AI Local 선택: 프라이버시 우선 및 빠른 응답"
    }

    return { selectedModel, response, reasoning }
  }

  private selectOptimalModel(query: string): string {
    // 키워드 기반 모델 선택 로직
    const complexKeywords = ["분석", "추론", "복잡한", "이미지", "그림", "사진"]
    const privateKeywords = ["개인", "프라이버시", "민감한", "보안"]

    if (privateKeywords.some((keyword) => query.includes(keyword))) {
      return "penta-ai-local"
    }

    if (complexKeywords.some((keyword) => query.includes(keyword))) {
      return "penta-ai-core"
    }

    // 기본값: 로컬 모델 (프라이버시 우선)
    return "penta-ai-local"
  }

  private async callPentaAICore(query: string, context?: string): Promise<string> {
    try {
      if (!this.gemini) throw new Error("Penta AI Core not initialized")

      const model = this.gemini.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

      const prompt = context ? `${context}\n\n사용자 질문: ${query}` : query

      const result = await model.generateContent(prompt)
      const response = await result.response

      return response.text()
    } catch (error) {
      console.error("Penta AI Core error:", error)
      throw error
    }
  }

  private async callPentaAILocal(query: string, context?: string): Promise<string> {
    try {
      // Penta AI Local 모델 호출 시뮬레이션
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "penta-ai-local:latest",
          prompt: context ? `${context}\n\n${query}` : query,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error("Penta AI Local not available")
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Penta AI Local error:", error)
      // 폴백: 시뮬레이션 응답
      return `[Penta AI Local 처리] ${query}에 대한 응답입니다.`
    }
  }

  // 멀티모달 처리
  async processMultimodal(text: string, imageData?: string, audioData?: string): Promise<string> {
    try {
      if (!this.gemini) throw new Error("Penta AI Core not initialized")

      const model = this.gemini.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

      const parts: any[] = [{ text }]

      if (imageData) {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData,
          },
        })
      }

      if (audioData) {
        parts.push({
          inlineData: {
            mimeType: "audio/wav",
            data: audioData,
          },
        })
      }

      const result = await model.generateContent(parts)
      const response = await result.response

      return response.text()
    } catch (error) {
      console.error("Multimodal processing error:", error)
      throw error
    }
  }
}

export const aiService = new AIService()
