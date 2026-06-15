import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { STATS } from '../data/content'

// 스크롤 진입 시 0 → to 로 카운트업 (원본 app.js runCount 이식)
function CountUp({ to, dec }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    function check() {
      if (done.current || !el) return
      const trigger = window.innerHeight * 0.82
      if (el.getBoundingClientRect().top < trigger) {
        done.current = true
        const t0 = performance.now()
        const dur = 1500
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / dur)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(to * eased)
          if (p < 1) requestAnimationFrame(tick)
          else setVal(to)
        }
        requestAnimationFrame(tick)
      }
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [to])

  const text = val.toLocaleString('ko-KR', { minimumFractionDigits: dec, maximumFractionDigits: dec })
  return <b ref={ref}>{text}</b>
}

export default function Stats() {
  const { t } = useLang()
  return (
    <section className="stage" id="stats" data-side="right" data-no="05" data-stop={t('운행 현황', 'By the numbers')}>
      <div className="road-anchor" />
      <div className="stage-inner">
        <div className="card-col reveal">
          <div className="card">
            <div className="section-no">STATION 05</div>
            <h2>{t('숫자로 보는 운행', 'By the numbers')}</h2>
            <p className="lead">
              {t('시범 운행 시작 이후 누적 기록입니다.', 'Cumulative figures since the pilot began.')}
            </p>
            <div className="stat-grid">
              {STATS.map((s, i) => (
                <div className="stat" key={i}>
                  <CountUp to={s.to} dec={s.dec} />
                  <span className="suf">{t(...s.suffix)}</span>
                  <span>{t(...s.label)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
