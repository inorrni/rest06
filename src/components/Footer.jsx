import { useLang } from '../context/LanguageContext'
import BrandMark from './BrandMark'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="site-footer">
      <div className="foot-inner">
        <BrandMark />
        <div className="foot-links">
          <div className="foot-col">
            <h4>{t('서비스', 'Service')}</h4>
            <a href="#live">{t('실시간 위치', 'Live location')}</a>
            <a href="#route">{t('운행 노선', 'Routes')}</a>
            <a href="#howto">{t('이용 방법', 'How to ride')}</a>
          </div>
          <div className="foot-col">
            <h4>{t('안내', 'Info')}</h4>
            <a href="#about">{t('자율주행버스 소개', 'About')}</a>
            <a href="#faq">{t('자주 묻는 질문', 'FAQ')}</a>
            <a href="#">{t('공지사항', 'Notices')}</a>
          </div>
          <div className="foot-col">
            <h4>{t('문의', 'Contact')}</h4>
            <a href="#">{t('서울 120 다산콜', 'Seoul 120 Dasan Call')}</a>
            <a href="#">{t('신고 · 제안', 'Report / Suggest')}</a>
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <span>
          {t(
            '본 사이트는 시연용입니다. 표시된 수치와 위치는 예시입니다.',
            'This is a demonstration site. Figures and locations are illustrative.',
          )}
        </span>
        &nbsp;·&nbsp; © 2026 Seoul Metropolitan Government
      </div>
    </footer>
  )
}
