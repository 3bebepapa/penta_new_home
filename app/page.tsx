"use client"
import { useState, useEffect } from "react"
import { Brain, Menu, X, Database, Network, CheckCircle, Zap, Layers, Sparkles, Globe, Settings, Play, Pause, RotateCcw, Search, Users, Activity, TrendingUp, Plus, Trash2, Key, Save, ArrowRight, Cpu } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// AI 엔진 컴포넌트들
import EMAIFramework from "@/components/engines/EMAIFramework"
import BlockchainEngine from "@/components/engines/BlockchainEngine"
import NASEngine from "@/components/engines/NASEngine"
import MoESystem from "@/components/engines/MoESystem"
import SquareGlobalModel from "@/components/engines/SquareGlobalModel"
import AIWorksInterface from "@/components/platforms/AIWorksInterface"
import IntegratedDemo from "@/components/demo/IntegratedDemo"
import Footer from "@/components/Footer"
import ModelSelectionModal from "@/components/modals/ModelSelectionModal"

export default function PentaLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [language, setLanguage] = useState<"ko" | "en">("ko")
  const [activeSection, setActiveSection] = useState("overview")
  const [activeEngine, setActiveEngine] = useState<string>("overview")
  const [walletAddress, setWalletAddress] = useState("0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e")
  const [showModelModal, setShowModelModal] = useState(false)

  // API 키 관리 상태
  const [apiKeys, setApiKeys] = useState({
    gemini: "",
    openai: "",
    infura: "3d235080f27243d5a8759860b8d178ca",
  })
  const [generatedApiKeys, setGeneratedApiKeys] = useState([
    { id: "pnta_api_1234567890abcdef", name: "개발용", createdAt: Date.now() - 86400000 },
    { id: "pnta_api_fedcba0987654321", name: "프로덕션용", createdAt: Date.now() - 172800000 },
  ])
  const [newApiKeyName, setNewApiKeyName] = useState("")

  // 전역 시스템 상태
  const [isTraining, setIsTraining] = useState(false)
  const [systemMetrics, setSystemMetrics] = useState({
    globalAccuracy: 0.835,
    totalNodes: 4,
    activeNodes: 2,
    currentRound: 15,
    pntaTokens: 565,
    blockHeight: 12847,
    hashRate: "2.4 TH/s",
    networkLatency: 45,
    gasPrice: "15 gwei",
    layer2Savings: "85%",
  })

  // 연합학습 노드들
  const [federatedNodes, setFederatedNodes] = useState([
    {
      id: "Node-001",
      location: "Seoul, KR",
      accuracy: 0.85,
      contribution: 0.23,
      rewards: 150,
      status: "active",
      modelVersion: "v2.1.3",
      lastUpdate: Date.now(),
      aiModel: "local",
    },
    {
      id: "Node-002",
      location: "Tokyo, JP",
      accuracy: 0.82,
      contribution: 0.19,
      rewards: 120,
      status: "training",
      modelVersion: "v2.1.2",
      lastUpdate: Date.now() - 30000,
      aiModel: "gemini",
    },
    {
      id: "Node-003",
      location: "Singapore, SG",
      accuracy: 0.88,
      contribution: 0.31,
      rewards: 200,
      status: "active",
      modelVersion: "v2.1.3",
      lastUpdate: Date.now() - 15000,
      aiModel: "hybrid",
    },
    {
      id: "Node-004",
      location: "Sydney, AU",
      accuracy: 0.79,
      contribution: 0.15,
      rewards: 95,
      status: "syncing",
      modelVersion: "v2.1.1",
      lastUpdate: Date.now() - 60000,
      aiModel: "local",
    },
  ])

  // 블록체인 트랜잭션
  const [transactions, setTransactions] = useState([
    {
      id: "0x1a2b3c...",
      type: "reward",
      amount: 25,
      from: "system",
      to: "Node-001",
      timestamp: Date.now() - 120000,
      status: "confirmed",
      gasUsed: "21000",
      layer2: true,
    },
    {
      id: "0x4d5e6f...",
      type: "model_update",
      amount: 0,
      from: "Node-003",
      to: "global_model",
      timestamp: Date.now() - 60000,
      status: "confirmed",
      gasUsed: "45000",
      layer2: true,
    },
    {
      id: "0x7g8h9i...",
      type: "contribution",
      amount: 15,
      from: "Node-002",
      to: "reward_pool",
      timestamp: Date.now() - 30000,
      status: "pending",
      gasUsed: "32000",
      layer2: true,
    },
  ])

  // 엔진 진행률
  const [engineProgress, setEngineProgress] = useState({
    emai: 0,
    federated: 0,
    blockchain: 0,
    nas: 0,
    moe: 0,
  })

  // 블록체인 관련 상태 추가 (기존 상태들 아래에)
  const [contractOperations, setContractOperations] = useState({
    rewardDistribution: false,
    modelRegistration: false,
    governance: false,
  })

  const [realBlockchainData, setRealBlockchainData] = useState({
    polygonRPC: "https://polygon-mainnet.infura.io/v3/3d235080f27243d5a8759860b8d178ca",
    contractAddresses: {
      pntaToken: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e",
      rewardPool: "0x1234567890123456789012345678901234567890",
      governance: "0x0987654321098765432109876543210987654321",
    },
    explorerBase: "https://polygonscan.com",
  })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 실제 시스템 시뮬레이션
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTraining) {
      interval = setInterval(() => {
        // 각 엔진 진행률 업데이트
        setEngineProgress((prev) => ({
          emai: Math.min(prev.emai + Math.random() * 3, 100),
          federated: Math.min(prev.federated + Math.random() * 2, 100),
          blockchain: Math.min(prev.blockchain + Math.random() * 1.5, 100),
          nas: Math.min(prev.nas + Math.random() * 2.5, 100),
          moe: Math.min(prev.moe + Math.random() * 2, 100),
        }))

        // 시스템 메트릭스 업데이트
        setSystemMetrics((prev) => ({
          ...prev,
          globalAccuracy: Math.min(prev.globalAccuracy + Math.random() * 0.0005, 0.95),
          currentRound: prev.currentRound + (Math.random() > 0.9 ? 1 : 0),
          pntaTokens: prev.pntaTokens + Math.floor(Math.random() * 3),
          blockHeight: prev.blockHeight + (Math.random() > 0.8 ? 1 : 0),
          networkLatency: Math.max(20, prev.networkLatency + (Math.random() - 0.5) * 10),
        }))

        // 노드 상태 업데이트
        setFederatedNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            accuracy: Math.min(node.accuracy + Math.random() * 0.001, 0.95),
            contribution: Math.min(node.contribution + Math.random() * 0.005, 1),
            rewards: node.rewards + Math.floor(Math.random() * 2),
            lastUpdate: Math.random() > 0.7 ? Date.now() : node.lastUpdate,
          })),
        )

        // 새로운 트랜잭션 생성
        if (Math.random() > 0.7) {
          const newTx = {
            id: `0x${Math.random().toString(16).substr(2, 8)}...`,
            type: (["reward", "model_update", "contribution"] as const)[Math.floor(Math.random() * 3)],
            amount: Math.floor(Math.random() * 50),
            from: `Node-${String(Math.floor(Math.random() * 4) + 1).padStart(3, "0")}`,
            to: Math.random() > 0.5 ? "system" : "reward_pool",
            timestamp: Date.now(),
            status: "pending" as const,
            gasUsed: String(Math.floor(Math.random() * 50000) + 21000),
            layer2: true,
          }
          setTransactions((prev) => [newTx, ...prev.slice(0, 9)])
        }
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isTraining])

  const content = {
    ko: {
      nav: {
        platform: "플랫폼",
        engines: "AI 엔진",
        blockchain: "블록체인",
        aiworks: "AIWorks",
        demo: "통합 데모",
      },
      hero: {
        badge: "차세대 탈중앙화 AI 플랫폼",
        title: "Penta AI 생태계",
        subtitle:
          "전 세계 최초로 연합학습과 블록체인이 완벽 통합된 혁신적인 AI 생태계. 개인의 데이터 주권을 보장하면서도 집단 지성을 통해 더 강력한 AI를 구현하는 새로운 패러다임을 제시합니다.",
        button: "플랫폼 시작",
        demoButton: "통합 데모 체험",
      },
    },
    en: {
      nav: {
        platform: "Platform",
        engines: "AI Engines",
        blockchain: "Blockchain",
        aiworks: "AIWorks",
        demo: "Integrated Demo",
      },
      hero: {
        badge: "Next-Generation Decentralized AI Platform",
        title: "Penta AI Ecosystem",
        subtitle:
          "World's first revolutionary AI ecosystem with perfect integration of federated learning and blockchain. A new paradigm that ensures individual data sovereignty while implementing more powerful AI through collective intelligence.",
        button: "Start Platform",
        demoButton: "Try Integrated Demo",
      },
    },
  }

  const t = content[language]

  const startTraining = () => setIsTraining(true)
  const stopTraining = () => setIsTraining(false)
  const resetSystem = () => {
    setIsTraining(false)
    setEngineProgress({ emai: 0, federated: 0, blockchain: 0, nas: 0, moe: 0 })
  }

  // API 키 저장 함수
  const saveApiKey = async (keyType: string, keyValue: string) => {
    try {
      // 실제 환경에서는 서버에 안전하게 저장
      setApiKeys((prev) => ({ ...prev, [keyType]: keyValue }))

      // 환경변수 업데이트 시뮬레이션
      if (keyType === "gemini") {
        // Gemini API 키가 설정되면 전체 시스템에서 사용 가능
        alert("Gemini API 키가 저장되었습니다. 이제 전체 시스템에서 Gemini AI를 사용할 수 있습니다.")
      } else if (keyType === "infura") {
        // Infura 키 업데이트
        setRealBlockchainData((prev) => ({
          ...prev,
          polygonRPC: `https://polygon-mainnet.infura.io/v3/${keyValue}`,
        }))
        alert("Infura API 키가 저장되었습니다. 블록체인 연결이 업데이트되었습니다.")
      }
    } catch (error) {
      console.error("API key save failed:", error)
      alert("API 키 저장에 실패했습니다.")
    }
  }

  // 새 API 키 생성
  const generateNewApiKey = () => {
    if (!newApiKeyName.trim()) {
      alert("API 키 이름을 입력해주세요.")
      return
    }

    const newKey = {
      id: `pnta_api_${Math.random().toString(36).substr(2, 16)}`,
      name: newApiKeyName,
      createdAt: Date.now(),
    }

    setGeneratedApiKeys((prev) => [newKey, ...prev])
    setNewApiKeyName("")
    alert(`새 API 키가 생성되었습니다: ${newKey.id}`)
  }

  // API 키 삭제
  const deleteApiKey = (keyId: string) => {
    if (confirm("정말로 이 API 키를 삭제하시겠습니까?")) {
      setGeneratedApiKeys((prev) => prev.filter((key) => key.id !== keyId))
      alert("API 키가 삭제되었습니다.")
    }
  }

  // 실제 스마트 컨트랙트 실행 함수들
  const executeRewardDistribution = async () => {
    setContractOperations((prev) => ({ ...prev, rewardDistribution: true }))

    try {
      // 실제 Web3 트랜잭션 시뮬레이션
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

      // 새 트랜잭션 추가
      const newTx = {
        id: txHash,
        type: "reward" as const,
        amount: Math.floor(Math.random() * 100 + 50),
        from: "reward_pool",
        to: "multiple_nodes",
        timestamp: Date.now(),
        status: "pending" as const,
        gasUsed: "45000",
        layer2: true,
      }

      setTransactions((prev) => [newTx, ...prev])

      // 3초 후 confirmed로 변경
      setTimeout(() => {
        setTransactions((prev) => prev.map((tx) => (tx.id === txHash ? { ...tx, status: "confirmed" as const } : tx)))
        setContractOperations((prev) => ({ ...prev, rewardDistribution: false }))
        alert(`보상 분배 완료! 트랜잭션: ${txHash.slice(0, 10)}...`)
      }, 3000)
    } catch (error) {
      console.error("Reward distribution failed:", error)
      setContractOperations((prev) => ({ ...prev, rewardDistribution: false }))
    }
  }

  const executeModelRegistration = async () => {
    setContractOperations((prev) => ({ ...prev, modelRegistration: true }))

    try {
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

      const newTx = {
        id: txHash,
        type: "model_update" as const,
        amount: 0,
        from: "global_model",
        to: "blockchain_registry",
        timestamp: Date.now(),
        status: "pending" as const,
        gasUsed: "65000",
        layer2: true,
      }

      setTransactions((prev) => [newTx, ...prev])

      setTimeout(() => {
        setTransactions((prev) => prev.map((tx) => (tx.id === txHash ? { ...tx, status: "confirmed" as const } : tx)))
        setContractOperations((prev) => ({ ...prev, modelRegistration: false }))
        alert(`모델 등록 완료! 새 버전: v2.${Math.floor(Math.random() * 10)}`)
      }, 4000)
    } catch (error) {
      console.error("Model registration failed:", error)
      setContractOperations((prev) => ({ ...prev, modelRegistration: false }))
    }
  }

  const executeGovernanceVote = async () => {
    setContractOperations((prev) => ({ ...prev, governance: true }))

    try {
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

      const newTx = {
        id: txHash,
        type: "contribution" as const,
        amount: 1, // 투표권
        from: walletAddress,
        to: "governance_contract",
        timestamp: Date.now(),
        status: "pending" as const,
        gasUsed: "32000",
        layer2: true,
      }

      setTransactions((prev) => [newTx, ...prev])

      setTimeout(() => {
        setTransactions((prev) => prev.map((tx) => (tx.id === txHash ? { ...tx, status: "confirmed" as const } : tx)))
        setContractOperations((prev) => ({ ...prev, governance: false }))
        alert(`거버넌스 투표 완료! 제안 #${Math.floor(Math.random() * 100)}에 찬성 투표`)
      }, 2500)
    } catch (error) {
      console.error("Governance vote failed:", error)
      setContractOperations((prev) => ({ ...prev, governance: false }))
    }
  }

  // 트랜잭션 클릭 시 익스플로러로 이동하는 함수
  const openInExplorer = (txId: string) => {
    const explorerUrl = `${realBlockchainData.explorerBase}/tx/${txId}`
    window.open(explorerUrl, "_blank")
  }

  const renderEngineInterface = () => {
    switch (activeEngine) {
      case "emai":
        return <EMAIFramework progress={engineProgress.emai} isTraining={isTraining} />
      case "federated":
        return (
          <div className="space-y-6">
            {/* Penta AI 글로벌 모델 상태 */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Penta AI 글로벌 모델 상태
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {(systemMetrics.globalAccuracy * 100).toFixed(2)}%
                    </div>
                    <div className="text-gray-600 text-sm">글로벌 모델 정확도</div>
                    <div className="text-blue-600 text-xs">지속 개선</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      v2.{Math.floor(systemMetrics.globalAccuracy * 10)}
                    </div>
                    <div className="text-gray-600 text-sm">모델 버전</div>
                    <div className="text-green-600 text-xs">자동 업데이트</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{systemMetrics.totalNodes}</div>
                    <div className="text-gray-600 text-sm">개 노드</div>
                    <div className="text-purple-600 text-xs">글로벌 참여</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{systemMetrics.pntaTokens}</div>
                    <div className="text-gray-600 text-sm">PNTA 토큰</div>
                    <div className="text-orange-600 text-xs">실시간 분배</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 연합학습 엔진 - 실시간 FedAvg 집계 */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  연합학습 엔진 - 실시간 FedAvg 집계
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">라운드 #{systemMetrics.currentRound}</div>
                    <div className="text-gray-600 text-sm">연합학습 라운드</div>
                    <div className="text-blue-600 text-xs">진행 중</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {systemMetrics.activeNodes}/{systemMetrics.totalNodes}
                    </div>
                    <div className="text-gray-600 text-sm">활성 노드</div>
                    <div className="text-green-600 text-xs">실시간 동기화</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">95.0%</div>
                    <div className="text-gray-600 text-sm">집계 정확도</div>
                    <div className="text-green-600 text-xs">최적화됨</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">95.0%</div>
                    <div className="text-gray-600 text-sm">수렴도</div>
                    <div className="text-green-600 text-xs">FedAvg</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FedAvg 집계 과정 실시간 시각화 */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  FedAvg 집계 과정 실시간 시각화
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-gray-900 font-medium mb-2">현재 단계: 모델 가중치 집계</h4>
                    <Progress value={engineProgress.federated} className="h-4 mb-2" />
                    <div className="text-sm text-gray-600">집계 진행률: {engineProgress.federated.toFixed(0)}%</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-gray-900 font-medium mb-2">FedAvg 공식 (실시간 계산)</h5>
                    <div className="font-mono text-sm text-gray-700 bg-white rounded p-2 border">
                      w_global = Σ(n_k / n_total) * w_k
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <div>노드별 기여도:</div>
                      <div>Node-001: 0.251 | Node-002: 0.193 | Node-003: 0.308 | Node-004: 0.248</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { step: 1, title: "로컬 모델 학습", status: "completed" },
                      { step: 2, title: "그래디언트 계산", status: "completed" },
                      { step: 3, title: "암호화된 전송", status: "completed" },
                      { step: 4, title: "FedAvg 집계", status: "processing" },
                      { step: 5, title: "글로벌 모델 업데이트", status: "pending" },
                    ].map((process, index) => (
                      <div key={index} className="text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                            process.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : process.status === "processing"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {process.step}
                        </div>
                        <div className="text-xs text-gray-600">{process.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 연합학습 네트워크 토폴로지 */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  연합학습 네트워크 토폴로지
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 flex items-center justify-center">
                  {/* 중앙 Penta AI 노드 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      Penta AI
                    </div>
                  </div>

                  {/* 주변 노드들 */}
                  {federatedNodes.map((node, index) => {
                    const angle = index * 90 * (Math.PI / 180)
                    const radius = 80
                    const x = Math.cos(angle) * radius
                    const y = Math.sin(angle) * radius

                    return (
                      <div
                        key={node.id}
                        className="absolute w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          left: `calc(50% + ${x}px - 24px)`,
                          top: `calc(50% + ${y}px - 24px)`,
                          backgroundColor:
                            node.status === "active" ? "#10B981" : node.status === "training" ? "#F59E0B" : "#6B7280",
                        }}
                      >
                        {node.id.split("-")[1]}
                      </div>
                    )
                  })}

                  {/* 연결선들 */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {federatedNodes.map((_, index) => {
                      const angle = index * 90 * (Math.PI / 180)
                      const radius = 80
                      const x1 = 50 + Math.cos(angle) * 20
                      const y1 = 50 + Math.sin(angle) * 20
                      const x2 = 50 + Math.cos(angle) * (radius - 20)
                      const y2 = 50 + Math.sin(angle) * (radius - 20)

                      return (
                        <line
                          key={index}
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="#3B82F6"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      )
                    })}
                  </svg>
                </div>

                {/* 노드 상세 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {federatedNodes.map((node) => (
                    <div key={node.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{node.id}</span>
                        <Badge variant={node.status === "active" ? "default" : "secondary"}>{node.status}</Badge>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">위치:</span>
                          <span className="text-gray-900">{node.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">AI 모델:</span>
                          <span className="text-gray-900">{node.aiModel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">정확도:</span>
                          <span className="text-gray-900">{(node.accuracy * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PNTA 보상:</span>
                          <span className="text-green-600">{node.rewards}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">모델 버전:</span>
                          <span className="text-gray-900">{node.modelVersion}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 실시간 성능 메트릭스 */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  실시간 성능 메트릭스
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-gray-900 font-medium mb-3">통신 효율성</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">압축률:</span>
                        <span className="text-gray-900">85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">대역폭 사용:</span>
                        <span className="text-gray-900">2.3 MB/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">지연시간:</span>
                        <span className="text-gray-900">45ms</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-medium mb-3">프라이버시 보호</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">암호화:</span>
                        <span className="text-gray-900">AES-256</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">차분 프라이버시:</span>
                        <span className="text-green-600">ε=1.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">보안 등급:</span>
                        <span className="text-green-600">높음</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-medium mb-3">모델 일관성</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">수렴 속도:</span>
                        <span className="text-gray-900">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">모델 동기화:</span>
                        <span className="text-green-600">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">전체 성능:</span>
                        <span className="text-green-600">94.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "blockchain":
        return (
          <BlockchainEngine
            transactions={transactions}
            metrics={systemMetrics}
            isTraining={isTraining}
            onRewardDistribution={executeRewardDistribution}
            onModelRegistration={executeModelRegistration}
            onGovernanceVote={executeGovernanceVote}
            onTransactionClick={openInExplorer}
            contractOperations={contractOperations}
            realBlockchainData={realBlockchainData}
          />
        )
      case "nas":
        return <NASEngine progress={engineProgress.nas} isTraining={isTraining} />
      case "moe":
        return <MoESystem progress={engineProgress.moe} isTraining={isTraining} />
      case "global":
        return (
          <SquareGlobalModel isTraining={isTraining} federatedNodes={federatedNodes} systemMetrics={systemMetrics} />
        )
      case "aiworks":
        return <AIWorksInterface />
      default:
        return null
    }
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white text-gray-900 overflow-x-hidden"
      style={{ fontFamily: '"Inter", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-100 px-6 lg:px-10 py-4 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center gap-3 text-gray-900">
            <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-tight">PENTA AI</h2>
          </div>

          <div className="flex flex-1 justify-end gap-6 lg:gap-8">
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <button
                onClick={() => setActiveSection("overview")}
                className={`text-sm font-medium leading-normal transition-colors ${
                  activeSection === "overview" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.nav.platform}
              </button>
              <button
                onClick={() => setActiveSection("engines")}
                className={`text-sm font-medium leading-normal transition-colors ${
                  activeSection === "engines" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.nav.engines}
              </button>
              <button
                onClick={() => setActiveSection("blockchain")}
                className={`text-sm font-medium leading-normal transition-colors ${
                  activeSection === "blockchain" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.nav.blockchain}
              </button>
              <button
                onClick={() => setActiveSection("aiworks")}
                className={`text-sm font-medium leading-normal transition-colors ${
                  activeSection === "aiworks" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.nav.aiworks}
              </button>
              <button
                onClick={() => setActiveSection("demo")}
                className={`text-sm font-medium leading-normal transition-colors ${
                  activeSection === "demo" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t.nav.demo}
              </button>
              <button
                onClick={() => setActiveSection("api-keys")}
                className={`text-sm font-medium leading-normal transition-colors ${
                  activeSection === "api-keys" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                API 키 관리
              </button>

              {/* Language Toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setLanguage("ko")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    language === "ko" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  한글
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    language === "en" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
            <button className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-blue-600 text-white text-sm font-semibold leading-normal tracking-normal hover:bg-blue-700 transition-colors">
              <span className="truncate">Connect Wallet</span>
            </button>
            <button className="md:hidden text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  setActiveSection("overview")
                  setIsMenuOpen(false)
                }}
                className={`text-left text-sm font-medium leading-normal ${
                  activeSection === "overview" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {t.nav.platform}
              </button>
              <button
                onClick={() => {
                  setActiveSection("engines")
                  setIsMenuOpen(false)
                }}
                className={`text-left text-sm font-medium leading-normal ${
                  activeSection === "engines" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {t.nav.engines}
              </button>
              <button
                onClick={() => {
                  setActiveSection("blockchain")
                  setIsMenuOpen(false)
                }}
                className={`text-left text-sm font-medium leading-normal ${
                  activeSection === "blockchain" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {t.nav.blockchain}
              </button>
              <button
                onClick={() => {
                  setActiveSection("aiworks")
                  setIsMenuOpen(false)
                }}
                className={`text-left text-sm font-medium leading-normal ${
                  activeSection === "aiworks" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {t.nav.aiworks}
              </button>
              <button
                onClick={() => {
                  setActiveSection("demo")
                  setIsMenuOpen(false)
                }}
                className={`text-left text-sm font-medium leading-normal ${
                  activeSection === "demo" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {t.nav.demo}
              </button>
              <button
                onClick={() => {
                  setActiveSection("api-keys")
                  setIsMenuOpen(false)
                }}
                className={`text-left text-sm font-medium leading-normal ${
                  activeSection === "api-keys" ? "text-blue-600" : "text-gray-600"
                }`}
              >
                API 키 관리
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full max-w-7xl">
            {activeSection === "overview" && (
              <>
                {/* Hero Section - Upstage 스타일로 깔끔하게 */}
                <div className="relative bg-white overflow-hidden">
                  <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
                    <div className="text-center">
                      {/* Status Badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
                        <Sparkles className="w-4 h-4" />
                        {t.hero.badge}
                      </div>

                      {/* Main Title */}
                      <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                        {t.hero.title}
                      </h1>

                      {/* Subtitle */}
                      <p className="text-lg lg:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        {t.hero.subtitle}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                          onClick={() => setActiveSection("engines")}
                          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          {t.hero.button}
                        </button>
                        <button
                          onClick={() => setActiveSection("demo")}
                          className="px-8 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          {t.hero.demoButton}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 완전한 탈중앙화 AI 생태계 */}
                <div className="px-6 lg:px-10 py-20 bg-white">
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        완전한 탈중앙화 AI 생태계
                      </h2>
                      <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Penta AI는 블록체인과 AI가 완벽하게 통합된 차세대 플랫폼입니다. 연합학습, 신경망 구조 탐색,
                        전문가 혼합 모델 등 첨단 AI 기술과 탈중앙화 블록체인이 결합되어 혁신적인 AI 생태계를 구축합니다.
                      </p>
                    </div>

                    {/* 기술 배지 */}
                    <div className="flex justify-center mb-16">
                      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200/50 shadow-sm">
                        <Cpu className="w-5 h-5 mr-3 text-blue-600" />
                        <span className="text-gray-700 font-medium">
                          로컬 모델과 생성형AI를 하이브리드로 조합하여 최적의 성능을 제공합니다.
                        </span>
                      </div>
                    </div>

                    {/* 4개 주요 기능 카드 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <Card className="bg-white border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Brain className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-gray-900 text-xl font-bold mb-4">하이브리드 AI</h3>
                          <p className="text-gray-600 leading-relaxed">
                            로컬 AI모델과 생성형AI를 지능적으로 조합하여 최적화된 성능을 제공하는 혁신적인 AI 시스템
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Network className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-gray-900 text-xl font-bold mb-4">연합학습</h3>
                          <p className="text-gray-600 leading-relaxed">
                            프라이버시를 보장하면서 분산된 데이터로 학습하는 Penta AI 글로벌 모델 구축 시스템
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Database className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-gray-900 text-xl font-bold mb-4">블록체인 통합</h3>
                          <p className="text-gray-600 leading-relaxed">
                            투명한 Layer2 솔루션으로 PNTA 기여도 측정과 보상 분배를 자동화하는 시스템
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-gray-900 text-xl font-bold mb-4">AIWorks 마켓</h3>
                          <p className="text-gray-600 leading-relaxed">
                            AI 에이전트를 생성, 거래, 배포할 수 있는 탈중앙화 PNTA 에이전트 마켓플레이스 플랫폼
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Penta AI 글로벌 모델 - 생성에서 응답 */}
                <div className="px-6 lg:px-10 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <Globe className="w-8 h-8 text-blue-600" />
                      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                        Penta AI 글로벌 모델 - 생성에서 응답
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">지능형 순환 구조</h3>
                        <ul className="space-y-4 text-gray-600">
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-lg">연합학습을 통해 글로벌 AI 모델 학습 수행</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-lg">Penta AI 생태계 전반의 학습 수행 최적 수행</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-lg">개인 데이터 보호와 집단 지성 활용 동시 달성</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-lg">AI의 지속적 성장 통한 생태계 가치 증진</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">하이브리드 AI 전략</h3>
                        <ul className="space-y-4 text-gray-600">
                          <li className="flex items-start gap-3">
                            <ArrowRight className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-lg">로컬 AI 모델 (프라이버시 우선)</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <ArrowRight className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-lg">생성형 AI 모델 (2차적 추론)</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <ArrowRight className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-lg">지능형 라우팅으로 최적 모델 선택</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <ArrowRight className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-lg">비용과 성능의 완벽한 균형 달성</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 기술 스택 및 아키텍처 */}
                <div className="px-6 lg:px-10 py-20 bg-white">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-16">
                      <Layers className="w-8 h-8 text-purple-600" />
                      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                        기술 스택 및 아키텍처
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      {/* AI 엔진 */}
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">AI 엔진</h3>
                        </div>
                        <ul className="space-y-3 text-gray-600 text-lg">
                          <li>• Penta Global AI 모델</li>
                          <li>• 다중 생성형 AI모델 지원</li>
                          <li>• EMAI 멀티모달 프레임워크</li>
                          <li>• NAS 자동 구조 탐색</li>
                          <li>• MoE 전문가 혼합 모델</li>
                        </ul>
                      </div>

                      {/* 블록체인 레이어 */}
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Database className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">블록체인 레이어</h3>
                        </div>
                        <ul className="space-y-3 text-gray-600 text-lg">
                          <li>• Polygon 메인넷 기반</li>
                          <li>• Layer2 솔루션 최적화</li>
                          <li>• 스마트 컨트랙트 기반 거버넌스</li>
                          <li>• PNTA 토큰 (ERC-20)</li>
                          <li>• 스마트 컨트랙트 자동화</li>
                          <li>• 실시간 보상 분배 시스템</li>
                        </ul>
                      </div>

                      {/* 네트워크 레이어 */}
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <Network className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">네트워크 레이어</h3>
                        </div>
                        <ul className="space-y-3 text-gray-600 text-lg">
                          <li>• FedAvg 연합학습 알고리즘</li>
                          <li>• 차분 프라이버시 보장</li>
                          <li>• P2P 네트워크 통신</li>
                          <li>• SMPC 보안 다자간 계산</li>
                          <li>• 동형 암호화 지원</li>
                          <li>• Penta AI 글로벌 모델 동기화</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Penta AI의 핵심 장점 */}
                <div className="px-6 lg:px-10 py-20 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-16">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                        Penta AI의 핵심 장점
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">완전한 프라이버시 보장</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                              데이터는 로컬에서만 처리되며 모델 파라미터만 공유하여 개인정보를 완벽하게 보호합니다.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">투명한 보상 시스템</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                              기여도에 따른 PNTA 토큰 분배가 블록체인에 투명하게 기록되어 공정성을 보장합니다.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">자동 최적화</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                              NAS와 MoE 시스템이 각 작업에 최적화된 AI 모델 구조를 자동으로 탐색합니다.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">지능형 고속화</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                              Layer2 솔루션으로 85% 가스비 절약과 빠른 거래 처리 속도를 제공합니다.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">실시간 협업</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                              전 세계 AI 에이전트들이 실시간으로 협업하여 더 강력한 집단 지성을 구현합니다.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-6">
                          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">확장 가능한 생태계</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                              AIWorks 마켓플레이스를 통해 누구나 AI 에이전트를 만들고 거래할 수 있습니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 실시간 시스템 상태 */}
                <div className="px-6 lg:px-10 py-20 bg-white">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <Activity className="w-8 h-8 text-green-600" />
                      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                        실시간 시스템 상태
                      </h2>
                      <Badge
                        variant="outline"
                        className="border-green-300 text-green-600 px-4 py-2 text-sm font-semibold"
                      >
                        온라인
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
                      <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-2">83.50%</div>
                          <div className="text-gray-600 text-sm font-medium">글로벌 AI 정확도</div>
                          <div className="text-green-600 text-xs font-medium mt-1">⬆ 연합학습 AI</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-2">#12847</div>
                          <div className="text-gray-600 text-sm font-medium">블록 높이</div>
                          <div className="text-blue-600 text-xs font-medium mt-1">⬆ Layer2</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-2">15 gwei</div>
                          <div className="text-gray-600 text-sm font-medium">가스 가격</div>
                          <div className="text-green-600 text-xs font-medium mt-1">⬇ 85% 절약</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-2">565</div>
                          <div className="text-gray-600 text-sm font-medium">PNTA 토큰</div>
                          <div className="text-orange-600 text-xs font-medium mt-1">⬆ 실시간</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-2">Polygon</div>
                          <div className="text-gray-600 text-sm font-medium">메인넷 (Layer2)</div>
                          <div className="text-green-600 text-xs font-medium mt-1">⬆ 연결됨</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* 연합학습 네트워크 */}
                      <Card className="bg-white border-gray-100 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-gray-900 flex items-center gap-3 text-xl">
                            <Network className="w-6 h-6 text-green-600" />
                            연합학습 네트워크
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">활성 노드:</span>
                              <span className="text-gray-900 font-semibold">2/4</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">현재 라운드:</span>
                              <span className="text-gray-900 font-semibold">#15</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">학습 상태:</span>
                              <Badge variant="outline" className="border-green-300 text-green-600">
                                활성
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* AI 모델 상태 */}
                      <Card className="bg-white border-gray-100 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-gray-900 flex items-center gap-3 text-xl">
                            <Brain className="w-6 h-6 text-blue-600" />
                            AI 모델 상태
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">모델 버전:</span>
                              <span className="text-gray-900 font-semibold">v2.8</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">성능 API:</span>
                              <span className="text-gray-900 font-semibold">하이브리드</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">응답 시간:</span>
                              <span className="text-gray-900 font-semibold">45ms</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 블록체인 상태 */}
                      <Card className="bg-white border-gray-100 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-gray-900 flex items-center gap-3 text-xl">
                            <Database className="w-6 h-6 text-purple-600" />
                            블록체인 상태
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">체인:</span>
                              <span className="text-gray-900 font-semibold">활성</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">Polygon 네트워크:</span>
                              <span className="text-gray-900 font-semibold">활성</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">TPS:</span>
                              <span className="text-gray-900 font-semibold">7,200+</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* 시작하기 */}
                <div className="px-6 lg:px-10 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-16">
                      <Play className="w-8 h-8 text-blue-600" />
                      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">시작하기</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                          1
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">지갑 연결</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          MetaMask를 연결하고 Polygon 네트워크를 설정하여 Penta AI 생태계에 참여하세요.
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                          2
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">노드 참여</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          연합학습 네트워크에 참여하여 글로벌 AI 모델 학습에 기여하고 PNTA 토큰을 획득하세요.
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                          3
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">보상 획득</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          기여도에 따라 자동으로 PNTA 토큰 보상을 받고 AIWorks에서 거래하세요.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "engines" && (
              <div className="flex flex-col gap-6 px-4 py-10">
                <div className="flex flex-col gap-4">
                  <h1 className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">
                    AI 엔진 시스템
                  </h1>
                  <p className="text-gray-600 text-base font-normal leading-normal">
                    Penta AI의 핵심을 이루는 6개의 혁신적인 AI 엔진들을 살펴보세요
                  </p>
                </div>

                {/* Engine Selection */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { id: "overview", label: "전체 개요", icon: <Activity className="w-4 h-4" /> },
                    { id: "emai", label: "EMAI", icon: <Brain className="w-4 h-4" /> },
                    { id: "federated", label: "연합학습", icon: <Network className="w-4 h-4" /> },
                    { id: "blockchain", label: "블록체인", icon: <Database className="w-4 h-4" /> },
                    { id: "nas", label: "NAS", icon: <Search className="w-4 h-4" /> },
                    { id: "moe", label: "MoE", icon: <Zap className="w-4 h-4" /> },
                    { id: "global", label: "글로벌 모델", icon: <Globe className="w-4 h-4" /> },
                    { id: "aiworks", label: "AIWorks", icon: <Users className="w-4 h-4" /> },
                  ].map((engine) => (
                    <Button
                      key={engine.id}
                      onClick={() => setActiveEngine(engine.id)}
                      variant={activeEngine === engine.id ? "default" : "outline"}
                      className={`${
                        activeEngine === engine.id
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      size="sm"
                    >
                      {engine.icon}
                      <span className="ml-2">{engine.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Engine Interface */}
                {activeEngine === "overview" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* System Status Overview */}
                    <Card className="col-span-full bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-gray-900 flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          시스템 전체 상태
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {(systemMetrics.globalAccuracy * 100).toFixed(1)}%
                            </div>
                            <div className="text-gray-600 text-sm">AI 정확도</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {systemMetrics.activeNodes}/{systemMetrics.totalNodes}
                            </div>
                            <div className="text-gray-600 text-sm">활성 노드</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">#{systemMetrics.blockHeight}</div>
                            <div className="text-gray-600 text-sm">블록 높이</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{systemMetrics.pntaTokens}</div>
                            <div className="text-gray-600 text-sm">PNTA 토큰</div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                          <Button
                            onClick={startTraining}
                            disabled={isTraining}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            시스템 시작
                          </Button>
                          <Button
                            onClick={stopTraining}
                            disabled={!isTraining}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            시스템 중지
                          </Button>
                          <Button onClick={resetSystem} className="bg-gray-600 hover:bg-gray-700 text-white">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            시스템 리셋
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Individual Engine Status */}
                    {[
                      {
                        id: "emai",
                        name: "EMAI 프레임워크",
                        icon: Brain,
                        color: "blue",
                        progress: engineProgress.emai,
                      },
                      {
                        id: "federated",
                        name: "연합학습",
                        icon: Network,
                        color: "green",
                        progress: engineProgress.federated,
                      },
                      {
                        id: "blockchain",
                        name: "블록체인",
                        icon: Database,
                        color: "purple",
                        progress: engineProgress.blockchain,
                      },
                      { id: "nas", name: "NAS 엔진", icon: Search, color: "red", progress: engineProgress.nas },
                      { id: "moe", name: "MoE 시스템", icon: Zap, color: "orange", progress: engineProgress.moe },
                      { id: "global", name: "글로벌 모델", icon: Globe, color: "indigo", progress: 85 },
                    ].map((engine) => (
                      <Card key={engine.id} className="bg-white border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-gray-900 flex items-center gap-2">
                            <engine.icon className={`w-5 h-5 text-${engine.color}-600`} />
                            {engine.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Progress value={engine.progress} className="h-2 mb-2" />
                          <p className="text-sm text-gray-600">처리 진행률: {engine.progress.toFixed(0)}%</p>
                          <Badge variant={isTraining ? "default" : "secondary"} className="mt-2">
                            {isTraining ? "처리중" : "대기"}
                          </Badge>
                          <Button
                            onClick={() => setActiveEngine(engine.id)}
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            상세 보기
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  renderEngineInterface()
                )}
              </div>
            )}

            {activeSection === "blockchain" && (
              <div className="flex flex-col gap-6 px-4 py-10">
                <div className="flex flex-col gap-4">
                  <h1 className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">
                    블록체인 시스템
                  </h1>
                  <p className="text-gray-600 text-base font-normal leading-normal">
                    투명하고 공정한 AI 생태계를 위한 Layer2 블록체인 인프라
                  </p>
                </div>
                <BlockchainEngine
                  transactions={transactions}
                  metrics={systemMetrics}
                  isTraining={isTraining}
                  onRewardDistribution={executeRewardDistribution}
                  onModelRegistration={executeModelRegistration}
                  onGovernanceVote={executeGovernanceVote}
                  onTransactionClick={openInExplorer}
                  contractOperations={contractOperations}
                  realBlockchainData={realBlockchainData}
                />
              </div>
            )}

            {activeSection === "aiworks" && (
              <div className="flex flex-col gap-6 px-4 py-10">
                <div className="flex flex-col gap-4">
                  <h1 className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">
                    AIWorks 마켓플레이스
                  </h1>
                  <p className="text-gray-600 text-base font-normal leading-normal">
                    AI 에이전트를 생성, 거래, 배포할 수 있는 탈중앙화 마켓플레이스
                  </p>
                </div>
                <AIWorksInterface />
              </div>
            )}

            {activeSection === "demo" && (
              <div className="flex flex-col gap-6 px-4 py-10">
                <div className="flex flex-col gap-4">
                  <h1 className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">통합 데모</h1>
                  <p className="text-gray-600 text-base font-normal leading-normal">
                    Penta AI 생태계의 모든 기능을 실제로 체험해보세요
                  </p>
                </div>
                <IntegratedDemo
                  isTraining={isTraining}
                  systemMetrics={systemMetrics}
                  federatedNodes={federatedNodes}
                  transactions={transactions}
                  engineProgress={engineProgress}
                  onStartTraining={startTraining}
                  onStopTraining={stopTraining}
                  onResetSystem={resetSystem}
                />
              </div>
            )}

            {activeSection === "api-keys" && (
              <div className="flex flex-col gap-6 px-4 py-10">
                <div className="flex flex-col gap-4">
                  <h1 className="text-gray-900 text-4xl font-black leading-tight tracking-[-0.033em]">API 키 관리</h1>
                  <p className="text-gray-600 text-base font-normal leading-normal">
                    Penta AI 시스템에서 사용할 API 키들을 관리하세요
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 외부 API 키 설정 */}
                  <Card className="bg-white border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-900 flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        외부 API 키 설정
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Gemini API 키 */}
                      <div>
                        <label className="text-gray-900 text-sm font-medium mb-2 block">
                          Gemini API 키
                          <Badge variant="outline" className="ml-2 border-green-300 text-green-600">
                            전체 시스템 연동
                          </Badge>
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            value={apiKeys.gemini}
                            onChange={(e) => setApiKeys((prev) => ({ ...prev, gemini: e.target.value }))}
                            placeholder="AIzaSy..."
                            className="bg-gray-50 border-gray-300 text-gray-900"
                          />
                          <Button
                            onClick={() => saveApiKey("gemini", apiKeys.gemini)}
                            disabled={!apiKeys.gemini.trim()}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Gemini API 키를 설정하면 전체 AI 시스템에서 Gemini 모델을 사용할 수 있습니다.
                        </p>
                      </div>

                      {/* Infura API 키 */}
                      <div>
                        <label className="text-gray-900 text-sm font-medium mb-2 block">
                          Infura API 키
                          <Badge variant="outline" className="ml-2 border-purple-300 text-purple-600">
                            블록체인 연결
                          </Badge>
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            value={apiKeys.infura}
                            onChange={(e) => setApiKeys((prev) => ({ ...prev, infura: e.target.value }))}
                            placeholder="3d235080f27243d5a8759860b8d178ca"
                            className="bg-gray-50 border-gray-300 text-gray-900"
                          />
                          <Button
                            onClick={() => saveApiKey("infura", apiKeys.infura)}
                            disabled={!apiKeys.infura.trim()}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Polygon 네트워크 연결을 위한 Infura 프로젝트 ID입니다.
                        </p>
                      </div>

                      {/* OpenAI API 키 */}
                      <div>
                        <label className="text-gray-900 text-sm font-medium mb-2 block">
                          OpenAI API 키
                          <Badge variant="outline" className="ml-2 border-gray-300 text-gray-600">
                            선택사항
                          </Badge>
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            value={apiKeys.openai}
                            onChange={(e) => setApiKeys((prev) => ({ ...prev, openai: e.target.value }))}
                            placeholder="sk-..."
                            className="bg-gray-50 border-gray-300 text-gray-900"
                          />
                          <Button
                            onClick={() => saveApiKey("openai", apiKeys.openai)}
                            disabled={!apiKeys.openai.trim()}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          OpenAI GPT 모델 사용을 위한 API 키입니다. (선택사항)
                        </p>
                      </div>

                      {/* 현재 설정된 키 상태 */}
                      <div className="border-t pt-4">
                        <h4 className="text-gray-900 font-medium mb-2">현재 설정 상태</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Gemini API:</span>
                            <Badge variant={apiKeys.gemini ? "default" : "secondary"}>
                              {apiKeys.gemini ? "설정됨" : "미설정"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Infura API:</span>
                            <Badge variant={apiKeys.infura ? "default" : "secondary"}>
                              {apiKeys.infura ? "설정됨" : "미설정"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">OpenAI API:</span>
                            <Badge variant={apiKeys.openai ? "default" : "secondary"}>
                              {apiKeys.openai ? "설정됨" : "미설정"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Penta AI API 키 관리 */}
                  <Card className="bg-white border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-gray-900 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Penta AI API 키 관리
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 새 API 키 생성 */}
                      <div>
                        <label className="text-gray-900 text-sm font-medium mb-2 block">새 API 키 생성</label>
                        <div className="flex gap-2">
                          <Input
                            value={newApiKeyName}
                            onChange={(e) => setNewApiKeyName(e.target.value)}
                            placeholder="API 키 이름 (예: 개발용, 프로덕션용)"
                            className="bg-gray-50 border-gray-300 text-gray-900"
                          />
                          <Button
                            onClick={generateNewApiKey}
                            disabled={!newApiKeyName.trim()}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 기존 API 키 목록 */}
                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">생성된 API 키</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {generatedApiKeys.map((key) => (
                            <div
                              key={key.id}
                              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-gray-900">{key.name}</span>
                                  <Badge variant="outline" className="border-blue-300 text-blue-600">
                                    활성
                                  </Badge>
                                </div>
                                <div className="font-mono text-xs text-gray-600 truncate">{key.id}</div>
                                <div className="text-xs text-gray-500">
                                  생성일: {new Date(key.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <Button
                                onClick={() => deleteApiKey(key.id)}
                                variant="outline"
                                size="sm"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* API 사용 통계 */}
                      <div className="border-t pt-4">
                        <h4 className="text-gray-900 font-medium mb-2">API 사용 통계</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-gray-900">
                              {Math.floor(Math.random() * 10000 + 5000)}
                            </div>
                            <div className="text-gray-600 text-sm">이번 달 요청</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xl font-bold text-gray-900">{generatedApiKeys.length}</div>
                            <div className="text-gray-600 text-sm">활성 키</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* API 연동 상태 */}
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      실시간 API 연동 상태
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-center mb-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-gray-900">Gemini API</span>
                        </div>
                        <div className="text-xs text-gray-600">{apiKeys.gemini ? "✅ 연결됨" : "⏸️ 대기 중"}</div>
                        <div className="text-xs text-gray-500 mt-1">응답시간: {apiKeys.gemini ? "120ms" : "N/A"}</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-center mb-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-gray-900">Infura RPC</span>
                        </div>
                        <div className="text-xs text-gray-600">✅ 연결됨</div>
                        <div className="text-xs text-gray-500 mt-1">Polygon 메인넷</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-center mb-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-gray-900">Penta AI 네트워크</span>
                        </div>
                        <div className="text-xs text-gray-600">✅ 활성</div>
                        <div className="text-xs text-gray-500 mt-1">{systemMetrics.activeNodes}개 노드 연결</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>

      {/* Model Selection Modal */}
      {showModelModal && <ModelSelectionModal onClose={() => setShowModelModal(false)} />}
    </div>
  )
}
