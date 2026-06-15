import { useLang } from '../context/LanguageContext'
import { STEPS } from '../data/content'

export default function HowTo() {
  const { t } = useLang()
  return (
    <section className="stage" id="howto" data-side="left" data-no="04" data-stop={t('이용 방법', 'How to ride')}>
      <div className="road-anchor" />
      <div className="stage-inner">
        <div className="card-col reveal">
          <div className="card">
            <div className="section-no">STATION 04</div>
            <h2>{t('이용 방법', 'How to ride')}</h2>
            <p className="lead">
              {t(
                '일반 버스처럼 타면 됩니다. 시범 운행 기간에는 무료예요.',
                "Riding is just like a regular bus — and it's free during the pilot.",
              )}
            </p>
            <div className="steps">
              {STEPS.map((s, i) => (
                <div className="step" key={i}>
                  <span className="num">{i + 1}</span>
                  <div>
                    <h3>{t(...s.title)}</h3>
                    <p>{t(...s.body)}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="howto-note">
              {t(
                '🚌 시범 운행 기간 무료 — 요금·카드 없이 이용하세요.',
                '🚌 Free during the pilot period. No fare or card needed.',
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
