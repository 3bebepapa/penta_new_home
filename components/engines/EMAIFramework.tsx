"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Eye, Mic, FileText, Zap, Activity, TrendingUp, Settings } from "lucide-react"

interface EMAIFrameworkProps {
  progress: number
  isTraining: boolean
}

export default function EMAIFramework({ progress, isTraining }: EMAIFrameworkProps) {
  const [modalityProgress, setModalityProgress] = useState({
    vision: 0,
    audio: 0,
    text: 0,
    ensemble: 0,
  })

  const [geminiStatus, setGeminiStatus] = useState({
    connected: true,
    responseTime: 245,
    requestCount: 1247,
    accuracy: 0.94,
  })

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setModalityProgress((prev) => ({
          vision: Math.min(prev.vision + Math.random() * 2, 100),
          audio: Math.min(prev.audio + Math.random() * 1.5, 100),
          text: Math.min(prev.text + Math.random() * 3, 100),
          ensemble: Math.min(prev.ensemble + Math.random() * 1, 100),
        }))

        setGeminiStatus((prev) => ({
          ...prev,
          responseTime: Math.max(200, prev.responseTime + (Math.random() - 0.5) * 50),
          requestCount: prev.requestCount + Math.floor(Math.random() * 3),
          accuracy: Math.min(prev.accuracy + Math.random() * 0.001, 0.98),
        }))
      }, 1500)

      return () => clearInterval(interval)
    }
  }, [isTraining])

  return (
    <div className="space-y-6">
      {/* EMAI Framework Overview */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            EMAI (Ensemble Multi-modal AI) 프레임워크
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{progress.toFixed(0)}%</div>
              <div className="text-gray-600 text-sm">전체 진행률</div>
              <Badge variant={isTraining ? "default" : "secondary"} className="mt-1">
                {isTraining ? "처리 중" : "대기"}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-gray-600 text-sm">모달리티</div>
              <Badge variant="outline" className="mt-1">
                멀티모달
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-gray-600 text-sm">AI 모델</div>
              <Badge variant="outline" className="mt-1">
                하이브리드
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">95.2%</div>
              <div className="text-gray-600 text-sm">앙상블 정확도</div>
              <Badge variant="outline" className="mt-1 border-green-200 text-green-600">
                최적화
              </Badge>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-gray-900 font-medium mb-2">EMAI 핵심 특징</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 로컬 DeepSeek 모델과 Gemini API의 지능형 앙상블</li>
              <li>• 비전, 오디오, 텍스트, 센서 데이터 통합 처리</li>
              <li>• 실시간 모달리티 가중치 조정</li>
              <li>• 프라이버시 보장 로컬 처리 + 클라우드 고성능 추론</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Gemini API Integration Status */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Gemini 2.0 Flash API 연동 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${geminiStatus.connected ? "bg-green-400" : "bg-red-400"} mr-2`}
                ></div>
                <span className="text-gray-900 font-medium">{geminiStatus.connected ? "연결됨" : "연결 끊김"}</span>
              </div>
              <div className="text-gray-600 text-sm">API 상태</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{geminiStatus.responseTime}ms</div>
              <div className="text-gray-600 text-sm">평균 응답시간</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{geminiStatus.requestCount.toLocaleString()}</div>
              <div className="text-gray-600 text-sm">총 요청 수</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{(geminiStatus.accuracy * 100).toFixed(1)}%</div>
              <div className="text-gray-600 text-sm">API 정확도</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-gray-900 font-medium mb-2">Gemini 2.0 Flash 특징</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <ul className="space-y-1">
                <li>• 초고속 멀티모달 처리</li>
                <li>• 실시간 스트리밍 응답</li>
                <li>• 향상된 추론 능력</li>
              </ul>
              <ul className="space-y-1">
                <li>• 코드 생성 및 실행</li>
                <li>• 복잡한 시각적 이해</li>
                <li>• 다국어 지원</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-modal Processing */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            멀티모달 처리 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Vision Processing */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <h4 className="text-gray-900 font-medium">비전 처리</h4>
                <Badge variant="outline">{modalityProgress.vision.toFixed(0)}%</Badge>
              </div>
              <Progress value={modalityProgress.vision} className="h-3 mb-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">객체 인식:</span>
                  <span className="text-gray-900 ml-1">98.5%</span>
                </div>
                <div>
                  <span className="text-gray-600">장면 이해:</span>
                  <span className="text-gray-900 ml-1">96.2%</span>
                </div>
                <div>
                  <span className="text-gray-600">OCR:</span>
                  <span className="text-gray-900 ml-1">99.1%</span>
                </div>
                <div>
                  <span className="text-gray-600">얼굴 인식:</span>
                  <span className="text-gray-900 ml-1">97.8%</span>
                </div>
              </div>
            </div>

            {/* Audio Processing */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Mic className="w-5 h-5 text-green-600" />
                <h4 className="text-gray-900 font-medium">오디오 처리</h4>
                <Badge variant="outline">{modalityProgress.audio.toFixed(0)}%</Badge>
              </div>
              <Progress value={modalityProgress.audio} className="h-3 mb-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">음성 인식:</span>
                  <span className="text-gray-900 ml-1">95.7%</span>
                </div>
                <div>
                  <span className="text-gray-600">화자 분리:</span>
                  <span className="text-gray-900 ml-1">92.3%</span>
                </div>
                <div>
                  <span className="text-gray-600">감정 분석:</span>
                  <span className="text-gray-900 ml-1">89.4%</span>
                </div>
                <div>
                  <span className="text-gray-600">음성 합성:</span>
                  <span className="text-gray-900 ml-1">96.8%</span>
                </div>
              </div>
            </div>

            {/* Text Processing */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <h4 className="text-gray-900 font-medium">텍스트 처리</h4>
                <Badge variant="outline">{modalityProgress.text.toFixed(0)}%</Badge>
              </div>
              <Progress value={modalityProgress.text} className="h-3 mb-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">자연어 이해:</span>
                  <span className="text-gray-900 ml-1">97.2%</span>
                </div>
                <div>
                  <span className="text-gray-600">번역:</span>
                  <span className="text-gray-900 ml-1">94.8%</span>
                </div>
                <div>
                  <span className="text-gray-600">요약:</span>
                  <span className="text-gray-900 ml-1">93.5%</span>
                </div>
                <div>
                  <span className="text-gray-600">생성:</span>
                  <span className="text-gray-900 ml-1">95.9%</span>
                </div>
              </div>
            </div>

            {/* Ensemble Processing */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <h4 className="text-gray-900 font-medium">앙상블 통합</h4>
                <Badge variant="outline">{modalityProgress.ensemble.toFixed(0)}%</Badge>
              </div>
              <Progress value={modalityProgress.ensemble} className="h-3 mb-2" />
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">
                  <div className="font-medium text-gray-900 mb-2">실시간 가중치 조정:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>DeepSeek: 45%</div>
                    <div>Gemini: 55%</div>
                    <div>로컬 처리: 60%</div>
                    <div>클라우드: 40%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            성능 메트릭스
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-gray-900 font-medium mb-3">처리 속도</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">이미지 처리:</span>
                  <span className="text-gray-900">0.12초</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">음성 처리:</span>
                  <span className="text-gray-900">0.08초</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">텍스트 처리:</span>
                  <span className="text-gray-900">0.05초</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">통합 추론:</span>
                  <span className="text-gray-900">0.15초</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-medium mb-3">리소스 사용량</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">CPU 사용률:</span>
                  <span className="text-gray-900">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GPU 사용률:</span>
                  <span className="text-gray-900">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">메모리 사용:</span>
                  <span className="text-gray-900">6.2GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">네트워크:</span>
                  <span className="text-gray-900">2.1MB/s</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-medium mb-3">품질 지표</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">전체 정확도:</span>
                  <span className="text-green-600">95.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">신뢰도:</span>
                  <span className="text-green-600">92.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">일관성:</span>
                  <span className="text-green-600">94.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">응답성:</span>
                  <span className="text-green-600">97.1%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
