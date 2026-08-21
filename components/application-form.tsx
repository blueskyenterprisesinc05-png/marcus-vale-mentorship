'use client'

import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

type Field = {
  id: string
  num: string
  label: string
  errLabel: string
  control: 'input' | 'textarea'
  inputType?: string
  autoComplete?: string
  help?: string
  full?: boolean
}

const fields: Field[] = [
  { id: 'fullName', num: '01', label: 'Full name', errLabel: 'Full name', control: 'input', autoComplete: 'name' },
  {
    id: 'email',
    num: '02',
    label: 'Email address',
    errLabel: 'Email address',
    control: 'input',
    inputType: 'email',
    autoComplete: 'email',
    help: "Where Marcus will follow up if it's a good fit.",
  },
  {
    id: 'experience',
    num: '03',
    label: 'How long have you been trading?',
    errLabel: 'Trading experience',
    control: 'input',
    help: 'e.g. 2 years actively trading futures.',
  },
  {
    id: 'markets',
    num: '04',
    label: 'What markets do you trade?',
    errLabel: 'Markets traded',
    control: 'input',
    help: 'e.g. NQ and ES futures.',
  },
  {
    id: 'challenge',
    num: '05',
    label: 'What is your biggest recurring challenge?',
    errLabel: 'This answer',
    control: 'textarea',
    help: 'The pattern that keeps showing up in your trading.',
    full: true,
  },
  {
    id: 'process',
    num: '06',
    label: 'How do you currently prepare, execute, and review?',
    errLabel: 'This answer',
    control: 'textarea',
    help: 'A short description of your current process.',
    full: true,
  },
  {
    id: 'improve',
    num: '07',
    label: 'What do you most want to improve?',
    errLabel: 'This answer',
    control: 'textarea',
    help: 'The change you want to make over eight weeks.',
    full: true,
  },
  {
    id: 'why',
    num: '08',
    label: 'Why are you considering mentorship now?',
    errLabel: 'This answer',
    control: 'textarea',
    full: true,
  },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ApplicationForm() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function fieldError(field: Field, raw: string): string | undefined {
    const value = raw.trim()
    if (!value) return `${field.errLabel} is required.`
    if (field.inputType === 'email' && !emailPattern.test(value)) {
      return 'Enter a valid email address.'
    }
    return undefined
  }

  function validate() {
    const next: Record<string, string> = {}
    for (const field of fields) {
      const message = fieldError(field, values[field.id] ?? '')
      if (message) next[field.id] = message
    }
    return next
  }

  function handleBlur(field: Field) {
    const message = fieldError(field, values[field.id] ?? '')
    setErrors((prev) => {
      if (message) {
        if (prev[field.id] === message) return prev
        return { ...prev, [field.id]: message }
      }
      if (!prev[field.id]) return prev
      const next = { ...prev }
      delete next[field.id]
      return next
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      const firstInvalid = fields.find((field) => next[field.id])?.id
      if (firstInvalid) {
        formRef.current?.querySelector<HTMLElement>(`#${firstInvalid}`)?.focus()
      }
      return
    }
    setSubmitted(true)
    window.dispatchEvent(new CustomEvent('application:submitted'))
  }

  function update(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  if (submitted) {
    return (
      <div className="application-success" role="status" aria-live="polite">
        <p className="section-label">APPLICATION RECEIVED</p>
        <h3>Application received.</h3>
        <p>Thanks for applying. Marcus reviews every application personally.</p>
        <p>If the mentorship looks like a good fit, you&apos;ll receive the next step by email.</p>
      </div>
    )
  }

  return (
    <form ref={formRef} className="application-form" noValidate onSubmit={handleSubmit}>
      <div className="form-grid">
        {fields.map((field) => {
          const error = errors[field.id]
          const describedBy =
            [field.help ? `${field.id}-help` : null, error ? `${field.id}-error` : null]
              .filter(Boolean)
              .join(' ') || undefined

          return (
            <div className={`field${field.full ? ' field-full' : ''}`} key={field.id}>
              <label htmlFor={field.id}>
                {field.num} <span>{field.label}</span>
              </label>
              {field.help && (
                <p className="field-help" id={`${field.id}-help`}>
                  {field.help}
                </p>
              )}
              {field.control === 'textarea' ? (
                <textarea
                  id={field.id}
                  name={field.id}
                  rows={3}
                  value={values[field.id] ?? ''}
                  onChange={(event) => update(field.id, event.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                />
              ) : (
                <input
                  id={field.id}
                  name={field.id}
                  type={field.inputType ?? 'text'}
                  autoComplete={field.autoComplete}
                  value={values[field.id] ?? ''}
                  onChange={(event) => update(field.id, event.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                />
              )}
              {error && (
                <p className="field-error" id={`${field.id}-error`} role="alert">
                  {error}
                </p>
              )}
            </div>
          )
        })}
      </div>
      <button className="apply-link submit-button" type="submit">
        Submit application <ArrowUpRight size={16} strokeWidth={1.5} />
      </button>
    </form>
  )
}
