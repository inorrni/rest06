import { useEffect, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { HEADER_NAV } from '../data/content'
import BrandMark from './BrandMark'
import AuthControls from './AuthControls'

export default function Header() {
  const { lang, setLang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={scrolled ? 'site-header scrolled' : 'site-header'}>
      <BrandMark />
      <nav className="header-nav">
        {HEADER_NAV.map(([href, ko, en]) => (
          <a key={href} href={href}>
            {t(ko, en)}
          </a>
        ))}
      </nav>
      <div className="header-tools">
        <div className="lang-toggle">
          <button className={lang === 'ko' ? 'active' : ''} onClick={() => setLang('ko')}>
            KO
          </button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
            EN
          </button>
        </div>
        <AuthControls />
        <a className="btn btn-primary" href="#live">
          {t('실시간 보기', 'See live map')}
        </a>
      </div>
    </header>
  )
}
