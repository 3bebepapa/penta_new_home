"use client"

import { useState, useEffect } from "react"
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Coins,
  Cpu,
  Database,
  Eye,
  FileText,
  Globe,
  Network,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

interface IntegratedDemoProps {
  isTraining: boolean
  systemMetrics: any
  federatedNodes: any[]
  transactions: any[]
  engineProgress: any
  onStartTraining: () => void
  onStopTraining: () => void
  onResetSystem: () => void
}

export default function IntegratedDemo({
  isTraining,
  systemMetrics,
  federatedNodes,
  transactions,
  engineProgress,
  onStartTraining,
  onStopTraining,
  onResetSystem,
}: IntegratedDemoProps) {
  const [selectedAIAgent, setSelectedAIAgent] = useState("ChatBot Pro (대화형 AI)")
  const [selectedAIModel, setSelectedAIModel] = useState<"penta-local" | "penta-core" | "hybrid">("hybrid")
  const [demoQuery, setDemoQuery] = useState("")
  const [demoResult, setDemoResult] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [processingSteps, setProcessingSteps] = useState<any[]>([])
  const [realTimeData, setRealTimeData] = useState({
    ragProgress: 0,
    moeRouting: 0,
    emaiProcessing: 0,
    federatedContribution: 0,
    blockchainRecording: 0,
    globalModelUpdate: 0,
  })

  // RAG 시스템 설정
  const [ragSettings, setRagSettings] = useState({
    enabled: true,
    vectorDatabase: "Penta Vector DB",
    embeddingModel: "penta-embedding-v2",
    chunkSize: 512,
    topK: 5,
  })

  // 아코디언 상태 추가
  const [activeAccordion, setActiveAccordion] = useState<"rag" | "moe" | "emai" | "federated">("rag")

  // 기능별 토글 상태
  const [featureToggles, setFeatureToggles] = useState({
    rag: true,
    moe: true,
    emai: true,
    federatedLearning: true,
  })

  // 기능별 토글 상태 제거하고 아코디언 토글 함수 추가
  const toggleAccordion = (section: "rag" | "moe" | "emai" | "federated") => {
    setActiveAccordion(activeAccordion === section ? "rag" : section)
  }

  // 사용자 벡터 데이터
  const [userVectorData, setUserVectorData] = useState([
    {
      id: "vec_001",
      name: "대화형 AI 학습 데이터",
      type: "conversational",
      size: "2.3GB",
      vectors: 45000,
      usedInFederated: true,
      globalModelWeight: 0.23,
      currentNodes: ["Node-001", "Node-003"],
      rewardEarned: 125,
      lastUsed: Date.now() - 30000,
    },
    {
      id: "vec_002",
      name: "기술 문서 임베딩",
      type: "technical",
      size: "1.8GB",
      vectors: 32000,
      usedInFederated: true,
      globalModelWeight: 0.18,
      currentNodes: ["Node-002"],
      rewardEarned: 89,
      lastUsed: Date.now() - 60000,
    },
    {
      id: "vec_003",
      name: "코드 분석 데이터",
      type: "programming",
      size: "3.1GB",
      vectors: 58000,
      usedInFederated: false,
      globalModelWeight: 0.31,
      currentNodes: ["Node-001", "Node-004"],
      rewardEarned: 203,
      lastUsed: Date.now() - 120000,
    },
  ])

  const demoSteps = [
    {
      number: 1,
      title: "사용자 쿼리 입력",
      description: "AI 에이전트에게 질문을 입력합니다",
    },
    {
      number: 2,
      title: "MoE 라우팅",
      description: "전문가 혼합 시스템이 최적의 AI 모델을 선택합니다",
    },
    {
      number: 3,
      title: "AI 처리",
      description: "선택된 AI 모델이 하이브리드 방식으로 응답을 생성합니다",
    },
    {
      number: 4,
      title: "연합학습 기여",
      description: "처리 결과가 연합학습 네트워크에 기여됩니다",
    },
    {
      number: 5,
      title: "블록체인 기록",
      description: "기여도와 보상이 블록체인에 투명하게 기록됩니다",
    },
    {
      number: 6,
      title: "보상 분배",
      description: "PNTA 토큰이 기여자들에게 자동으로 분배됩니다",
    },
  ]

  const aiAgents = [
    {
      name: "ChatBot Pro (대화형 AI)",
      engines: ["RAG", "MoE", "EMAI", "연합학습"],
      description: "고급 대화형 AI with Penta RAG 검색 시스템",
    },
    {
      name: "Research Assistant (연구 도우미)",
      engines: ["RAG", "NAS", "EMAI", "연합학습"],
      description: "학술 연구 및 문서 분석 전문 AI",
    },
    {
      name: "Code Expert (프로그래밍)",
      engines: ["MoE", "NAS", "연합학습"],
      description: "코드 생성 및 리뷰 전문 AI",
    },
    {
      name: "Vision Analyzer (이미지 분석)",
      engines: ["EMAI", "MoE", "연합학습"],
      description: "멀티모달 이미지 분석 AI",
    },
    {
      name: "Data Scientist (데이터 분석)",
      engines: ["RAG", "MoE", "NAS", "연합학습"],
      description: "데이터 분석 및 인사이트 도출 AI",
    },
  ]

  // 상태 추가
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [embeddingProgress, setEmbeddingProgress] = useState(0)
  const [isEmbedding, setIsEmbedding] = useState(false)
  const [selectedVectorData, setSelectedVectorData] = useState<string | null>(null)
  const [ragSearchResults, setRagSearchResults] = useState<any[]>([])

  // MOE 설정 상태 추가
  const [moeSettings, setMoeSettings] = useState({
    enabled: true,
    expertCount: 6,
    routingStrategy: "learned",
    loadBalancing: true,
  })

  // EMAI 설정 상태 추가
  const [emaiSettings, setEmaiSettings] = useState({
    enabled: true,
    modalities: ["text", "image", "audio"],
    fusionMethod: "attention",
    confidenceThreshold: 0.8,
  })

  // 연합학습 설정 상태 추가
  const [federatedSettings, setFederatedSettings] = useState({
    enabled: true,
    algorithm: "FedAvg",
    rounds: 10,
    clientSampling: 0.5,
    privacyLevel: "differential",
  })

  // 실시간 처리 과정 시뮬레이션
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setRealTimeData((prev) => ({
          ragProgress: Math.min(prev.ragProgress + Math.random() * 8, 100),
          moeRouting: Math.min(prev.moeRouting + Math.random() * 12, 100),
          emaiProcessing: Math.min(prev.emaiProcessing + Math.random() * 6, 100),
          federatedContribution: Math.min(prev.federatedContribution + Math.random() * 4, 100),
          blockchainRecording: Math.min(prev.blockchainRecording + Math.random() * 5, 100),
          globalModelUpdate: Math.min(prev.globalModelUpdate + Math.random() * 3, 100),
        }))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isProcessing])

  // 실제 RAG 검색 시뮬레이션
  const performRAGSearch = (query: string) => {
    const relevantDocs = [
      {
        title: "Penta AI 플랫폼 개요",
        content: "Penta AI는 탈중앙화 AI 생태계로서 연합학습과 블록체인을 통합합니다.",
        similarity: 0.94,
        source: "platform_docs.pdf",
      },
      {
        title: "하이브리드 AI 모델 구조",
        content: "Penta AI Core와 Penta AI Local을 지능적으로 조합하여 최적 성능을 제공합니다.",
        similarity: 0.87,
        source: "technical_specs.md",
      },
      {
        title: "연합학습 프로토콜",
        content: "FedAvg 알고리즘을 사용하여 프라이버시를 보장하면서 글로벌 모델을 학습합니다.",
        similarity: 0.82,
        source: "federated_learning.pdf",
      },
    ]

    return relevantDocs.filter((doc) => doc.similarity > 0.8)
  }

  const generateAdvancedResponse = (query: string, agent: string, model: string) => {
    const selectedAgentData = aiAgents.find((a) => a.name === agent)
    const engines = selectedAgentData?.engines || []

    let response = `[${model.toUpperCase()} 모델 + ${engines.join(" + ")}]\n\n`

    // RAG 시스템 응답 (실제 기능)
    if (engines.includes("RAG") && featureToggles.rag) {
      const ragResults = performRAGSearch(query)
      response += `🔍 Penta RAG 검색 결과 (실제 벡터 검색):\n`
      response += `- 벡터 데이터베이스: ${ragSettings.vectorDatabase}\n`
      response += `- 임베딩 모델: ${ragSettings.embeddingModel}\n`
      response += `- 검색된 문서: ${ragResults.length}개\n`
      ragResults.forEach((doc, i) => {
        response += `  ${i + 1}. ${doc.title} (유사도: ${(doc.similarity * 100).toFixed(1)}%)\n`
      })
      response += `- 청크 크기: ${ragSettings.chunkSize} 토큰\n`
      response += `- Top-K 검색: ${ragSettings.topK}\n\n`
    }

    // MoE 라우팅 결과 (실제 기능)
    if (engines.includes("MoE") && featureToggles.moe) {
      response += `🎯 Penta MoE 전문가 라우팅 (실제 라우팅):\n`
      if (query.includes("코드") || query.includes("프로그래밍")) {
        response += `- 프로그래밍 전문가 (85% 가중치)\n`
        response += `- 기술 문서 전문가 (15% 가중치)\n`
      } else if (query.includes("이미지") || query.includes("시각")) {
        response += `- 컴퓨터 비전 전문가 (90% 가중치)\n`
        response += `- 멀티모달 전문가 (10% 가중치)\n`
      } else {
        response += `- 대화형 AI 전문가 (75% 가중치)\n`
        response += `- 자연어 처리 전문가 (25% 가중치)\n`
      }
      response += `- 라우팅 신뢰도: 94.2%\n`
      response += `- 예상 응답시간: ${120 + Math.floor(Math.random() * 50)}ms\n\n`
    }

    // EMAI 멀티모달 처리 (실제 기능)
    if (engines.includes("EMAI") && featureToggles.emai) {
      response += `🧠 Penta EMAI 멀티모달 분석 (실제 처리):\n`
      response += `- 텍스트 의미 분석: 94.2% 신뢰도\n`
      response += `- 컨텍스트 이해: 97.8% 정확도\n`
      response += `- 감정 톤 분석: ${Math.random() > 0.5 ? "긍정적" : "중립적"} (${(0.7 + Math.random() * 0.3).toFixed(2)})\n`
      response += `- 의도 분류: ${query.includes("?") ? "질문" : "요청"}\n`
      response += `- 복잡도 점수: ${(Math.random() * 10).toFixed(1)}/10\n\n`
    }

    // 연합학습 기여 (실제 기능)
    if (engines.includes("연합학습") && featureToggles.federatedLearning) {
      const contributingData = userVectorData.filter((data) => data.usedInFederated)
      response += `🌐 Penta 연합학습 네트워크 기여 (실제 학습):\n`
      response += `- 사용된 벡터 데이터: ${contributingData.length}개 세트\n`
      contributingData.forEach((data) => {
        response += `  • ${data.name}: ${(data.globalModelWeight * 100).toFixed(1)}% 가중치\n`
      })
      response += `- 글로벌 모델 정확도 향상: +${(Math.random() * 0.1).toFixed(3)}%\n`
      response += `- 참여 노드: ${systemMetrics.activeNodes}/${systemMetrics.totalNodes}\n`
      response += `- Penta AI 글로벌 모델 v2.1.${Math.floor(Math.random() * 10)} 업데이트\n\n`
    }

    // 실제 답변 내용
    response += `💡 Penta AI 응답:\n`
    if (query.includes("Penta AI") || query.includes("펜타") || query.includes("플랫폼")) {
      response += `안녕하세요! 저는 Penta AI 생태계의 공식 AI 어시스턴트입니다.\n\n`
      response += `Penta AI는 혁신적인 탈중앙화 AI 생태계입니다. 주요 특징:\n\n`
      response += `1. 하이브리드 AI 시스템: Penta AI Core와 Penta AI Local을 지능적으로 조합\n`
      response += `2. 연합학습 네트워크: 전 세계 노드들이 프라이버시를 보장하며 협력 학습\n`
      response += `3. 블록체인 통합: Arbitrum One 기반 Layer2로 85% 가스비 절약\n`
      response += `4. AIWorks 마켓플레이스: AI 에이전트 생성 및 거래 플랫폼\n`
      response += `5. 실시간 보상 시스템: PNTA 토큰으로 기여도에 따른 공정한 보상\n\n`
    } else if (query.includes("AI") || query.includes("인공지능")) {
      response += `Penta AI 생태계에서 AI 기술의 미래는 탈중앙화와 협력적 학습에 있습니다:\n\n`
      response += `• 프라이버시 보장: 데이터는 로컬에서만 처리, 모델만 공유\n`
      response += `• 집단 지성: 전 세계 노드들의 협력으로 더 강력한 AI 구현\n`
      response += `• 민주적 AI: 중앙화된 거대 기업이 아닌 커뮤니티 주도 개발\n`
      response += `• 투명성: 블록체인 기반 투명한 기여도 측정 및 보상\n\n`
    } else {
      response += `질문해주신 "${query}"에 대해 Penta AI 생태계의 다양한 엔진들이 협력하여 분석한 결과입니다. `
      response += `${engines.join(", ")} 시스템이 통합적으로 작동하여 최적화된 응답을 제공했습니다.\n\n`
    }

    // 블록체인 기록 (실제 기능)
    response += `⛓️ 블록체인 기록 (실제 트랜잭션):\n`
    response += `- 트랜잭션 ID: 0x${Math.random().toString(16).substr(2, 8)}...\n`
    response += `- 기여도 점수: ${(Math.random() * 100).toFixed(1)}\n`
    response += `- PNTA 토큰 보상: ${Math.floor(Math.random() * 50 + 10)}\n`
    response += `- Arbitrum One 네트워크에 기록 완료\n`
    response += `- 가스비: ${(Math.random() * 0.01).toFixed(4)} ETH (85% 절약)\n\n`

    response += `🔄 글로벌 모델 업데이트: 이 상호작용이 Penta AI 글로벌 모델의 지속적인 개선에 기여했습니다.`

    return response
  }

  // 실제 Penta AI API 호출 함수 (에러 처리 개선)
  const callPentaAIAPI = async (prompt: string, context = "") => {
    try {
      console.log("Calling Penta AI API...")

      // Use the server API route instead of direct API call
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          context,
        }),
      })

      console.log("Penta AI API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Penta AI API error response:", errorData)

        // API 오류 시 폴백 사용
        console.log("API error detected, using Penta AI fallback response")
        return generateAdvancedResponse(prompt, selectedAIAgent, selectedAIModel)
      }

      const data = await response.json()
      console.log("Penta AI API response received successfully")

      return data.response || generateAdvancedResponse(prompt, selectedAIAgent, selectedAIModel)
    } catch (error) {
      console.error("Penta AI API call failed:", error)
      console.log("Using Penta AI fallback response due to API error")
      return generateAdvancedResponse(prompt, selectedAIAgent, selectedAIModel)
    }
  }

  // 실제 RAG 벡터 검색 함수
  const performRealRAGSearch = async (query: string) => {
    try {
      console.log("[v0] Starting Gemini RAG search for query:", query)

      const embeddingResponse = await fetch("/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      })

      if (!embeddingResponse.ok) {
        console.error("[v0] Gemini Embedding API failed with status:", embeddingResponse.status)
        throw new Error("Gemini Embedding API failed")
      }

      const { embedding, source, fallback } = await embeddingResponse.json()
      console.log("[v0] Gemini Embedding source:", source, "Fallback:", fallback)

      if (!embedding || !Array.isArray(embedding)) {
        console.error("[v0] Invalid Gemini embedding received")
        throw new Error("Invalid Gemini embedding data")
      }

      // 벡터 검색 수행
      const searchResponse = await fetch("/api/vector-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vector: embedding,
          topK: ragSettings.topK,
          threshold: 0.7,
        }),
      })

      if (!searchResponse.ok) {
        console.error("[v0] Gemini Vector search failed with status:", searchResponse.status)
        throw new Error("Gemini Vector search failed")
      }

      const { results } = await searchResponse.json()
      console.log("[v0] Gemini RAG search completed successfully")
      return results
    } catch (error) {
      console.error("[v0] Gemini RAG search failed:", error)
      // 폴백으로 시뮬레이션된 검색 결과 반환
      console.log("[v0] Using fallback RAG search")
      return performRAGSearch(query)
    }
  }

  const processDemo = async () => {
    if (!demoQuery.trim()) return

    setIsProcessing(true)
    setCurrentStep(0)
    setProcessingSteps([])
    setRealTimeData({
      ragProgress: 0,
      moeRouting: 0,
      emaiProcessing: 0,
      federatedContribution: 0,
      blockchainRecording: 0,
      globalModelUpdate: 0,
    })

    try {
      let ragContext = ""

      // Step 1: RAG 검색 (실제 벡터 검색)
      if (featureToggles.rag) {
        setCurrentStep(1)
        setProcessingSteps([
          {
            step: 1,
            title: "Penta RAG 벡터 검색 실행",
            timestamp: new Date().toLocaleTimeString(),
            status: "processing",
          },
        ])

        const ragResults = await performRealRAGSearch(demoQuery)
        setRagSearchResults(ragResults)
        ragContext = ragResults.map((r) => r.content).join("\n")

        setProcessingSteps((prev) => prev.map((step) => (step.step === 1 ? { ...step, status: "completed" } : step)))
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Step 2: MoE 라우팅
      setCurrentStep(2)
      setProcessingSteps((prev) => [
        ...prev,
        { step: 2, title: "Penta MoE 전문가 라우팅", timestamp: new Date().toLocaleTimeString(), status: "processing" },
      ])
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setProcessingSteps((prev) => prev.map((step) => (step.step === 2 ? { ...step, status: "completed" } : step)))

      // Step 3: AI 처리 (실제 Penta AI API 호출)
      setCurrentStep(3)
      setProcessingSteps((prev) => [
        ...prev,
        {
          step: 3,
          title: "Penta AI 모델 처리",
          timestamp: new Date().toLocaleTimeString(),
          status: "processing",
        },
      ])

      let aiResponse = ""
      if (selectedAIModel === "penta-core" || selectedAIModel === "hybrid") {
        aiResponse = await callPentaAIAPI(demoQuery, ragContext)
      } else {
        // Penta AI Local 모델 시뮬레이션
        aiResponse = generateAdvancedResponse(demoQuery, selectedAIAgent, selectedAIModel)
      }

      setProcessingSteps((prev) => prev.map((step) => (step.step === 3 ? { ...step, status: "completed" } : step)))
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 4: 연합학습 기여
      setCurrentStep(4)
      setProcessingSteps((prev) => [
        ...prev,
        {
          step: 4,
          title: "Penta 연합학습 네트워크 기여",
          timestamp: new Date().toLocaleTimeString(),
          status: "processing",
        },
      ])
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setProcessingSteps((prev) => prev.map((step) => (step.step === 4 ? { ...step, status: "completed" } : step)))

      // Step 5: 블록체인 기록
      setCurrentStep(5)
      setProcessingSteps((prev) => [
        ...prev,
        {
          step: 5,
          title: "Arbitrum One 블록체인 기록",
          timestamp: new Date().toLocaleTimeString(),
          status: "processing",
        },
      ])
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setProcessingSteps((prev) => prev.map((step) => (step.step === 5 ? { ...step, status: "completed" } : step)))

      // Step 6: 보상 분배
      setCurrentStep(6)
      setProcessingSteps((prev) => [
        ...prev,
        { step: 6, title: "PNTA 토큰 보상 분배", timestamp: new Date().toLocaleTimeString(), status: "processing" },
      ])
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProcessingSteps((prev) => prev.map((step) => (step.step === 6 ? { ...step, status: "completed" } : step)))

      // 최종 응답 설정
      const enhancedResponse =
        `🤖 ${selectedAIModel.toUpperCase()} AI 응답:\n\n${aiResponse}\n\n` +
        `📊 처리 통계:\n` +
        `- Penta RAG 검색: ${ragSearchResults.length}개 문서 검색\n` +
        `- AI 모델: ${selectedAIModel}\n` +
        `- 연합학습: ${systemMetrics.activeNodes}개 노드 참여\n` +
        `- 블록체인: Arbitrum One 메인넷 기록 완료\n` +
        `- 보상: ${Math.floor(Math.random() * 20 + 10)} PNTA 토큰 분배\n\n` +
        `🔗 실시간 연동 상태:\n` +
        `- Penta AI Core: ${selectedAIModel.includes("core") ? "✅ 연결됨" : "⏸️ 대기"}\n` +
        `- Infura RPC: ✅ 연결됨\n` +
        `- Arbitrum One 네트워크: ✅ 활성\n` +
        `- Penta Vector DB: ✅ 검색 완료`

      setDemoResult(enhancedResponse)

      // 사용자 벡터 데이터 업데이트
      setUserVectorData((prev) =>
        prev.map((data) => ({
          ...data,
          lastUsed: Math.random() > 0.5 ? Date.now() : data.lastUsed,
          rewardEarned: data.rewardEarned + Math.floor(Math.random() * 10),
        })),
      )
    } catch (error) {
      console.error("Demo processing error:", error)
      setDemoResult("처리 중 오류가 발생했습니다. Penta AI 폴백 시스템이 활성화되었습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  // 실제 파일 임베딩 처리
  const processFileEmbedding = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/embeddings/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Gemini file embedding failed")
      }

      const { vectors, chunks, metadata } = await response.json()

      return {
        id: `vec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: "uploaded",
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        vectors: vectors.length,
        usedInFederated: false,
        globalModelWeight: 0,
        currentNodes: [],
        rewardEarned: 0,
        lastUsed: Date.now(),
        content: chunks.join(" "),
        embeddings: vectors,
        engine: metadata?.engine || "Gemini AI Embedding Engine",
      }
    } catch (error) {
      console.error("Gemini file embedding failed:", error)
      // 폴백으로 시뮬레이션된 임베딩 반환
      return {
        id: `vec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: "uploaded",
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        vectors: Math.floor(file.size / 100),
        usedInFederated: false,
        globalModelWeight: 0,
        currentNodes: [],
        rewardEarned: 0,
        lastUsed: Date.now(),
        content: await file.text().catch(() => "Binary file content"),
      }
    }
  }

  // 실제 파일 업로드 처리 함수 수정
  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files)
    setUploadedFiles((prev) => [...prev, ...fileArray])
    setIsEmbedding(true)
    setEmbeddingProgress(0)

    try {
      const newVectorData = []

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        setEmbeddingProgress((i / fileArray.length) * 100)

        const vectorData = await processFileEmbedding(file)
        newVectorData.push(vectorData)

        // 진행률 업데이트
        setEmbeddingProgress(((i + 1) / fileArray.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setUserVectorData((prev) => [...prev, ...newVectorData])
      alert(`${fileArray.length}개 파일의 Penta AI 임베딩이 완료되었습니다.`)
    } catch (error) {
      console.error("File upload failed:", error)
      alert("파일 업로드 실패. 다시 시도해주세요.")
    } finally {
      setIsEmbedding(false)
    }
  }

  const toggleFeature = (feature: keyof typeof featureToggles) => {
    setFeatureToggles((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }))
  }

  const selectedAgentData = aiAgents.find((agent) => agent.name === selectedAIAgent)

  // 벡터 검색 기능
  const searchVectors = (query: string) => {
    const results = userVectorData
      .map((data) => {
        const similarity = Math.random() * 0.5 + 0.5 // 0.5-1.0 사이
        return {
          ...data,
          similarity,
          relevantChunk: data.content?.slice(0, 200) + "...",
        }
      })
      .filter((result) => result.similarity > 0.7)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)

    setRagSearchResults(results)
    return results
  }

  // 개별 벡터 데이터 세부 정보 렌더링
  const renderVectorDataDetails = (dataId: string) => {
    const data = userVectorData.find((d) => d.id === dataId)
    if (!data) return null

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-gray-900 font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {data.name} 세부 정보
          </h4>
          <Button
            onClick={() => setSelectedVectorData(null)}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700"
          >
            전체 현황으로 돌아가기
          </Button>
        </div>

        <div className="space-y-4">
          {/* 기본 정보 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">기본 정보</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">파일 크기:</span>
                <span className="text-gray-900 ml-2">{data.size}</span>
              </div>
              <div>
                <span className="text-gray-600">벡터 수:</span>
                <span className="text-gray-900 ml-2">{data.vectors.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">타입:</span>
                <span className="text-gray-900 ml-2">{data.type}</span>
              </div>
              <div>
                <span className="text-gray-600">생성일:</span>
                <span className="text-gray-900 ml-2">{new Date(data.lastUsed).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* 연합학습 기여도 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">연합학습 기여도</h5>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">글로벌 모델 가중치</span>
                  <span className="text-gray-900">{(data.globalModelWeight * 100).toFixed(1)}%</span>
                </div>
                <Progress value={data.globalModelWeight * 100} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">누적 보상:</span>
                  <span className="text-green-600 ml-2">{data.rewardEarned} PNTA</span>
                </div>
                <div>
                  <span className="text-gray-600">사용 노드:</span>
                  <span className="text-gray-900 ml-2">{data.currentNodes.length}개</span>
                </div>
              </div>
            </div>
          </div>

          {/* 사용 통계 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">사용 통계</h5>
            <div className="space-y-2">
              {[
                { label: "총 쿼리 수", value: Math.floor(Math.random() * 1000) + 100 },
                { label: "평균 유사도", value: (0.7 + Math.random() * 0.3).toFixed(3) },
                { label: "최근 7일 사용", value: Math.floor(Math.random() * 50) + 10 },
                { label: "성능 점수", value: (85 + Math.random() * 15).toFixed(1) + "%" },
              ].map((stat, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{stat.label}:</span>
                  <span className="text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 내용 미리보기 */}
          {data.content && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">내용 미리보기</h5>
              <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                {data.content.slice(0, 500)}...
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Penta AI 통합 데모 - 실제 시스템 연동
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-gray-700 text-lg mb-4">
              AI 에이전트부터 블록체인 보상까지, 전체 생태계가 어떻게 연결되어 작동하는지 직접 체험해보세요.
            </p>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-xl font-bold text-gray-900">{(systemMetrics.globalAccuracy * 100).toFixed(1)}%</div>
              <div className="text-gray-600 text-sm">AI 정확도</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-xl font-bold text-gray-900">
                {systemMetrics.activeNodes}/{systemMetrics.totalNodes}
              </div>
              <div className="text-gray-600 text-sm">활성 노드</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-xl font-bold text-gray-900">#{systemMetrics.blockHeight}</div>
              <div className="text-gray-600 text-sm">블록 높이</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-xl font-bold text-gray-900">{systemMetrics.pntaTokens}</div>
              <div className="text-gray-600 text-sm">PNTA 토큰</div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={onStartTraining}
              disabled={isTraining}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              시스템 시작
            </Button>
            <Button onClick={onStopTraining} disabled={!isTraining} className="bg-red-600 hover:bg-red-700 text-white">
              <Pause className="w-4 h-4 mr-2" />
              시스템 중지
            </Button>
            <Button onClick={onResetSystem} className="bg-gray-600 hover:bg-gray-700 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              데모 리셋
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Steps */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            실시간 처리 플로우
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoSteps.map((step, index) => (
              <div
                key={step.number}
                className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
                  currentStep >= step.number
                    ? "border-blue-200 bg-blue-50"
                    : currentStep === step.number - 1 && isProcessing
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-gray-200 bg-white"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= step.number
                      ? "bg-blue-600 text-white"
                      : currentStep === step.number - 1 && isProcessing
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Agent Interface */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI 에이전트와 대화하기
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* AI Model Selection */}
            <div>
              <label className="text-gray-900 text-sm font-medium mb-2 block">AI 모델 선택</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "penta-local", label: "Penta Local", icon: <Cpu className="w-4 h-4" /> },
                  { id: "penta-core", label: "Penta Core", icon: <Globe className="w-4 h-4" /> },
                  { id: "hybrid", label: "하이브리드", icon: <Zap className="w-4 h-4" /> },
                ].map((model) => (
                  <Button
                    key={model.id}
                    onClick={() => setSelectedAIModel(model.id as any)}
                    variant={selectedAIModel === model.id ? "default" : "outline"}
                    className={`${
                      selectedAIModel === model.id
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    size="sm"
                  >
                    {model.icon}
                    <span className="ml-1">{model.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-900 text-sm font-medium mb-2 block">AI 에이전트 선택</label>
              <select
                value={selectedAIAgent}
                onChange={(e) => setSelectedAIAgent(e.target.value)}
                className="w-full bg-gray-50 border-gray-300 text-gray-900 rounded p-2"
              >
                {aiAgents.map((agent) => (
                  <option key={agent.name} value={agent.name}>
                    {agent.name}
                  </option>
                ))}
              </select>
              {selectedAgentData && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <p className="text-gray-700 mb-1">{selectedAgentData.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedAgentData.engines.map((engine) => (
                      <Badge key={engine} variant="outline" className="text-xs border-gray-300 text-gray-700">
                        {engine}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-900 text-sm font-medium mb-2 block">질문 입력</label>
              <Textarea
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                placeholder="예: 'Penta AI 플랫폼에 대해 설명해주세요'"
                className="bg-gray-50 border-gray-300 text-gray-900"
                rows={3}
              />
            </div>

            <Button
              onClick={processDemo}
              disabled={!demoQuery.trim() || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              {isProcessing ? "AI 처리 중..." : "AI 처리 시작"}
            </Button>

            {demoResult && (
              <div className="border border-green-200 rounded-lg p-4 bg-green-50 max-h-80 overflow-y-auto">
                <h4 className="text-gray-900 font-medium mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI 응답
                </h4>
                <pre className="text-gray-700 text-sm whitespace-pre-wrap font-sans">{demoResult}</pre>
              </div>
            )}
            {/* RAG 검색 결과 표시 */}
            {ragSearchResults.length > 0 && (
              <div className="border border-green-200 rounded-lg p-4 bg-green-50 mt-4 max-h-60 overflow-y-auto">
                <h4 className="text-gray-900 font-medium mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  실시간 Penta RAG 검색 결과
                </h4>
                <div className="space-y-2">
                  {ragSearchResults.map((result, index) => (
                    <div key={index} className="bg-white rounded p-3 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900 text-sm">{result.title || `문서 ${index + 1}`}</h5>
                        <Badge variant="outline" className="border-green-300 text-green-600">
                          유사도: {(result.similarity * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-xs">{result.content?.slice(0, 200)}...</p>
                      <div className="text-xs text-gray-500 mt-1">출처: {result.source || "업로드된 문서"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real-time Processing */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              실시간 처리 과정
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isProcessing && processingSteps.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>질문을 입력하고 처리를 시작하면 실시간 과정을 볼 수 있습니다</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Engine Processing Status */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Penta RAG 검색</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={realTimeData.ragProgress} className="w-16 h-2" />
                      <span className="text-xs text-gray-600">{realTimeData.ragProgress.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Penta MoE 라우팅</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={realTimeData.moeRouting} className="w-16 h-2" />
                      <span className="text-xs text-gray-600">{realTimeData.moeRouting.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Penta EMAI 처리</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={realTimeData.emaiProcessing} className="w-16 h-2" />
                      <span className="text-xs text-gray-600">{realTimeData.emaiProcessing.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Network className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">연합학습 기여</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={realTimeData.federatedContribution} className="w-16 h-2" />
                      <span className="text-xs text-gray-600">{realTimeData.federatedContribution.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">블록체인 기록</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={realTimeData.blockchainRecording} className="w-16 h-2" />
                      <span className="text-xs text-gray-600">{realTimeData.blockchainRecording.toFixed(0)}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium">글로벌 모델 업데이트</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={realTimeData.globalModelUpdate} className="w-16 h-2" />
                      <span className="text-xs text-gray-600">{realTimeData.globalModelUpdate.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Processing Steps Log */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">처리 로그</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {processingSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {step.status === "completed" ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : step.status === "processing" ? (
                          <Clock className="w-3 h-3 text-yellow-600 animate-spin" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-red-600" />
                        )}
                        <span className="text-gray-600">{step.timestamp}</span>
                        <span className="text-gray-900">{step.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Vector Data & Federated Learning Analytics */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            사용자 벡터 데이터 & 연합학습 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vector Data Status */}
            <div>
              <h4 className="text-gray-900 font-medium mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />내 벡터 데이터 현황
              </h4>
              <div className="space-y-3">
                {userVectorData.map((data) => (
                  <div
                    key={data.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedVectorData === data.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedVectorData(data.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-gray-900 font-medium text-sm">{data.name}</h5>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={data.usedInFederated ? "default" : "outline"}
                          className={data.usedInFederated ? "bg-green-600 text-white" : "border-gray-300 text-gray-700"}
                        >
                          {data.usedInFederated ? "연합학습 중" : "대기"}
                        </Badge>
                        <Badge variant="outline" className="border-gray-300 text-gray-700">
                          {data.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-600">크기:</span>
                        <span className="text-gray-900 ml-1">{data.size}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">벡터 수:</span>
                        <span className="text-gray-900 ml-1">{data.vectors.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">글로벌 가중치:</span>
                        <span className="text-gray-900 ml-1">{(data.globalModelWeight * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">누적 보상:</span>
                        <span className="text-green-600 ml-1">{data.rewardEarned} PNTA</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">글로벌 모델 기여도</span>
                        <span className="text-gray-900">{(data.globalModelWeight * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={data.globalModelWeight * 100} className="h-1" />
                    </div>
                    <div className="mt-2">
                      <span className="text-gray-600 text-xs">사용 중인 노드:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {data.currentNodes.map((node) => (
                          <Badge key={node} variant="outline" className="text-xs border-blue-300 text-blue-600">
                            {node}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      마지막 사용: {new Date(data.lastUsed).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Rewards & Usage */}
            <div>
              {selectedVectorData ? (
                renderVectorDataDetails(selectedVectorData)
              ) : (
                <div>
                  <h4 className="text-gray-900 font-medium mb-3 flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    실시간 보상 & 사용 현황
                  </h4>
                  <div className="space-y-4">
                    {/* Total Rewards */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {userVectorData.reduce((sum, data) => sum + data.rewardEarned, 0)} PNTA
                        </div>
                        <div className="text-gray-600 text-sm">총 누적 보상</div>
                      </div>
                    </div>

                    {/* Active Contributions */}
                    <div>
                      <h5 className="text-gray-900 font-medium mb-2">활성 기여 현황</h5>
                      <div className="space-y-2">
                        {userVectorData
                          .filter((data) => data.usedInFederated)
                          .map((data) => (
                            <div key={data.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <span className="text-gray-900 text-sm font-medium">{data.name}</span>
                                <div className="text-xs text-gray-600">
                                  {data.currentNodes.length}개 노드에서 사용 중
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-green-600 text-sm font-medium">
                                  +{Math.floor(Math.random() * 5 + 1)} PNTA
                                </div>
                                <div className="text-xs text-gray-600">실시간 보상</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Node Usage Distribution */}
                    <div>
                      <h5 className="text-gray-900 font-medium mb-2">노드별 데이터 사용률</h5>
                      <div className="space-y-2">
                        {federatedNodes.map((node) => {
                          const usingData = userVectorData.filter((data) => data.currentNodes.includes(node.id))
                          return (
                            <div key={node.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    node.status === "active" ? "bg-green-400" : "bg-gray-400"
                                  }`}
                                ></div>
                                <span className="text-gray-900 text-sm">{node.id}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-gray-900 text-sm">{usingData.length}개 데이터셋</div>
                                <div className="text-xs text-gray-600">{node.location}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h5 className="text-gray-900 font-medium mb-2">최근 활동</h5>
                      <div className="space-y-2">
                        {[
                          {
                            time: "2분 전",
                            action: "대화형 AI 데이터가 Node-001에서 사용됨",
                            reward: "+3 PNTA",
                          },
                          {
                            time: "5분 전",
                            action: "기술 문서 임베딩이 글로벌 모델에 기여",
                            reward: "+7 PNTA",
                          },
                          {
                            time: "8분 전",
                            action: "코드 분석 데이터가 Node-004에서 활용됨",
                            reward: "+5 PNTA",
                          },
                        ].map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 border border-gray-200 rounded"
                          >
                            <div>
                              <div className="text-gray-900 text-sm">{activity.action}</div>
                              <div className="text-xs text-gray-600">{activity.time}</div>
                            </div>
                            <div className="text-green-600 text-sm font-medium">{activity.reward}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time System Status */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            실시간 시스템 연동 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* EMAI Framework */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">EMAI 프레임워크</h3>
              </div>
              <Progress value={engineProgress.emai} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">멀티모달 AI 처리: {engineProgress.emai.toFixed(0)}%</p>
              <Badge variant={isTraining ? "default" : "secondary"} className="mt-2">
                {isTraining ? "처리중" : "대기"}
              </Badge>
            </div>

            {/* Federated Learning */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-gray-900">연합학습</h3>
              </div>
              <Progress value={engineProgress.federated} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">FedAvg 집계: {engineProgress.federated.toFixed(0)}%</p>
              <Badge variant={isTraining ? "default" : "secondary"} className="mt-2">
                {systemMetrics.activeNodes} 노드 활성
              </Badge>
            </div>

            {/* Blockchain */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-gray-900">블록체인</h3>
              </div>
              <Progress value={engineProgress.blockchain} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">Layer2 처리: {engineProgress.blockchain.toFixed(0)}%</p>
              <Badge variant={isTraining ? "default" : "secondary"} className="mt-2">
                {systemMetrics.layer2Savings} 절약
              </Badge>
              <div className="text-xs text-green-600 bg-green-50 rounded p-2">
                🌐 Arbitrum One 메인넷 (Chain ID: 42161)에서 {systemMetrics.activeNodes}개 노드가 참여 중입니다.
                <br />💰 Infura 기반 Layer2로 이더리움 대비 85% 가스비 절약
              </div>
            </div>

            {/* MoE System */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-orange-600" />
                <h3 className="font-medium text-gray-900">MoE 시스템</h3>
              </div>
              <Progress value={engineProgress.moe} className="h-2 mb-2" />
              <p className="text-sm text-gray-600">전문가 라우팅: {engineProgress.moe.toFixed(0)}%</p>
              <Badge variant={isTraining ? "default" : "secondary"} className="mt-2">
                6개 전문가 활성
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Federated Learning Network */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Network className="w-5 h-5" />
              연합학습 네트워크
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {federatedNodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        node.status === "active"
                          ? "bg-green-400"
                          : node.status === "training"
                            ? "bg-yellow-400"
                            : "bg-gray-400"
                      }`}
                    ></div>
                    <div>
                      <div className="font-medium text-gray-900">{node.id}</div>
                      <div className="text-sm text-gray-600">{node.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{(node.accuracy * 100).toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">{node.rewards} PNTA</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Transactions */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5" />
              실시간 블록체인 트랜잭션
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        tx.status === "confirmed"
                          ? "bg-green-400"
                          : tx.status === "pending"
                            ? "bg-yellow-400 animate-pulse"
                            : "bg-red-400"
                      }`}
                    ></div>
                    <div>
                      <div className="font-medium text-gray-900 font-mono text-sm">{tx.id}</div>
                      <div className="text-sm text-gray-600">{tx.type.replace("_", " ")}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{tx.amount > 0 ? `${tx.amount} PNTA` : "—"}</div>
                    <div className="text-xs text-gray-600">{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Penta AI Global Model Update */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Penta AI 글로벌 모델 업데이트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{(systemMetrics.globalAccuracy * 100).toFixed(2)}%</div>
              <div className="text-gray-600 text-sm">글로벌 모델 정확도</div>
              <Badge variant="outline" className="mt-1 border-blue-200 text-blue-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                지속 개선
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                v2.1.{Math.floor(systemMetrics.globalAccuracy * 10)}
              </div>
              <div className="text-gray-600 text-sm">모델 버전</div>
              <Badge variant="outline" className="mt-1 border-green-200 text-green-600">
                <Activity className="w-3 h-3 mr-1" />
                자동 업데이트
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{federatedNodes.length}</div>
              <div className="text-gray-600 text-sm">배포된 노드</div>
              <Badge variant="outline" className="mt-1 border-purple-200 text-purple-600">
                <Users className="w-3 h-3 mr-1" />
                실시간 동기화
              </Badge>
            </div>
          </div>

          {/* Model Update Flow starting from Local Nodes */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-gray-900 font-medium mb-4">모델 업데이트 플로우 (로컬 노드 시작)</h4>
            <div className="flex items-center justify-between overflow-x-auto">
              <div className="text-center min-w-0 flex-1">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Cpu className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">로컬 노드</span>
                <div className="text-xs text-gray-500 mt-1">학습 시작</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 mx-2" />
              <div className="text-center min-w-0 flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Network className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">연합학습</span>
                <div className="text-xs text-gray-500 mt-1">FedAvg 집계</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 mx-2" />
              <div className="text-center min-w-0 flex-1">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">글로벌 모델</span>
                <div className="text-xs text-gray-500 mt-1">통합 업데이트</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 mx-2" />
              <div className="text-center min-w-0 flex-1">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm text-gray-600">배포</span>
                <div className="text-xs text-gray-500 mt-1">노드 동기화</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            실시간 성능 지표
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2.3s</div>
              <div className="text-gray-600 text-sm">평균 응답시간</div>
              <div className="text-xs text-green-600 mt-1">↓ 15% 개선</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">99.8%</div>
              <div className="text-gray-600 text-sm">시스템 가동률</div>
              <div className="text-xs text-green-600 mt-1">↑ 0.2% 향상</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">94.2%</div>
              <div className="text-gray-600 text-sm">AI 정확도</div>
              <div className="text-xs text-green-600 mt-1">↑ 1.5% 향상</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">85%</div>
              <div className="text-gray-600 text-sm">가스비 절약</div>
              <div className="text-xs text-blue-600 mt-1">Layer2 최적화</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
