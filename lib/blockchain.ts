import { ethers } from "ethers"

// Polygon 네트워크 설정
export const POLYGON_CONFIG = {
  chainId: 137,
  name: "Polygon Mainnet",
  rpcUrl: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
  explorerUrl: "https://polygonscan.com",
}

// PNTA 토큰 컨트랙트 ABI (간소화)
export const PNTA_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]

// 보상 분배 컨트랙트 ABI
export const REWARD_CONTRACT_ABI = [
  "function distributeRewards(address[] memory recipients, uint256[] memory amounts)",
  "function getContribution(address node) view returns (uint256)",
  "function updateContribution(address node, uint256 contribution)",
  "event RewardDistributed(address indexed recipient, uint256 amount)",
]

export class BlockchainService {
  private provider: ethers.JsonRpcProvider
  private signer?: ethers.Wallet
  private pntaContract?: ethers.Contract
  private rewardContract?: ethers.Contract

  constructor() {
    this.provider = new ethers.JsonRpcProvider(POLYGON_CONFIG.rpcUrl)

    if (process.env.PRIVATE_KEY) {
      this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider)
      this.initContracts()
    }
  }

  private initContracts() {
    if (!this.signer) return

    this.pntaContract = new ethers.Contract(process.env.PNTA_TOKEN_ADDRESS!, PNTA_TOKEN_ABI, this.signer)

    this.rewardContract = new ethers.Contract(process.env.REWARD_POOL_ADDRESS!, REWARD_CONTRACT_ABI, this.signer)
  }

  // 실제 PNTA 토큰 잔액 조회
  async getPNTABalance(address: string): Promise<string> {
    try {
      if (!this.pntaContract) throw new Error("Contract not initialized")

      const balance = await this.pntaContract.balanceOf(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error("Error getting PNTA balance:", error)
      return "0"
    }
  }

  // 실제 보상 분배 실행
  async distributeRewards(recipients: string[], amounts: string[]): Promise<string> {
    try {
      if (!this.rewardContract) throw new Error("Contract not initialized")

      const amountsBN = amounts.map((amount) => ethers.parseEther(amount))

      const tx = await this.rewardContract.distributeRewards(recipients, amountsBN)
      await tx.wait()

      return tx.hash
    } catch (error) {
      console.error("Error distributing rewards:", error)
      throw error
    }
  }

  // 기여도 업데이트
  async updateContribution(nodeAddress: string, contribution: number): Promise<string> {
    try {
      if (!this.rewardContract) throw new Error("Contract not initialized")

      const contributionBN = ethers.parseEther(contribution.toString())
      const tx = await this.rewardContract.updateContribution(nodeAddress, contributionBN)
      await tx.wait()

      return tx.hash
    } catch (error) {
      console.error("Error updating contribution:", error)
      throw error
    }
  }

  // 실시간 이벤트 리스닝
  startEventListening(callback: (event: any) => void) {
    if (!this.pntaContract || !this.rewardContract) return

    // PNTA 토큰 전송 이벤트
    this.pntaContract.on("Transfer", (from, to, value, event) => {
      callback({
        type: "token_transfer",
        from,
        to,
        value: ethers.formatEther(value),
        txHash: event.log.transactionHash,
      })
    })

    // 보상 분배 이벤트
    this.rewardContract.on("RewardDistributed", (recipient, amount, event) => {
      callback({
        type: "reward_distributed",
        recipient,
        amount: ethers.formatEther(amount),
        txHash: event.log.transactionHash,
      })
    })
  }
}

export const blockchainService = new BlockchainService()
