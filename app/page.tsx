'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowDownRight, ArrowUpRight, Check, Menu, Minus, Plus, X } from 'lucide-react'

const principles = [
  ['01', 'Context', 'Understand what the market is doing before looking for an opportunity.'],
  ['02', 'Selection', 'Only take setups that meet clearly defined conditions.'],
  ['03', 'Execution', 'Know what confirms the idea—and what invalidates it.'],
  ['04', 'Review', 'Judge the quality of the decision, not just the outcome.'],
]

const process = [
  ['01', 'Prepare', 'Market structure, context, key levels.'],
  ['02', 'Select', 'Identify the setup and define the conditions.'],
  ['03', 'Execute', 'Enter only when confirmation is present.'],
  ['04', 'Manage', 'Follow predefined risk and management rules.'],
  ['05', 'Review', 'Document the decision, outcome, and lesson.'],
]

const weeks = [
  ['WEEK 01', 'Audit & Baseline', 'Review your current process, recent trades, journal, and recurring mistakes.', 'Know what is actually holding you back.'],
  ['WEEKS 02–03', 'Build the Process', 'Define setups, entry criteria, confirmation, invalidation, risk, and management rules.', 'Know what you are looking for—and when not to trade.'],
  ['WEEKS 04–05', 'Execution & Decision Review', 'Review actual trades and identify impulsive entries, hesitation, rule-breaking, and execution problems.', 'Turn the framework into repeatable behavior.'],
  ['WEEKS 06–07', 'Refine & Stabilize', 'Refine rules, identify recurring patterns, and strengthen the review process.', 'Make your process easier to execute consistently.'],
  ['WEEK 08', 'Personal Operating Plan', "Create your documented framework, rules, review routine, and next-stage plan.", 'Leave with a process you can continue without Marcus.'],
]

const faqs = [
  ['Who is this mentorship for?', 'It is for traders with some market experience who want direct feedback, a repeatable process, and accountability around their own decisions.'],
  ['Is this a signals service?', 'No. Marcus does not provide trade alerts, entries, copy trades, or predictions. The work is centered on building and reviewing your own decision-making process.'],
  ['What happens during the first week?', 'We audit your recent trades, current routine, journal, and recurring mistakes to establish a clear baseline before changing anything.'],
  ['How much access do I get?', 'You receive one private weekly session, trade and journal review, between-session work, and private messaging for clarification and accountability.'],
  ['What markets do you work with?', 'The framework is built around intraday ES and NQ futures. The decision-making principles can also apply across related markets.'],
  ['Are results guaranteed?', 'No. Trading outcomes cannot be guaranteed. The mentorship teaches a process and gives you a structure for improving how you make and review decisions.'],
  ['Do I need a large account?', 'No. Account size is not the focus. You need enough market experience to participate meaningfully and the willingness to size risk responsibly.'],
  ['What happens after eight weeks?', 'You leave with a documented personal trading playbook, review routine, and next-stage plan that you can continue independently.'],
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label">{children}</p>
}

