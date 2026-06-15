import { useLang } from '../context/LanguageContext'
import { FEATURES } from '../data/content'
import { FEATURE_ICONS } from './icons'

export default function About() {
  const { t } = useLang()
  return (
    <section className="stage" id="about" data-side="left" data-no="02" data-stop={t('자율주행 소개', 'About')}>
      <div className="road-anchor" />
      <div className="stage-inner">
        <div className="card-col reveal">
          <div className="card">
            <div className="section-no">STATION 02</div>
            <h2>{t('자율주행버스란?', 'What is an autonomous bus?')}</h2>
            <p className="lead">
              {t(
                '센서와 AI로 정해진 노선을 스스로 운행하는 버스입니다. 24시간 관제 아래, 안전요원이 늘 함께 탑승합니다.',
                'A bus that drives itself along a fixed route using sensors and AI — monitored 24/7 and always with a safety attendant on board.',
              )}
            </p>
            <div className="feature-list">
              {FEATURES.map((f, i) => {
                const Icon = FEATURE_ICONS[f.icon]
                return (
                  <div className="feature" key={i}>
                    <span className="ic">
                      <Icon />
                    </span>
                    <div>
                      <h3>{t(...f.title)}</h3>
                      <p>{t(...f.body)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
