import { useEffect, useState, useCallback } from 'react'
import { useLang } from '../context/LanguageContext'
import { useLiveMap } from '../hooks/useLiveMap'
import { useAuth } from '../hooks/useAuth'
import { listFavorites, addFavorite, removeFavorite } from '../lib/favorites'
import { IconStar } from './icons'

function useClock() {
  const [time, setTime] = useState('--:--:--')
  useEffect(() => {
    const p = (n) => String(n).padStart(2, '0')
    const tick = () => {
      const d = new Date()
      setTime(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function LiveMap() {
  const { t } = useLang()
  const { user } = useAuth()
  const clock = useClock()
  const [selectedBus, setSelectedBus] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [favBusy, setFavBusy] = useState(false)

  const onSelect = useCallback((busNo) => setSelectedBus(busNo), [])
  useLiveMap(onSelect)

  // 로그인 사용자의 즐겨찾기 목록 로드
  useEffect(() => {
    let active = true
    if (user) {
      listFavorites(user.id)
        .then((rows) => active && setFavorites(rows))
        .catch(() => active && setFavorites([]))
    } else {
      setFavorites([])
    }
    return () => { active = false }
  }, [user])

  const isFav = selectedBus && favorites.includes(selectedBus)

  async function toggleFav() {
    if (!user || !selectedBus || favBusy) return
    setFavBusy(true)
    try {
      if (isFav) {
        await removeFavorite(user.id, selectedBus)
        setFavorites((f) => f.filter((b) => b !== selectedBus))
      } else {
        await addFavorite(user.id, selectedBus)
        setFavorites((f) => [...f, selectedBus])
      }
    } catch {
      /* 네트워크/권한 오류는 조용히 무시 (UI 롤백) */
    } finally {
      setFavBusy(false)
    }
  }

  return (
    <section className="stage" id="live" data-side="right" data-no="01" data-stop={t('실시간 위치', 'Live location')}>
      <div className="road-anchor" />
      <div className="stage-inner">
        <div className="card-col reveal">
          <div className="card map-card">
            <div className="map-head">
              <div>
                <div className="section-no">STATION 01</div>
                <h2 style={{ fontSize: 24 }}>{t('지금, 어디쯤 달릴까요?', 'Where is it now?')}</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span className="live-badge">
                  <span className="blip" />
                  LIVE
                </span>
                <span className="map-clock" id="mapClock">{clock}</span>
              </div>
            </div>
            <div className="map-grid">
              <div className="map-stage">
                <svg viewBox="0 0 520 380" preserveAspectRatio="xMidYMid meet">
                  <rect x="40" y="40" width="120" height="80" rx="14" fill="currentColor" opacity=".04" />
                  <rect x="360" y="60" width="120" height="90" rx="14" fill="currentColor" opacity=".04" />
                  <rect x="300" y="250" width="150" height="90" rx="14" fill="currentColor" opacity=".04" />
                  <rect x="60" y="250" width="120" height="80" rx="14" fill="currentColor" opacity=".04" />
                  <path
                    id="routePath"
                    className="route-line"
                    d="M80 90 C 80 60 120 52 180 56 C 260 62 300 44 360 64 C 430 86 470 80 466 140 C 462 200 488 226 446 270 C 404 314 420 340 332 340 C 252 340 206 358 138 336 C 78 316 52 286 60 224 C 66 176 56 122 80 90 Z"
                  />
                  <path
                    className="route-line dash"
                    d="M80 90 C 80 60 120 52 180 56 C 260 62 300 44 360 64 C 430 86 470 80 466 140 C 462 200 488 226 446 270 C 404 314 420 340 332 340 C 252 340 206 358 138 336 C 78 316 52 286 60 224 C 66 176 56 122 80 90 Z"
                  />
                  <g id="mapStopLayer" />
                  <g id="mapBusLayer" />
                </svg>
              </div>
              <div className="map-side">
                <div className="bus-pick" id="busPick" />
                <div className="eta-big">
                  <b id="liveEta">--:--</b>
                  <span>{t('다음 정류장 도착까지', 'until next stop')}</span>
                </div>
                <div className="live-row">
                  <span className="k">{t('차량 번호', 'Vehicle')}</span>
                  <span className="v" id="liveNo">—</span>
                </div>
                <div className="live-row">
                  <span className="k">{t('현재 위치', 'Position')}</span>
                  <span className="v" id="liveNow">—</span>
                </div>
                <div className="live-row">
                  <span className="k">{t('다음 정류장', 'Next stop')}</span>
                  <span className="v" id="liveNext">—</span>
                </div>
                <div className="live-row">
                  <span className="k">{t('혼잡도', 'Crowding')}</span>
                  <span className="v occu" id="liveOcc" />
                </div>

                {/* 즐겨찾기 — 로그인 시에만 노출 (Supabase 저장) */}
                {user ? (
                  <div className="fav-row">
                    <button className={isFav ? 'fav-btn on' : 'fav-btn'} onClick={toggleFav} disabled={favBusy}>
                      <IconStar filled={isFav} />
                      {isFav
                        ? t('즐겨찾기 해제', 'Remove favorite')
                        : t('이 차량 즐겨찾기', 'Favorite this vehicle')}
                    </button>
                  </div>
                ) : (
                  <p className="fav-hint">{t('로그인하면 차량을 즐겨찾기할 수 있어요', 'Log in to favorite a vehicle')}</p>
                )}
              </div>
            </div>
          </div>
          <p className="lead" style={{ marginTop: 16, fontSize: 14.5 }}>
            {t(
              '* 데모용 예시 데이터입니다. 실제 서비스는 차량 실시간 정보와 연동됩니다.',
              '* Demo data for illustration. The live service connects to real-time vehicle telemetry.',
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
