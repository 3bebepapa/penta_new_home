"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, Network, Database, Cpu, Users, Settings, Play, Pause, RotateCcw, Zap } from "lucide-react"

interface NodeAgent {
  id: string
  status: "active" | "training" | "idle"
  accuracy: number
  contribution: number
  rewards: number
}

interface TrainingMetrics {
  globalAccuracy: number
  totalNodes: number
  activeNodes: number
  currentRound: number
  sqaTokens: number
}

export default function SquareAIPlatform() {
  const [isTraining, setIsTraining] = useState(false)
  const [nodes, setNodes] = useState<NodeAgent[]>([
    { id: "Node-001", status: "active", accuracy: 0.85, contribution: 0.23, rewards: 150 },
    { id: "Node-002", status: "training", accuracy: 0.82, contribution: 0.19, rewards: 120 },
    { id: "Node-003", status: "active", accuracy: 0.88, contribution: 0.31, rewards: 200 },
    { id: "Node-004", status: "idle", accuracy: 0.79, contribution: 0.15, rewards: 95 },
  ])

  const [metrics, setMetrics] = useState<TrainingMetrics>({
    globalAccuracy: 0.835,
    totalNodes: 4,
    activeNodes: 2,
    currentRound: 15,
    sqaTokens: 565,
  })

  const [emaiProgress, setEmaiProgress] = useState(0)
  const [federatedProgress, setFederatedProgress] = useState(0)
  const [blockchainProgress, setBlockchainProgress] = useState(0)
  const [nasProgress, setNasProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTraining) {
      interval = setInterval(() => {
        // Simulate training progress
        setEmaiProgress((prev) => Math.min(prev + Math.random() * 5, 100))
        setFederatedProgress((prev) => Math.min(prev + Math.random() * 3, 100))
        setBlockchainProgress((prev) => Math.min(prev + Math.random() * 2, 100))
        setNasProgress((prev) => Math.min(prev + Math.random() * 4, 100))

        // Update metrics
        setMetrics((prev) => ({
          ...prev,
          globalAccuracy: Math.min(prev.globalAccuracy + Math.random() * 0.001, 0.95),
          currentRound: prev.currentRound + (Math.random() > 0.8 ? 1 : 0),
          sqaTokens: prev.sqaTokens + Math.floor(Math.random() * 5),
        }))

        // Update nodes
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            accuracy: Math.min(node.accuracy + Math.random() * 0.002, 0.95),
            contribution: Math.min(node.contribution + Math.random() * 0.01, 1),
            rewards: node.rewards + Math.floor(Math.random() * 3),
            status:
              Math.random() > 0.7
                ? (["active", "training", "idle"] as const)[Math.floor(Math.random() * 3)]
                : node.status,
          })),
        )
      }, 1000)
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
      sqaTokens: 565,
    })
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-neutral-800 border-[#4d4d4d]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Square AI Platform Control Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button
              onClick={startTraining}
              disabled={isTraining}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Training
            </Button>
            <Button onClick={stopTraining} disabled={!isTraining} className="bg-red-600 hover:bg-red-700 text-white">
              <Pause className="w-4 h-4 mr-2" />
              Stop Training
            </Button>
            <Button onClick={resetSystem} className="bg-gray-600 hover:bg-gray-700 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Global Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{(metrics.globalAccuracy * 100).toFixed(1)}%</div>
              <div className="text-[#adadad] text-sm">Global Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {metrics.activeNodes}/{metrics.totalNodes}
              </div>
              <div className="text-[#adadad] text-sm">Active Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{metrics.currentRound}</div>
              <div className="text-[#adadad] text-sm">Training Round</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{metrics.sqaTokens}</div>
              <div className="text-[#adadad] text-sm">SQA Tokens</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Engines Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-neutral-800 border-[#4d4d4d]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              EMAI Framework
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#adadad]">Multi-modal Processing</span>
                  <span className="text-white">{emaiProgress.toFixed(0)}%</span>
                </div>
                <Progress value={emaiProgress} className="h-2" />
              </div>
              <div className="text-xs text-[#adadad]">
                Status: {isTraining ? "Processing ensemble models..." : "Standby"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-[#4d4d4d]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Network className="w-5 h-5" />
              Federated Learning Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#adadad]">Gradient Aggregation</span>
                  <span className="text-white">{federatedProgress.toFixed(0)}%</span>
                </div>
                <Progress value={federatedProgress} className="h-2" />
              </div>
              <div className="text-xs text-[#adadad]">
                Status: {isTraining ? "Aggregating local models..." : "Standby"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-[#4d4d4d]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Blockchain Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#adadad]">Transaction Processing</span>
                  <span className="text-white">{blockchainProgress.toFixed(0)}%</span>
                </div>
                <Progress value={blockchainProgress} className="h-2" />
              </div>
              <div className="text-xs text-[#adadad]">
                Status: {isTraining ? "Recording contributions..." : "Standby"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-800 border-[#4d4d4d]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              NAS Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#adadad]">Architecture Search</span>
                  <span className="text-white">{nasProgress.toFixed(0)}%</span>
                </div>
                <Progress value={nasProgress} className="h-2" />
              </div>
              <div className="text-xs text-[#adadad]">
                Status: {isTraining ? "Optimizing architecture..." : "Standby"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Node Agents */}
      <Card className="bg-neutral-800 border-[#4d4d4d]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Federated Learning Nodes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {nodes.map((node) => (
              <div key={node.id} className="border border-[#4d4d4d] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{node.id}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      node.status === "active"
                        ? "bg-green-400"
                        : node.status === "training"
                          ? "bg-yellow-400"
                          : "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#adadad]">Accuracy:</span>
                    <span className="text-white">{(node.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#adadad]">Contribution:</span>
                    <span className="text-white">{(node.contribution * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#adadad]">SQA Rewards:</span>
                    <span className="text-white">{node.rewards}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AIWorks Platform */}
      <Card className="bg-neutral-800 border-[#4d4d4d]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AIWorks Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[#4d4d4d] rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">AI Agent Creator</h4>
              <p className="text-[#adadad] text-sm mb-3">Create personalized AI agents</p>
              <Button className="w-full bg-black text-white hover:bg-gray-800">Create Agent</Button>
            </div>
            <div className="border border-[#4d4d4d] rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Model Marketplace</h4>
              <p className="text-[#adadad] text-sm mb-3">Share and monetize AI models</p>
              <Button className="w-full bg-black text-white hover:bg-gray-800">Browse Models</Button>
            </div>
            <div className="border border-[#4d4d4d] rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Reward Dashboard</h4>
              <p className="text-[#adadad] text-sm mb-3">Track your SQA token earnings</p>
              <Button className="w-full bg-black text-white hover:bg-gray-800">View Rewards</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
