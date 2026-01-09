"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus, Globe, Cpu, Zap, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface ModelSelectionModalProps {
  onClose: () => void
}

export default function ModelSelectionModal({ onClose }: ModelSelectionModalProps) {
  const [selectedTab, setSelectedTab] = useState<"local" | "cloud">("local")
  const [customModelName, setCustomModelName] = useState("")
  const [customModelUrl, setCustomModelUrl] = useState("")

  const localModels = [
    {
      id: "deepseek-v3",
      name: "DeepSeek V3",
      status: "connected",
      description: "고성능 로컬 추론 모델",
      size: "7B",
      type: "local",
    },
    {
      id: "llama-3.1",
      name: "Llama 3.1",
      status: "available",
      description: "Meta의 오픈소스 모델",
      size: "8B",
      type: "local",
    },
    {
      id: "qwen-2.5",
      name: "Qwen 2.5",
      status: "available",
      description: "Alibaba의 다국어 모델",
      size: "14B",
      type: "local",
    },
    {
      id: "mistral-7b",
      name: "Mistral 7B",
      status: "available",
      description: "효율적인 추론 모델",
      size: "7B",
      type: "local",
    },
  ]

  const cloudModels = [
    {
      id: "gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      status: "connected",
      description: "Google의 멀티모달 모델",
      provider: "Google",
      type: "cloud",
    },
    {
      id: "gpt-4o",
      name: "GPT-4o",
      status: "pending",
      description: "OpenAI의 최신 모델",
      provider: "OpenAI",
      type: "cloud",
    },
    {
      id: "claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      status: "pending",
      description: "Anthropic의 고성능 모델",
      provider: "Anthropic",
      type: "cloud",
    },
    {
      id: "grok-3",
      name: "Grok 3",
      status: "pending",
      description: "xAI의 실시간 모델",
      provider: "xAI",
      type: "cloud",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "available":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "연결됨"
      case "available":
        return "사용 가능"
      case "pending":
        return "예정"
      default:
        return "알 수 없음"
    }
  }

  const handleAddCustomModel = () => {
    if (customModelName && customModelUrl) {
      // 커스텀 모델 추가 로직
      console.log("Adding custom model:", { name: customModelName, url: customModelUrl })
      setCustomModelName("")
      setCustomModelUrl("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI 모델 선택 및 하이브리드 운영</h2>
            <p className="text-gray-600 text-sm mt-1">로컬 모델과 클라우드 API를 조합하여 최적의 성능을 구현하세요</p>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setSelectedTab("local")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedTab === "local" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Cpu className="w-4 h-4" />
              로컬 모델
            </button>
            <button
              onClick={() => setSelectedTab("cloud")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedTab === "cloud" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Globe className="w-4 h-4" />
              클라우드 API
            </button>
          </div>

          {/* Local Models */}
          {selectedTab === "local" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">로컬 AI 모델</h3>
                <Badge variant="outline" className="border-blue-200 text-blue-600">
                  <Cpu className="w-3 h-3 mr-1" />
                  프라이버시 보장
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localModels.map((model) => (
                  <Card key={model.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{model.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(model.status)}
                          <span className="text-xs text-gray-600">{getStatusText(model.status)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {model.size} 파라미터
                        </Badge>
                        <Button
                          size="sm"
                          variant={model.status === "connected" ? "outline" : "default"}
                          disabled={model.status === "connected"}
                        >
                          {model.status === "connected" ? "연결됨" : "연결하기"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Local Model */}
              <Card className="border border-dashed border-gray-300">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    커스텀 로컬 모델 추가
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="모델 이름 (예: Custom-Llama-3.2)"
                      value={customModelName}
                      onChange={(e) => setCustomModelName(e.target.value)}
                    />
                    <Input
                      placeholder="모델 경로 또는 URL"
                      value={customModelUrl}
                      onChange={(e) => setCustomModelUrl(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleAddCustomModel}
                    className="w-full"
                    disabled={!customModelName || !customModelUrl}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    커스텀 모델 추가
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Cloud Models */}
          {selectedTab === "cloud" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">클라우드 AI API</h3>
                <Badge variant="outline" className="border-green-200 text-green-600">
                  <Globe className="w-3 h-3 mr-1" />
                  고성능 추론
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cloudModels.map((model) => (
                  <Card key={model.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{model.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(model.status)}
                          <span className="text-xs text-gray-600">{getStatusText(model.status)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {model.provider}
                        </Badge>
                        <Button
                          size="sm"
                          variant={model.status === "connected" ? "outline" : "default"}
                          disabled={model.status === "connected" || model.status === "pending"}
                        >
                          {model.status === "connected" ? "연결됨" : model.status === "pending" ? "예정" : "연결하기"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Hybrid Configuration */}
          <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                하이브리드 운영 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <Cpu className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">프라이버시 우선</h4>
                  <p className="text-xs text-gray-600">민감한 데이터는 로컬 모델 사용</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">성능 우선</h4>
                  <p className="text-xs text-gray-600">복잡한 작업은 클라우드 API 사용</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 mb-1">지능형 라우팅</h4>
                  <p className="text-xs text-gray-600">자동으로 최적 모델 선택</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button onClick={onClose} variant="outline">
              취소
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">설정 저장</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
