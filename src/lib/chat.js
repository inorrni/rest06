import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Edge Function `chat` 호출. supabase-js가 로그인 사용자의 access token을
 * Authorization 헤더로 자동 첨부하므로, 함수 쪽에서 사용자 인증을 검증한다.
 *
 * @param {{role:'user'|'assistant', content:string}[]} messages
 * @returns {Promise<{reply:string, provider:string, model:string}>}
 */
export async function sendChatMessage(messages) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase가 설정되지 않았습니다. (.env.local 키 확인)')
  }
  const { data, error } = await supabase.functions.invoke('chat', {
    body: { messages },
  })

  if (error) {
    // 함수가 4xx/5xx로 응답하면 본문(JSON)에서 메시지를 꺼내 본다.
    let msg = error.message || '요청에 실패했습니다.'
    try {
      const body = await error.context?.json?.()
      if (body?.error) msg = body.error
    } catch {
      /* 무시 */
    }
    throw new Error(msg)
  }
  if (data?.error) throw new Error(data.error)
  return data
}
