import { useLang } from '../context/LanguageContext'

export default function Hero() {
  const { t } = useLang()
  return (
    <section className="stage" id="hero" data-side="center" data-no="S" data-stop={t('출발', 'Start')}>
      <div className="road-anchor" style={{ top: '80%' }} />
      <div className="stage-inner">
        <div className="hero-glow" />
        <span className="eyebrow">{t('서울특별시 · 미래교통', 'SEOUL · Future Mobility')}</span>
        <h1>
          {t('서울을 달리는', 'Seoul runs on')}
          <br />
          <span className="hl">{t('자율주행버스', 'autonomous buses')}</span>
        </h1>
        <p className="sub">
          {t(
            '운전자 없이, 안전하게. 실시간으로 위치를 확인하고 노선을 따라 함께 이동하세요.',
            'No driver, fully safe. Check the live location and ride along the route with us.',
          )}
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#live">
            {t('실시간 위치 보기', 'See live location')}
          </a>
          <a className="btn btn-ghost" href="#about">
            {t('자율주행버스란?', 'What is it?')}
          </a>
        </div>
        <div className="hero-scroll">
          <div className="mouse" />
          <span>{t('스크롤하면 버스가 정류장을 따라 움직여요', 'Scroll — the bus follows the stops')}</span>
        </div>
      </div>
    </section>
  )
}
