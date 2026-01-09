export interface ModelWeights {
  [layerName: string]: number[][]
}

export interface NodeContribution {
  nodeId: string
  weights: ModelWeights
  dataSize: number
  accuracy: number
  timestamp: number
}

export class FederatedLearningEngine {
  private globalModel: ModelWeights = {}
  private nodeContributions: Map<string, NodeContribution> = new Map()
  private currentRound = 0

  // FedAvg 알고리즘 구현
  async aggregateWeights(contributions: NodeContribution[]): Promise<ModelWeights> {
    if (contributions.length === 0) return this.globalModel

    // 총 데이터 크기 계산
    const totalDataSize = contributions.reduce((sum, contrib) => sum + contrib.dataSize, 0)

    // 가중 평균 계산
    const aggregatedWeights: ModelWeights = {}

    // 첫 번째 기여자의 레이어 구조를 기준으로 함
    const firstContrib = contributions[0]

    for (const layerName in firstContrib.weights) {
      const layerShape = firstContrib.weights[layerName]
      aggregatedWeights[layerName] = Array(layerShape.length)
        .fill(0)
        .map(() => Array(layerShape[0].length).fill(0))

      // 각 노드의 가중치를 데이터 크기에 비례하여 집계
      for (const contrib of contributions) {
        const weight = contrib.dataSize / totalDataSize
        const nodeWeights = contrib.weights[layerName]

        for (let i = 0; i < nodeWeights.length; i++) {
          for (let j = 0; j < nodeWeights[i].length; j++) {
            aggregatedWeights[layerName][i][j] += nodeWeights[i][j] * weight
          }
        }
      }
    }

    this.globalModel = aggregatedWeights
    this.currentRound++

    return aggregatedWeights
  }

  // 노드 기여도 계산
  calculateContribution(nodeId: string, accuracy: number, dataSize: number): number {
    const baseContribution = dataSize / 1000 // 데이터 크기 기반
    const accuracyBonus = accuracy > 0.8 ? (accuracy - 0.8) * 5 : 0 // 정확도 보너스

    return Math.min(baseContribution + accuracyBonus, 1.0) // 최대 1.0
  }

  // 보상 계산
  calculateReward(contribution: number, totalRewardPool: number): number {
    return contribution * totalRewardPool
  }

  // 노드 등록
  registerNode(nodeId: string, initialWeights: ModelWeights): void {
    this.nodeContributions.set(nodeId, {
      nodeId,
      weights: initialWeights,
      dataSize: 0,
      accuracy: 0,
      timestamp: Date.now(),
    })
  }

  // 노드 업데이트
  updateNode(nodeId: string, weights: ModelWeights, dataSize: number, accuracy: number): void {
    const existing = this.nodeContributions.get(nodeId)
    if (existing) {
      this.nodeContributions.set(nodeId, {
        ...existing,
        weights,
        dataSize,
        accuracy,
        timestamp: Date.now(),
      })
    }
  }

  // 현재 라운드 정보
  getCurrentRound(): number {
    return this.currentRound
  }

  // 활성 노드 수
  getActiveNodes(): number {
    const now = Date.now()
    const activeThreshold = 5 * 60 * 1000 // 5분

    return Array.from(this.nodeContributions.values()).filter((contrib) => now - contrib.timestamp < activeThreshold)
      .length
  }

  // 글로벌 모델 정확도 계산
  calculateGlobalAccuracy(): number {
    const contributions = Array.from(this.nodeContributions.values())
    if (contributions.length === 0) return 0

    const totalDataSize = contributions.reduce((sum, contrib) => sum + contrib.dataSize, 0)

    return contributions.reduce((weightedSum, contrib) => {
      const weight = contrib.dataSize / totalDataSize
      return weightedSum + contrib.accuracy * weight
    }, 0)
  }
}

export const federatedEngine = new FederatedLearningEngine()
