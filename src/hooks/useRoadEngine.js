import { useEffect } from 'react'

/* ============================================================
   useRoadEngine — ported from road-engine.js
   Builds one long S-curve road down the whole document and pins a
   top-view bus at viewport-center that reads the road's x at the
   current scroll position — so it drives down the road and parks
   upright at each section's 정류장.

   The markup (#roadSvg, #bus, #busPing, #stopLayer, .stage[data-*],
   .linenav-item) is rendered by React; this hook drives it imperatively
   after mount, exactly like the original script.
   ============================================================ */
export function useRoadEngine(lang) {
  useEffect(() => {
    const svg = document.getElementById('roadSvg')
    if (!svg) return
    const roadPaths = [...svg.querySelectorAll('path')]
    const measure = document.getElementById('roadAsphalt')
    const bus = document.getElementById('bus')
    const ping = document.getElementById('busPing')
    const stopLayer = document.getElementById('stopLayer')
    const stages = [...document.querySelectorAll('.stage')]
    const navItems = [...document.querySelectorAll('.linenav-item')]

    const BUS_ANCHOR = 0.46
    let vw = 0, vh = 0, docH = 0
    let roadEndY = 0
    let samples = []
    let stops = []
    let busW = 64, busH = 120
    let activeStop = -1
    let ticking = false

    function laneX(side) {
      // 차선을 화면 바깥쪽으로 더 밀어, 넓은 카드(#live 880px) 뒤로
      // 정류장 배지·버스가 가려지지 않게 한다. (좁은 화면은 자동 축소)
      const amp = Math.min(0.34, 460 / vw)
      const c = 0.5
      if (side === 'left') return vw * (c - amp)
      if (side === 'right') return vw * (c + amp)
      return vw * c
    }

    function build() {
      vw = window.innerWidth
      vh = window.innerHeight

      // 문서 높이는 '실제 콘텐츠(푸터 바닥)' 기준으로 잰다.
      // scrollHeight를 쓰면 absolute 인 도로 SVG·정류장 레이어(height:docH)가
      // 스크롤 높이에 포함돼, 콘텐츠가 줄어도 높이가 고정(latch)되며
      // 푸터 아래에 빈 공간이 생긴다.
      const footerEl = document.querySelector('.site-footer')
      docH = footerEl
        ? Math.round(footerEl.getBoundingClientRect().bottom + window.scrollY)
        : Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)

      busW = bus.offsetWidth || 64
      busH = bus.offsetHeight || 120

      const wps = []
      stages.forEach((st, i) => {
        const anchorEl = st.querySelector('.road-anchor') || st
        const r = anchorEl.getBoundingClientRect()
        const y = r.top + window.scrollY + r.height / 2
        wps.push({ x: laneX(st.dataset.side || 'center'), y, navIndex: i })
      })
      if (!wps.length) return

      // 도로는 마지막 섹션 다음에 푸터 윗선에서 끝낸다.
      // (docH까지 그리면 푸터를 관통해 화면 바닥까지 길게 이어진다)
      const endY = footerEl
        ? footerEl.getBoundingClientRect().top + window.scrollY
        : docH
      roadEndY = endY

      const pts = [
        { x: wps[0].x, y: 0 },
        ...wps,
        { x: wps[wps.length - 1].x, y: endY },
      ]

      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i]
        const my = ((a.y + b.y) / 2).toFixed(1)
        d += ` C ${a.x.toFixed(1)} ${my} ${b.x.toFixed(1)} ${my} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
      }

      svg.setAttribute('width', vw)
      svg.setAttribute('height', docH)
      svg.setAttribute('viewBox', `0 0 ${vw} ${docH}`)
      svg.style.width = vw + 'px'
      svg.style.height = docH + 'px'
      roadPaths.forEach((p) => p.setAttribute('d', d))

      const total = measure.getTotalLength()
      const N = 700
      samples = []
      for (let i = 0; i <= N; i++) {
        const p = measure.getPointAtLength((total * i) / N)
        samples.push({ x: p.x, y: p.y })
      }
      samples.sort((a, b) => a.y - b.y)

      stopLayer.style.height = docH + 'px'
      stopLayer.innerHTML = ''
      stops = wps.map((w, i) => {
        const m = document.createElement('div')
        m.className = 'stop-marker'
        const label = stages[w.navIndex].dataset.stop || ''
        m.innerHTML =
          `<div class="stop-sign"><span class="no">${stages[w.navIndex].dataset.no || i}</span>${label}</div>` +
          `<div class="stop-pole"></div>`
        m.style.left = w.x + 'px'
        m.style.top = w.y - 30 + 'px'
        stopLayer.appendChild(m)
        return { x: w.x, y: w.y, navIndex: w.navIndex, marker: m }
      })

      update()
    }

    function sampleAtY(y) {
      if (!samples.length) return { x: vw / 2, angle: 180 }
      if (y <= samples[0].y) return { x: samples[0].x, angle: 180 }
      const last = samples[samples.length - 1]
      if (y >= last.y) return { x: last.x, angle: 180 }
      let lo = 0, hi = samples.length - 1
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        samples[mid].y < y ? (lo = mid) : (hi = mid)
      }
      const a = samples[lo], b = samples[hi]
      const t = (y - a.y) / ((b.y - a.y) || 1)
      const x = a.x + (b.x - a.x) * t
      const dx = b.x - a.x, dy = (b.y - a.y) || 1
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
      return { x, angle }
    }

    function update() {
      const docY = window.scrollY + vh * BUS_ANCHOR
      const { x, angle } = sampleAtY(docY)
      const bx = x - busW / 2
      const by = vh * BUS_ANCHOR - busH / 2
      bus.style.transform = `translate(${bx}px, ${by}px) rotate(${angle}deg)`
      // 시작부 페이드인 + 도로 끝(푸터 윗선) 도달 시 페이드아웃 → 푸터 위에 버스가 겹치지 않게
      const fadeIn = Math.min(1, window.scrollY / (vh * 0.42))
      const fadeOut = roadEndY
        ? Math.min(1, Math.max(0, (roadEndY - docY) / (vh * 0.4)))
        : 1
      bus.style.opacity = Math.min(fadeIn, fadeOut).toFixed(3)
      if (ping) ping.style.transform = `translate(${x - 16}px, ${vh * BUS_ANCHOR - 16}px)`

      let nearest = -1, best = 1e9
      for (let i = 0; i < stops.length; i++) {
        const dist = Math.abs(stops[i].y - docY)
        if (dist < best) { best = dist; nearest = i }
      }
      if (nearest !== activeStop && best < vh * 0.34) {
        if (activeStop >= 0 && stops[activeStop]) stops[activeStop].marker.classList.remove('arrived')
        activeStop = nearest
        const s = stops[activeStop]
        if (s) {
          s.marker.classList.add('arrived')
          navItems.forEach((n, i) => n.classList.toggle('active', i === s.navIndex))
          if (ping) { ping.classList.remove('go'); void ping.offsetWidth; ping.classList.add('go') }
        }
      } else if (best >= vh * 0.34 && activeStop >= 0) {
        if (stops[activeStop]) stops[activeStop].marker.classList.remove('arrived')
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => { update(); ticking = false })
      }
    }

    const navClickHandlers = navItems.map((n, i) => {
      const handler = () => {
        const st = stages[i]
        if (!st) return
        const anchorEl = st.querySelector('.road-anchor') || st
        const r = anchorEl.getBoundingClientRect()
        const y = r.top + window.scrollY + r.height / 2
        window.scrollTo({ top: y - vh * BUS_ANCHOR, behavior: 'smooth' })
      }
      n.addEventListener('click', handler)
      return handler
    })

    let rt
    function rebuild() { clearTimeout(rt); rt = setTimeout(build, 140) }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', rebuild)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build)

    window.__roadRebuild = rebuild

    build()
    const t1 = setTimeout(build, 300)
    const t2 = setTimeout(build, 1200)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', rebuild)
      navItems.forEach((n, i) => n.removeEventListener('click', navClickHandlers[i]))
      clearTimeout(rt)
      clearTimeout(t1)
      clearTimeout(t2)
      delete window.__roadRebuild
    }
  }, [])

  // 언어가 바뀌면 레이아웃 높이가 달라질 수 있으니 도로를 다시 그린다.
  useEffect(() => {
    if (window.__roadRebuild) window.__roadRebuild()
  }, [lang])
}
