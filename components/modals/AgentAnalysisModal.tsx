"use client"

import { Modal } from "@/components/ui/modal"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Coins, Download, Star, Activity, Clock, Users, BarChart3, Target, Zap } from "lucide-react"

interface AgentAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  agent: {
    id: string
    name: string
    description: string
    earnings: number
    downloads: number
    accuracy: number
    category: string
    aiModel: string
    version: string
    status: string
  }
}

export function AgentAnalysisModal({ isOpen, onClose, agent }: AgentAnalysisModalProps) {
  const recentEarnings = [
    { date: "2024-06-26", amount: 15, type: "다운로드 수수료", users: 3 },
    { date: "2024-06-25", amount: 22, type: "사용료", users: 8 },
    { date: "2024-06-24", amount: 8, type: "평점 보너스", users: 1 },
    { date: "2024-06-23", amount: 31, type: "다운로드 수수료", users: 5 },
    { date: "2024-06-22", amount: 12, type: "사용료", users: 4 },
  ]

  const performanceMetrics = {
    totalRevenue: agent.earnings,
    monthlyGrowth: 23.5,
    avgRating: 4.7,
    totalUsers: 156,
    activeUsers: 89,
    retentionRate: 78.2,
    responseTime: 145,
    uptime: 99.8,
  }

  const optimizationSuggestions = [
    {
      title: "모델 압축 최적화",
      description: "응답 속도 15% 향상 가능",
      impact: "높음",
      effort: "중간",
    },
    {
      title: "추가 훈련 데이터",
      description: "정확도 2% 향상 예상",
      impact: "중간",
      effort: "높음",
    },
    {
      title: "캐싱 시스템 도입",
      description: "비용 20% 절감 가능",
      impact: "높음",
      effort: "낮음",
    },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${agent.name} 상세 분석`} size="xl">
      <div className="space-y-6">
        {/* Agent Header */}
        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
            <p className="text-gray-600">{agent.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="border-blue-300 text-blue-600">
                {agent.category}
              </Badge>
              <Badge variant="outline" className="border-green-300 text-green-600">
                {agent.aiModel}
              </Badge>
              <Badge variant="outline" className="border-purple-300 text-purple-600">
                {agent.version}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{agent.earnings} SQA</div>
            <div className="text-gray-600 text-sm">총 수익</div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Coins className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{performanceMetrics.totalRevenue} SQA</div>
            <div className="text-gray-600 text-sm">총 수익</div>
            <div className="text-green-600 text-xs mt-1">+{performanceMetrics.monthlyGrowth}% 이번 달</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{performanceMetrics.avgRating}</div>
            <div className="text-gray-600 text-sm">평균 평점</div>
            <div className="text-blue-600 text-xs mt-1">5.0 만점</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{performanceMetrics.totalUsers}</div>
            <div className="text-gray-600 text-sm">총 사용자</div>
            <div className="text-purple-600 text-xs mt-1">{performanceMetrics.activeUsers}명 활성</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-gray-900">{(agent.accuracy * 100).toFixed(1)}%</div>
            <div className="text-gray-600 text-sm">정확도</div>
            <div className="text-orange-600 text-xs mt-1">업계 평균 대비 +5%</div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              수익 분석
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">이번 달 수익</span>
                  <span className="text-gray-900 font-medium">{Math.floor(agent.earnings * 0.3)} SQA</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">목표 달성률</span>
                  <span className="text-gray-900 font-medium">87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>

              <div className="pt-2 border-t">
                <h5 className="text-gray-900 font-medium mb-2">수익 구성</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">다운로드 수수료:</span>
                    <span className="text-gray-900">{Math.floor(agent.earnings * 0.6)} SQA (60%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">사용료:</span>
                    <span className="text-gray-900">{Math.floor(agent.earnings * 0.3)} SQA (30%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">보너스:</span>
                    <span className="text-gray-900">{Math.floor(agent.earnings * 0.1)} SQA (10%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              최근 수익 내역
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentEarnings.map((earning, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-gray-900 font-medium text-sm">{earning.type}</div>
                    <div className="text-gray-600 text-xs">
                      {earning.date} • {earning.users}명 사용자
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-medium">+{earning.amount} SQA</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            성능 지표
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{performanceMetrics.retentionRate}%</div>
              <div className="text-gray-600 text-sm">사용자 유지율</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{performanceMetrics.responseTime}ms</div>
              <div className="text-gray-600 text-sm">평균 응답시간</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{performanceMetrics.uptime}%</div>
              <div className="text-gray-600 text-sm">가동시간</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{agent.downloads}</div>
              <div className="text-gray-600 text-sm">총 다운로드</div>
            </div>
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            최적화 제안
          </h4>
          <div className="space-y-3">
            {optimizationSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h5 className="text-gray-900 font-medium">{suggestion.title}</h5>
                  <p className="text-gray-600 text-sm">{suggestion.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={`${
                      suggestion.impact === "높음"
                        ? "border-red-300 text-red-600"
                        : suggestion.impact === "중간"
                          ? "border-yellow-300 text-yellow-600"
                          : "border-green-300 text-green-600"
                    }`}
                  >
                    영향: {suggestion.impact}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${
                      suggestion.effort === "높음"
                        ? "border-red-300 text-red-600"
                        : suggestion.effort === "중간"
                          ? "border-yellow-300 text-yellow-600"
                          : "border-green-300 text-green-600"
                    }`}
                  >
                    노력: {suggestion.effort}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            성능 최적화 시작
          </Button>
          <Button variant="outline" className="border-gray-300 text-gray-700">
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
          <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700">
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  )
}
