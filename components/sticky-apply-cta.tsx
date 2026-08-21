'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

export function StickyApplyCta() {
  const [hidden, setHidden] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    function onSubmitted() {
      setSubmitted(true)
    }
    window.addEventListener('application:submitted', onSubmitted)
    return () => window.removeEventListener('application:submitted', onSubmitted)
  }, [])

  useEffect(() => {
    const targets: Element[] = []
    const hero = document.getElementById('top')
    const apply = document.getElementById('apply')
    const footer = document.querySelector('.site-footer')
    if (hero) targets.push(hero)
    if (apply) targets.push(apply)
    if (footer) targets.push(footer)
    if (targets.length === 0) return

    const visible = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target)
          else visible.delete(entry.target)
        }
        // Hide the CTA while the hero, application form, or footer is on screen.
        setHidden(visible.size > 0)
      },
      { threshold: 0 },
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  if (submitted) return null

  return (
    <a
      href="#apply"
      className={`sticky-apply${hidden ? ' is-hidden' : ''}`}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
    >
      Apply for Mentorship <ArrowUpRight size={16} strokeWidth={1.5} />
    </a>
  )
}
