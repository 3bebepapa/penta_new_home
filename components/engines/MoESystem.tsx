"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Users, Target, Activity, TrendingUp, Zap, Brain, Network, Settings, Play, BarChart3 } from "lucide-react"

interface Expert {
  id: string
  name: string
  domain: string
  accuracy: number
  load: number
  status: "active" | "idle" | "training"
  specialization: string
  requests: number
  responseTime: number
  expertise: number
}

interface MoESystemProps {
  progress: number
  isTraining: boolean
}

export default function MoESystem({ progress, isTraining }: MoESystemProps) {
  const [experts, setExperts] = useState<Expert[]>([
    {
      id: "expert_001",
      name: "Vision Expert",
      domain: "Computer Vision",
      accuracy: 0.94,
      load: 0.65,
      status: "active",
      specialization: "이미지 분류, 객체 감지, 장면 이해",
      requests: 1250,
      responseTime: 85,
      expertise: 0.96,
    },
    {
      id: "expert_002",
      name: "NLP Expert",
      domain: "Natural Language",
      accuracy: 0.91,
      load: 0.78,
      status: "active",
      specialization: "텍스트 분석, 감정 분석, 언어 모델링",
      requests: 980,
      responseTime: 120,
      expertise: 0.93,
    },
    {
      id: "expert_003",
      name: "Audio Expert",
      domain: "Audio Processing",
      accuracy: 0.88,
      load: 0.42,
      status: "active",
      specialization: "음성 인식, 오디오 분류, 음향 분석",
      requests: 650,
      responseTime: 95,
      expertise: 0.89,
    },
    {
      id: "expert_004",
      name: "Multimodal Expert",
      domain: "Cross-Modal",
      accuracy: 0.92,
      load: 0.55,
      status: "training",
      specialization: "멀티모달 융합, 크로스 모달 학습",
      requests: 420,
      responseTime: 150,
      expertise: 0.91,
    },
    {
      id: "expert_005",
      name: "Code Expert",
      domain: "Programming",
      accuracy: 0.89,
      load: 0.33,
      status: "active",
      specialization: "코드 생성, 프로그래밍 분석",
      requests: 380,
      responseTime: 110,
      expertise: 0.87,
    },
    {
      id: "expert_006",
      name: "Math Expert",
      domain: "Mathematics",
      accuracy: 0.95,
      load: 0.28,
      status: "idle",
      specialization: "수학 문제 해결, 공식 유도",
      requests: 220,
      responseTime: 75,
      expertise: 0.94,
    },
  ])

  const [routingStats, setRoutingStats] = useState({
    totalRequests: 3900,
    routingAccuracy: 0.96,
    loadBalance: 0.85,
    avgResponseTime: 105,
    expertUtilization: 0.72,
  })

  const [inputQuery, setInputQuery] = useState("")
  const [routingResult, setRoutingResult] = useState<{
    selectedExperts: string[]
    confidence: number
    reasoning: string
    weights: number[]
    estimatedTime: number
  } | null>(null)

  const [gatingNetwork, setGatingNetwork] = useState({
    accuracy: 0.94,
    trainingLoss: 0.12,
    validationLoss: 0.15,
    epochs: 150,
  })

  // MoE 시스템 실시간 업데이트
  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        // 전문가 상태 업데이트
        setExperts((prev) =>
          prev.map((expert) => ({
            ...expert,
            load: Math.max(0.05, Math.min(0.95, expert.load + (Math.random() - 0.5) * 0.1)),
            accuracy: Math.min(0.99, expert.accuracy + Math.random() * 0.001),
            requests: expert.requests + Math.floor(Math.random() * 8),
            responseTime: Math.max(50, expert.responseTime + (Math.random() - 0.5) * 15),
            expertise: Math.min(0.99, expert.expertise + Math.random() * 0.001),
            status:
              Math.random() > 0.9
                ? (["active", "idle", "training"] as const)[Math.floor(Math.random() * 3)]
                : expert.status,
          })),
        )

        // 라우팅 통계 업데이트
        setRoutingStats((prev) => ({
          totalRequests: prev.totalRequests + Math.floor(Math.random() * 15),
          routingAccuracy: Math.min(0.99, prev.routingAccuracy + Math.random() * 0.001),
          loadBalance: Math.max(0.7, Math.min(0.98, prev.loadBalance + (Math.random() - 0.5) * 0.03)),
          avgResponseTime: Math.max(70, prev.avgResponseTime + (Math.random() - 0.5) * 8),
          expertUtilization: Math.max(0.5, Math.min(0.9, prev.expertUtilization + (Math.random() - 0.5) * 0.05)),
        }))

        // 게이팅 네트워크 업데이트
        setGatingNetwork((prev) => ({
          accuracy: Math.min(0.98, prev.accuracy + Math.random() * 0.001),
          trainingLoss: Math.max(0.05, prev.trainingLoss - Math.random() * 0.001),
          validationLoss: Math.max(0.08, prev.validationLoss - Math.random() * 0.001),
          epochs: prev.epochs + (Math.random() > 0.8 ? 1 : 0),
        }))
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isTraining])

  // 지능형 라우팅 알고리즘
  const performRouting = () => {
    if (!inputQuery.trim()) return

    const keywords = inputQuery.toLowerCase()
    const expertScores: { [key: string]: number } = {}
    const selectedExperts: string[] = []
    const weights: number[] = []
    let reasoning = ""

    // 도메인별 키워드 매칭
    experts.forEach((expert) => {
      let score = 0

      // 도메인 특화 키워드 점수 계산
      if (expert.domain === "Computer Vision") {
        if (
          keywords.includes("이미지") ||
          keywords.includes("사진") ||
          keywords.includes("그림") ||
          keywords.includes("시각")
        ) {
          score += 0.8
        }
        if (keywords.includes("객체") || keywords.includes("감지") || keywords.includes("인식")) {
          score += 0.6
        }
      }

      if (expert.domain === "Natural Language") {
        if (
          keywords.includes("텍스트") ||
          keywords.includes("글") ||
          keywords.includes("문장") ||
          keywords.includes("언어")
        ) {
          score += 0.8
        }
        if (keywords.includes("번역") || keywords.includes("요약") || keywords.includes("분석")) {
          score += 0.6
        }
      }

      if (expert.domain === "Audio Processing") {
        if (
          keywords.includes("음성") ||
          keywords.includes("소리") ||
          keywords.includes("오디오") ||
          keywords.includes("음향")
        ) {
          score += 0.8
        }
        if (keywords.includes("인식") || keywords.includes("변환")) {
          score += 0.6
        }
      }

      if (expert.domain === "Programming") {
        if (keywords.includes("코드") || keywords.includes("프로그래밍") || keywords.includes("개발")) {
          score += 0.8
        }
        if (keywords.includes("함수") || keywords.includes("알고리즘")) {
          score += 0.6
        }
      }

      if (expert.domain === "Mathematics") {
        if (keywords.includes("수학") || keywords.includes("계산") || keywords.includes("공식")) {
          score += 0.8
        }
        if (keywords.includes("방정식") || keywords.includes("함수")) {
          score += 0.6
        }
      }

      // 전문가 성능 및 가용성 고려
      score *= expert.expertise * expert.accuracy
      score *= 1 - expert.load // 부하가 낮을수록 높은 점수
      score *= expert.status === "active" ? 1 : 0.3

      expertScores[expert.name] = score
    })

    // 상위 전문가 선택 (최대 3개)
    const sortedExperts = Object.entries(expertScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .filter(([, score]) => score > 0.1)

    if (sortedExperts.length === 0) {
      selectedExperts.push("NLP Expert")
      weights.push(1.0)
      reasoning = "기본 NLP 전문가로 라우팅"
    } else {
      const totalScore = sortedExperts.reduce((sum, [, score]) => sum + score, 0)
      sortedExperts.forEach(([name, score]) => {
        selectedExperts.push(name)
        weights.push(score / totalScore)
      })

      reasoning = `${selectedExperts.length}개 전문가 선택: ${selectedExperts
        .map((name, i) => `${name}(${(weights[i] * 100).toFixed(1)}%)`)
        .join(", ")}`
    }

    // 예상 응답 시간 계산
    const estimatedTime = selectedExperts.reduce((sum, expertName, i) => {
      const expert = experts.find((e) => e.name === expertName)
      return sum + (expert?.responseTime || 100) * weights[i]
    }, 0)

    setRoutingResult({
      selectedExperts,
      confidence: 0.8 + Math.random() * 0.15,
      reasoning,
      weights,
      estimatedTime: Math.round(estimatedTime),
    })
  }

  const totalLoad = experts.reduce((sum, expert) => sum + expert.load, 0) / experts.length
  const activeExperts = experts.filter((expert) => expert.status === "active").length
  const avgAccuracy = experts.reduce((sum, expert) => sum + expert.accuracy, 0) / experts.length

  return (
    <div className="space-y-6">
      {/* MoE System Overview */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            전문가 혼합 (MoE) 시스템
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{experts.length}</div>
              <div className="text-gray-600 text-sm">전체 전문가</div>
              <Badge variant="outline" className="mt-1 border-blue-200 text-blue-600">
                <Activity className="w-3 h-3 mr-1" />
                {activeExperts} 활성
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{(routingStats.routingAccuracy * 100).toFixed(1)}%</div>
              <div className="text-gray-600 text-sm">라우팅 정확도</div>
              <Badge variant="outline" className="mt-1 border-green-200 text-green-600">
                <Target className="w-3 h-3 mr-1" />
                지능형
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{(totalLoad * 100).toFixed(0)}%</div>
              <div className="text-gray-600 text-sm">평균 부하</div>
              <Badge variant="outline" className="mt-1 border-purple-200 text-purple-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                균형
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{routingStats.avgResponseTime}ms</div>
              <div className="text-gray-600 text-sm">평균 응답시간</div>
              <Badge variant="outline" className="mt-1 border-orange-200 text-orange-600">
                <Zap className="w-3 h-3 mr-1" />
                최적화
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Routing Test */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            실시간 라우팅 테스트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-gray-900 text-sm font-medium mb-2 block">쿼리 입력</label>
              <Textarea
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="예: '이미지에서 객체를 감지하고 텍스트로 설명해주세요'"
                className="bg-gray-50 border-gray-300 text-gray-900"
                rows={3}
              />
            </div>
            <Button
              onClick={performRouting}
              disabled={!inputQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              라우팅 실행
            </Button>

            {routingResult && (
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <h4 className="text-gray-900 font-medium mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  라우팅 결과
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600 text-sm">선택된 전문가:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {routingResult.selectedExperts.map((expert, index) => (
                        <Badge key={expert} variant="default" className="bg-blue-600 text-white">
                          {expert} ({(routingResult.weights[index] * 100).toFixed(0)}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">신뢰도:</span>
                    <span className="text-green-600">{(routingResult.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">예상 응답시간:</span>
                    <span className="text-gray-900">{routingResult.estimatedTime}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">라우팅 이유:</span>
                    <p className="text-gray-900 text-sm mt-1">{routingResult.reasoning}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expert Network Visualization */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Network className="w-5 h-5" />
            전문가 네트워크 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experts.map((expert) => (
              <div key={expert.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        expert.status === "active"
                          ? "bg-green-400"
                          : expert.status === "training"
                            ? "bg-yellow-400 animate-pulse"
                            : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-gray-900 font-medium text-sm">{expert.name}</span>
                  </div>
                  <Badge
                    variant={
                      expert.status === "active" ? "default" : expert.status === "training" ? "secondary" : "outline"
                    }
                    className={expert.status === "active" ? "bg-green-600 text-white" : ""}
                  >
                    {expert.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">도메인:</span>
                      <span className="text-gray-900">{expert.domain}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">정확도:</span>
                      <span className="text-gray-900">{(expert.accuracy * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">부하:</span>
                      <span className="text-gray-900">{(expert.load * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={expert.load * 100} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">전문성:</span>
                      <span className="text-gray-900">{(expert.expertise * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={expert.expertise * 100} className="h-1" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">요청 수:</span>
                    <span className="text-gray-900">{expert.requests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">응답시간:</span>
                    <span className="text-gray-900">{expert.responseTime}ms</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600 text-xs">전문분야:</span>
                    <p className="text-gray-900 text-xs mt-1">{expert.specialization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gating Network Status */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            게이팅 네트워크 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-gray-900 font-medium mb-3">네트워크 성능</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 text-sm">라우팅 정확도</span>
                    <span className="text-gray-900">{(gatingNetwork.accuracy * 100).toFixed(2)}%</span>
                  </div>
                  <Progress value={gatingNetwork.accuracy * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 text-sm">훈련 손실</span>
                    <span className="text-gray-900">{gatingNetwork.trainingLoss.toFixed(3)}</span>
                  </div>
                  <Progress value={(1 - gatingNetwork.trainingLoss) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 text-sm">검증 손실</span>
                    <span className="text-gray-900">{gatingNetwork.validationLoss.toFixed(3)}</span>
                  </div>
                  <Progress value={(1 - gatingNetwork.validationLoss) * 100} className="h-2" />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">훈련 에포크:</span>
                  <span className="text-gray-900">{gatingNetwork.epochs}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-3">시스템 메트릭스</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">총 요청 수:</span>
                  <span className="text-gray-900">{routingStats.totalRequests.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">부하 균형:</span>
                  <span className="text-gray-900">{(routingStats.loadBalance * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">전문가 활용률:</span>
                  <span className="text-gray-900">{(routingStats.expertUtilization * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">평균 정확도:</span>
                  <span className="text-gray-900">{(avgAccuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">처리량 (RPS):</span>
                  <span className="text-gray-900">{Math.floor(routingStats.totalRequests / 3600)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            성능 분석 및 최적화
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-gray-900 font-medium mb-3">라우팅 효율성</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">최적 라우팅률:</span>
                  <span className="text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">지연시간 감소:</span>
                  <span className="text-green-600">-35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">자원 활용률:</span>
                  <span className="text-gray-900">87.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">처리 실패율:</span>
                  <span className="text-red-600">0.8%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-3">전문가 성능</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">최고 성능:</span>
                  <span className="text-gray-900">Math Expert (95%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">최고 활용:</span>
                  <span className="text-gray-900">NLP Expert (78%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">평균 전문성:</span>
                  <span className="text-gray-900">91.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">학습 중인 전문가:</span>
                  <span className="text-yellow-600">1개</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-3">시스템 최적화</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">동적 스케일링:</span>
                  <span className="text-green-600">활성화</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">부하 예측:</span>
                  <span className="text-green-600">정확도 92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">자동 재훈련:</span>
                  <span className="text-green-600">활성화</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">A/B 테스트:</span>
                  <span className="text-blue-600">진행중</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MOE Analytics Dashboard */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            MoE 시스템 분석 대시보드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 라우팅 패턴 분석 */}
            <div>
              <h4 className="text-gray-900 font-medium mb-3">라우팅 패턴 분석</h4>
              <div className="space-y-3">
                {[
                  { query: "이미지 관련", expert: "Vision Expert", frequency: 35, accuracy: 96 },
                  { query: "텍스트 분석", expert: "NLP Expert", frequency: 28, accuracy: 91 },
                  { query: "코드 생성", expert: "Code Expert", frequency: 22, accuracy: 89 },
                  { query: "수학 문제", expert: "Math Expert", frequency: 15, accuracy: 97 },
                ].map((pattern, index) => (
                  <div key={index} className="border border-gray-200 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-900 font-medium text-sm">{pattern.query}</span>
                      <Badge variant="outline" className="border-gray-300 text-gray-700">
                        {pattern.frequency}%
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">주로 라우팅: {pattern.expert}</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">정확도:</span>
                      <span className="text-green-600">{pattern.accuracy}%</span>
                    </div>
                    <Progress value={pattern.accuracy} className="h-1 mt-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* 전문가 성능 트렌드 */}
            <div>
              <h4 className="text-gray-900 font-medium mb-3">전문가 성능 트렌드</h4>
              <div className="space-y-3">
                {experts.slice(0, 4).map((expert) => (
                  <div key={expert.id} className="border border-gray-200 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-900 font-medium text-sm">{expert.name}</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">+{(Math.random() * 5).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">7일 평균:</span>
                        <span className="text-gray-900 ml-1">
                          {(expert.accuracy * 100 - Math.random() * 2).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">처리량:</span>
                        <span className="text-gray-900 ml-1">{Math.floor(expert.requests / 7)}/일</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">효율성 점수</span>
                        <span className="text-gray-900">{(expert.accuracy * expert.expertise * 100).toFixed(0)}</span>
                      </div>
                      <Progress value={expert.accuracy * expert.expertise * 100} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 실시간 라우팅 히트맵 */}
          <div className="mt-6">
            <h4 className="text-gray-900 font-medium mb-3">실시간 라우팅 히트맵</h4>
            <div className="grid grid-cols-6 gap-2">
              {experts.map((expert, index) => (
                <div key={expert.id} className="text-center">
                  <div
                    className={`h-16 rounded flex items-center justify-center text-white text-xs font-medium ${
                      expert.load > 0.7 ? "bg-red-500" : expert.load > 0.4 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ opacity: 0.3 + expert.load * 0.7 }}
                  >
                    {(expert.load * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{expert.name.split(" ")[0]}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>낮은 부하</span>
              <span>높은 부하</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
