import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const network = searchParams.get("network") || "arbitrum"

    let rpcUrl: string

    switch (network) {
      case "ethereum":
        rpcUrl = process.env.ETHEREUM_MAINNET_URL!
        break
      case "polygon":
        rpcUrl = process.env.POLYGON_MAINNET_URL!
        break
      case "arbitrum":
        rpcUrl = process.env.ARBITRUM_MAINNET_URL!
        break
      case "base":
        rpcUrl = process.env.BASE_MAINNET_URL!
        break
      case "optimism":
        rpcUrl = process.env.OPTIMISM_MAINNET_URL!
        break
      default:
        rpcUrl = process.env.ARBITRUM_MAINNET_URL!
    }

    return NextResponse.json({ rpcUrl })
  } catch (error) {
    console.error("Error getting RPC URL:", error)
    return NextResponse.json({ error: "Failed to get RPC URL" }, { status: 500 })
  }
}
