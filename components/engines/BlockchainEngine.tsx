"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Database,
  Lock,
  Coins,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Link,
  Wallet,
} from "lucide-react"
import { SmartContractModal } from "@/components/modals/SmartContractModal"

interface BlockchainTransaction {
  id: string
  type: "reward" | "model_update" | "contribution"
  amount: number
  from: string
  to: string
  timestamp: number
  status: "pending" | "confirmed" | "failed"
  gasUsed: string
  layer2: boolean
}

interface TrainingMetrics {
  blockHeight: number
  hashRate: string
  pntaTokens: number
  networkLatency: number
  gasPrice: string
  layer2Savings: string
}

interface BlockchainEngineProps {
  transactions: BlockchainTransaction[]
  metrics: TrainingMetrics
  isTraining: boolean
  onRewardDistribution?: () => void
  onModelRegistration?: () => void
  onGovernanceVote?: () => void
  onTransactionClick?: (txId: string) => void
  contractOperations?: {
    rewardDistribution: boolean
    modelRegistration: boolean
    governance: boolean
  }
  realBlockchainData?: {
    polygonRPC: string
    contractAddresses: {
      pntaToken: string
      rewardPool: string
      governance: string
    }
    explorerBase: string
  }
}

export default function BlockchainEngine({
  transactions,
  metrics,
  isTraining,
  onRewardDistribution,
  onModelRegistration,
  onGovernanceVote,
  onTransactionClick,
  contractOperations,
  realBlockchainData,
}: BlockchainEngineProps) {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [pntaBalance, setPntaBalance] = useState(0)
  const [layer2Status, setLayer2Status] = useState("connected")

  // 스마트 컨트랙트 상태
  const [contractStats, setContractStats] = useState({
    totalRewards: 0,
    activeNodes: 0,
    totalTransactions: 0,
    gasOptimization: 85,
  })

  const [systemMetrics, setSystemMetrics] = useState({
    globalAccuracy: 0.87,
    dataThroughput: "150 MB/s",
    modelSize: "256 MB",
  })

  const [activeModal, setActiveModal] = useState<"reward" | "model" | "governance" | null>(null)

  // 실제 Web3 연결 시뮬레이션 (Infura 기반)
  const connectWallet = async () => {
    try {
      // MetaMask 연결 시뮬레이션
      if (typeof window !== "undefined" && (window as any).ethereum) {
        // 실제 환경에서는 여기서 MetaMask 연결
        setWalletConnected(true)
        setWalletAddress("0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e")
        setPntaBalance(1250)
      } else {
        // 시뮬레이션 모드
        setWalletConnected(true)
        setWalletAddress("0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e")
        setPntaBalance(1250)
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
    }
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress("")
    setPntaBalance(0)
  }

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setContractStats((prev) => ({
          totalRewards: prev.totalRewards + Math.floor(Math.random() * 10),
          activeNodes: Math.floor(Math.random() * 2) + 3,
          totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 3),
          gasOptimization: Math.min(prev.gasOptimization + Math.random() * 0.5, 95),
        }))

        if (walletConnected) {
          setPntaBalance((prev) => prev + Math.floor(Math.random() * 5))
        }
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isTraining, walletConnected])

  const pendingTxs = transactions.filter((tx) => tx.status === "pending").length
  const confirmedTxs = transactions.filter((tx) => tx.status === "confirmed").length
  const totalRewards = transactions
    .filter((tx) => tx.type === "reward" && tx.status === "confirmed")
    .reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Web3 지갑 연결
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!walletConnected ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">블록체인 기능을 사용하려면 지갑을 연결하세요</p>
              <Button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Wallet className="w-4 h-4 mr-2" />
                MetaMask 연결
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-medium">연결된 지갑</p>
                  <p className="text-gray-600 text-sm font-mono">{walletAddress}</p>
                </div>
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  className="border-gray-300 text-gray-700 bg-transparent"
                >
                  연결 해제
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{pntaBalance}</div>
                  <div className="text-gray-600 text-sm">PNTA 토큰</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{metrics.layer2Savings}</div>
                  <div className="text-gray-600 text-sm">가스비 절약</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Polygon</div>
                  <div className="text-gray-600 text-sm">Layer2 네트워크</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blockchain Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600 text-sm">블록 높이</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">#{metrics.blockHeight.toLocaleString()}</div>
            <Badge variant="outline" className="mt-1 border-blue-200 text-blue-600">
              <Activity className="w-3 h-3 mr-1" />
              {isTraining ? "채굴중" : "대기"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-gray-600 text-sm">가스 가격</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.gasPrice}</div>
            <Badge variant="outline" className="mt-1 border-green-200 text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              Layer2 최적화
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-green-600" />
              <span className="text-gray-600 text-sm">총 보상</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalRewards} PNTA</div>
            <Badge variant="outline" className="mt-1 border-orange-200 text-orange-600">
              <TrendingUp className="w-3 h-3 mr-1" />+{Math.floor(totalRewards * 0.1)} 오늘
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-gray-600 text-sm">네트워크 지연</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(metrics.networkLatency)}ms</div>
            <Badge variant="outline" className="mt-1 border-green-200 text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              최적
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Layer2 Solution Status */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Link className="w-5 h-5" />
            Polygon 메인넷 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-gray-900 font-medium mb-3">네트워크 정보</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">메인넷:</span>
                  <span className="text-gray-900">Polygon (MATIC)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">체인 ID:</span>
                  <span className="text-gray-900">137</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">RPC URL:</span>
                  <span className="text-gray-900 text-xs">polygon-mainnet.infura.io</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">블록 탐색기:</span>
                  <span className="text-gray-900 text-xs">polygonscan.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상태:</span>
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    연결됨
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-3">가스 최적화 (vs 이더리움)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">평균 가스비:</span>
                  <span className="text-gray-900">0.001 MATIC (~$0.0008)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">이더리움 대비:</span>
                  <span className="text-green-600">-{metrics.layer2Savings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">처리 속도:</span>
                  <span className="text-gray-900">2초 (vs 15초)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TPS:</span>
                  <span className="text-gray-900">7,000+ (vs 15)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-3">스마트 컨트랙트 (Polygon)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">PNTA 토큰:</span>
                  <span className="text-gray-900 text-xs">0xABC...123 (ERC-20)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">보상 풀:</span>
                  <span className="text-gray-900 text-xs">0xDEF...456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">거버넌스:</span>
                  <span className="text-gray-900 text-xs">0x789...ABC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">연합학습:</span>
                  <span className="text-gray-900 text-xs">0x123...DEF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상태:</span>
                  <Badge variant="default" className="bg-blue-600">
                    <Activity className="w-3 h-3 mr-1" />
                    활성
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Transaction Pool */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            실시간 트랜잭션 풀
            <Badge variant="outline" className="border-gray-300 text-gray-700">
              {pendingTxs} 대기 | {confirmedTxs} 확인
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onTransactionClick?.(tx.id)}
              >
                <div className="flex items-center gap-4">
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
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium font-mono text-sm hover:text-blue-600">{tx.id}</span>
                      <Badge
                        variant={
                          tx.type === "reward" ? "default" : tx.type === "model_update" ? "secondary" : "outline"
                        }
                      >
                        {tx.type.replace("_", " ")}
                      </Badge>
                      {tx.layer2 && (
                        <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-600">
                          Layer2
                        </Badge>
                      )}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {tx.from} → {tx.to} | Gas: {tx.gasUsed} | 클릭하여 Polygonscan에서 확인
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 font-medium">{tx.amount > 0 ? `${tx.amount} PNTA` : "—"}</div>
                  <div className="text-gray-600 text-sm">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {tx.status === "confirmed" && <CheckCircle className="w-3 h-3 text-green-600" />}
                    {tx.status === "pending" && <Clock className="w-3 h-3 text-yellow-600" />}
                    {tx.status === "failed" && <AlertCircle className="w-3 h-3 text-red-600" />}
                    <span className="text-xs text-gray-600 capitalize">{tx.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Contract Operations */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            스마트 컨트랙트 운영
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-gray-900 font-medium mb-2 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                보상 분배
              </h4>
              <p className="text-gray-600 text-sm mb-3">기여도에 따른 PNTA 토큰 자동 분배</p>
              <div className="space-y-2 text-xs mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">컨트랙트:</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {realBlockchainData?.contractAddresses.rewardPool.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">가스 한도:</span>
                  <span className="text-gray-900">45,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">예상 비용:</span>
                  <span className="text-green-600">$0.002</span>
                </div>
              </div>
              <Button
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                disabled={!walletConnected}
                onClick={() => setActiveModal("reward")}
              >
                <Coins className="w-4 h-4 mr-2" />
                보상 실행
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-gray-900 font-medium mb-2 flex items-center gap-2">
                <Database className="w-4 h-4" />
                모델 등록
              </h4>
              <p className="text-gray-600 text-sm mb-3">새로운 AI 모델 버전 블록체인 등록</p>
              <div className="space-y-2 text-xs mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">현재 버전:</span>
                  <span className="text-gray-900">v2.{Math.floor(systemMetrics.globalAccuracy * 10)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">가스 한도:</span>
                  <span className="text-gray-900">65,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">예상 비용:</span>
                  <span className="text-green-600">$0.003</span>
                </div>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!walletConnected}
                onClick={() => setActiveModal("model")}
              >
                <Database className="w-4 h-4 mr-2" />
                모델 등록
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-gray-900 font-medium mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                거버넌스 투표
              </h4>
              <p className="text-gray-600 text-sm mb-3">프로토콜 거버넌스 참여</p>
              <div className="space-y-2 text-xs mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">활성 제안:</span>
                  <span className="text-gray-900">#{Math.floor(Math.random() * 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">투표권:</span>
                  <span className="text-gray-900">{pntaBalance} PNTA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">예상 비용:</span>
                  <span className="text-green-600">$0.001</span>
                </div>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!walletConnected}
                onClick={() => setActiveModal("governance")}
              >
                <Lock className="w-4 h-4 mr-2" />
                투표 참여
              </Button>
            </div>
          </div>

          {/* 실시간 컨트랙트 상태 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-gray-900 font-medium mb-2">실시간 컨트랙트 상태</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">PNTA 토큰 컨트랙트:</span>
                <div
                  className="font-mono text-blue-600 cursor-pointer hover:underline text-xs break-all"
                  onClick={() =>
                    window.open(
                      `${realBlockchainData?.explorerBase}/address/${realBlockchainData?.contractAddresses.pntaToken}`,
                      "_blank",
                    )
                  }
                >
                  {realBlockchainData?.contractAddresses.pntaToken.slice(0, 10)}...
                  {realBlockchainData?.contractAddresses.pntaToken.slice(-8)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">보상 풀 컨트랙트:</span>
                <div
                  className="font-mono text-blue-600 cursor-pointer hover:underline text-xs break-all"
                  onClick={() =>
                    window.open(
                      `${realBlockchainData?.explorerBase}/address/${realBlockchainData?.contractAddresses.rewardPool}`,
                      "_blank",
                    )
                  }
                >
                  {realBlockchainData?.contractAddresses.rewardPool.slice(0, 10)}...
                  {realBlockchainData?.contractAddresses.rewardPool.slice(-8)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">거버넌스 컨트랙트:</span>
                <div
                  className="font-mono text-blue-600 cursor-pointer hover:underline text-xs break-all"
                  onClick={() =>
                    window.open(
                      `${realBlockchainData?.explorerBase}/address/${realBlockchainData?.contractAddresses.governance}`,
                      "_blank",
                    )
                  }
                >
                  {realBlockchainData?.contractAddresses.governance.slice(0, 10)}...
                  {realBlockchainData?.contractAddresses.governance.slice(-8)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gas Optimization Analytics */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            가스 최적화 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-gray-900 font-medium mb-3">비용 비교 (24시간)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">이더리움 메인넷</span>
                  <span className="text-red-600 font-medium">$45.20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Polygon Layer2</span>
                  <span className="text-green-600 font-medium">$0.68</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-gray-900">절약 금액</span>
                  <span className="text-green-600">$44.52 (98.5%)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 font-medium mb-3">처리 성능</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">평균 확인 시간</span>
                  <span className="text-gray-900">2.1초</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">처리량 (TPS)</span>
                  <span className="text-gray-900">7,200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">성공률</span>
                  <span className="text-green-600">99.8%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {activeModal && (
        <SmartContractModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          type={activeModal}
          onExecute={
            activeModal === "reward"
              ? onRewardDistribution
              : activeModal === "model"
                ? onModelRegistration
                : onGovernanceVote
          }
          isExecuting={
            activeModal === "reward"
              ? contractOperations?.rewardDistribution
              : activeModal === "model"
                ? contractOperations?.modelRegistration
                : contractOperations?.governance
          }
        />
      )}
    </div>
  )
}
