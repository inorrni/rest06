import { useLang } from '../context/LanguageContext'
import { NAV_STOPS } from '../data/content'

// 좌측 고정 노선도 — 활성화/클릭 스크롤은 road-engine 훅이 담당한다.
export default function LineNav() {
  const { t } = useLang()
  return (
    <nav className="linenav" aria-label="노선도">
      {NAV_STOPS.map(([ko, en], i) => (
        <button key={i} className={i === 0 ? 'linenav-item active' : 'linenav-item'}>
          <span className="dot" />
          <span className="lbl">{t(ko, en)}</span>
        </button>
      ))}
    </nav>
  )
}
