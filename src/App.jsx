import { useLang } from './context/LanguageContext'
import { useReveal } from './hooks/useReveal'
import { useRoadEngine } from './hooks/useRoadEngine'

import Header from './components/Header'
import LineNav from './components/LineNav'
import RoadLayer from './components/RoadLayer'
import Hero from './components/Hero'
import LiveMap from './components/LiveMap'
import About from './components/About'
import RoutesSection from './components/RoutesSection'
import HowTo from './components/HowTo'
import Stats from './components/Stats'
import Faq from './components/Faq'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

export default function App() {
  const { lang } = useLang()
  useReveal()
  useRoadEngine(lang)

  return (
    <>
      <Header />
      <LineNav />
      <RoadLayer />

      <main>
        <Hero />
        <LiveMap />
        <About />
        <RoutesSection />
        <HowTo />
        <Stats />
        <Faq />
      </main>

      <Footer />
      <ChatWidget />
    </>
  )
}
