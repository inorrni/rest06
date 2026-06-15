import { useLang } from '../context/LanguageContext'

// 헤더/푸터 공용 브랜드 로고
export default function BrandMark() {
  const { t } = useLang()
  return (
    <a className="brand" href="#hero">
      <span className="brand-mark">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="4" y="3" width="16" height="15" rx="4" fill="#fff" />
          <rect x="6.5" y="6" width="11" height="4" rx="1.5" fill="#0e7490" />
          <circle cx="8" cy="20" r="1.6" fill="#fff" />
          <circle cx="16" cy="20" r="1.6" fill="#fff" />
        </svg>
      </span>
      <span>
        서울 자율주행버스
        <small>{t('SEOUL AUTONOMOUS BUS', 'Seoul Autonomous Bus')}</small>
      </span>
    </a>
  )
}
