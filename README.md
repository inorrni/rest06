# rest06 — 서울 자율주행버스 실시간 위치

서울시 자율주행버스 소개 및 실시간 대민 페이지.
Claude Design 시안(`서울 자율주행버스 실시간 위치 사이트`)을 **Vite + React 18**로 이식하고,
**Supabase Auth(카카오 로그인)** 와 **즐겨찾는 차량** 기능을 연동했다.

## 스택
- Vite + React 18, 순수 CSS(`:root` 디자인 토큰)
- `@supabase/supabase-js` — 인증 + 데이터
- 카카오 로그인 = Supabase Auth의 **Kakao OAuth provider**

## 개발
```bash
npm install
cp .env.example .env.local   # Supabase 키 입력
npm run dev                  # http://localhost:5173
npm run build                # dist/ 생성
```

> `.env.local` 이 없어도 사이트는 동작한다(로그인 버튼만 "설정 필요" 에러를 표시).

## 카카오 로그인 설정 (Supabase)
1. **Supabase** → Authentication → Providers → **Kakao** 활성화
2. **Kakao Developers**(https://developers.kakao.com) 에서 앱 생성
   - 카카오 로그인 활성화, 동의항목(닉네임/프로필/이메일) 설정
   - **REST API 키**와 **Client Secret**(보안 → Client Secret 발급)을 Supabase Kakao provider에 입력
   - **Redirect URI** 에 등록: `https://<PROJECT>.supabase.co/auth/v1/callback`
3. `.env.local` 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 입력

## 즐겨찾는 차량 (Supabase 테이블)
로그인 사용자는 실시간 지도에서 차량을 즐겨찾기할 수 있다. 아래 SQL을 한 번 실행한다:

```sql
create table public.favorite_buses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bus_no text not null,
  created_at timestamptz not null default now(),
  unique (user_id, bus_no)
);
alter table public.favorite_buses enable row level security;
create policy "own rows" on public.favorite_buses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## 채팅 도우미 (Edge Function 프록시)
우하단 팝업 채팅. **카카오 로그인 사용자만** 사용 가능하며, LLM 호출은 Supabase
**Edge Function**(`supabase/functions/chat`)이 대행한다. Solar/OpenAI 키는 함수의
secret 에서만 읽으므로 브라우저에 노출되지 않는다. (Solar 우선 → 실패 시 OpenAI 폴백)

```bash
# Supabase CLI 로그인 & 프로젝트 연결
supabase login
supabase link --project-ref <PROJECT_REF>

# 키 저장 (Supabase 에 보관 — 클라이언트로 안 나감)
supabase secrets set SOLAR_API_KEY=up_xxx OPENAI_API_KEY=sk-xxx
# (선택) 모델 변경
supabase secrets set SOLAR_MODEL=solar-pro2 OPENAI_MODEL=gpt-4o-mini

# 함수 배포
supabase functions deploy chat
```

- 인증: Edge Function 이 요청의 access token 으로 `auth.getUser()` 를 검증 → 로그인
  사용자가 아니면 401. supabase-js `functions.invoke` 가 토큰을 자동 첨부한다.
- Solar 는 OpenAI 호환 엔드포인트(`https://api.upstage.ai/v1/chat/completions`)를 사용.
  모델명이 바뀌면 코드 수정 없이 `SOLAR_MODEL` secret 만 변경하면 된다.

## 구조
```
src/
  main.jsx · App.jsx
  context/LanguageContext.jsx   ← KO/EN i18n
  data/content.js               ← 모든 카피 + 데모 데이터
  lib/                          ← supabase, auth(카카오), favorites, chat
  hooks/                        ← useAuth, useReveal, useRoadEngine, useLiveMap
  components/                   ← Header, LineNav, RoadLayer, Hero, LiveMap, ChatWidget, …
  styles/index.css
supabase/functions/chat/        ← LLM 프록시 Edge Function (Solar + OpenAI)
docs/                           ← 개발일지 · 평가보고서
```
