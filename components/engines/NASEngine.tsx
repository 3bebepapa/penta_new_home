"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Zap, TrendingUp, Activity, Search, Target, Layers, Play, Pause, Settings } from "lucide-react"

interface NASEngineProps {
  progress: number
  isTraining: boolean
}

interface Architecture {
  id: string
  name: string
  accuracy: number
  params: string
  flops: string
  status: "evaluating" | "training" | "searching" | "optimizing" | "completed"
  score: number
  layers: number
  channels: number
  kernelSize: number
  activation: string
}

export default function NASEngine({ progress, isTraining }: NASEngineProps) {
  const [architectures, setArchitectures] = useState<Architecture[]>([
    {
      id: "arch_001",
      name: "EfficientNet-B7",
      accuracy: 0.943,
      params: "66M",
      flops: "37B",
      status: "completed",
      score: 0.89,
      layers: 32,
      channels: 256,
      kernelSize: 3,
      activation: "Swish",
    },
    {
      id: "arch_002",
      name: "MobileNetV3-Large",
      accuracy: 0.891,
      params: "5.4M",
      flops: "219M",
      status: "completed",
      score: 0.92,
      layers: 16,
      channels: 128,
      kernelSize: 5,
      activation: "ReLU",
    },
    {
      id: "arch_003",
      name: "Custom-NAS-v2.1",
      accuracy: 0.957,
      params: "23M",
      flops: "8.2B",
      status: "optimizing",
      score: 0.96,
      layers: 24,
      channels: 192,
      kernelSize: 7,
      activation: "GELU",
    },
  ])

  const [searchSpace, setSearchSpace] = useState({
    layers: { min: 8, max: 50, current: 24 },
    channels: { min: 16, max: 512, current: 256 },
    kernelSizes: [3, 5, 7],
    activations: ["ReLU", "Swish", "GELU", "Mish"],
  })

  const [isSearching, setIsSearching] = useState(false)
  const [searchProgress, setSearchProgress] = useState(0)
  const [currentGeneration, setCurrentGeneration] = useState(1)

  // 실제 NAS 알고리즘 시뮬레이션
  useEffect(() => {
    if (isTraining && isSearching) {
      const interval = setInterval(() => {
        setSearchProgress((prev) => {
          const newProgress = prev + Math.random() * 3
          if (newProgress >= 100) {
            setCurrentGeneration((gen) => gen + 1)
            // 새로운 아키텍처 생성
            const newArch: Architecture = {
              id: `arch_${Date.now()}`,
              name: `NAS-Gen${currentGeneration}-${Math.floor(Math.random() * 100)}`,
              accuracy: 0.85 + Math.random() * 0.1,
              params: `${Math.floor(Math.random() * 50 + 10)}M`,
              flops: `${Math.floor(Math.random() * 20 + 5)}B`,
              status: "evaluating",
              score: 0.8 + Math.random() * 0.2,
              layers: Math.floor(Math.random() * 30 + 10),
              channels: Math.floor(Math.random() * 400 + 64),
              kernelSize: [3, 5, 7][Math.floor(Math.random() * 3)],
              activation: ["ReLU", "Swish", "GELU", "Mish"][Math.floor(Math.random() * 4)],
            }
            setArchitectures((prev) => [newArch, ...prev.slice(0, 9)])
            return 0
          }
          return newProgress
        })

        // 기존 아키텍처 상태 업데이트
        setArchitectures((prev) =>
          prev.map((arch) => ({
            ...arch,
            status:
              Math.random() > 0.8
                ? (["evaluating", "training", "searching", "optimizing"] as const)[Math.floor(Math.random() * 4)]
                : arch.status,
            accuracy: Math.min(arch.accuracy + Math.random() * 0.001, 0.98),
            score: Math.min(arch.score + Math.random() * 0.01, 1.0),
          })),
        )
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isTraining, isSearching, currentGeneration])

  const startSearch = () => setIsSearching(true)
  const stopSearch = () => setIsSearching(false)

  const bestArchitecture = architectures.reduce(
    (best, current) => (current.score > best.score ? current : best),
    architectures[0],
  )

  return (
    <div className="space-y-6">
      {/* NAS Overview */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5" />
            신경망 구조 탐색 (NAS) 엔진
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{progress.toFixed(0)}%</div>
              <div className="text-gray-600 text-sm">탐색 진행률</div>
              <Badge variant="outline" className="mt-1 border-blue-200 text-blue-600">
                <Activity className="w-3 h-3 mr-1" />
                {isSearching ? "탐색중" : "대기"}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{architectures.length}</div>
              <div className="text-gray-600 text-sm">평가된 구조</div>
              <Badge variant="outline" className="mt-1 border-green-200 text-green-600">
                <GitBranch className="w-3 h-3 mr-1" />
                Gen {currentGeneration}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{bestArchitecture?.score.toFixed(3) || "0.000"}</div>
              <div className="text-gray-600 text-sm">최고 점수</div>
              <Badge variant="outline" className="mt-1 border-purple-200 text-purple-600">
                <Target className="w-3 h-3 mr-1" />
                최적
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{searchSpace.layers.current}</div>
              <div className="text-gray-600 text-sm">현재 깊이</div>
              <Badge variant="outline" className="mt-1 border-orange-200 text-orange-600">
                <Layers className="w-3 h-3 mr-1" />
                레이어
              </Badge>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={startSearch}
              disabled={isSearching || !isTraining}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              구조 탐색 시작
            </Button>
            <Button onClick={stopSearch} disabled={!isSearching} className="bg-red-600 hover:bg-red-700 text-white">
              <Pause className="w-4 h-4 mr-2" />
              탐색 중지
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Space Configuration */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            탐색 공간 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-gray-900 font-medium">구조 매개변수</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 text-sm">네트워크 깊이</span>
                    <span className="text-gray-900 text-sm">{searchSpace.layers.current} 레이어</span>
                  </div>
                  <Progress
                    value={
                      ((searchSpace.layers.current - searchSpace.layers.min) /
                        (searchSpace.layers.max - searchSpace.layers.min)) *
                      100
                    }
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>{searchSpace.layers.min}</span>
                    <span>{searchSpace.layers.max}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 text-sm">채널 너비</span>
                    <span className="text-gray-900 text-sm">{searchSpace.channels.current} 채널</span>
                  </div>
                  <Progress
                    value={
                      ((searchSpace.channels.current - searchSpace.channels.min) /
                        (searchSpace.channels.max - searchSpace.channels.min)) *
                      100
                    }
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>{searchSpace.channels.min}</span>
                    <span>{searchSpace.channels.max}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-gray-900 font-medium">탐색 옵션</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 text-sm">커널 크기</span>
                  <div className="flex gap-2 mt-1">
                    {searchSpace.kernelSizes.map((size) => (
                      <Badge key={size} variant="outline" className="border-gray-300 text-gray-700">
                        {size}x{size}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 text-sm">활성화 함수</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {searchSpace.activations.map((activation) => (
                      <Badge key={activation} variant="outline" className="border-gray-300 text-gray-700">
                        {activation}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 text-sm">현재 탐색 진행률</span>
                  <Progress value={searchProgress} className="h-2 mt-1" />
                  <div className="text-xs text-gray-600 mt-1">
                    Generation {currentGeneration} - {searchProgress.toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Architecture Candidates */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            아키텍처 후보 및 성능
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {architectures.slice(0, 6).map((arch, index) => (
              <div key={arch.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        arch.status === "evaluating"
                          ? "bg-blue-400 animate-pulse"
                          : arch.status === "training"
                            ? "bg-yellow-400 animate-pulse"
                            : arch.status === "searching"
                              ? "bg-purple-400 animate-pulse"
                              : arch.status === "optimizing"
                                ? "bg-green-400 animate-pulse"
                                : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-gray-900 font-medium">{arch.name}</span>
                    <Badge variant={arch.score > 0.9 ? "default" : "outline"} className="bg-blue-600 text-white">
                      점수: {arch.score.toFixed(3)}
                    </Badge>
                    {index === 0 && (
                      <Badge variant="default" className="bg-yellow-600 text-white">
                        <Target className="w-3 h-3 mr-1" />
                        최고
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="capitalize border-gray-300 text-gray-700">
                    {arch.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-600">정확도</span>
                    <div className="text-gray-900 font-medium">{(arch.accuracy * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">매개변수</span>
                    <div className="text-gray-900 font-medium">{arch.params}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">FLOPs</span>
                    <div className="text-gray-900 font-medium">{arch.flops}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">레이어</span>
                    <div className="text-gray-900 font-medium">{arch.layers}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">채널</span>
                    <div className="text-gray-900 font-medium">{arch.channels}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">활성화</span>
                    <div className="text-gray-900 font-medium">{arch.activation}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">종합 성능</span>
                    <span className="text-gray-900">{(arch.score * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={arch.score * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Process */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            최적화 파이프라인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                stage: "탐색 공간 정의",
                progress: 100,
                description: "아키텍처 탐색 공간과 제약 조건 정의",
              },
              {
                stage: "슈퍼넷 훈련",
                progress: isSearching ? 85 : 100,
                description: "가중치 공유를 통한 슈퍼넷 훈련",
              },
              {
                stage: "아키텍처 샘플링",
                progress: isSearching ? searchProgress : 80,
                description: "슈퍼넷에서 후보 아키텍처 샘플링",
              },
              {
                stage: "성능 추정",
                progress: isSearching ? Math.max(0, searchProgress - 20) : 60,
                description: "전체 훈련 없이 성능 추정",
              },
              {
                stage: "아키텍처 순위",
                progress: isSearching ? Math.max(0, searchProgress - 40) : 40,
                description: "효율성 점수로 아키텍처 순위 매기기",
              },
              {
                stage: "최종 훈련",
                progress: isSearching ? Math.max(0, searchProgress - 60) : 20,
                description: "상위 아키텍처를 처음부터 훈련",
              },
            ].map((stage, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">{stage.stage}</span>
                  <span className="text-gray-600 text-sm">{stage.progress.toFixed(0)}%</span>
                </div>
                <Progress value={stage.progress} className="h-2" />
                <p className="text-gray-600 text-sm">{stage.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            성능 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-gray-900 font-medium mb-3">탐색 효율성</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">탐색된 구조:</span>
                  <span className="text-gray-900">{architectures.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">평균 점수:</span>
                  <span className="text-gray-900">
                    {(architectures.reduce((sum, arch) => sum + arch.score, 0) / architectures.length).toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">수렴 속도:</span>
                  <span className="text-gray-900">92%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-3">자원 사용량</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">GPU 시간:</span>
                  <span className="text-gray-900">24.5h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">메모리 사용:</span>
                  <span className="text-gray-900">8.2 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">효율성:</span>
                  <span className="text-green-600">95.8%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-3">최적화 결과</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">정확도 향상:</span>
                  <span className="text-green-600">+3.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">매개변수 감소:</span>
                  <span className="text-green-600">-65%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">추론 속도:</span>
                  <span className="text-green-600">+180%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
