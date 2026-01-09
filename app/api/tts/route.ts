import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, voice = "ko-KR-Wavenet-A" } = await request.json()

    // Google Cloud Text-to-Speech API 키 확인
    const apiKey = process.env.GOOGLE_GCP_API_KEY

    if (!apiKey) {
      // 시뮬레이션된 응답
      return NextResponse.json({
        audioContent: "data:audio/mp3;base64,//mock_audio_data//",
        message: "TTS 시뮬레이션 모드입니다.",
      })
    }

    // 실제 Google Text-to-Speech API 호출 로직
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: "ko-KR",
          name: voice,
        },
        audioConfig: {
          audioEncoding: "MP3",
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({
      audioContent: `data:audio/mp3;base64,${data.audioContent}`,
    })
  } catch (error) {
    console.error("TTS API error:", error)
    return NextResponse.json({
      audioContent: "data:audio/mp3;base64,//mock_audio_data//",
      message: "TTS 처리 중 오류가 발생했습니다.",
    })
  }
}
