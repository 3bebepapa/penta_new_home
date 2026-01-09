// FederatedLearningEngine.tsx
import type React from "react"

interface Node {
  id: string
  name: string
  status: string
  data: any // Replace 'any' with a more specific type if possible
}

interface FederatedLearningEngineProps {
  nodes: Node[]
}

const FederatedLearningEngine: React.FC<FederatedLearningEngineProps> = ({ nodes }) => {
  return (
    <div>
      {/* 모바일 반응형 그리드 수정 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {nodes.map((node) => (
          <div key={node.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
            {/* 기존 내용 */}
            <h3>{node.name}</h3>
            <p>Status: {node.status}</p>
            {/* Display other node data here */}
          </div>
        ))}
      </div>

      {/* 블록체인 정보 추가 */}
      <div className="text-xs text-blue-600 bg-blue-50 rounded p-2 mt-2">
        🔗 Polygon 메인넷에서 스마트 컨트랙트로 자동 집계
        <br />💰 기여도별 SQA 토큰 자동 분배 (가스비 85% 절약)
      </div>
    </div>
  )
}

export default FederatedLearningEngine
