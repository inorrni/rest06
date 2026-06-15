import { useEffect } from 'react'

/**
 * scroll-position 기반 reveal — .reveal 요소가 뷰포트에 들어오면 .in 추가.
 * (IntersectionObserver가 일부 임베드에서 불안정하다는 원본 주석을 따른다.)
 */
export function useReveal() {
  useEffect(() => {
    const revealEls = [...document.querySelectorAll('.reveal')]
    function checkReveal() {
      const trigger = window.innerHeight * 0.86
      for (const el of revealEls) {
        if (el.classList.contains('in')) continue
        if (el.getBoundingClientRect().top < trigger) {
          el.classList.add('in')
          setTimeout(
            ((node) => () => {
              const cs = getComputedStyle(node)
              if (parseFloat(cs.opacity) < 0.99) {
                node.style.transition = 'none'
                node.style.opacity = '1'
                node.style.transform = 'none'
              }
            })(el),
            900,
          )
        }
      }
    }
    window.addEventListener('scroll', checkReveal, { passive: true })
    window.addEventListener('resize', checkReveal)
    checkReveal()
    return () => {
      window.removeEventListener('scroll', checkReveal)
      window.removeEventListener('resize', checkReveal)
    }
  }, [])
}
