"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Network,
  Database,
  Cpu,
  Users,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Activity,
  TrendingUp,
  Coins,
  Server,
  GitBranch,
  Lock,
  CheckCircle,
  Clock,
  Globe,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react"
import BlockchainEngine from "./engines/BlockchainEngine"
import FederatedLearningEngine from "./engines/FederatedLearningEngine"
import EMAIFramework from "./engines/EMAIFramework"
import NASEngine from "./engines/NASEngine"
import AIWorksInterface from "./platforms/AIWorksInterface"

interface NodeAgent {
  id: string
  status: "active" | "training" | "idle" | "syncing"
  accuracy: number
  contribution: number
  rewards: number
  location: string
  lastUpdate: number
  modelVersion: string
}

interface TrainingMetrics {
  globalAccuracy: number
  totalNodes: number
  activeNodes: number
  currentRound: number
  pntaTokens: number
  blockHeight: number
  hashRate: string
  networkLatency: number
}

interface BlockchainTransaction {
  id: string
  type: "reward" | "model_update" | "contribution"
  amount: number
  from: string
  to: string
  timestamp: number
  status: "pending" | "confirmed" | "failed"
}

export default function PentaAIPlatform() {
  const [isTraining, setIsTraining] = useState(false)
  const [activeEngine, setActiveEngine] = useState<string>("overview")
  const [nodes, setNodes] = useState<NodeAgent[]>([
    {
      id: "Node-001",
      status: "active",
      accuracy: 0.85,
      contribution: 0.23,
      rewards: 150,
      location: "Seoul, KR",
      lastUpdate: Date.now(),
      modelVersion: "v2.1.3",
    },
    {
      id: "Node-002",
      status: "training",
      accuracy: 0.82,
      contribution: 0.19,
      rewards: 120,
      location: "Tokyo, JP",
      lastUpdate: Date.now() - 30000,
      modelVersion: "v2.1.2",
    },
    {
      id: "Node-003",
      status: "active",
      accuracy: 0.88,
      contribution: 0.31,
      rewards: 200,
      location: "Singapore, SG",
      lastUpdate: Date.now() - 15000,
      modelVersion: "v2.1.3",
    },
    {
      id: "Node-004",
      status: "syncing",
      accuracy: 0.79,
      contribution: 0.15,
      rewards: 95,
      location: "Sydney, AU",
      lastUpdate: Date.now() - 60000,
      modelVersion: "v2.1.1",
    },
  ])

  const [metrics, setMetrics] = useState<TrainingMetrics>({
    globalAccuracy: 0.835,
    totalNodes: 4,
    activeNodes: 2,
    currentRound: 15,
    pntaTokens: 565,
    blockHeight: 12847,
    hashRate: "2.4 TH/s",
    networkLatency: 45,
  })

  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([
    {
      id: "tx_001",
      type: "reward",
      amount: 25,
      from: "system",
      to: "Node-001",
      timestamp: Date.now() - 120000,
      status: "confirmed",
    },
    {
      id: "tx_002",
      type: "model_update",
      amount: 0,
      from: "Node-003",
      to: "global_model",
      timestamp: Date.now() - 60000,
      status: "confirmed",
    },
    {
      id: "tx_003",
      type: "contribution",
      amount: 15,
      from: "Node-002",
      to: "reward_pool",
      timestamp: Date.now() - 30000,
      status: "pending",
    },
  ])

  const [emaiProgress, setEmaiProgress] = useState(0)
  const [federatedProgress, setFederatedProgress] = useState(0)
  const [blockchainProgress, setBlockchainProgress] = useState(0)
  const [nasProgress, setNasProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTraining) {
      interval = setInterval(() => {
        // Simulate training progress
        setEmaiProgress((prev) => Math.min(prev + Math.random() * 3, 100))
        setFederatedProgress((prev) => Math.min(prev + Math.random() * 2, 100))
        setBlockchainProgress((prev) => Math.min(prev + Math.random() * 1.5, 100))
        setNasProgress((prev) => Math.min(prev + Math.random() * 2.5, 100))

        // Update metrics with realistic blockchain data
        setMetrics((prev) => ({
          ...prev,
          globalAccuracy: Math.min(prev.globalAccuracy + Math.random() * 0.0005, 0.95),
          currentRound: prev.currentRound + (Math.random() > 0.9 ? 1 : 0),
          pntaTokens: prev.pntaTokens + Math.floor(Math.random() * 3),
          blockHeight: prev.blockHeight + (Math.random() > 0.8 ? 1 : 0),
          networkLatency: Math.max(20, prev.networkLatency + (Math.random() - 0.5) * 10),
        }))

        // Update nodes with realistic federated learning behavior
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            accuracy: Math.min(node.accuracy + Math.random() * 0.001, 0.95),
            contribution: Math.min(node.contribution + Math.random() * 0.005, 1),
            rewards: node.rewards + Math.floor(Math.random() * 2),
            lastUpdate: Math.random() > 0.7 ? Date.now() : node.lastUpdate,
            status:
              Math.random() > 0.8
                ? (["active", "training", "syncing"] as const)[Math.floor(Math.random() * 3)]
                : node.status,
          })),
        )

        // Add new blockchain transactions
        if (Math.random() > 0.7) {
          const newTx: BlockchainTransaction = {
            id: `tx_${Date.now()}`,
            type: (["reward", "model_update", "contribution"] as const)[Math.floor(Math.random() * 3)],
            amount: Math.floor(Math.random() * 50),
            from: `Node-${String(Math.floor(Math.random() * 4) + 1).padStart(3, "0")}`,
            to: Math.random() > 0.5 ? "system" : "reward_pool",
            timestamp: Date.now(),
            status: "pending",
          }

          setTransactions((prev) => [newTx, ...prev.slice(0, 9)])
        }

        // Update transaction statuses
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.status === "pending" && Math.random() > 0.6 ? { ...tx, status: "confirmed" as const } : tx,
          ),
        )
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isTraining])

  const startTraining = () => {
    setIsTraining(true)
  }

  const stopTraining = () => {
    setIsTraining(false)
  }

  const resetSystem = () => {
    setIsTraining(false)
    setEmaiProgress(0)
    setFederatedProgress(0)
    setBlockchainProgress(0)
    setNasProgress(0)
    setMetrics({
      globalAccuracy: 0.835,
      totalNodes: 4,
      activeNodes: 2,
      currentRound: 15,
      pntaTokens: 565,
      blockHeight: 12847,
      hashRate: "2.4 TH/s",
      networkLatency: 45,
    })
  }

  const renderEngineInterface = () => {
    switch (activeEngine) {
      case "blockchain":
        return <BlockchainEngine transactions={transactions} metrics={metrics} isTraining={isTraining} />
      case "federated":
        return <FederatedLearningEngine nodes={nodes} metrics={metrics} isTraining={isTraining} />
      case "emai":
        return <EMAIFramework progress={emaiProgress} isTraining={isTraining} />
      case "nas":
        return <NASEngine progress={nasProgress} isTraining={isTraining} />
      case "aiworks":
        return <AIWorksInterface />
      default:
        return null
    }
  }

  return (
    <div className="space-y-10 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            실제 작동하는 탈중앙화 AI 플랫폼
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">Penta AI 생태계</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
            실제 AI 모델과 블록체인이 연동된 완전한 탈중앙화 플랫폼. 로컬 DeepSeek과 Gemini API를 모두 지원하며, Polygon
            메인넷 기반 Layer2 솔루션으로 가스비를 85% 절약합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={startTraining}
              disabled={isTraining}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 h-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              플랫폼 시작
            </Button>
            <Button
              onClick={() => setActiveEngine("demo")}
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 h-auto"
            >
              통합 데모 체험
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {/* 완전한 탈중앙화 AI 생태계 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">완전한 탈중앙화 AI 생태계</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
            Penta AI는 블록체인과 AI가 완벽하게 통합된 차세대 플랫폼입니다. 연합학습, 신경망 구조 탐색, 전문가 혼합 모델
            등 첨단 AI 기술과 탈중앙화 블록체인이 결합되어 혁신적인 AI 생태계를 구축합니다.
          </p>

          {/* 기술 배지 */}
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm mb-12">
            <Cpu className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-gray-700 text-sm font-medium">
              로컬 모델과 생성형AI를 하이브리드로 조합하여 최적의 성능을 제공합니다.
            </span>
          </div>

          {/* 4개 주요 기능 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-gray-900 text-lg font-bold mb-2">하이브리드 AI</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  로컬 DeepSeek과 Gemini API를 지능적으로 조합하여 최적의 성능을 제공합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Network className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-gray-900 text-lg font-bold mb-2">연합학습</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  프라이버시를 보장하면서 전 세계 노드들이 협력하여 Penta AI 글로벌 모델을 학습합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-gray-900 text-lg font-bold mb-2">블록체인 통합</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Infura 기반 Layer2 솔루션으로 85% 가스비 절약과 투명한 보상 시스템을 제공합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-gray-900 text-lg font-bold mb-2">AIWorks 마켓</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  AI 에이전트를 생성, 거래하고 PNTA 토큰으로 수익을 창출할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Penta AI 글로벌 모델 - 생태계의 중심 */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2 text-2xl">
              <Globe className="w-6 h-6" />
              Penta AI 글로벌 모델 - 생태계의 중심
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-gray-900 text-lg font-bold mb-4">지능형 순환 구조</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>연합학습을 통해 전 세계 노드에서 지식 수집</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Penta AI 글로벌 모델 통한 학습 수행</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>개인의 모델을 다시 로컬 노드 배포</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>지속적인 성장 향상과 지속 순환</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 text-lg font-bold mb-4">하이브리드 AI 운영</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>DeepSeek 로컬 모델 (프라이버시 우선)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Google Gemini API (고성능 추론)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>지능형 라우팅으로 최적 모델 선택</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>비용과 성능의 완벽한 균형 공정</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 기술 스택 및 아키텍처 */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2 text-2xl">
              <Layers className="w-6 h-6" />
              기술 스택 및 아키텍처
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* AI 레이어 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-gray-900 text-lg font-bold">AI 레이어</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• DeepSeek 로컬 모델</li>
                  <li>• Google Gemini API</li>
                  <li>• OpenAI GPT (확장 가능)</li>
                </ul>
              </div>

              {/* 블록체인 레이어 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Database className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-gray-900 text-lg font-bold">블록체인 레이어</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Infura 인프라 기반</li>
                  <li>• Polygon Layer2 네트워크</li>
                  <li>• PNTA 토큰 (ERC-20)</li>
                </ul>
              </div>

              {/* 네트워크 레이어 */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Network className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-gray-900 text-lg font-bold">네트워크 레이어</h3>
                </div>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• FedAvg 연합학습 알고리즘</li>
                  <li>• 차분 프라이버시 보장</li>
                  <li>• P2P 네트워크 통신</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status Dashboard */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              실시간 시스템 상태
              <Badge variant="outline" className="border-green-300 text-green-600">
                온라인
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{(metrics.globalAccuracy * 100).toFixed(2)}%</div>
                <div className="text-gray-600 text-sm">글로벌 모델 정확도</div>
                <Badge variant="outline" className="mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.12%
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">#{metrics.blockHeight.toLocaleString()}</div>
                <div className="text-gray-600 text-sm">블록 높이</div>
                <Badge variant="outline" className="mt-1">
                  <Database className="w-3 h-3 mr-1" />
                  {metrics.hashRate}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.pntaTokens.toLocaleString()}</div>
                <div className="text-gray-600 text-sm">PNTA 토큰 분배</div>
                <Badge variant="outline" className="mt-1">
                  <Coins className="w-3 h-3 mr-1" />
                  실시간
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.networkLatency}ms</div>
                <div className="text-gray-600 text-sm">네트워크 지연시간</div>
                <Badge variant="outline" className="mt-1">
                  <Network className="w-3 h-3 mr-1" />
                  최적
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                onClick={startTraining}
                disabled={isTraining}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                생태계 시작
              </Button>
              <Button onClick={stopTraining} disabled={!isTraining} className="bg-red-600 hover:bg-red-700 text-white">
                <Pause className="w-4 h-4 mr-2" />
                학습 중지
              </Button>
              <Button onClick={resetSystem} className="bg-gray-600 hover:bg-gray-700 text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                시스템 리셋
              </Button>
            </div>

            {/* Engine Selection */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "overview", label: "전체 개요", icon: <Settings className="w-4 h-4" /> },
                { id: "blockchain", label: "블록체인 엔진", icon: <Database className="w-4 h-4" /> },
                { id: "federated", label: "연합학습", icon: <Network className="w-4 h-4" /> },
                { id: "emai", label: "EMAI 프레임워크", icon: <Brain className="w-4 h-4" /> },
                { id: "nas", label: "NAS 엔진", icon: <Cpu className="w-4 h-4" /> },
                { id: "aiworks", label: "AIWorks 플랫폼", icon: <Zap className="w-4 h-4" /> },
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
          </CardContent>
        </Card>

        {/* Engine-specific Interface */}
        {activeEngine === "overview" ? (
          <>
            {/* Core Engines Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    EMAI 프레임워크
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">멀티모달 처리</span>
                        <span className="text-gray-900">{emaiProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={emaiProgress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isTraining ? "default" : "secondary"}>
                        {isTraining ? <Activity className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {isTraining ? "처리중" : "대기"}
                      </Badge>
                      <span className="text-xs text-gray-600">
                        {isTraining ? "앙상블 모델 집계 활성" : "학습 준비 완료"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    연합학습 엔진
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">그래디언트 집계</span>
                        <span className="text-gray-900">{federatedProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={federatedProgress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isTraining ? "default" : "secondary"}>
                        {isTraining ? <Users className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {metrics.activeNodes}/{metrics.totalNodes} 노드
                      </Badge>
                      <span className="text-xs text-gray-600">라운드 #{metrics.currentRound}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    블록체인 엔진
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">트랜잭션 처리</span>
                        <span className="text-gray-900">{blockchainProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={blockchainProgress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isTraining ? "default" : "secondary"}>
                        {isTraining ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        블록 #{metrics.blockHeight}
                      </Badge>
                      <span className="text-xs text-gray-600">
                        {transactions.filter((tx) => tx.status === "pending").length}개 대기중
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    NAS 엔진
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">구조 탐색</span>
                        <span className="text-gray-900">{nasProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={nasProgress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isTraining ? "default" : "secondary"}>
                        {isTraining ? <GitBranch className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {isTraining ? "최적화중" : "대기"}
                      </Badge>
                      <span className="text-xs text-gray-600">모델 {nodes[0]?.modelVersion || "v2.1.3"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Node Network */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  연합학습 네트워크 - 실시간 상태
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {nodes.map((node) => (
                    <div key={node.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-900 font-medium">{node.id}</span>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              node.status === "active"
                                ? "bg-green-400"
                                : node.status === "training"
                                  ? "bg-yellow-400"
                                  : node.status === "syncing"
                                    ? "bg-blue-400"
                                    : "bg-gray-400"
                            }`}
                          ></div>
                          <Badge variant="outline" className="text-xs">
                            {node.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">위치:</span>
                          <span className="text-gray-900">{node.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">정확도:</span>
                          <span className="text-gray-900">{(node.accuracy * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">기여도:</span>
                          <span className="text-gray-900">{(node.contribution * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PNTA 보상:</span>
                          <span className="text-gray-900">{node.rewards}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">모델 버전:</span>
                          <span className="text-gray-900">{node.modelVersion}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">마지막 업데이트:</span>
                          <span className="text-gray-900">
                            {Math.floor((Date.now() - node.lastUpdate) / 1000)}초 전
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Blockchain Transactions */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  최근 블록체인 트랜잭션
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            tx.status === "confirmed"
                              ? "bg-green-400"
                              : tx.status === "pending"
                                ? "bg-yellow-400"
                                : "bg-red-400"
                          }`}
                        ></div>
                        <div>
                          <div className="text-gray-900 font-medium">{tx.type.replace("_", " ").toUpperCase()}</div>
                          <div className="text-gray-600 text-sm">
                            {tx.from} → {tx.to}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-900 font-medium">{tx.amount > 0 ? `${tx.amount} PNTA` : "—"}</div>
                        <div className="text-gray-600 text-sm">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          renderEngineInterface()
        )}
      </div>
    </div>
  )
}
