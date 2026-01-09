"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  Globe,
  TrendingUp,
  Activity,
  Zap,
  Download,
  Upload,
  RefreshCw,
  Cpu,
  Target,
  Sparkles,
} from "lucide-react"

interface PentaGlobalModelProps {
  isTraining: boolean
  federatedNodes: any[]
  systemMetrics: any
}

export default function PentaGlobalModel({ isTraining, federatedNodes, systemMetrics }: PentaGlobalModelProps) {
  const [modelVersion, setModelVersion] = useState("v2.1.3")
  const [globalAccuracy, setGlobalAccuracy] = useState(0.835)
  const [modelSize, setModelSize] = useState("2.4GB")
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [selectedAIProvider, setSelectedAIProvider] = useState<"deepseek" | "gemini" | "hybrid">("hybrid")

  const [modelStats, setModelStats] = useState({
    totalParameters: "7.2B",
    activeNodes: 4,
    lastUpdate: Date.now(),
    improvements: 0.023,
    deployedNodes: 3,
    pendingUpdates: 1,
  })

  const [aiProviders, setAiProviders] = useState([
    {
      id: "deepseek",
      name: "DeepSeek (로컬)",
      status: "active",
      accuracy: 0.89,
      latency: 45,
      cost: 0,
      privacy: "완전",
    },
    {
      id: "gemini",
      name: "Google Gemini",
      status: "active",
      accuracy: 0.94,
      latency: 120,
      cost: 0.002,
      privacy: "제한적",
    },
    {
      id: "gpt",
      name: "OpenAI GPT",
      status: "available",
      accuracy: 0.92,
      latency: 150,
      cost: 0.003,
      privacy: "제한적",
    },
    {
      id: "claude",
      name: "Anthropic Claude",
      status: "available",
      accuracy: 0.91,
      latency: 130,
      cost: 0.0025,
      privacy: "제한적",
    },
  ])

  const [testQuery, setTestQuery] = useState("")
  const [testResult, setTestResult] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        // 글로벌 모델 훈련 진행
        setTrainingProgress((prev) => Math.min(prev + Math.random() * 2, 100))
        setDeploymentProgress((prev) => Math.min(prev + Math.random() * 1.5, 100))

        // 모델 정확도 개선
        setGlobalAccuracy((prev) => Math.min(prev + Math.random() * 0.0005, 0.98))

        // 모델 통계 업데이트
        setModelStats((prev) => ({
          ...prev,
          improvements: prev.improvements + Math.random() * 0.001,
          lastUpdate: Date.now(),
          deployedNodes: Math.min(prev.deployedNodes + (Math.random() > 0.8 ? 1 : 0), federatedNodes.length),
          pendingUpdates: Math.max(0, prev.pendingUpdates - (Math.random() > 0.7 ? 1 : 0)),
        }))

        // AI 제공자 상태 업데이트
        setAiProviders((prev) =>
          prev.map((provider) => ({
            ...provider,
            accuracy: Math.min(provider.accuracy + Math.random() * 0.0002, 0.98),
            latency: Math.max(30, provider.latency + (Math.random() - 0.5) * 5),
          })),
        )
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isTraining, federatedNodes.length])

  // 실제 AI 모델 테스트
  const testGlobalModel = async () => {
    if (!testQuery.trim()) return

    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      let response = ""
      switch (selectedAIProvider) {
        case "deepseek":
          response = `[DeepSeek 로컬 모델] "${testQuery}"에 대한 응답입니다. 완전한 프라이버시 보장으로 로컬에서 처리되었습니다. Penta AI 글로벌 모델 v${modelVersion}의 지식을 활용했습니다.`
          break
        case "gemini":
          response = `[Gemini API] "${testQuery}"에 대한 고성능 클라우드 AI 응답입니다. Penta AI 글로벌 모델과 연동하여 최적화된 결과를 제공합니다.`
          break
        case "hybrid":
          response = `[하이브리드 시스템] "${testQuery}"에 대해 DeepSeek 로컬 모델과 Gemini API를 지능적으로 조합한 응답입니다. Penta AI 글로벌 모델 v${modelVersion}이 최적의 라우팅을 결정했습니다.`
          break
      }

      setTestResult(response)
    } catch (error) {
      console.error("AI processing error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Global Model Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Penta AI 글로벌 모델 - 중앙 지능 허브
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{modelVersion}</div>
              <div className="text-gray-600 text-sm">현재 버전</div>
              <Badge variant="outline" className="mt-1 border-blue-200 text-blue-600">
                <RefreshCw className="w-3 h-3 mr-1" />
                자동 업데이트
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{(globalAccuracy * 100).toFixed(2)}%</div>
              <div className="text-gray-600 text-sm">글로벌 정확도</div>
              <Badge variant="outline" className="mt-1 border-green-200 text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />+{(modelStats.improvements * 100).toFixed(3)}%
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{modelStats.totalParameters}</div>
              <div className="text-gray-600 text-sm">총 매개변수</div>
              <Badge variant="outline" className="mt-1 border-purple-200 text-purple-600">
                <Sparkles className="w-3 h-3 mr-1" />
                대규모
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {modelStats.deployedNodes}/{modelStats.activeNodes}
              </div>
              <div className="text-gray-600 text-sm">배포된 노드</div>
              <Badge variant="outline" className="mt-1 border-orange-200 text-orange-600">
                <Globe className="w-3 h-3 mr-1" />
                실시간 동기화
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Provider Selection */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI 제공자 선택 및 하이브리드 운영
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="text-gray-900 text-sm font-medium mb-2 block">운영 모드 선택</label>
            <div className="flex gap-2">
              {[
                { id: "deepseek", label: "DeepSeek 로컬", icon: <Cpu className="w-4 h-4" /> },
                { id: "gemini", label: "Gemini API", icon: <Globe className="w-4 h-4" /> },
                { id: "hybrid", label: "하이브리드", icon: <Zap className="w-4 h-4" /> },
              ].map((mode) => (
                <Button
                  key={mode.id}
                  onClick={() => setSelectedAIProvider(mode.id as any)}
                  variant={selectedAIProvider === mode.id ? "default" : "outline"}
                  className={`${
                    selectedAIProvider === mode.id
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {mode.icon}
                  <span className="ml-2">{mode.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiProviders.map((provider) => (
              <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{provider.name}</h3>
                  <Badge
                    variant={provider.status === "active" ? "default" : "outline"}
                    className={provider.status === "active" ? "bg-green-600" : ""}
                  >
                    {provider.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">정확도:</span>
                    <span className="text-gray-900">{(provider.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">지연시간:</span>
                    <span className="text-gray-900">{provider.latency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">비용:</span>
                    <span className="text-gray-900">{provider.cost === 0 ? "무료" : `$${provider.cost}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">프라이버시:</span>
                    <span className="text-gray-900">{provider.privacy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Testing Interface */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5" />
            글로벌 모델 실시간 테스트
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-gray-900 text-sm font-medium mb-2 block">테스트 쿼리</label>
            <Textarea
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Penta AI 글로벌 모델을 테스트할 질문을 입력하세요..."
              className="bg-gray-50 border-gray-300 text-gray-900"
              rows={3}
            />
          </div>

          <Button
            onClick={testGlobalModel}
            disabled={!testQuery.trim() || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isProcessing ? "처리중..." : `${selectedAIProvider} 모델로 테스트`}
          </Button>

          {testResult && (
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h4 className="text-gray-900 font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                글로벌 모델 응답
              </h4>
              <p className="text-gray-700 text-sm">{testResult}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training and Deployment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              연합학습 기여 수집
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">훈련 진행률</span>
                  <span className="text-gray-900">{trainingProgress.toFixed(0)}%</span>
                </div>
                <Progress value={trainingProgress} className="h-3" />
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-900 font-medium">기여 노드 현황</h4>
                {federatedNodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-900 text-sm">{node.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-xs">{(node.contribution * 100).toFixed(0)}%</span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          node.status === "active" ? "bg-green-400" : "bg-yellow-400"
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Download className="w-5 h-5" />
              모델 배포 및 동기화
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">배포 진행률</span>
                  <span className="text-gray-900">{deploymentProgress.toFixed(0)}%</span>
                </div>
                <Progress value={deploymentProgress} className="h-3" />
              </div>

              <div className="space-y-2">
                <h4 className="text-gray-900 font-medium">배포 상태</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">마지막 업데이트:</span>
                    <span className="text-gray-900 text-sm">
                      {Math.floor((Date.now() - modelStats.lastUpdate) / 1000)}초 전
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">대기 중인 업데이트:</span>
                    <span className="text-gray-900 text-sm">{modelStats.pendingUpdates}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">동기화 완료:</span>
                    <span className="text-gray-900 text-sm">
                      {modelStats.deployedNodes}/{modelStats.activeNodes} 노드
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Performance Analytics */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            모델 성능 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-gray-900 font-medium mb-3">학습 효율성</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">수렴 속도:</span>
                  <span className="text-gray-900">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">데이터 효율성:</span>
                  <span className="text-gray-900">87.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">메모리 사용률:</span>
                  <span className="text-gray-900">68%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-3">배포 성능</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">동기화 속도:</span>
                  <span className="text-gray-900">15.2 MB/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">압축률:</span>
                  <span className="text-gray-900">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">배포 성공률:</span>
                  <span className="text-green-600">99.1%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-3">품질 지표</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">일관성:</span>
                  <span className="text-gray-900">96.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">안정성:</span>
                  <span className="text-gray-900">98.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">사용자 만족도:</span>
                  <span className="text-green-600">4.7/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
