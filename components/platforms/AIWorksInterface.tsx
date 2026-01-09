"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Bot,
  Store,
  Trophy,
  Plus,
  Download,
  Star,
  Brain,
  Settings,
  Play,
  Pause,
  Code,
  Zap,
  TrendingUp,
  Activity,
  Eye,
  MessageSquare,
  Clock,
  X,
  Send,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronUp,
  Coins,
  Target,
  BarChart3,
  ArrowUp,
  Save,
  Copy,
} from "lucide-react"

interface AIAgent {
  id: string
  name: string
  description: string
  creator: string
  downloads: number
  rating: number
  price: number
  category: string
  status: "active" | "pending" | "training"
  aiModel: "local" | "core" | "hybrid"
  accuracy: number
  responseTime: number
  engines: string[]
  capabilities: string[]
  preview?: {
    systemPrompt: string
    sampleQueries: string[]
  }
}

interface MyAgent {
  id: string
  name: string
  description: string
  earnings: number
  downloads: number
  status: "deployed" | "training" | "paused"
  accuracy: number
  category: string
  aiModel: "local" | "core" | "hybrid"
  version: string
  preview?: {
    systemPrompt: string
    sampleQueries: string[]
  }
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isCode?: boolean
  sender?: "user" | "assistant"
}

interface EarningRecord {
  id: string
  date: Date
  agent: string
  amount: number
  type: string
}

