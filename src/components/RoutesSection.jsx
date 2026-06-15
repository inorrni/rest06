import { useLang } from '../context/LanguageContext'
import { ROUTES } from '../data/content'

export default function RoutesSection() {
  const { t } = useLang()
  return (
    <section className="stage" id="route" data-side="right" data-no="03" data-stop={t('운행 노선', 'Routes')}>
      <div className="road-anchor" />
      <div className="stage-inner">
        <div className="card-col reveal">
          <div className="card">
            <div className="section-no">STATION 03</div>
            <h2>{t('운행 노선', 'Operating routes')}</h2>
            <p className="lead">
              {t('현재 서울 도심에서 세 개 노선이 운행 중입니다.', 'Three loops currently in service across central Seoul.')}
            </p>
            <div className="route-cards">
              {ROUTES.map((r) => (
                <div className="route-item" key={r.tag}>
                  <span className="route-tag">{r.tag}</span>
                  <div className="route-info">
                    <h3>{t(...r.name)}</h3>
                    <p>{t(...r.desc)}</p>
                  </div>
                  <div className="route-meta">
                    <div>
                      <b>{r.stops}</b>
                      <span>{t('정류장', 'stops')}</span>
                    </div>
                    <div>
                      <b>{r.headway}</b>
                      <span>{t('분 배차', 'min')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
