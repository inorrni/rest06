import { useEffect } from 'react'
import { MAP_STOPS, MAP_BUSES } from '../data/content'

/* ============================================================
   useLiveMap — ported from app.js "LIVE DEMO MAP".
   Animates demo buses around #routePath, draws stops, wires the
   vehicle picker, and updates the live info panel. Language is read
   live from document.documentElement.lang each frame (no rebuild).

   onSelect(busNo) is called whenever the selected vehicle changes
   (and once on init) so React can show the 즐겨찾기 button for it.
   ============================================================ */
export function useLiveMap(onSelect) {
  useEffect(() => {
    const routePath = document.getElementById('routePath')
    if (!routePath) return

    const STOPS = MAP_STOPS.map((s) => ({ ...s }))
    const total = routePath.getTotalLength()
    const mapBusLayer = document.getElementById('mapBusLayer')
    const stopLayer = document.getElementById('mapStopLayer')
    const ns = 'http://www.w3.org/2000/svg'

    stopLayer.innerHTML = ''
    STOPS.forEach((s) => {
      const p = routePath.getPointAtLength(s.frac * total)
      const c = document.createElementNS(ns, 'circle')
      c.setAttribute('cx', p.x)
      c.setAttribute('cy', p.y)
      c.setAttribute('r', 5.5)
      c.setAttribute('class', 'map-stop')
      stopLayer.appendChild(c)
      s.x = p.x
      s.y = p.y
    })

    const BUSES = MAP_BUSES.map((b) => ({ ...b }))
    mapBusLayer.innerHTML = ''
    BUSES.forEach((b) => {
      const g = document.createElementNS(ns, 'g')
      g.setAttribute('class', 'map-bus')
      g.innerHTML =
        `<circle r="11" fill="${b.color}" opacity=".18"/>` +
        `<rect x="-7" y="-9" width="14" height="18" rx="5" fill="${b.color}"/>` +
        `<rect x="-4.5" y="-6.5" width="9" height="4.5" rx="1.5" fill="#fff" opacity=".9"/>`
      mapBusLayer.appendChild(g)
      b.el = g
      b.dwellUntil = 0
      b.lastStop = -1
    })

    const pickWrap = document.getElementById('busPick')
    let sel = 0
    pickWrap.innerHTML = ''
    const pickHandlers = []
    BUSES.forEach((b, i) => {
      const btn = document.createElement('button')
      btn.textContent = b.no
      btn.className = i === 0 ? 'active' : ''
      const handler = () => {
        sel = i
        ;[...pickWrap.children].forEach((c, j) => c.classList.toggle('active', j === i))
        if (onSelect) onSelect(b.no)
      }
      btn.addEventListener('click', handler)
      pickHandlers.push(handler)
      pickWrap.appendChild(btn)
    })
    if (onSelect) onSelect(BUSES[0].no)

    const elNow = document.getElementById('liveNow')
    const elNext = document.getElementById('liveNext')
    const elEta = document.getElementById('liveEta')
    const elOcc = document.getElementById('liveOcc')
    const elNo = document.getElementById('liveNo')
    const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ko')
    const stopName = (s) => s[lang()]

    let last = performance.now()
    function step() {
      const now = performance.now()
      const dt = Math.min(0.06, (now - last) / 1000)
      last = now

      BUSES.forEach((b) => {
        if (now >= b.dwellUntil) b.frac = (b.frac + b.speed * dt) % 1
        const p = routePath.getPointAtLength(b.frac * total)
        b.el.setAttribute('transform', `translate(${p.x},${p.y})`)
        for (let i = 0; i < STOPS.length; i++) {
          const d = Math.abs((b.frac - STOPS[i].frac + 1) % 1)
          if ((d < 0.012 || d > 0.988) && b.lastStop !== i && now >= b.dwellUntil) {
            b.lastStop = i
            b.dwellUntil = now + 1400
          }
        }
      })

      const b = BUSES[sel]
      let nextIdx = 0, nextGap = 2
      for (let i = 0; i < STOPS.length; i++) {
        const gap = (STOPS[i].frac - b.frac + 1) % 1
        if (gap < nextGap) { nextGap = gap; nextIdx = i }
      }
      const prevIdx = (nextIdx - 1 + STOPS.length) % STOPS.length
      const etaSec = Math.max(0, Math.round(nextGap / b.speed))
      const parked = now < b.dwellUntil
      if (elNo) elNo.textContent = b.no
      if (elNow)
        elNow.textContent = parked
          ? stopName(STOPS[b.lastStop >= 0 ? b.lastStop : prevIdx]) + (lang() === 'en' ? ' (stop)' : ' 정차중')
          : stopName(STOPS[prevIdx]) + (lang() === 'en' ? ' →' : ' 통과')
      if (elNext) elNext.textContent = stopName(STOPS[nextIdx])
      if (elEta) {
        const mm = String(Math.floor(etaSec / 60)).padStart(2, '0')
        const ss = String(etaSec % 60).padStart(2, '0')
        elEta.textContent = parked ? (lang() === 'en' ? 'now' : '도착') : `${mm}:${ss}`
      }
      if (elOcc) {
        const lv = b.occ
        elOcc.innerHTML = Array.from({ length: 5 }, (_, k) => `<i class="${k < lv ? 'on' : ''}"></i>`).join('')
      }
    }
    step()
    const timer = setInterval(step, 40)

    return () => {
      clearInterval(timer)
      ;[...pickWrap.children].forEach((c, i) => c.removeEventListener('click', pickHandlers[i]))
    }
  }, [])
}
