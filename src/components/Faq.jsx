import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { FAQS } from '../data/content'

export default function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState(-1)

  return (
    <section className="stage" id="faq" data-side="left" data-no="06" data-stop={t('자주 묻는 질문', 'FAQ')}>
      <div className="road-anchor" />
      <div className="stage-inner">
        <div className="card-col reveal">
          <div className="card">
            <div className="section-no">STATION 06</div>
            <h2>{t('자주 묻는 질문', 'Frequently asked')}</h2>
            <div className="faq">
              {FAQS.map((item, i) => {
                const isOpen = open === i
                return (
                  <div className={isOpen ? 'faq-item open' : 'faq-item'} key={i}>
                    <div className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)}>
                      <span>{t(...item.q)}</span>
                      <span className="pm">+</span>
                    </div>
                    <div className="faq-a" style={{ maxHeight: isOpen ? '240px' : 0 }}>
                      <p>{t(...item.a)}</p>
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
