import { supabase, isSupabaseConfigured } from './supabase'

/* ============================================================
   favorites.js — 로그인 사용자의 "즐겨찾는 차량" 저장/조회.
   Supabase 테이블 예시 (SQL):

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
   ============================================================ */

export async function listFavorites(userId) {
  if (!isSupabaseConfigured || !userId) return []
  const { data, error } = await supabase
    .from('favorite_buses')
    .select('bus_no')
    .eq('user_id', userId)
  if (error) throw error
  return (data || []).map((r) => r.bus_no)
}

export async function addFavorite(userId, busNo) {
  if (!isSupabaseConfigured || !userId) return
  const { error } = await supabase
    .from('favorite_buses')
    .insert({ user_id: userId, bus_no: busNo })
  if (error && error.code !== '23505') throw error // 중복은 무시
}

export async function removeFavorite(userId, busNo) {
  if (!isSupabaseConfigured || !userId) return
  const { error } = await supabase
    .from('favorite_buses')
    .delete()
    .eq('user_id', userId)
    .eq('bus_no', busNo)
  if (error) throw error
}
