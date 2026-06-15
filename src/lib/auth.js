import { supabase, isSupabaseConfigured } from './supabase'

/**
 * 카카오 로그인 — Supabase Auth의 Kakao OAuth provider 사용.
 * Supabase 대시보드 Authentication → Providers → Kakao 를 활성화하고,
 * Kakao Developers 앱의 Redirect URI 에
 *   https://<project>.supabase.co/auth/v1/callback
 * 를 등록해 두어야 한다.
 */
export async function signInWithKakao() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase가 설정되지 않았습니다. .env.local 에 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 를 추가하세요.',
    )
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      // 로그인 완료 후 돌아올 주소(현재 페이지)
      redirectTo: window.location.origin + window.location.pathname,
    },
  })
  if (error) throw error
}

export async function signOut() {
  if (!isSupabaseConfigured) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
