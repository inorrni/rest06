import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../hooks/useAuth'
import { signInWithKakao, signOut } from '../lib/auth'
import { listFavorites } from '../lib/favorites'
import { IconKakao } from './icons'

// 사용자 메타데이터에서 표시 이름/아바타 뽑기 (카카오 프로필 구조 대응)
function profileOf(user) {
  const m = user?.user_metadata || {}
  const name = m.name || m.full_name || m.nickname || m.preferred_username || user?.email || '사용자'
  const avatar = m.avatar_url || m.picture || null
  return { name, avatar, email: user?.email || '' }
}

export default function AuthControls() {
  const { t } = useLang()
  const { user, loading, configured } = useAuth()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [favCount, setFavCount] = useState(null)
  const menuRef = useRef(null)

  // 바깥 클릭 시 팝오버 닫기
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // 로그인 시 즐겨찾기 개수 로드
  useEffect(() => {
    let active = true
    if (user) {
      listFavorites(user.id)
        .then((rows) => active && setFavCount(rows.length))
        .catch(() => active && setFavCount(null))
    } else {
      setFavCount(null)
    }
    return () => { active = false }
  }, [user])

  async function handleLogin() {
    setBusy(true)
    setError('')
    try {
      await signInWithKakao()
    } catch (e) {
      setError(e.message || String(e))
      setBusy(false)
    }
  }

  async function handleLogout() {
    setOpen(false)
    try {
      await signOut()
    } catch (e) {
      setError(e.message || String(e))
    }
  }

  if (loading) return null

  if (!user) {
    return (
      <>
        <button
          className="btn btn-kakao"
          onClick={handleLogin}
          disabled={busy}
          aria-label={t('카카오 로그인', 'Kakao login')}
        >
          <IconKakao />
          <span className="btn-label">
            {busy ? t('연결 중…', 'Connecting…') : t('카카오 로그인', 'Kakao login')}
          </span>
        </button>
        {error && (
          <div className="auth-error" role="alert">
            <span>{error}</span>
            <button onClick={() => setError('')} aria-label="닫기">✕</button>
          </div>
        )}
      </>
    )
  }

  const { name, avatar, email } = profileOf(user)
  const initial = name.slice(0, 1).toUpperCase()

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-chip" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {avatar ? (
          <img className="user-avatar" src={avatar} alt="" />
        ) : (
          <span className="user-avatar">{initial}</span>
        )}
        {name}
      </button>
      {open && (
        <div className="user-pop">
          <div className="who">
            {avatar ? (
              <img className="user-avatar" src={avatar} alt="" />
            ) : (
              <span className="user-avatar">{initial}</span>
            )}
            <div>
              <div className="nm">{name}</div>
              {email && <div className="em">{email}</div>}
            </div>
          </div>
          {favCount != null && (
            <div className="pop-fav">
              {t('즐겨찾는 차량', 'Favorite vehicles')} <b>{favCount}</b>
              {t('대', '')}
            </div>
          )}
          <button className="btn btn-ghost btn-block" onClick={handleLogout}>
            {t('로그아웃', 'Log out')}
          </button>
        </div>
      )}
      {error && (
        <div className="auth-error" role="alert">
          <span>{error}</span>
          <button onClick={() => setError('')} aria-label="닫기">✕</button>
        </div>
      )}
    </div>
  )
}
