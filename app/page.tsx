import Image from 'next/image'
import { ArrowDownRight, ArrowUpRight, Check, Minus, Plus } from 'lucide-react'
import { MobileNav } from '@/components/mobile-nav'
import { ApplicationForm } from '@/components/application-form'
import { StickyApplyCta } from '@/components/sticky-apply-cta'

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

function ApplyLink({ className = '' }: { className?: string }) {
  return <a className={`apply-link ${className}`} href="#apply">Apply for 1-on-1 Mentorship <ArrowUpRight size={16} strokeWidth={1.5} /></a>
}

export default function Page() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Marcus Vale home">MARCUS <span>VALE</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#approach">Approach</a><a href="#mentorship">Mentorship</a><a href="#about">About</a>
        </nav>
        <nav className="social-nav" aria-label="Social links"><a href="#x">X</a><a href="#instagram">Instagram</a><a href="#discord">Discord</a></nav>
        <ApplyLink className="header-cta" />
        <MobileNav />
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <SectionLabel>1-ON-1 FUTURES TRADING MENTORSHIP</SectionLabel>
          <h1>Trade with a process.<br /><em>Not a prediction.</em></h1>
          <p className="hero-lede">I help serious futures traders build a repeatable process, execute with discipline, and understand why their trades work—or don&apos;t.</p>
          <div className="hero-actions"><ApplyLink /><a className="text-link" href="#x">Follow on X <ArrowUpRight size={15} /></a></div>
          <p className="hero-meta">8 weeks <span /> Private mentorship <span /> Limited to a small number of traders</p>
        </div>
        <div className="hero-image-wrap"><Image src="/marcus-portrait.png" alt="Marcus Vale in his trading workspace" fill priority sizes="(max-width: 768px) 100vw, 48vw" className="hero-image" /><div className="image-caption">LONDON, UK<br /><span>51°30&apos;N / 0°07&apos;W</span></div></div>
      </section>

      <section className="recognition section-pad" id="approach"><div className="split-heading"><SectionLabel>THE ACTUAL PROBLEM</SectionLabel><h2>You probably don&apos;t need another strategy.</h2></div><div className="recognition-body"><p className="large-copy">Most traders don&apos;t struggle because they lack information. They struggle because what they know doesn&apos;t consistently translate into what they do.</p><div className="problem-grid">{[['01','Too many strategies','Constantly changing systems instead of refining one.'],['02','Inconsistent execution','Knowing the plan, then abandoning it when the market moves.'],['03','Poor risk discipline','Allowing one bad decision to turn into a bad session.'],['04','No structured review','Looking at whether the trade won instead of understanding whether the decision was good.']].map(([n,t,d]) => <div className="problem" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div><p className="transition">The goal isn&apos;t to predict more. It&apos;s to make better decisions with the information you already have.</p></div></section>

      <section className="philosophy section-pad"><div className="section-intro"><SectionLabel>THE APPROACH</SectionLabel><h2>I don&apos;t teach more information.<br /><em>I teach better decisions.</em></h2></div><div className="principles">{principles.map(([n,t,d]) => <div className="principle" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>

      <section className="process section-pad"><div className="process-head"><SectionLabel>THE OPERATING SYSTEM</SectionLabel><h2>A process you can<br className="desktop-only" /> actually repeat.</h2><p>Five decisions, made in order. The structure is simple enough to follow when the market is moving.</p></div><div className="process-list">{process.map(([n,t,d], i) => <div className="process-item" key={n}><div className="process-index">{n}</div><div><h3>{t}</h3><p>{d}</p></div>{i < process.length - 1 && <ArrowDownRight className="process-arrow" size={22} />}</div>)}</div></section>

      <section className="fit section-pad"><div className="fit-head"><SectionLabel>THE RIGHT FIT</SectionLabel><h2>This isn&apos;t<br /><em>for everyone.</em></h2><p>The mentorship is built for traders who already have some market experience and are ready to take ownership of their process.</p></div><div className="fit-columns"><div className="fit-column for"><h3>This is for you if</h3>{['You already trade but struggle with consistency.','You want direct feedback.','You are willing to journal and review.','You want a repeatable process.','You are prepared to follow risk rules.','You want to understand your mistakes instead of blaming the market.'].map(x => <p key={x}><Check size={15} />{x}</p>)}</div><div className="fit-column not"><h3>This is not for you if</h3>{['You want trade alerts.','You want someone to tell you exactly what to buy or sell.','You expect guaranteed returns.','You’re looking for a shortcut.','You’re unwilling to review your own decisions.','You expect Marcus to do the work for you.'].map(x => <p key={x}><Minus size={15} />{x}</p>)}</div></div></section>

      <section className="mentorship section-pad" id="mentorship"><div className="section-intro"><SectionLabel>THE MENTORSHIP</SectionLabel><h2>Eight weeks.<br /><em>One process.</em></h2><p>Each week centers on a private 60-minute 1-on-1 session, review of your trades and journal, one practical implementation task, and private async support between sessions—not hours of passive content. You finish with a documented trading playbook.</p></div><div className="week-list">{weeks.map(([tag,t,d,o]) => <article className="week" key={tag}><div className="week-tag">{tag}</div><div><h3>{t}</h3><p>{d}</p><strong>{o}</strong></div></article>)}</div><div className="included"><SectionLabel>WHAT YOU GET</SectionLabel><div className="included-grid">{['1-on-1 sessions','Trade review','Journal review','Personalized framework','Between-session support','Weekly work','Final trading playbook'].map((x,i) => <div key={x}><span>0{i+1}</span><h3>{x}</h3></div>)}</div></div></section>

      <section className="about section-pad" id="about"><div className="about-image"><Image src="/marcus-portrait.png" alt="Marcus Vale portrait" fill sizes="(max-width: 768px) 100vw, 42vw" className="about-photo" /></div><div className="about-copy"><SectionLabel>THE PERSON BEHIND THE PROCESS</SectionLabel><h2>Clarity is a skill.</h2><p>Marcus has spent 8+ years trading ES and NQ futures intraday, with a focus on price action and decision quality.</p><p>He spent years trying to solve inconsistency by adding more information—more strategies, more charts, more variables.</p><p>Eventually, he found the problem wasn&apos;t a lack of information. It was a lack of a process that could survive real decisions. That became the foundation of how he trades—and how he mentors.</p><div className="about-meta"><span>BASED IN<br /><b>LONDON, UK</b></span><span>MARKETS<br /><b>ES / NQ FUTURES</b></span><span>STYLE<br /><b>INTRADAY / PRICE ACTION</b></span></div></div></section>

      <section className="review section-pad"><div className="review-heading"><SectionLabel>DEMONSTRATION</SectionLabel><h2>This is what<br /><em>mentorship looks like.</em></h2><p>Not a callout. Not a prediction. A closer look at the decision behind the trade.</p></div><div className="review-card"><div className="review-top"><span>SAMPLE TRADE REVIEW</span><b>NQ · 5M</b></div><div className="review-grid"><div><label>SETUP</label><p>Opening range reversal</p><label>THESIS</label><p>Price rejected prior session high.</p><label>ENTRY</label><p>Early by one confirmation condition.</p></div><div><label>RISK</label><p>Planned: 0.50%<br />Actual: 0.75%</p><label>MANAGEMENT</label><p>Exited after first pullback.</p></div></div><div className="mentor-observation"><label>MENTOR OBSERVATION</label><p>“The setup wasn&apos;t the problem. You entered before your confirmation condition was present.”</p></div><div className="next-review"><label>NEXT REVIEW</label><p>Define the confirmation checklist before the next session.</p></div></div></section>

      <section className="proof section-pad"><div className="section-intro"><SectionLabel>PROCESS-FOCUSED PROOF</SectionLabel><h2>What changes when<br /><em>the process gets clearer.</em></h2></div><div className="proof-grid"><blockquote>“I stopped changing strategies every time I had a losing week. I had something to review instead of something to replace.”<cite>— Daniel R. · Futures trader</cite></blockquote><blockquote>“The biggest shift wasn&apos;t finding better entries. It was understanding why I was taking the bad ones.”<cite>— Alex M. · NQ trader</cite></blockquote><blockquote>“I finally had a process I could explain on paper before I ever opened the chart.”<cite>— Chris T. · Futures trader</cite></blockquote></div></section>

      <section className="offer section-pad"><div className="offer-copy"><SectionLabel>THE OFFER</SectionLabel><h2>Private work.<br /><em>Built around you.</em></h2><p>Eight weeks of direct, high-touch mentorship for traders ready to stop collecting information and start building a process they can trust.</p><p className="offer-distinction">This isn&apos;t a library of trading content. It&apos;s direct, individual work built around your own trades and decisions:</p><ul className="offer-value"><li>Direct access</li><li>Personalized review</li><li>Individual feedback</li><li>Accountability</li><li>Process refinement</li><li>Real trade &amp; journal analysis</li></ul></div><div className="price-card"><div><span>1-ON-1 MENTORSHIP</span><strong>$2,500</strong><small>USD · 8 weeks</small></div><dl className="price-delivery"><div><dt>Weekly private session</dt><dd>60-minute 1-on-1 focused on your actual decisions.</dd></div><div><dt>Before each session</dt><dd>Submit selected trades and journal entries for review.</dd></div><div><dt>During the week</dt><dd>Private async support for clarification and accountability.</dd></div><div><dt>Weekly implementation</dt><dd>One practical task focused on improving your process.</dd></div><div><dt>Final outcome</dt><dd>A documented personal trading playbook with your framework, rules, and review routine.</dd></div></dl><p className="offer-disclaimer">Educational mentorship only. No trading profits or financial outcomes are guaranteed.</p><ApplyLink /></div></section>

      <section className="application section-pad" id="apply"><div className="application-heading"><SectionLabel>THE APPLICATION</SectionLabel><h2>Let&apos;s see if<br /><em>we&apos;re a fit.</em></h2><p>This isn&apos;t a sales call. It&apos;s a short application to understand where you are, what you&apos;re struggling with, and whether the mentorship makes sense for you.</p></div><ApplicationForm /></section>

      <section className="faq section-pad"><div className="faq-heading"><SectionLabel>COMMON QUESTIONS</SectionLabel><h2>Before you<br /><em>apply.</em></h2></div><div className="faq-list">{faqs.map(([q,a]) => <details key={q}><summary>{q}<Plus size={18} className="plus" /><Minus size={18} className="minus" /></summary><p>{a}</p></details>)}</div></section>

      <section className="final-cta"><div><SectionLabel>READY TO BUILD A PROCESS YOU CAN TRUST?</SectionLabel><h2>Trade with a process.<br /><em>Take ownership.</em></h2><p>If you&apos;re looking for another strategy, I&apos;m probably not the right mentor. If you&apos;re ready to understand your decisions and refine your process, apply below.</p><ApplyLink /></div></section>

      <footer className="site-footer"><a className="wordmark" href="#top">MARCUS <span>VALE</span></a><p>© 2026 Marcus Vale. Educational mentorship only. No financial outcomes are guaranteed.</p><div><a href="#x">X</a><a href="#instagram">Instagram</a><a href="#discord">Discord</a></div></footer>

      <StickyApplyCta />
    </main>
  )
}
