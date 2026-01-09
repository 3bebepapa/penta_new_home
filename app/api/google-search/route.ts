import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, type = "web" } = await request.json()

    const apiKey = "AIzaSyD0HC9KVqdZoth0KxEdrqDXgHrFUo0e5Nw"
    const searchEngineId = "e2e41f7fa26ed4ee4"

    if (!apiKey || !searchEngineId) {
      return NextResponse.json({
        items: [
          {
            title: "Penta AI 검색 결과",
            snippet: `"${query}"에 대한 검색을 수행했습니다. Penta AI의 분산 검색 네트워크를 통해 관련 정보를 수집하고 있습니다.`,
            link: "https://penta.ai",
          },
        ],
      })
    }

    let searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=10`

    if (type === "news") {
      searchUrl += "&tbm=nws&sort=date"
    }

    const response = await fetch(searchUrl)

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`)
    }

    const data = await response.json()

    const results =
      data.items?.map((item: any) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link,
        displayLink: item.displayLink,
        formattedUrl: item.formattedUrl,
        publishedDate: item.pagemap?.metatags?.[0]?.["article:published_time"] || null,
      })) || []

    const relatedSearches = generateRelatedSearches(query)

    const summary =
      results.length > 0
        ? `"${query}"에 대한 ${results.length}개의 검색 결과를 찾았습니다. ${type === "news" ? "최신 뉴스" : "웹 검색"} 결과입니다.`
        : `"${query}"에 대한 검색 결과를 찾을 수 없습니다.`

    return NextResponse.json({
      items: results, // items 키로 변경하여 프론트엔드와 일치
      searchInformation: {
        totalResults: data.searchInformation?.totalResults || "0",
        formattedTotalResults: data.searchInformation?.formattedTotalResults || "0개",
        formattedSearchTime: data.searchInformation?.formattedSearchTime || "0.00초",
      },
      relatedSearches,
      summary,
      query,
      type,
    })
  } catch (error) {
    console.error("Google search error:", error)
    return NextResponse.json({
      items: [
        {
          title: "Penta AI 검색 시스템",
          snippet: "현재 검색 서비스를 준비 중입니다. Penta AI의 분산 검색 네트워크가 곧 활성화됩니다.",
          link: "https://penta.ai",
        },
      ],
      searchInformation: {
        totalResults: "1",
        formattedTotalResults: "1개",
        formattedSearchTime: "0.01초",
      },
      relatedSearches: [],
      summary: "검색 중 오류가 발생했습니다. Penta AI 폴백 시스템이 활성화되었습니다.",
      query: "",
      type: "web",
    })
  }
}

function generateRelatedSearches(query: string): string[] {
  const keywords = query.toLowerCase().split(" ")
  const relatedTerms: string[] = []

  // 기본 관련 검색어 패턴
  if (keywords.includes("파이썬") || keywords.includes("python")) {
    relatedTerms.push("파이썬 튜토리얼", "파이썬 라이브러리", "파이썬 프로젝트")
  } else if (keywords.includes("이재명")) {
    relatedTerms.push("이재명 정책", "이재명 뉴스", "이재명 프로필")
  } else if (keywords.includes("ai") || keywords.includes("인공지능")) {
    relatedTerms.push("AI 기술", "머신러닝", "딥러닝")
  } else {
    // 일반적인 관련 검색어
    relatedTerms.push(`${query} 뜻`, `${query} 방법`, `${query} 최신`)
  }

  return relatedTerms.slice(0, 5)
}
