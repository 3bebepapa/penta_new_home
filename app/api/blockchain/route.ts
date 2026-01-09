import { type NextRequest, NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain"

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json()

    switch (action) {
      case "get_balance":
        const balance = await blockchainService.getPNTABalance(params.address)
        return NextResponse.json({ balance })

      case "distribute_rewards":
        const txHash = await blockchainService.distributeRewards(params.recipients, params.amounts)
        return NextResponse.json({ txHash, success: true })

      case "update_contribution":
        const contributionTx = await blockchainService.updateContribution(params.nodeAddress, params.contribution)
        return NextResponse.json({ txHash: contributionTx, success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Blockchain API error:", error)
    return NextResponse.json({ error: "Blockchain operation failed" }, { status: 500 })
  }
}
