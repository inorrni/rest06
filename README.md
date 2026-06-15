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

## 구조
```
src/
  main.jsx · App.jsx
  context/LanguageContext.jsx   ← KO/EN i18n
  data/content.js               ← 모든 카피 + 데모 데이터
  lib/                          ← supabase, auth(카카오), favorites
  hooks/                        ← useAuth, useReveal, useRoadEngine, useLiveMap
  components/                   ← Header, LineNav, RoadLayer, Hero, LiveMap, About, …
  styles/index.css
docs/                           ← 개발일지 · 평가보고서
```
