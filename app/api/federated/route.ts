import { type NextRequest, NextResponse } from "next/server"
import { federatedEngine } from "@/lib/federated-learning"
import { blockchainService } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json()

    switch (action) {
      case "register_node":
        federatedEngine.registerNode(params.nodeId, params.initialWeights)
        return NextResponse.json({ success: true })

      case "update_weights":
        federatedEngine.updateNode(params.nodeId, params.weights, params.dataSize, params.accuracy)

        // 기여도 계산 및 블록체인 업데이트
        const contribution = federatedEngine.calculateContribution(params.nodeId, params.accuracy, params.dataSize)

        try {
          await blockchainService.updateContribution(params.nodeAddress, contribution)
        } catch (error) {
          console.error("Blockchain update failed:", error)
        }

        return NextResponse.json({ success: true, contribution })

      case "aggregate":
        const contributions = Array.from(params.contributions)
        const aggregatedWeights = await federatedEngine.aggregateWeights(contributions)

        return NextResponse.json({
          globalWeights: aggregatedWeights,
          round: federatedEngine.getCurrentRound(),
          globalAccuracy: federatedEngine.calculateGlobalAccuracy(),
        })

      case "get_status":
        return NextResponse.json({
          currentRound: federatedEngine.getCurrentRound(),
          activeNodes: federatedEngine.getActiveNodes(),
          globalAccuracy: federatedEngine.calculateGlobalAccuracy(),
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Federated learning API error:", error)
    return NextResponse.json({ error: "Federated learning operation failed" }, { status: 500 })
  }
}
