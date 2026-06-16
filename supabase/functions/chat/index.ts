// ============================================================
// Edge Function: chat
// 카카오(=Supabase Auth) 로그인 사용자만 호출 가능한 LLM 프록시.
// 키(SOLAR_API_KEY / OPENAI_API_KEY)는 이 함수의 환경(secret)에서만 읽으며
// 브라우저로 노출되지 않는다. Solar(Upstage) 우선, 실패 시 OpenAI 폴백.
//
// 배포:
//   supabase functions deploy chat
// 시크릿 설정:
//   supabase secrets set SOLAR_API_KEY=... OPENAI_API_KEY=...
//   (선택) supabase secrets set SOLAR_MODEL=solar-pro2 OPENAI_MODEL=gpt-4o-mini
// ============================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SOLAR_URL = 'https://api.upstage.ai/v1/chat/completions'
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

const SYSTEM_PROMPT =
  '당신은 "서울 자율주행버스" 안내 챗봇입니다. ' +
  '실시간 위치, 노선(A01 청계천 순환선, A02 여의도–마포선, A03 상암 DMC선), ' +
  '이용 방법, 운행 시간(매일 07:00–22:00), 요금(시범 운행 기간 무료), 안전(레벨4 자율주행·안전요원 동승·24시간 관제) ' +
  '등에 대해 친절하고 간결한 한국어로 답하세요. 모르면 모른다고 답하고, 정확하지 않은 정보를 지어내지 마세요.'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// OpenAI 호환 chat completion 호출 (Solar/OpenAI 공용)
async function callLLM(url: string, apiKey: string, model: string, messages: ChatMessage[]) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, temperature: 0.4, stream: false }),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`${res.status} ${detail.slice(0, 300)}`)
  }
  const data = await res.json()
  const reply = data?.choices?.[0]?.message?.content?.trim()
  if (!reply) throw new Error('빈 응답')
  return reply
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    if (req.method !== 'POST') return json({ error: 'POST만 허용됩니다.' }, 405)

    // ----- 인증 게이트: 로그인 사용자만 -----
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return json({ error: '로그인이 필요합니다.' }, 401)

    // ----- 입력 -----
    const { messages } = (await req.json()) as { messages?: ChatMessage[] }
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'messages 배열이 필요합니다.' }, 400)
    }
    // 안전: 최근 20개만 사용 + 시스템 프롬프트 선두 고정
    const trimmed = messages
      .filter((m) => m && typeof m.content === 'string' && m.role !== 'system')
      .slice(-20)
    const payload: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed]

    const solarKey = Deno.env.get('SOLAR_API_KEY')
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    const solarModel = Deno.env.get('SOLAR_MODEL') ?? 'solar-pro2'
    const openaiModel = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini'

    if (!solarKey && !openaiKey) {
      return json({ error: 'LLM 키가 설정되지 않았습니다. (SOLAR_API_KEY / OPENAI_API_KEY)' }, 500)
    }

    // ----- Solar 우선, 실패 시 OpenAI 폴백 -----
    const errors: string[] = []
    if (solarKey) {
      try {
        const reply = await callLLM(SOLAR_URL, solarKey, solarModel, payload)
        return json({ reply, provider: 'solar', model: solarModel })
      } catch (e) {
        errors.push(`solar: ${e instanceof Error ? e.message : String(e)}`)
      }
    }
    if (openaiKey) {
      try {
        const reply = await callLLM(OPENAI_URL, openaiKey, openaiModel, payload)
        return json({ reply, provider: 'openai', model: openaiModel })
      } catch (e) {
        errors.push(`openai: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    return json({ error: '응답 생성 실패', detail: errors.join(' | ') }, 502)
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