function ApplyLink({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  return <a className={`apply-link ${className}`} href="#apply" onClick={onClick}>Apply for 1-on-1 Mentorship <ArrowUpRight size={16} strokeWidth={1.5} /></a>
}

function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const validateField = (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
    const message = field.value.trim() ? '' : 'Please complete this field.'
    setErrors((current) => ({ ...current, [field.name]: message }))
    return message
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fields = Array.from(formRef.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[name]') ?? [])
    const nextErrors = Object.fromEntries(fields.map((field) => [field.name, field.value.trim() ? '' : 'Please complete this field.']))
    setErrors(nextErrors)
    const firstInvalid = fields.find((field) => nextErrors[field.name])
    if (firstInvalid) {
      firstInvalid.focus()
      return
    }
    setSubmitted(true)
  }

  if (submitted) return <div className="application-success" role="status"><SectionLabel>APPLICATION RECEIVED</SectionLabel><h3>Thanks for putting your process on paper.</h3><p>Marcus will review your answers and follow up if the mentorship looks like a strong fit.</p></div>

  const fieldProps = (name: string) => ({
    name,
    required: true,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => validateField(event.currentTarget),
  })

  return <form ref={formRef} className="application-form" noValidate onSubmit={handleSubmit}>
    <div className="form-grid">
      <label>01 <span><b className="form-label-desktop">How long have you been trading?</b><b className="form-label-mobile">Trading experience</b></span><input {...fieldProps('experience')} placeholder="e.g. 2 years" />{errors.experience && <small id="experience-error" className="field-error">{errors.experience}</small>}</label>
      <label>02 <span><b className="form-label-desktop">What do you trade?</b><b className="form-label-mobile">Markets traded</b></span><input {...fieldProps('market')} placeholder="e.g. NQ futures" />{errors.market && <small id="market-error" className="field-error">{errors.market}</small>}</label>
      <label>03 <span><b className="form-label-desktop">What is your biggest recurring challenge?</b><b className="form-label-mobile">Recurring challenge</b></span><textarea {...fieldProps('challenge')} rows={3} placeholder="Tell us what keeps showing up..." />{errors.challenge && <small id="challenge-error" className="field-error">{errors.challenge}</small>}</label>
      <label>04 <span><b className="form-label-desktop">How do you currently prepare, execute, and review?</b><b className="form-label-mobile">Current process</b></span><textarea {...fieldProps('process')} rows={3} placeholder="Describe your current process..." />{errors.process && <small id="process-error" className="field-error">{errors.process}</small>}</label>
      <label>05 <span><b className="form-label-desktop">What would you want to be different after eight weeks?</b><b className="form-label-mobile">Eight-week outcome</b></span><textarea {...fieldProps('goal')} rows={3} placeholder="Describe the change you want to make..." />{errors.goal && <small id="goal-error" className="field-error">{errors.goal}</small>}</label>
      <label>06 <span><b className="form-label-desktop">Can you commit to the weekly work and review process?</b><b className="form-label-mobile">Weekly commitment</b></span><select {...fieldProps('commitment')} defaultValue=""><option value="" disabled>Select one</option><option>Yes, I can commit</option><option>I need to understand the schedule first</option></select>{errors.commitment && <small id="commitment-error" className="field-error">{errors.commitment}</small>}</label>
    </div><button className="apply-link submit-button" type="submit">Submit application <ArrowUpRight size={16} strokeWidth={1.5} /></button>
  </form>
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showStickyApply, setShowStickyApply] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateStickyApply = () => {
      const application = document.querySelector<HTMLElement>('#apply')
      const applicationVisible = application ? application.getBoundingClientRect().top < window.innerHeight * 0.8 && application.getBoundingClientRect().bottom > 100 : false
      setShowStickyApply(window.scrollY > 420 && !applicationVisible)
    }
    updateStickyApply()
    window.addEventListener('scroll', updateStickyApply, { passive: true })
    return () => window.removeEventListener('scroll', updateStickyApply)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Marcus Vale home">MARCUS <span>VALE</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#approach">Approach</a><a href="#mentorship">Mentorship</a><a href="#about">About</a>
        </nav>
        <nav className="social-nav" aria-label="Social links"><a href="#x">X</a><a href="#instagram">Instagram</a><a href="#discord">Discord</a></nav>
        <ApplyLink className="header-cta" />
        <button className="mobile-menu" type="button" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
        {menuOpen && <div className="mobile-drawer-backdrop" role="presentation" onClick={() => setMenuOpen(false)}><div ref={menuRef} id="mobile-navigation" className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile navigation" onClick={(event) => event.stopPropagation()}><button className="mobile-drawer-close" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={20} /></button><a href="#approach" onClick={() => setMenuOpen(false)}>Approach</a><a href="#mentorship" onClick={() => setMenuOpen(false)}>Mentorship</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><ApplyLink onClick={() => setMenuOpen(false)} /></div></div>}
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <SectionLabel>1-ON-1 FUTURES TRADING MENTORSHIP</SectionLabel>
          <h1>Trade with a process.<br /><em>Not a prediction.</em></h1>
          <p className="hero-lede"><span className="desktop-copy">I help serious futures traders build a repeatable process, execute with discipline, and understand why their trades work—or don&apos;t.</span><span className="mobile-copy">Build a repeatable process and make better decisions with the information you already have.</span></p>
          <div className="hero-actions"><ApplyLink /><a className="text-link" href="#x">Follow on X <ArrowUpRight size={15} /></a></div>
          <p className="hero-meta">8 weeks <span /> Private mentorship <span /> Limited to a small number of traders</p>
        </div>
        <div className="hero-image-wrap"><Image src="/marcus-portrait.png" alt="Marcus Vale in his trading workspace" fill priority sizes="(max-width: 768px) 100vw, 48vw" className="hero-image" /><div className="image-caption">LONDON, UK<br /><span>51°30&apos;N / 0°07&apos;W</span></div></div>
      </section>

      <section className="recognition section-pad" id="approach"><div className="split-heading"><SectionLabel>THE ACTUAL PROBLEM</SectionLabel><h2>You probably don&apos;t need another strategy.</h2></div><div className="recognition-body"><p className="large-copy">Most traders don&apos;t struggle because they lack information. They struggle because what they know doesn&apos;t consistently translate into what they do.</p><div className="problem-grid">{[['01','Too many strategies','Constantly changing systems instead of refining one.'],['02','Inconsistent execution','Knowing the plan, then abandoning it when the market moves.'],['03','Poor risk discipline','Allowing one bad decision to turn into a bad session.'],['04','No structured review','Looking at whether the trade won instead of understanding whether the decision was good.']].map(([n,t,d]) => <div className="problem" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div><p className="transition">The goal isn&apos;t to predict more. It&apos;s to make better decisions with the information you already have.</p></div></section>

      <section className="philosophy section-pad"><div className="section-intro"><SectionLabel>THE APPROACH</SectionLabel><h2>I don&apos;t teach more information.<br /><em>I teach better decisions.</em></h2></div><div className="principles">{principles.map(([n,t,d]) => <div className="principle" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>

      <section className="process section-pad"><div className="process-head"><SectionLabel>THE OPERATING SYSTEM</SectionLabel><h2>A process you can<br className="desktop-only" /> actually repeat.</h2><p>Five decisions, made in order. The structure is simple enough to follow when the market is moving.</p></div><div className="process-list">{process.map(([n,t,d], i) => <div className="process-item" key={n}><div className="process-index">{n}</div><div><h3>{t}</h3><p>{d}</p></div>{i < process.length - 1 && <ArrowDownRight className="process-arrow" size={22} />}</div>)}</div></section>

      <section className="fit section-pad"><div className="fit-head"><SectionLabel>THE RIGHT FIT</SectionLabel><h2>This isn&apos;t<br /><em>for everyone.</em></h2><p>The mentorship is built for traders who already have some market experience and are ready to take ownership of their process.</p></div><div className="fit-columns"><div className="fit-column for"><h3>This is for you if</h3>{['You already trade but struggle with consistency.','You want direct feedback.','You are willing to journal and review.','You want a repeatable process.','You are prepared to follow risk rules.','You want to understand your mistakes instead of blaming the market.'].map(x => <p key={x}><Check size={15} />{x}</p>)}</div><div className="fit-column not"><h3>This is not for you if</h3>{['You want trade alerts.','You want someone to tell you exactly what to buy or sell.','You expect guaranteed returns.','You’re looking for a shortcut.','You’re unwilling to review your own decisions.','You expect Marcus to do the work for you.'].map(x => <p key={x}><Minus size={15} />{x}</p>)}</div></div></section>

      <section className="mentorship section-pad" id="mentorship"><div className="section-intro"><SectionLabel>THE MENTORSHIP</SectionLabel><h2>Eight weeks.<br /><em>One process.</em></h2><p>The mentorship is structured around diagnosis, implementation, execution, and refinement—not hours of passive content.</p></div><div className="week-list">{weeks.map(([tag,t,d,o]) => <article className="week" key={tag}><div className="week-tag">{tag}</div><div><h3>{t}</h3><p>{d}</p><strong>{o}</strong></div></article>)}</div><div className="included"><SectionLabel>WHAT YOU GET</SectionLabel><div className="included-grid">{['1-on-1 sessions','Trade review','Journal review','Personalized framework','Between-session support','Weekly work','Final trading playbook'].map((x,i) => <div key={x}><span>0{i+1}</span><h3>{x}</h3></div>)}</div></div></section>

      <section className="about section-pad" id="about"><div className="about-image"><Image src="/marcus-portrait.png" alt="Marcus Vale portrait" fill sizes="(max-width: 768px) 100vw, 42vw" className="about-photo" /></div><div className="about-copy"><SectionLabel>THE PERSON BEHIND THE PROCESS</SectionLabel><h2>Clarity is a skill.</h2><p>Marcus has spent 8+ years trading ES and NQ futures intraday, with a focus on price action and decision quality.</p><p>He spent years trying to solve inconsistency by adding more information—more strategies, more charts, more variables.</p><p>Eventually, he found the problem wasn&apos;t a lack of information. It was a lack of a process that could survive real decisions. That became the foundation of how he trades—and how he mentors.</p><div className="about-meta"><span>BASED IN<br /><b>LONDON, UK</b></span><span>MARKETS<br /><b>ES / NQ FUTURES</b></span><span>STYLE<br /><b>INTRADAY / PRICE ACTION</b></span></div></div></section>

      <section className="review section-pad"><div className="review-heading"><SectionLabel>DEMONSTRATION</SectionLabel><h2>This is what<br /><em>mentorship looks like.</em></h2><p>Not a callout. Not a prediction. A closer look at the decision behind the trade.</p></div><div className="review-card"><div className="review-top"><span>SAMPLE TRADE REVIEW</span><b>NQ · 5M</b></div><div className="review-grid"><div><label>SETUP</label><p>Opening range reversal</p><label>THESIS</label><p>Price rejected prior session high.</p><label>ENTRY</label><p>Early by one confirmation condition.</p></div><div><label>RISK</label><p>Planned: 0.50%<br />Actual: 0.75%</p><label>MANAGEMENT</label><p>Exited after first pullback.</p></div></div><div className="mentor-observation"><label>MENTOR OBSERVATION</label><p>“The setup wasn&apos;t the problem. You entered before your confirmation condition was present.”</p></div><div className="next-review"><label>NEXT REVIEW</label><p>Define the confirmation checklist before the next session.</p></div></div></section>

      <section className="proof section-pad"><div className="section-intro"><SectionLabel>PROCESS-FOCUSED PROOF</SectionLabel><h2>What changes when<br /><em>the process gets clearer.</em></h2></div><div className="proof-grid"><blockquote>“I stopped changing strategies every time I had a losing week. I had something to review instead of something to replace.”<cite>— Daniel R. · Futures trader</cite></blockquote><blockquote>“The biggest shift wasn&apos;t finding better entries. It was understanding why I was taking the bad ones.”<cite>— Alex M. · NQ trader</cite></blockquote><blockquote>“I finally had a process I could explain on paper before I ever opened the chart.”<cite>— Chris T. · Futures trader</cite></blockquote></div></section>

      <section className="offer section-pad"><div className="offer-copy"><SectionLabel>THE OFFER</SectionLabel><h2>Private work.<br /><em>Built around you.</em></h2><p>Eight weeks of direct, high-touch mentorship for traders ready to stop collecting information and start building a process they can trust.</p></div><div className="price-card"><div><span>1-ON-1 MENTORSHIP</span><strong>$2,500</strong><small>USD · 8 weeks</small></div><ul><li>Weekly 1-on-1 sessions</li><li>Trade review</li><li>Journal review</li><li>Between-session support</li><li>Weekly implementation work</li><li>Personal trading playbook</li></ul><ApplyLink /></div></section>

      <section className="application section-pad" id="apply"><div className="application-heading"><SectionLabel>THE APPLICATION</SectionLabel><h2>Let&apos;s see if<br /><em>we&apos;re a fit.</em></h2><p>This isn&apos;t a sales call. It&apos;s a short application to understand where you are, what you&apos;re struggling with, and whether the mentorship makes sense for you.</p></div><ApplicationForm /></section>

      <section className="faq section-pad"><div className="faq-heading"><SectionLabel>COMMON QUESTIONS</SectionLabel><h2>Before you<br /><em>apply.</em></h2></div><div className="faq-list">{faqs.map(([q,a]) => <details key={q}><summary>{q}<Plus size={18} className="plus" /><Minus size={18} className="minus" /></summary><p>{a}</p></details>)}</div></section>

      <section className="final-cta"><div><SectionLabel>READY TO BUILD A PROCESS YOU CAN TRUST?</SectionLabel><h2>Trade with a process.<br /><em>Take ownership.</em></h2><p>If you&apos;re looking for another strategy, I&apos;m probably not the right mentor. If you&apos;re ready to understand your decisions and refine your process, apply below.</p><ApplyLink /></div></section>

      {showStickyApply && <a className="apply-link mobile-apply" href="#apply">Apply for Mentorship <ArrowUpRight size={16} strokeWidth={1.5} /></a>}
      <footer className="site-footer"><a className="wordmark" href="#top">MARCUS <span>VALE</span></a><p>© 2026 Marcus Vale. Educational mentorship only. No financial outcomes are guaranteed.</p><div><a href="#x">X</a><a href="#instagram">Instagram</a><a href="#discord">Discord</a></div></footer>
    </main>
  )
}
