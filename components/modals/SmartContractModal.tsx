"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Coins, Database, Lock, Clock, CheckCircle, Copy, ExternalLink } from "lucide-react"

interface SmartContractModalProps {
  isOpen: boolean
  onClose: () => void
  type: "reward" | "model" | "governance"
  onExecute: () => void
  isExecuting: boolean
}

export function SmartContractModal({ isOpen, onClose, type, onExecute, isExecuting }: SmartContractModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [proposal, setProposal] = useState("")
  const [executionStep, setExecutionStep] = useState(0)

  const modalConfig = {
    reward: {
      title: "보상 분배 실행",
      icon: <Coins className="w-6 h-6 text-yellow-600" />,
      description: "기여도에 따른 SQA 토큰 자동 분배를 실행합니다.",
      contractAddress: "0xDEF456...",
      gasLimit: "45,000",
      estimatedCost: "$0.002",
    },
    model: {
      title: "AI 모델 등록",
      icon: <Database className="w-6 h-6 text-blue-600" />,
      description: "새로운 AI 모델 버전을 블록체인에 등록합니다.",
      contractAddress: "0x123DEF...",
      gasLimit: "65,000",
      estimatedCost: "$0.003",
    },
    governance: {
      title: "거버넌스 투표",
      icon: <Lock className="w-6 h-6 text-purple-600" />,
      description: "프로토콜 거버넌스 제안에 투표합니다.",
      contractAddress: "0x789ABC...",
      gasLimit: "32,000",
      estimatedCost: "$0.001",
    },
  }

  const config = modalConfig[type]

  const handleExecute = async () => {
    if (!apiKey) {
      alert("Square AI API 키를 입력해주세요.")
      return
    }

    setExecutionStep(1)

    // 실행 단계 시뮬레이션
    const steps = [
      "API 키 검증 중...",
      "스마트 컨트랙트 연결 중...",
      "트랜잭션 생성 중...",
      "서명 대기 중...",
      "블록체인에 전송 중...",
      "트랜잭션 확인 중...",
      "실행 완료!",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setExecutionStep(i + 1)
    }

    onExecute()
    setTimeout(() => {
      setExecutionStep(0)
      onClose()
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("클립보드에 복사되었습니다.")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={config.title} size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          {config.icon}
          <div>
            <h4 className="text-gray-900 font-medium">{config.title}</h4>
            <p className="text-gray-600 text-sm">{config.description}</p>
          </div>
        </div>

        {/* Contract Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="text-blue-900 font-medium mb-2">컨트랙트 주소</h5>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-blue-700">{config.contractAddress}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(config.contractAddress)}
                className="border-blue-300 text-blue-600"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h5 className="text-green-900 font-medium mb-2">가스 한도</h5>
            <span className="text-green-700 font-mono">{config.gasLimit}</span>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h5 className="text-purple-900 font-medium mb-2">예상 비용</h5>
            <span className="text-purple-700 font-medium">{config.estimatedCost}</span>
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Square AI API 키 <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sq_api_xxxxxxxxxxxxxxxx"
              className="bg-gray-50 border-gray-300"
            />
            <p className="text-xs text-gray-500 mt-1">관리자만 접근 가능한 API 키가 필요합니다.</p>
          </div>

          {/* Type-specific inputs */}
          {type === "reward" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">분배 금액 (SQA)</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="bg-gray-50 border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">수혜자 수</label>
                <Input
                  type="number"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="4"
                  className="bg-gray-50 border-gray-300"
                />
              </div>
            </div>
          )}

          {type === "governance" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제안 ID</label>
              <Input
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                placeholder="PROP-001"
                className="bg-gray-50 border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Execution Progress */}
        {isExecuting && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h5 className="text-blue-900 font-medium mb-3">실행 진행 상황</h5>
            <div className="space-y-3">
              <Progress value={(executionStep / 7) * 100} className="h-2" />
              <div className="flex items-center gap-2">
                {executionStep < 7 ? (
                  <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                <span className="text-sm text-gray-700">
                  {executionStep === 0 && "대기 중..."}
                  {executionStep === 1 && "API 키 검증 중..."}
                  {executionStep === 2 && "스마트 컨트랙트 연결 중..."}
                  {executionStep === 3 && "트랜잭션 생성 중..."}
                  {executionStep === 4 && "서명 대기 중..."}
                  {executionStep === 5 && "블록체인에 전송 중..."}
                  {executionStep === 6 && "트랜잭션 확인 중..."}
                  {executionStep === 7 && "실행 완료!"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Network Status */}
        <div className="bg-green-50 rounded-lg p-4">
          <h5 className="text-green-900 font-medium mb-2">네트워크 상태</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Polygon 메인넷:</span>
              <Badge variant="outline" className="bg-green-100 border-green-300 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                연결됨
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Infura RPC:</span>
              <Badge variant="outline" className="bg-green-100 border-green-300 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                정상
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <Button
            onClick={handleExecute}
            disabled={!apiKey || isExecuting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isExecuting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                실행 중...
              </>
            ) : (
              <>
                {config.icon}
                <span className="ml-2">{config.title} 실행</span>
              </>
            )}
          </Button>

          <Button variant="outline" onClick={onClose} disabled={isExecuting} className="border-gray-300 text-gray-700">
            취소
          </Button>

          <Button
            variant="outline"
            onClick={() => window.open("https://polygonscan.com", "_blank")}
            className="border-blue-300 text-blue-600"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            익스플로러
          </Button>
        </div>
      </div>
    </Modal>
  )
}
