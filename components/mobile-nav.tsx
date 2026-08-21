'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#approach', label: 'Approach' },
  { href: '#mentorship', label: 'Mentorship' },
  { href: '#about', label: 'About' },
]

const socialLinks = [
  { href: '#x', label: 'X' },
  { href: '#instagram', label: 'Instagram' },
  { href: '#discord', label: 'Discord' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mobile-menu"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="mobile-drawer-root">
          <button
            type="button"
            className="mobile-drawer-overlay"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={close}
          />
          <div
            id="mobile-drawer"
            ref={panelRef}
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="mobile-drawer-top">
              <span className="section-label">MENU</span>
              <button
                ref={closeRef}
                type="button"
                className="mobile-drawer-close"
                aria-label="Close menu"
                onClick={close}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-drawer-nav" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={close}>
                  {link.label}
                </a>
              ))}
            </nav>

            <nav className="mobile-drawer-social" aria-label="Social links">
              {socialLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={close}>
                  {link.label}
                </a>
              ))}
            </nav>

            <a className="apply-link mobile-drawer-cta" href="#apply" onClick={close}>
              Apply for Mentorship <ArrowUpRight size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