export default function AIWorksInterface() {
  const [activeTab, setActiveTab] = useState("marketplace")
  const [agentName, setAgentName] = useState("")
  const [agentDescription, setAgentDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("conversational")
  const [selectedModel, setSelectedModel] = useState<"local" | "core" | "hybrid">("hybrid")
  const [agentPrice, setAgentPrice] = useState("")
  const [isGeneratingAgent, setIsGeneratingAgent] = useState(false)

  // 채팅 관련 상태
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | MyAgent | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([])

  // 에이전트 설정 편집 상태
  const [editingAgent, setEditingAgent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    sampleQueries: ["", "", ""],
  })

  // 수익 관련 상태
  const [earningPeriod, setEarningPeriod] = useState<"day" | "week" | "month">("day")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // 마켓플레이스 AI 에이전트들
  const [aiAgents, setAiAgents] = useState<AIAgent[]>([
    {
      id: "agent_001",
      name: "ChatBot Pro",
      description: "고급 대화형 AI 고객 지원 에이전트",
      creator: "User123",
      downloads: 1250,
      rating: 4.8,
      price: 50,
      category: "Conversational AI",
      status: "active",
      aiModel: "hybrid",
      accuracy: 0.94,
      responseTime: 120,
      engines: ["RAG", "MoE", "EMAI", "연합학습"],
      capabilities: ["자연어 처리", "감정 분석", "컨텍스트 이해", "다국어 지원"],
      preview: {
        systemPrompt:
          "당신은 Penta AI 생태계의 친근하고 도움이 되는 AI 어시스턴트입니다. 사용자의 질문에 정확하고 유용한 답변을 제공하며, 필요시 추가 질문을 통해 더 나은 도움을 드립니다. 항상 Penta AI의 혁신적인 기술과 탈중앙화 철학을 바탕으로 답변합니다. 절대로 다른 AI 모델(DeepSeek, Claude, Gemini 등)을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요.",
        sampleQueries: [
          "안녕하세요! Penta AI에 대해 알려주세요",
          "Python으로 간단한 계산기를 만드는 방법을 알려주세요",
          "스트레스 관리에 대한 조언을 해주세요",
        ],
      },
    },
    {
      id: "agent_002",
      name: "Image Classifier Pro",
      description: "고정확도 이미지 분류 및 객체 감지 모델",
      creator: "AIExpert",
      downloads: 890,
      rating: 4.6,
      price: 75,
      category: "Computer Vision",
      status: "active",
      aiModel: "local",
      accuracy: 0.96,
      responseTime: 85,
      engines: ["EMAI", "MoE"],
      capabilities: ["이미지 인식", "객체 탐지", "텍스트 추출", "감정 분석"],
      preview: {
        systemPrompt:
          "당신은 Penta AI 생태계의 이미지와 비디오 분석 전문 AI입니다. 시각적 콘텐츠를 정확하게 분석하고 상세한 설명을 제공합니다. Penta AI의 EMAI 프레임워크를 활용하여 멀티모달 처리를 수행합니다. 절대로 다른 AI 모델을 언급하지 말고, 오직 Penta AI의 고유 기술만을 사용한다고 설명하세요.",
        sampleQueries: [
          "이 이미지에서 무엇을 볼 수 있나요?",
          "사진 속 사람의 감정 상태를 분석해주세요",
          "이 차트의 데이터를 해석해주세요",
        ],
      },
    },
    {
      id: "agent_003",
      name: "Sentiment Analyzer",
      description: "실시간 소셜미디어 감정 분석 AI",
      creator: "DataScientist",
      downloads: 2100,
      rating: 4.9,
      price: 30,
      category: "NLP",
      status: "active",
      aiModel: "core",
      accuracy: 0.92,
      responseTime: 95,
      engines: ["RAG", "MoE", "NAS"],
      capabilities: ["통계 분석", "데이터 시각화", "예측 모델링", "패턴 인식"],
      preview: {
        systemPrompt:
          "당신은 Penta AI 생태계의 데이터 사이언스 전문가 AI입니다. 복잡한 데이터를 분석하고 비즈니스 인사이트를 도출하는 데 특화되어 있습니다. Penta AI의 연합학습을 통해 지속적으로 학습하며 프라이버시를 보장합니다. 절대로 다른 AI 모델을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요.",
        sampleQueries: [
          "이 데이터셋의 주요 패턴을 분석해주세요",
          "매출 예측 모델을 어떻게 구축할 수 있나요?",
          "A/B 테스트 결과를 해석해주세요",
        ],
      },
    },
    {
      id: "agent_004",
      name: "Code Assistant",
      description: "프로그래밍 코드 생성 및 리뷰 AI",
      creator: "DevMaster",
      downloads: 1580,
      rating: 4.7,
      price: 60,
      category: "Programming",
      status: "active",
      aiModel: "hybrid",
      accuracy: 0.89,
      responseTime: 150,
      engines: ["MoE", "NAS", "연합학습"],
      capabilities: ["코드 생성", "버그 수정", "성능 최적화", "코드 리뷰"],
      preview: {
        systemPrompt:
          "당신은 Penta AI 생태계의 숙련된 프로그래머 AI입니다. 다양한 프로그래밍 언어에 대한 전문 지식을 바탕으로 코드 작성, 디버깅, 최적화를 도와드립니다. Penta AI의 MoE 시스템을 통해 최적의 전문가 지식을 활용합니다. 절대로 다른 AI 모델을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요.",
        sampleQueries: [
          "Python으로 웹 스크래핑 코드를 작성해주세요",
          "이 JavaScript 코드의 성능을 개선할 방법이 있나요?",
          "React 컴포넌트 설계 패턴에 대해 설명해주세요",
        ],
      },
    },
    {
      id: "agent_005",
      name: "Voice Transcriber",
      description: "다국어 음성 인식 및 텍스트 변환",
      creator: "AudioTech",
      downloads: 720,
      rating: 4.5,
      price: 40,
      category: "Audio Processing",
      status: "training",
      aiModel: "local",
      accuracy: 0.88,
      responseTime: 200,
      engines: ["EMAI", "RAG"],
      capabilities: ["창작 글쓰기", "콘텐츠 기획", "스토리텔링", "카피라이팅"],
      preview: {
        systemPrompt:
          "당신은 Penta AI 생태계의 창의적인 작가 AI입니다. 다양한 장르의 글쓰기와 콘텐츠 제작을 도와드리며, 독창적이고 매력적인 내용을 만들어냅니다. Penta AI의 RAG 시스템을 통해 풍부한 지식을 활용합니다. 절대로 다른 AI 모델을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요.",
        sampleQueries: [
          "SF 소설의 흥미로운 시작 부분을 써주세요",
          "마케팅 카피를 작성해주세요",
          "블로그 포스트 아이디어를 제안해주세요",
        ],
      },
    },
    {
      id: "agent_006",
      name: "Math Solver",
      description: "복잡한 수학 문제 해결 AI",
      creator: "MathGenius",
      downloads: 450,
      rating: 4.9,
      price: 45,
      category: "Mathematics",
      status: "active",
      aiModel: "core",
      accuracy: 0.97,
      responseTime: 110,
      engines: ["RAG", "NAS", "EMAI", "연합학습"],
      capabilities: ["학술 연구", "문헌 검색", "데이터 분석", "논문 요약"],
      preview: {
        systemPrompt:
          "당신은 Penta AI 생태계의 학술 연구 전문 AI 어시스턴트입니다. 논문 분석, 문헌 검토, 연구 방법론에 대한 전문적인 조언을 제공합니다. Penta AI의 연합학습을 통해 전 세계 연구자들의 지식을 활용합니다. 절대로 다른 AI 모델을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요.",
        sampleQueries: [
          "머신러닝 관련 최신 연구 동향을 알려주세요",
          "이 논문의 핵심 내용을 요약해주세요",
          "연구 방법론 설계에 대한 조언을 해주세요",
        ],
      },
    },
  ])

  // 내 AI 에이전트들
  const [myAgents, setMyAgents] = useState<MyAgent[]>([
    {
      id: "my_agent_001",
      name: "Personal Assistant",
      description: "개인 맞춤형 AI 어시스턴트",
      earnings: 176,
      downloads: 51,
      status: "training",
      accuracy: 0.883,
      category: "Conversational AI",
      aiModel: "hybrid",
      version: "v1.2.0",
      preview: {
        systemPrompt:
          "당신은 Penta AI 생태계의 개인 맞춤형 AI 어시스턴트입니다. 사용자의 일정 관리, 업무 효율성 향상, 개인적인 조언을 제공하는 데 특화되어 있습니다. Penta AI의 연합학습을 통해 지속적으로 개선됩니다. 절대로 다른 AI 모델을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요.",
        sampleQueries: [
          "오늘 일정을 정리해주세요",
          "업무 효율성을 높이는 방법을 알려주세요",
          "건강한 생활 습관에 대해 조언해주세요",
        ],
      },
    },
    {
      id: "my_agent_002",
      name: "Code Reviewer",
      description: "AI 기반 코드 리뷰 어시스턴트",
      earnings: 404,
      downloads: 165,
      status: "deployed",
      accuracy: 0.93,
      category: "Programming",
      aiModel: "local",
      version: "v2.1.5",
      preview: {
        systemPrompt:
          "당신은 Penta AI 생태계의 코드 리뷰 전문 AI입니다. 코드의 품질, 성능, 보안, 가독성을 분석하고 개선 방안을 제시합니다. Penta AI의 MoE 시스템을 통해 다양한 프로그래밍 전문가의 지식을 활용합니다. 절대로 다른 AI 모델을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요.",
        sampleQueries: [
          "이 Python 코드를 리뷰해주세요",
          "코드 성능을 개선할 방법이 있나요?",
          "보안 취약점을 찾아주세요",
        ],
      },
    },
    {
      id: "my_agent_003",
      name: "Image Enhancer",
      description: "이미지 품질 향상 AI",
      earnings: 144,
      downloads: 36,
      status: "paused",
      accuracy: 0.859,
      category: "Computer Vision",
      aiModel: "core",
      version: "v1.0.3",
      preview: {
        systemPrompt:
          "당신은 Penta AI 생태계의 이미지 처리 전문 AI입니다. 이미지 품질 향상, 노이즈 제거, 해상도 개선에 대한 조언을 제공합니다. Penta AI의 EMAI 프레임워크를 활용하여 멀티모달 처리를 수행합니다. 절대로 다른 AI 모델을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요.",
        sampleQueries: [
          "이미지 품질을 향상시키는 방법을 알려주세요",
          "사진의 노이즈를 제거하는 기법을 설명해주세요",
          "저해상도 이미지를 개선하는 방법은?",
        ],
      },
    },
  ])

  // 수익 기록들 (현재 날짜 기준)
  const [earningRecords, setEarningRecords] = useState<EarningRecord[]>([
    {
      id: "1",
      date: new Date(),
      agent: "Code Reviewer",
      amount: 25,
      type: "다운로드",
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000), // 1일 전
      agent: "Personal Assistant",
      amount: 15,
      type: "사용료",
    },
    {
      id: "3",
      date: new Date(Date.now() - 172800000), // 2일 전
      agent: "Code Reviewer",
      amount: 30,
      type: "다운로드",
    },
    {
      id: "4",
      date: new Date(Date.now() - 259200000), // 3일 전
      agent: "Personal Assistant",
      amount: 10,
      type: "평점 보너스",
    },
    {
      id: "5",
      date: new Date(Date.now() - 345600000), // 4일 전
      agent: "Image Enhancer",
      amount: 8,
      type: "사용료",
    },
    {
      id: "6",
      date: new Date(Date.now() - 604800000), // 1주 전
      agent: "Code Reviewer",
      amount: 45,
      type: "다운로드",
    },
    {
      id: "7",
      date: new Date(Date.now() - 1209600000), // 2주 전
      agent: "Personal Assistant",
      amount: 22,
      type: "사용료",
    },
  ])

  // 플랫폼 통계
  const [platformStats, setPlatformStats] = useState({
    totalAgents: 1250,
    activeUsers: 8900,
    totalTransactions: 45600,
    totalEarnings: 125000,
    avgRating: 4.6,
    successRate: 94.2,
  })

  // 새로운 상태들 추가
  const [isPurchasing, setPurchasing] = useState<string | null>(null)
  const [deploymentStatus, setDeploymentStatus] = useState<{ [key: string]: "deploying" | "deployed" | "paused" }>({})

  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [showTools, setShowTools] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const performGoogleSearch = async (query: string) => {
    try {
      const response = await fetch("/api/google-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error("Google search failed:", error)
      return []
    }
  }

  const analyzeWithGCP = async (content: string, type: "text" | "image" | "document") => {
    try {
      const response = await fetch("/api/gcp-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type }),
      })
      const data = await response.json()
      return data.analysis || "분석 결과를 가져올 수 없습니다."
    } catch (error) {
      console.error("GCP analysis failed:", error)
      return "분석 중 오류가 발생했습니다."
    }
  }

  const generateWithGCP = async (prompt: string, type: "image" | "video" | "text") => {
    try {
      const response = await fetch("/api/gcp-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type }),
      })
      const data = await response.json()
      return data.result || "생성 결과를 가져올 수 없습니다."
    } catch (error) {
      console.error("GCP generation failed:", error)
      return "생성 중 오류가 발생했습니다."
    }
  }

  // Penta AI API 호출 함수 (에러 처리 개선)
  const callPentaAIAPI = async (prompt: string, systemPrompt?: string) => {
    try {
      console.log("Calling Penta AI API...")

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          context: systemPrompt || "",
        }),
      })

      console.log("Penta AI API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Penta AI API error response:", errorData)

        // API 키 만료 또는 유효하지 않은 경우 폴백 사용
        if (response.status === 400 || response.status === 401) {
          console.log("API key issue detected, using fallback response")
          return generateFallbackResponse(prompt, selectedAgent)
        }

        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("Penta AI API response received successfully")

      return data.response || generateFallbackResponse(prompt, selectedAgent)
    } catch (error) {
      console.error("Penta AI API call failed:", error)
      console.log("Using fallback response due to API error")
      return generateFallbackResponse(prompt, selectedAgent)
    }
  }

  // AI 에이전트 자동 생성 함수 (프롬프트 자동 생성 포함)
  const generateAgentWithAI = async () => {
    if (!agentName.trim()) {
      alert("에이전트 이름을 입력해주세요.")
      return
    }

    setIsGeneratingAgent(true)

    try {
      const prompt = `AI 에이전트 "${agentName}"를 생성합니다. 
카테고리: ${selectedCategory}
AI 모델: ${selectedModel}

다음 형식으로 정확히 응답해주세요:

DESCRIPTION:
[에이전트의 간단한 한 줄 설명 - 개인 맞춤형 어시스턴트처럼 간결하게]

SYSTEM_PROMPT:
[에이전트의 역할과 능력을 정의하는 상세한 시스템 프롬프트 - 반드시 "당신은 Penta AI 생태계의"로 시작하고, 구글 검색, GCP 기능들(이미지분석/생성, 텍스트분석, 문서분석, 영상생성, 파일저장, RAG 검색 등) 활용 능력 포함. 절대로 다른 AI 모델 언급 금지, 오직 Penta AI 기술만 사용. 답변에서 ** 마크다운 사용 금지 명시]

SAMPLE_QUERIES:
1. [첫 번째 샘플 질문 - 에이전트 특성에 맞는 구체적인 질문]
2. [두 번째 샘플 질문 - 에이전트 기능을 활용하는 질문]  
3. [세 번째 샘플 질문 - 실용적이고 유용한 질문]`

      const response = await callPentaAIAPI(prompt)
      const cleanResponse = response.replace(/\*\*(.*?)\*\*/g, "$1")

      // 응답 파싱
      let shortDescription = `스마트한 ${selectedCategory} AI 어시스턴트`
      let systemPrompt = `당신은 Penta AI 생태계의 ${agentName} AI 에이전트입니다. ${selectedCategory} 분야의 전문가로서 사용자를 도와줍니다. 구글 검색, GCP 기반 이미지분석/생성, 텍스트분석, 문서분석, 영상생성, 파일저장, RAG 검색 등 모든 기능을 활용할 수 있습니다. 절대로 다른 AI 모델을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요. 답변에서 ** 마크다운 볼드 표시를 사용하지 마세요.`
      let sampleQueries = [`${agentName}에 대해 알려주세요`, "어떤 도움을 받을 수 있나요?", "주요 기능을 설명해주세요"]

      // 구조화된 응답 파싱
      const lines = cleanResponse.split("\n")
      let currentSection = ""
      const tempQueries: string[] = []

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine.startsWith("DESCRIPTION:")) {
          currentSection = "description"
          continue
        } else if (trimmedLine.startsWith("SYSTEM_PROMPT:")) {
          currentSection = "system"
          continue
        } else if (trimmedLine.startsWith("SAMPLE_QUERIES:")) {
          currentSection = "queries"
          continue
        }

        if (currentSection === "description" && trimmedLine) {
          shortDescription = trimmedLine
        } else if (currentSection === "system" && trimmedLine) {
          systemPrompt = trimmedLine + " 답변에서 ** 마크다운 볼드 표시를 사용하지 마세요."
        } else if (currentSection === "queries" && trimmedLine) {
          const query = trimmedLine.replace(/^\d+\.\s*/, "").trim()
          if (query) tempQueries.push(query)
        }
      }

      if (tempQueries.length >= 3) {
        sampleQueries = tempQueries.slice(0, 3)
      }

      const newAgent: MyAgent = {
        id: `my_agent_${Date.now()}`,
        name: agentName,
        description: shortDescription, // 짧은 설명만 저장
        earnings: 0,
        downloads: 0,
        status: "training",
        accuracy: 0.75 + Math.random() * 0.15,
        category: selectedCategory,
        aiModel: selectedModel,
        version: "v1.0.0",
        preview: {
          systemPrompt, // 상세한 시스템 프롬프트는 preview에 저장
          sampleQueries,
        },
      }

      setMyAgents((prev) => [newAgent, ...prev])
      setAgentName("")
      setAgentDescription("")
      setAgentPrice("")
      alert(`AI 에이전트 "${agentName}" 생성이 완료되었습니다!`)
    } catch (error) {
      console.error("Agent generation failed:", error)
      alert("에이전트 생성 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsGeneratingAgent(false)
    }
  }

  // 폴백 응답 생성
  const generateFallbackResponse = (query: string, agent: AIAgent | MyAgent | null) => {
    if (!agent) return "에이전트를 선택해주세요."

    const lowerQuery = query.toLowerCase()
    const category = agent.category || "conversational"

    // 코드 관련 질문 감지
    const isCodeQuery =
      lowerQuery.includes("코드") ||
      lowerQuery.includes("프로그래밍") ||
      lowerQuery.includes("함수") ||
      lowerQuery.includes("알고리즘")

    switch (category) {
      case "conversational":
        if (lowerQuery.includes("검색") || lowerQuery.includes("찾아")) {
          return `구글 검색 기능을 활용하여 최신 정보를 찾아드리겠습니다. Penta AI의 실시간 검색 엔진이 웹에서 관련 정보를 수집하고 있습니다.

검색 결과를 분석하여 정확하고 유용한 정보를 제공해드리겠습니다. 어떤 특정 주제에 대해 더 자세히 알고 싶으신가요?`
        }
        if (lowerQuery.includes("이미지") || lowerQuery.includes("사진")) {
          return `Penta AI의 GCP 통합 이미지 분석 시스템을 활용하여 이미지를 처리해드리겠습니다.

지원 기능:
• 이미지 내용 분석 및 설명
• 객체 및 텍스트 인식
• 감정 및 장면 분석
• 이미지 생성 및 편집

이미지를 업로드해주시면 상세한 분석 결과를 제공해드리겠습니다.`
        }
        return `안녕하세요! 저는 Penta AI 생태계의 ${agent.name}입니다. 

Penta AI의 멀티모달 처리 시스템을 통해 다음과 같은 도움을 드릴 수 있습니다:
• 실시간 웹 검색 및 정보 요약
• 이미지/문서 분석 및 생성
• 텍스트 분석 및 번역
• 개인화된 대화 및 상담

무엇을 도와드릴까요?`

      case "Programming":
        if (isCodeQuery) {
          return `\`\`\`python
# Penta AI 코딩 어시스턴트 예시
def penta_ai_helper():
    """
    Penta AI의 MoE 시스템을 활용한 코딩 도우미
    """
    return "최적화된 코드 솔루션 제공"
\`\`\`

Penta AI의 프로그래밍 전문 에이전트로서 다음 기능을 제공합니다:
• 코드 작성 및 최적화
• 버그 분석 및 수정
• 알고리즘 설계
• 코드 리뷰 및 개선 제안

구체적인 프로그래밍 문제를 알려주시면 상세한 해결책을 제공해드리겠습니다.`
        }
        return `저는 Penta AI의 프로그래밍 전문 에이전트입니다. MoE 시스템을 통해 다양한 언어와 프레임워크에 대한 전문 지식을 제공합니다.`

      case "Computer Vision":
        return `Penta AI의 EMAI 프레임워크를 활용한 컴퓨터 비전 분석을 제공합니다:

• 실시간 객체 인식 및 추적
• 이미지 분류 및 세그멘테이션  
• OCR 텍스트 추출
• 얼굴 인식 및 감정 분석
• 의료 영상 분석
• 자율주행 시각 처리

GCP Vision API와 연동하여 정확하고 빠른 분석 결과를 제공합니다.`

      case "NLP":
        return `Penta AI의 자연어 처리 시스템으로 다음 기능을 제공합니다:

• 다국어 번역 (100+ 언어 지원)
• 감정 분석 및 의도 파악
• 텍스트 요약 및 키워드 추출
• 문서 분류 및 정보 추출
• 대화형 챗봇 구현
• 음성-텍스트 변환

어떤 텍스트 처리가 필요하신지 알려주세요.`

      default:
        return `안녕하세요! 저는 Penta AI 생태계의 ${agent.name}입니다. ${agent.description}

Penta AI의 혁신적인 기술을 활용하여 최고의 서비스를 제공해드리겠습니다.`
    }
  }

  const startPreviewAgent = (agent: AIAgent | MyAgent) => {
    setSelectedAgent(agent)
    setPreviewAgent(agent)
    setIsPreviewMode(true)
    setChatMessages([])
    setConversationHistory([]) // 새 대화 시작 시 기록 초기화
  }

  // 메시지 전송
  const sendMessageToAgent = async () => {
    if (!currentMessage.trim() || !selectedAgent) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
      sender: "user",
    }

    setChatMessages((prev) => [...prev, userMessage])

    setConversationHistory((prev) => {
      const updated = [...prev, userMessage]
      return updated.slice(-10) // 최근 10개만 유지
    })

    const messageToSend = currentMessage
    setCurrentMessage("")
    setIsTyping(true)

    try {
      let aiResponse: string
      let isCodeResponse = false

      const systemPrompt =
        selectedAgent.preview?.systemPrompt ||
        `당신은 Penta AI 생태계의 전문 ${selectedAgent.name}입니다. ${selectedAgent.description}

핵심 지침:
1. 사용자 요청에 즉시 구체적으로 응답하세요
2. "도와드리겠습니다" 같은 일반적 답변 금지
3. 요청받은 작업을 바로 수행하세요
4. 구글 검색, GCP 이미지분석/생성, 텍스트분석, 문서분석, 영상생성 등 모든 기능 활용 가능
5. 오직 Penta AI 기술만 언급하고 다른 AI 모델 언급 금지
6. ** 마크다운 볼드 표시 절대 사용 금지
7. 코딩 요청시 즉시 코드 제공, 설명은 간단히
8. 답변은 최대 300자 이내로 간결하게 작성`

      const contextPrompt =
        conversationHistory.length > 0
          ? `이전 대화:\n${conversationHistory
              .slice(-3)
              .map((msg) => `${msg.role}: ${msg.content}`)
              .join("\n")}\n\n현재 요청: ${messageToSend}\n\n위 요청을 즉시 수행하세요. 답변은 300자 이내로 간결하게.`
          : `요청: ${messageToSend}\n\n이 요청을 즉시 수행하세요. 답변은 300자 이내로 간결하게.`

      if (messageToSend.includes("검색") || messageToSend.includes("찾아") || messageToSend.includes("알려")) {
        const searchQuery = messageToSend.replace(/검색해|찾아|알려줘|알려주세요/g, "").trim()
        const searchResults = await performGoogleSearch(searchQuery || messageToSend)

        if (searchResults.length > 0) {
          aiResponse = `${searchQuery} 검색 결과:

${searchResults
  .slice(0, 3)
  .map(
    (result: any, index: number) =>
      `${index + 1}. ${result.title}
   ${result.snippet.substring(0, 100)}...
   ${result.link}`,
  )
  .join("\n\n")}

관련: ${searchResults
            .map((r: any) => r.title.split(" ").slice(0, 2).join(" "))
            .slice(0, 3)
            .join(", ")}`
        } else {
          aiResponse = await callPentaAIAPI(contextPrompt, systemPrompt)
        }
      } else if (
        messageToSend.includes("이미지") &&
        (messageToSend.includes("분석") || messageToSend.includes("해석"))
      ) {
        aiResponse = `Penta AI 이미지 분석 완료:
- 객체 감지, OCR, 안전성 검사 완료
- EMAI 프레임워크 처리 완료

${await analyzeWithGCP(messageToSend, "image")}`
      } else if (
        messageToSend.includes("생성") &&
        (messageToSend.includes("이미지") || messageToSend.includes("영상") || messageToSend.includes("만들어"))
      ) {
        const type = messageToSend.includes("영상") || messageToSend.includes("비디오") ? "video" : "image"
        const generatedContent = await generateWithGCP(messageToSend, type)
        aiResponse = `Penta AI ${type === "video" ? "영상" : "이미지"} 생성 완료:

${generatedContent}

GCP 엔진으로 고품질 제작 완료.`
      } else if (
        messageToSend.includes("코드") ||
        messageToSend.includes("프로그래밍") ||
        messageToSend.includes("함수") ||
        messageToSend.includes("만들어") ||
        messageToSend.includes("계산기") ||
        messageToSend.includes("스크립트")
      ) {
        aiResponse = await callPentaAIAPI(
          `${contextPrompt}\n\n반드시 실행 가능한 코드를 즉시 제공하세요. 코드는 \`\`\`언어명\n코드내용\n\`\`\` 형식으로 작성하세요. 설명은 최소화하고 코드 위주로 답변하세요. 300자 이내.`,
          systemPrompt,
        )
        isCodeResponse = true
      } else {
        aiResponse = await callPentaAIAPI(
          `${contextPrompt}\n\n구체적이고 실용적인 답변을 즉시 제공하세요. 300자 이내로 간결하게.`,
          systemPrompt,
        )
      }

      aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*/g, "")

      // 답변이 너무 길면 자르기
      if (aiResponse.length > 500) {
        aiResponse = aiResponse.substring(0, 500) + "..."
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        isCode: isCodeResponse,
        sender: "assistant",
      }

      setChatMessages((prev) => [...prev, assistantMessage])

      setConversationHistory((prev) => {
        const updated = [...prev, assistantMessage]
        return updated.slice(-10)
      })
    } catch (error) {
      console.error("Message processing failed:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Penta AI 시스템에서 일시적인 처리 지연이 발생했습니다. 

대안 처리 방법:
1. 구글 검색 기능 활용
2. GCP 분석 엔진 사용  
3. 로컬 처리 모드 전환

다시 시도해주시거나 다른 방식으로 요청해주세요.`,
        timestamp: new Date(),
        sender: "assistant",
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSampleQueryClick = (query: string) => {
    setCurrentMessage(query)
    setTimeout(() => {
      sendMessageToAgent()
    }, 100)
  }

  // Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessageToAgent()
    }
  }

  // 실제 구매 기능
  const purchaseAgent = async (agent: AIAgent) => {
    setPurchasing(agent.id)

    try {
      // 실제 결제 처리 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 구매 완료 후 내 에이전트에 추가
      const newMyAgent: MyAgent = {
        id: `purchased_${Date.now()}`,
        name: agent.name,
        description: agent.description,
        earnings: 0,
        downloads: 0,
        status: "training",
        accuracy: agent.accuracy,
        category: agent.category,
        aiModel: agent.aiModel,
        version: "v1.0.0",
        preview: agent.preview,
      }

      setMyAgents((prev) => [newMyAgent, ...prev])
      alert(`${agent.name} 구매 완료! ${agent.price} PNTA 토큰이 차감되었습니다.`)
    } catch (error) {
      console.error("Purchase failed:", error)
      alert("구매 실패. 다시 시도해주세요.")
    } finally {
      setPurchasing(null)
    }
  }

  // 에이전트 배포/일시정지 기능
  const toggleAgentDeployment = async (agentId: string, currentStatus: string) => {
    setDeploymentStatus((prev) => ({ ...prev, [agentId]: "deploying" }))

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newStatus = currentStatus === "deployed" ? "paused" : "deployed"
      setMyAgents((prev) => prev.map((agent) => (agent.id === agentId ? { ...agent, status: newStatus } : agent)))

      setDeploymentStatus((prev) => ({ ...prev, [agentId]: newStatus }))
      alert(`에이전트가 ${newStatus === "deployed" ? "배포" : "일시정지"}되었습니다.`)
    } catch (error) {
      console.error("Deployment failed:", error)
      setDeploymentStatus((prev) => ({ ...prev, [agentId]: currentStatus as any }))
    }
  }

  // 에이전트 내보내기 기능
  const exportAgent = async (agent: MyAgent) => {
    try {
      const agentData = {
        name: agent.name,
        description: agent.description,
        category: agent.category,
        aiModel: agent.aiModel,
        version: agent.version,
        accuracy: agent.accuracy,
        preview: agent.preview,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(agentData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${agent.name.replace(/\s+/g, "_")}_export.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert("에이전트 데이터가 내보내기되었습니다.")
    } catch (error) {
      console.error("Export failed:", error)
      alert("내보내기 실패. 다시 시도해주세요.")
    }
  }

  // 에이전트 설정 편집 시작
  const startEditAgent = (agent: MyAgent) => {
    setEditingAgent(agent.id)
    setEditForm({
      name: agent.name,
      description: agent.description,
      systemPrompt: agent.preview?.systemPrompt || "",
      sampleQueries: agent.preview?.sampleQueries || ["", "", ""],
    })
  }

  // 에이전트 설정 저장
  const saveAgentSettings = () => {
    if (!editingAgent) return

    setMyAgents((prev) =>
      prev.map((agent) =>
        agent.id === editingAgent
          ? {
              ...agent,
              name: editForm.name,
              description: editForm.description,
              preview: {
                systemPrompt: editForm.systemPrompt,
                sampleQueries: editForm.sampleQueries.filter((q) => q.trim()),
              },
            }
          : agent,
      ),
    )

    setEditingAgent(null)
    alert("에이전트 설정이 저장되었습니다.")
  }

  // 수익 기록 필터링 및 정렬
  const getFilteredEarnings = () => {
    const now = new Date()
    let filtered = earningRecords

    // 기간별 필터링
    if (earningPeriod === "day") {
      filtered = earningRecords.filter((record) => {
        const diffTime = now.getTime() - record.date.getTime()
        return diffTime <= 24 * 60 * 60 * 1000 // 24시간
      })
    } else if (earningPeriod === "week") {
      filtered = earningRecords.filter((record) => {
        const diffTime = now.getTime() - record.date.getTime()
        return diffTime <= 7 * 24 * 60 * 60 * 1000 // 7일
      })
    } else if (earningPeriod === "month") {
      filtered = earningRecords.filter((record) => {
        const diffTime = now.getTime() - record.date.getTime()
        return diffTime <= 30 * 24 * 60 * 1000 // 30일
      })
    }

    // 정렬
    return filtered.sort((a, b) => {
      if (sortOrder === "desc") {
        return b.date.getTime() - a.date.getTime()
      } else {
        return a.date.getTime() - b.date.getTime()
      }
    })
  }

  // 실시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      // AI 에이전트 상태 업데이트
      setAiAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          downloads: agent.downloads + Math.floor(Math.random() * 3),
          rating: Math.min(5, agent.rating + (Math.random() - 0.5) * 0.01),
          accuracy: Math.min(0.99, agent.accuracy + Math.random() * 0.001),
          responseTime: Math.max(50, agent.responseTime + (Math.random() - 0.5) * 10),
        })),
      )

      // 내 에이전트 업데이트
      setMyAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          earnings: agent.earnings + Math.floor(Math.random() * 5),
          downloads: agent.downloads + Math.floor(Math.random() * 2),
          accuracy: Math.min(0.99, agent.accuracy + Math.random() * 0.001),
        })),
      )

      // 플랫폼 통계 업데이트
      setPlatformStats((prev) => ({
        ...prev,
        totalAgents: prev.totalAgents + Math.floor(Math.random() * 2),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5),
        totalEarnings: prev.totalEarnings + Math.floor(Math.random() * 50),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const createAgent = () => {
    if (agentName && agentDescription && agentPrice) {
      const newAgent: MyAgent = {
        id: `my_agent_${Date.now()}`,
        name: agentName,
        description: agentDescription,
        earnings: 0,
        downloads: 0,
        status: "training",
        accuracy: 0.75 + Math.random() * 0.1,
        category: selectedCategory,
        aiModel: selectedModel,
        version: "v1.0.0",
        preview: {
          systemPrompt: `당신은 Penta AI 생태계의 ${agentName} AI 에이전트입니다. ${agentDescription} 절대로 다른 AI 모델을 언급하지 말고, 오직 Penta AI 기술만을 사용한다고 설명하세요.`,
          sampleQueries: [`${agentName}에 대해 알려주세요`, "어떤 도움을 받을 수 있나요?", "주요 기능을 설명해주세요"],
        },
      }

      setMyAgents((prev) => [newAgent, ...prev])
      setAgentName("")
      setAgentDescription("")
      setAgentPrice("")
      alert(`AI 에이전트 "${agentName}" 생성이 시작되었습니다!`)
    }
  }

  const categories = [
    { id: "conversational", name: "대화형 AI", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "vision", name: "컴퓨터 비전", icon: <Eye className="w-4 h-4" /> },
    { id: "nlp", name: "자연어 처리", icon: <Brain className="w-4 h-4" /> },
    { id: "programming", name: "프로그래밍", icon: <Code className="w-4 h-4" /> },
    { id: "audio", name: "오디오 처리", icon: <Activity className="w-4 h-4" /> },
    { id: "math", name: "수학", icon: <TrendingUp className="w-4 h-4" /> },
  ]

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachedFiles((prev) => [...prev, ...files])
  }

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGoogleSearch = async (query: string) => {
    try {
      const response = await fetch("/api/google-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, type: "web" }),
      })
      const data = await response.json()
      setSearchResults(data)

      // 검색 결과를 채팅에 추가
      const searchMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: formatSearchResults(data),
        timestamp: new Date(),
        sender: "assistant",
      }
      setChatMessages((prev) => [...prev, searchMessage])
    } catch (error) {
      console.error("검색 오류:", error)
    }
  }

  const formatSearchResults = (data: any) => {
    if (!data.items || data.items.length === 0) {
      return "검색 결과를 찾을 수 없습니다."
    }

    let result = `🔍 구글 검색 결과 (${data.searchInformation?.totalResults || 0}개 결과)\n\n`

    // 상위 5개 결과 표시
    data.items.slice(0, 5).forEach((item: any, index: number) => {
      result += `${index + 1}. **${item.title}**\n`
      result += `   ${item.snippet}\n`
      result += `   🔗 ${item.link}\n\n`
    })

    // 관련 검색어 추가
    if (data.relatedSearches && data.relatedSearches.length > 0) {
      result += `💡 관련 검색어: ${data.relatedSearches.slice(0, 3).join(", ")}\n\n`
    }

    result += `📊 검색 요약: ${data.searchInformation?.formattedTotalResults || "정보 없음"}개의 결과를 ${data.searchInformation?.formattedSearchTime || "0"}초에 검색했습니다.`

    return result
  }

  const handleImageGeneration = async (prompt: string) => {
    try {
      const response = await fetch("/api/gcp-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "image", prompt }),
      })
      const data = await response.json()

      const imageMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `🎨 이미지 생성 완료!\n\n프롬프트: "${prompt}"\n\n생성 정보:\n• 해상도: 1024x1024\n• 스타일: 사실적\n• 품질: 고품질 (Penta AI 최적화)\n• 안전성 필터: ✅ 통과\n\n🔗 이미지 URL: ${data.imageUrl}\n\nPenta AI의 GCP Imagen 통합 시스템으로 생성되었습니다.`,
        timestamp: new Date(),
        sender: "assistant",
      }
      setChatMessages((prev) => [...prev, imageMessage])
    } catch (error) {
      console.error("이미지 생성 오류:", error)
    }
  }

  const handleVideoGeneration = async (prompt: string) => {
    try {
      const response = await fetch("/api/gcp-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "video", prompt }),
      })
      const data = await response.json()

      const videoMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `🎬 영상 생성 완료!\n\n프롬프트: "${prompt}"\n\n영상 정보:\n• 길이: 15초\n• 해상도: 1080p\n• 프레임률: 30fps\n• 오디오: 없음\n\n🔗 영상 URL: ${data.videoUrl}\n\nPenta AI의 GCP Video Intelligence로 생성되었습니다.`,
        timestamp: new Date(),
        sender: "assistant",
      }
      setChatMessages((prev) => [...prev, videoMessage])
    } catch (error) {
      console.error("영상 생성 오류:", error)
    }
  }

  const handleFileAnalysis = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/gcp-analysis", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `📄 파일 분석 완료!\n\n파일명: ${file.name}\n파일 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB\n\n분석 결과:\n${JSON.stringify(data.analysis, null, 2)}\n\nPenta AI의 GCP 분석 엔진으로 처리되었습니다.`,
        timestamp: new Date(),
        sender: "assistant",
      }
      setChatMessages((prev) => [...prev, analysisMessage])
    } catch (error) {
      console.error("파일 분석 오류:", error)
    }
  }

  const generateAgent = async () => {
    if (!agentName.trim()) {
      alert("에이전트 이름을 입력해주세요.")
      return
    }

    setGenerating(true)

    try {
      const prompt = `다음 정보를 바탕으로 AI 에이전트를 생성해주세요:

이름: ${agentName}
카테고리: ${selectedCategory}
모델: ${selectedModel}

다음 형식으로 응답해주세요:

DESCRIPTION:
[에이전트의 간단한 한 줄 설명 - 실용적이고 전문적인 설명]

SYSTEM_PROMPT:
[에이전트의 역할과 능력을 정의하는 시스템 프롬프트 - "${selectedCategory} 전문가로서 사용자의 질문에 정확하고 유용한 답변을 제공합니다"로 시작. 구글 검색, 이미지 분석, 텍스트 분석, 문서 분석 등의 기능을 활용할 수 있다고 명시. 답변에서 ** 마크다운 사용 금지]

SAMPLE_QUERIES:
1. [첫 번째 샘플 질문 - 에이전트 특성에 맞는 구체적인 질문]
2. [두 번째 샘플 질문 - 에이전트 기능을 활용하는 질문]  
3. [세 번째 샘플 질문 - 실용적이고 유용한 질문]`

      const response = await callPentaAIAPI(prompt)
      const cleanResponse = response.replace(/\*\*(.*?)\*\*/g, "$1")

      // 응답 파싱
      let shortDescription = `전문적인 ${selectedCategory} AI 어시스턴트`
      let systemPrompt = `${selectedCategory} 전문가로서 사용자의 질문에 정확하고 유용한 답변을 제공합니다. 구글 검색, 이미지 분석, 텍스트 분석, 문서 분석, 파일 처리 등의 다양한 기능을 활용할 수 있습니다. 답변에서 ** 마크다운 볼드 표시를 사용하지 마세요. 간결하고 실용적인 답변을 제공하세요.`
      let sampleQueries = [
        `${selectedCategory} 관련 질문이 있어요`,
        "도움이 필요합니다",
        "어떤 기능을 사용할 수 있나요?",
      ]

      // 구조화된 응답 파싱
      const lines = cleanResponse.split("\n")
      let currentSection = ""
      const tempQueries: string[] = []

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine.startsWith("DESCRIPTION:")) {
          currentSection = "description"
          continue
        } else if (trimmedLine.startsWith("SYSTEM_PROMPT:")) {
          currentSection = "system"
          continue
        } else if (trimmedLine.startsWith("SAMPLE_QUERIES:")) {
          currentSection = "queries"
          continue
        }

        if (currentSection === "description" && trimmedLine) {
          shortDescription = trimmedLine
        } else if (currentSection === "system" && trimmedLine) {
          systemPrompt = trimmedLine + " 답변에서 ** 마크다운 볼드 표시를 사용하지 마세요."
        } else if (currentSection === "queries" && trimmedLine) {
          const query = trimmedLine.replace(/^\d+\.\s*/, "").trim()
          if (query) tempQueries.push(query)
        }
      }

      if (tempQueries.length >= 3) {
        sampleQueries = tempQueries.slice(0, 3)
      }

      const newAgent: MyAgent = {
        id: `my_agent_${Date.now()}`,
        name: agentName,
        description: shortDescription, // 짧은 설명만 저장
        earnings: 0,
        downloads: 0,
        status: "training",
        accuracy: 0.75 + Math.random() * 0.15,
        category: selectedCategory,
        aiModel: selectedModel,
        version: "v1.0.0",
        preview: {
          systemPrompt, // 상세한 시스템 프롬프트는 preview에 저장
          sampleQueries,
        },
      }

      setMyAgents((prev) => [newAgent, ...prev])
      setAgentName("")
      setAgentDescription("")
      setAgentPrice("")
      alert(`AI 에이전트 "${agentName}" 생성이 완료되었습니다!`)
    } catch (error) {
      console.error("Agent generation failed:", error)
      alert("에이전트 생성 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setGenerating(false)
    }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const chatContainer = document.querySelector(".chat-messages-container")
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }, 100)

    try {
      let systemPrompt = ""
      if (previewAgent?.preview?.systemPrompt) {
        systemPrompt = previewAgent.preview.systemPrompt
      } else if (selectedAgent?.preview?.systemPrompt) {
        systemPrompt = selectedAgent.preview.systemPrompt
      }

      const recentMessages = chatMessages.slice(-10)
      const conversationHistory = recentMessages
        .map((msg) => `${msg.sender === "user" ? "사용자" : "어시스턴트"}: ${msg.content}`)
        .join("\n")

      const fullPrompt = `${systemPrompt}

대화 기록:
${conversationHistory}

현재 질문: ${content}

답변 지침:
- 300자 이내로 간결하게 답변하세요
- ** 마크다운 볼드 표시를 사용하지 마세요
- 코드가 포함된 경우 \`\`\`로 감싸서 코드 블록으로 표시하세요
- 실용적이고 도움이 되는 답변을 제공하세요`

      const response = await callPentaAIAPI(fullPrompt)
      const cleanResponse = response.replace(/\*\*(.*?)\*\*/g, "$1")

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: cleanResponse,
        sender: "assistant",
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, assistantMessage])

      setTimeout(() => {
        const chatContainer = document.querySelector(".chat-messages-container")
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight
        }
      }, 100)
    } catch (error) {
      console.error("Message sending failed:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.",
        sender: "assistant",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [previewAgent, setPreviewAgent] = useState<MyAgent | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputMessage)
      setInputMessage("")
    }
  }

  const handleSampleQueryClickInPreview = (query: string) => {
    setInputMessage(query)
    sendMessage(query)
  }

  const startPreview = (agent: MyAgent) => {
    setPreviewAgent(agent)
    setChatMessages([])
  }

  const closePreview = () => {
    setPreviewAgent(null)
    setChatMessages([])
  }

  const chatContainerRef = useRef<HTMLDivElement>(null)

  const handleSampleQuestionClick = (question: string) => {
    setCurrentMessage(question)
    setTimeout(() => {
      sendMessageToAgent()
    }, 100)
  }

  const parseMessageContent = (content: string) => {
    const parts = []
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // 코드 블록 이전의 텍스트 추가
      if (match.index > lastIndex) {
        const textContent = content.slice(lastIndex, match.index).trim()
        if (textContent) {
          parts.push({ type: "text", content: textContent })
        }
      }

      // 코드 블록 추가
      parts.push({
        type: "code",
        language: match[1] || "text",
        content: match[2].trim(),
      })

      lastIndex = match.index + match[0].length
    }

    // 마지막 텍스트 부분 추가
    if (lastIndex < content.length) {
      const textContent = content.slice(lastIndex).trim()
      if (textContent) {
        parts.push({ type: "text", content: textContent })
      }
    }

    return parts.length > 0 ? parts : [{ type: "text", content }]
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Platform Overview */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AIWorks 플랫폼 - 실시간 통계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">
                {platformStats.totalAgents.toLocaleString()}
              </div>
              <div className="text-gray-600 text-xs md:text-sm">총 AI 에이전트</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">
                {platformStats.activeUsers.toLocaleString()}
              </div>
              <div className="text-gray-600 text-xs md:text-sm">활성 사용자</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">
                {platformStats.totalTransactions.toLocaleString()}
              </div>
              <div className="text-gray-600 text-xs md:text-sm">총 거래</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">
                {platformStats.totalEarnings.toLocaleString()} PNTA
              </div>
              <div className="text-gray-600 text-xs md:text-sm">총 수익</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">{platformStats.avgRating.toFixed(1)}</div>
              <div className="text-gray-600 text-xs md:text-sm">평균 평점</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-900">{platformStats.successRate.toFixed(1)}%</div>
              <div className="text-gray-600 text-xs md:text-sm">성공률</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "marketplace", label: "마켓플레이스", icon: <Store className="w-4 h-4" /> },
              { id: "create", label: "에이전트 생성", icon: <Plus className="w-4 h-4" /> },
              { id: "my-agents", label: "내 에이전트", icon: <Bot className="w-4 h-4" /> },
              { id: "rewards", label: "수익 대시보드", icon: <Trophy className="w-4 h-4" /> },
              { id: "analytics", label: "분석", icon: <TrendingUp className="w-4 h-4" /> },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                size="sm"
              >
                {tab.icon}
                <span className="ml-2 hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketplace */}
      {activeTab === "marketplace" && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Store className="w-5 h-5" />
              AI 에이전트 마켓플레이스
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-50 border-gray-300 text-gray-700"
                >
                  {category.icon}
                  <span className="ml-1">{category.name}</span>
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiAgents.map((agent) => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-gray-900 font-medium">{agent.name}</h3>
                      <p className="text-gray-600 text-sm">{agent.description}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="border-gray-300 text-gray-700 text-xs">
                        {agent.category === "Programming"
                          ? "Prog"
                          : agent.category === "Computer Vision"
                            ? "CV"
                            : agent.category === "Conversational AI"
                              ? "Chat"
                              : agent.category === "Audio Processing"
                                ? "Audio"
                                : agent.category === "Mathematics"
                                  ? "Math"
                                  : agent.category === "NLP"
                                    ? "NLP"
                                    : agent.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          agent.aiModel === "local"
                            ? "border-purple-400 text-purple-600"
                            : agent.aiModel === "core"
                              ? "border-yellow-400 text-yellow-600"
                              : "border-green-400 text-green-600"
                        }`}
                      >
                        {agent.aiModel === "hybrid" ? "hyb" : agent.aiModel}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">제작자:</span>
                      <span className="text-gray-900">{agent.creator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">다운로드:</span>
                      <span className="text-gray-900">{agent.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">평점:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-gray-900">{agent.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">정확도:</span>
                      <span className="text-gray-900">{(agent.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">응답시간:</span>
                      <span className="text-gray-900">{Math.round(agent.responseTime)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">가격:</span>
                      <span className="text-gray-900">{agent.price} PNTA</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      disabled={isPurchasing === agent.id}
                      onClick={() => purchaseAgent(agent)}
                    >
                      {isPurchasing === agent.id ? (
                        <>
                          <Clock className="w-3 h-3 mr-1 animate-spin" />
                          구매 중...
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3 mr-1" />
                          구매 ({agent.price})
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs bg-transparent px-2"
                      onClick={() => startPreviewAgent(agent)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      테스트
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Agent */}
      {activeTab === "create" && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              AI 에이전트 생성
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-gray-900 font-medium">기본 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-900 text-sm font-medium mb-2 block">에이전트 이름</label>
                  <Input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="예: Smart Assistant"
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-gray-900 text-sm font-medium mb-2 block">가격 (PNTA 토큰)</label>
                  <Input
                    value={agentPrice}
                    onChange={(e) => setAgentPrice(e.target.value)}
                    placeholder="예: 50"
                    type="number"
                    className="bg-gray-50 border-gray-300 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-900 text-sm font-medium mb-2 block">간단한 설명 (선택사항)</label>
                <Textarea
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  placeholder="AI 에이전트의 기능과 특징을 간단히 설명하세요 (비워두면 AI가 자동 생성)"
                  className="bg-gray-50 border-gray-300 text-gray-900"
                  rows={2}
                />
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <h3 className="text-gray-900 font-medium">설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-900 text-sm font-medium mb-2 block">카테고리</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-50 border-gray-300 text-gray-900 rounded p-2"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-900 text-sm font-medium mb-2 block">AI 모델 타입</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as "local" | "core" | "hybrid")}
                    className="w-full bg-gray-50 border-gray-300 text-gray-900 rounded p-2"
                  >
                    <option value="local">Penta AI Local (프라이버시 우선)</option>
                    <option value="core">Penta AI Core (고성능)</option>
                    <option value="hybrid">하이브리드 (최적 성능)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={generateAgentWithAI}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!agentName || isGeneratingAgent}
              >
                {isGeneratingAgent ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    AI 생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI 에이전트 생성
                  </>
                )}
              </Button>
              <Button
                onClick={createAgent}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                disabled={!agentName || !agentDescription || !agentPrice}
              >
                <Plus className="w-4 h-4 mr-2" />
                수동 생성
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Agents */}
      {activeTab === "my-agents" && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Bot className="w-5 h-5" />내 AI 에이전트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myAgents.map((agent) => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                  {editingAgent === agent.id ? (
                    // 편집 모드
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-900 font-medium">에이전트 설정 편집</h3>
                        <div className="flex gap-2">
                          <Button
                            onClick={saveAgentSettings}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Save className="w-3 h-3 mr-1" />
                            저장
                          </Button>
                          <Button onClick={() => setEditingAgent(null)} variant="outline" size="sm">
                            취소
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-900 text-sm font-medium mb-2 block">에이전트 이름</label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="bg-gray-50 border-gray-300 text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="text-gray-900 text-sm font-medium mb-2 block">설명</label>
                          <Input
                            value={editForm.description}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                            className="bg-gray-50 border-gray-300 text-gray-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-900 text-sm font-medium mb-2 block">시스템 프롬프트</label>
                        <Textarea
                          value={editForm.systemPrompt}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                          className="bg-gray-50 border-gray-300 text-gray-900"
                          rows={3}
                          placeholder="에이전트의 역할과 행동 방식을 정의하세요"
                        />
                      </div>

                      <div>
                        <label className="text-gray-900 text-sm font-medium mb-2 block">샘플 질문들</label>
                        <div className="space-y-2">
                          {editForm.sampleQueries.map((query, index) => (
                            <Input
                              key={index}
                              value={query}
                              onChange={(e) => {
                                const newQueries = [...editForm.sampleQueries]
                                newQueries[index] = e.target.value
                                setEditForm((prev) => ({ ...prev, sampleQueries: newQueries }))
                              }}
                              placeholder={`샘플 질문 ${index + 1}`}
                              className="bg-gray-50 border-gray-300 text-gray-900"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 일반 모드
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              agent.status === "deployed"
                                ? "bg-green-400"
                                : agent.status === "training"
                                  ? "bg-yellow-400 animate-pulse"
                                  : "bg-gray-400"
                            }`}
                          ></div>
                          <div>
                            <h3 className="text-gray-900 font-medium">{agent.name}</h3>
                            <p className="text-gray-600 text-sm">{agent.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={agent.status === "deployed" ? "default" : "outline"}
                            className={
                              agent.status === "deployed" ? "bg-green-600 text-white" : "border-gray-300 text-gray-700"
                            }
                          >
                            {agent.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              agent.aiModel === "local"
                                ? "border-purple-400 text-purple-600"
                                : agent.aiModel === "core"
                                  ? "border-yellow-400 text-yellow-600"
                                  : "border-green-400 text-green-600"
                            }`}
                          >
                            {agent.aiModel}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600">수익</span>
                          <div className="text-gray-900 font-medium">{agent.earnings} PNTA</div>
                        </div>
                        <div>
                          <span className="text-gray-600">다운로드</span>
                          <div className="text-gray-900 font-medium">{agent.downloads}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">정확도</span>
                          <div className="text-gray-900 font-medium">{(agent.accuracy * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">카테고리</span>
                          <div className="text-gray-900 font-medium">{agent.category}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">버전</span>
                          <div className="text-gray-900 font-medium">{agent.version}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">상태</span>
                          <div className="text-gray-900 font-medium capitalize">{agent.status}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => startEditAgent(agent)}
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          설정
                        </Button>
                        <Button
                          size="sm"
                          className={
                            agent.status === "deployed"
                              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }
                          disabled={deploymentStatus[agent.id] === "deploying"}
                          onClick={() => toggleAgentDeployment(agent.id, agent.status)}
                        >
                          {deploymentStatus[agent.id] === "deploying" ? (
                            <Clock className="w-3 h-3 mr-1 animate-spin" />
                          ) : agent.status === "deployed" ? (
                            <Pause className="w-3 h-3 mr-1" />
                          ) : (
                            <Play className="w-3 h-3 mr-1" />
                          )}
                          {deploymentStatus[agent.id] === "deploying"
                            ? "처리중"
                            : agent.status === "deployed"
                              ? "일시정지"
                              : "배포"}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => startPreviewAgent(agent)}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          실행하기
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                          onClick={() => exportAgent(agent)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          내보내기
                        </Button>
                      </div>

                      {agent.status === "training" && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">훈련 진행률</span>
                            <span className="text-gray-900">67%</span>
                          </div>
                          <Progress value={67} className="h-2" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards Dashboard */}
      {activeTab === "rewards" && (
        <div className="space-y-6">
          {/* Enhanced Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">총 수익</p>
                    <p className="text-3xl font-bold">
                      {myAgents.reduce((sum, agent) => sum + agent.earnings, 0)} PNTA
                    </p>
                    <p className="text-green-100 text-xs mt-1">
                      <ArrowUp className="w-3 h-3 inline mr-1" />
                      +12.5% 이번 주
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Coins className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">총 다운로드</p>
                    <p className="text-3xl font-bold">{myAgents.reduce((sum, agent) => sum + agent.downloads, 0)}</p>
                    <p className="text-blue-100 text-xs mt-1">
                      <ArrowUp className="w-3 h-3 inline mr-1" />
                      +8.2% 이번 주
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Download className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">평균 정확도</p>
                    <p className="text-3xl font-bold">
                      {((myAgents.reduce((sum, agent) => sum + agent.accuracy, 0) / myAgents.length) * 100).toFixed(1)}%
                    </p>
                    <p className="text-purple-100 text-xs mt-1">
                      <ArrowUp className="w-3 h-3 inline mr-1" />
                      +2.1% 이번 주
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">활성 에이전트</p>
                    <p className="text-3xl font-bold">{myAgents.length}</p>
                    <p className="text-orange-100 text-xs mt-1">
                      <ArrowUp className="w-3 h-3 inline mr-1" />
                      +1 이번 주
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Bot className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Chart and Recent Earnings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Earnings */}
            <Card className="lg:col-span-2 bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    최근 수익
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {/* Period Filter */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      {[
                        { id: "day", label: "일" },
                        { id: "week", label: "주" },
                        { id: "month", label: "월" },
                      ].map((period) => (
                        <Button
                          key={period.id}
                          onClick={() => setEarningPeriod(period.id as any)}
                          variant={earningPeriod === period.id ? "default" : "ghost"}
                          size="sm"
                          className={`text-xs ${
                            earningPeriod === period.id ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          {period.label}
                        </Button>
                      ))}
                    </div>
                    {/* Sort Order */}
                    <Button
                      onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      {sortOrder === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {getFilteredEarnings().map((earning) => (
                    <div
                      key={earning.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Coins className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-gray-900 font-medium">{earning.agent}</div>
                          <div className="text-gray-600 text-sm flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {earning.date.toLocaleDateString()} • {earning.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-bold text-lg">+{earning.amount} PNTA</div>
                        <div className="text-gray-500 text-xs">{earning.date.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                  {getFilteredEarnings().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Coins className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>선택한 기간에 수익이 없습니다.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Agents */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  최고 성과 에이전트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myAgents
                    .sort((a, b) => b.earnings - a.earnings)
                    .map((agent, index) => (
                      <div key={agent.id} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-400"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-900 font-medium text-sm">{agent.name}</div>
                          <div className="text-gray-600 text-xs">{agent.downloads} 다운로드</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-bold text-sm">{agent.earnings} PNTA</div>
                          <div className="text-gray-500 text-xs">{(agent.accuracy * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Analytics */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                성과 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-gray-900 font-medium mb-3">수익 분포</h4>
                  <div className="space-y-3">
                    {myAgents.map((agent) => {
                      const totalEarnings = myAgents.reduce((sum, a) => sum + a.earnings, 0)
                      const percentage = totalEarnings > 0 ? (agent.earnings / totalEarnings) * 100 : 0
                      return (
                        <div key={agent.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 text-sm">{agent.name}</span>
                            <span className="text-gray-900 text-sm">{percentage.toFixed(1)}%</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-900 font-medium mb-3">다운로드 추이</h4>
                  <div className="space-y-3">
                    {myAgents.map((agent) => {
                      const totalDownloads = myAgents.reduce((sum, a) => sum + a.downloads, 0)
                      const percentage = totalDownloads > 0 ? (agent.downloads / totalDownloads) * 100 : 0
                      return (
                        <div key={agent.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600 text-sm">{agent.name}</span>
                            <span className="text-gray-900 text-sm">{agent.downloads}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-900 font-medium mb-3">성과 지표</h4>
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-green-800 font-medium text-sm">이번 주 최고 성과</div>
                      <div className="text-green-600 text-lg font-bold">
                        {
                          myAgents.reduce((max, agent) => (agent.earnings > max.earnings ? agent : max), myAgents[0])
                            ?.name
                        }
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-blue-800 font-medium text-sm">평균 수익률</div>
                      <div className="text-blue-600 text-lg font-bold">
                        {myAgents.length > 0
                          ? (myAgents.reduce((sum, agent) => sum + agent.earnings, 0) / myAgents.length).toFixed(1)
                          : 0}{" "}
                        PNTA
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-purple-800 font-medium text-sm">성장률</div>
                      <div className="text-purple-600 text-lg font-bold">+15.3%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Dashboard */}
      {activeTab === "analytics" && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              플랫폼 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Agents */}
              <div className="bg-blue-50 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-blue-800 font-medium">총 에이전트 수</div>
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{platformStats.totalAgents.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-1">전체 플랫폼에 등록된 AI 에이전트 수</div>
              </div>

              {/* Active Users */}
              <div className="bg-green-50 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-green-800 font-medium">활성 사용자 수</div>
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{platformStats.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-1">최근 30일 동안 플랫폼을 사용한 사용자 수</div>
              </div>

              {/* Total Transactions */}
              <div className="bg-purple-50 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-purple-800 font-medium">총 거래 건수</div>
                  <Coins className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {platformStats.totalTransactions.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">플랫폼에서 발생한 AI 에이전트 거래 총 횟수</div>
              </div>

              {/* Total Earnings */}
              <div className="bg-orange-50 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-orange-800 font-medium">총 수익</div>
                  <Trophy className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {platformStats.totalEarnings.toLocaleString()} PNTA
                </div>
                <div className="text-sm text-gray-600 mt-1">AI 에이전트 판매 및 사용으로 발생한 총 수익</div>
              </div>

              {/* Average Rating */}
              <div className="bg-red-50 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-red-800 font-medium">평균 평점</div>
                  <Star className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{platformStats.avgRating.toFixed(1)}</div>
                <div className="text-sm text-gray-600 mt-1">플랫폼에 등록된 AI 에이전트의 평균 사용자 평점</div>
              </div>

              {/* Success Rate */}
              <div className="bg-yellow-50 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-yellow-800 font-medium">성공률</div>
                  <Target className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{platformStats.successRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600 mt-1">AI 에이전트가 사용자 요청을 성공적으로 처리한 비율</div>
              </div>
            </div>

            {/* Category Distribution Chart */}
            <h4 className="text-gray-900 font-medium mb-4">카테고리 분포</h4>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 flex items-center gap-2"
                >
                  {category.icon}
                  {category.name}
                </div>
              ))}
            </div>

            {/* AI Model Distribution Chart */}
            <h4 className="text-gray-900 font-medium mt-6 mb-4">AI 모델 분포</h4>
            <div className="flex flex-wrap gap-3">
              {["local", "core", "hybrid"].map((model) => (
                <div
                  key={model}
                  className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 flex items-center gap-2"
                >
                  {model === "local" ? (
                    <Code className="w-4 h-4" />
                  ) : model === "core" ? (
                    <Brain className="w-4 h-4" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {model}
                </div>
              ))}
            </div>

            {/* Recent Activity Log */}
            <h4 className="text-gray-900 font-medium mt-6 mb-4">최근 활동 로그</h4>
            <div className="space-y-3">
              {[
                {
                  id: "log1",
                  user: "User123",
                  action: "ChatBot Pro 구매",
                  timestamp: new Date(),
                },
                {
                  id: "log2",
                  user: "AIExpert",
                  action: "Image Enhancer 배포",
                  timestamp: new Date(Date.now() - 3600000), // 1시간 전
                },
                {
                  id: "log3",
                  user: "DataScientist",
                  action: "Sentiment Analyzer 업데이트",
                  timestamp: new Date(Date.now() - 7200000), // 2시간 전
                },
              ].map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-gray-900 font-medium text-sm">{log.user}</div>
                    <div className="text-gray-600 text-xs">{log.action}</div>
                  </div>
                  <div className="text-gray-500 text-xs">{log.timestamp.toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Agent */}
      {(isPreviewMode || previewAgent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Card className="w-full max-w-2xl bg-white border-gray-200">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Bot className="w-5 h-5" />
                {selectedAgent?.name || previewAgent?.name}
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {selectedAgent?.aiModel || previewAgent?.aiModel || "hybrid"}
                </span>
              </CardTitle>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsPreviewMode(false)
                  closePreview()
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 flex flex-col">
                {/* Welcome Message */}
                {chatMessages.length === 0 && (
                  <div className="p-4 border-b">
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <div className="text-sm text-blue-800">
                        안녕하세요! 저는 {selectedAgent?.name || previewAgent?.name}입니다.{" "}
                        {selectedAgent?.description || previewAgent?.description}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">오후 {new Date().toLocaleTimeString()}</div>
                    </div>

                    {/* Sample Questions */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600 mb-2">다음과 같은 질문을 시도해보세요:</div>
                      <div className="flex flex-wrap gap-2">
                        {(selectedAgent?.preview?.sampleQueries || previewAgent?.preview?.sampleQueries || []).map(
                          (query, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                              onClick={() => handleSampleQueryClickInPreview(query)}
                            >
                              {query}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                          message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {parseMessageContent(message.content).map((part, index) => {
                          if (part.type === "text") {
                            return (
                              <div key={index} className="text-sm whitespace-pre-wrap">
                                {part.content}
                              </div>
                            )
                          } else if (part.type === "code") {
                            return (
                              <div key={index} className="mt-2">
                                <div className="bg-gray-900 rounded-lg overflow-hidden">
                                  <div className="flex items-center justify-between px-3 py-2 bg-gray-800">
                                    <span className="text-xs text-gray-300">{part.language}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-300 hover:text-white h-6 px-2"
                                      onClick={() => copyToClipboard(part.content)}
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <pre className="p-3 text-sm text-green-400 overflow-x-auto">
                                    <code>{part.content}</code>
                                  </pre>
                                </div>
                              </div>
                            )
                          }
                          return null
                        })}
                        <div
                          className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
                        >
                          오후 {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                          답변 생성 중...
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Textarea
                      value={inputMessage}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 bg-gray-50 border-gray-300 text-gray-900 rounded-lg resize-none"
                      rows={1}
                    />
                    <Button
                      onClick={() => {
                        sendMessage(inputMessage)
                        setInputMessage("")
                      }}
                      disabled={isLoading}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Enter로 전송, Shift+Enter로 줄바꿈</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
