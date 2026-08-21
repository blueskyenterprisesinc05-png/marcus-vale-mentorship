'use client'

import { useRef, useState, useTransition } from 'react'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { submitApplication } from '@/app/actions/application'
import { applicationSchema } from '@/lib/validation'

type FieldId =
  | 'name'
  | 'email'
  | 'experience'
  | 'market'
  | 'challenge'
  | 'process'
  | 'goal'
  | 'commitment'

type FieldConfig = {
  id: FieldId
  num: string
  label: string
  placeholder?: string
  help?: string
  control: 'input' | 'textarea' | 'select'
  inputType?: string
  autoComplete?: string
  options?: string[]
}

const fields: FieldConfig[] = [
  {
    id: 'name',
    num: '01',
    label: 'Full name',
    placeholder: 'e.g. Alex Mercer',
    control: 'input',
    autoComplete: 'name',
  },
  {
    id: 'email',
    num: '02',
    label: 'Email address',
    placeholder: 'e.g. alex@example.com',
    help: "Where Marcus will follow up if it's a good fit.",
    control: 'input',
    inputType: 'email',
    autoComplete: 'email',
  },
  {
    id: 'experience',
    num: '03',
    label: 'How long have you been trading?',
    placeholder: 'e.g. 2 years',
    control: 'input',
  },
  {
    id: 'market',
    num: '04',
    label: 'What do you trade?',
    placeholder: 'e.g. NQ futures',
    control: 'input',
  },
  {
    id: 'challenge',
    num: '05',
    label: 'What is your biggest recurring challenge?',
    placeholder: 'Tell us what keeps showing up...',
    help: 'The pattern or behavior that keeps showing up in your trading.',
    control: 'textarea',
  },
  {
    id: 'process',
    num: '06',
    label: 'How do you currently prepare, execute, and review?',
    placeholder: 'Describe your current process...',
    help: 'A brief description of how you approach each trading session.',
    control: 'textarea',
  },
  {
    id: 'goal',
    num: '07',
    label: 'What would you want to be different after eight weeks?',
    placeholder: 'Describe the change you want to make...',
    help: 'The specific change or process improvement you want to build.',
    control: 'textarea',
  },
  {
    id: 'commitment',
    num: '08',
    label: 'Can you commit to the weekly work and review process?',
    control: 'select',
    options: ['Yes, I can commit', 'I need to understand the schedule first'],
  },
]

export function ApplicationForm() {
  const [values, setValues] = useState<Record<string, string>>({ commitment: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function validateField(id: FieldId, value: string) {
    const rawSchema = applicationSchema.shape[id]
    const parsed = rawSchema.safeParse(value)
    setErrors((prev) => {
      if (!parsed.success) {
        return { ...prev, [id]: parsed.error.issues[0].message }
      }
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function updateValue(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isPending) return

    // 1. Client-side Zod validation
    const parsed = applicationSchema.safeParse(values)
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) {
          nextErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(nextErrors)

      // Focus the first invalid element
      const firstInvalidId = fields.find((f) => nextErrors[f.id])?.id
      if (firstInvalidId) {
        const el = formRef.current?.querySelector<HTMLElement>(`#${firstInvalidId}`)
        el?.focus()
      }
      toast.error('Please fix the errors in the form.')
      return;
    }

    // 2. Submit via Server Action inside transition
    startTransition(async () => {
      try {
        const result = await submitApplication(parsed.data)
        if (result.success) {
          setSubmitted(true)
          window.dispatchEvent(new CustomEvent('application:submitted'))
          toast.success('Application submitted successfully!')
        } else if (result.errors) {
          setErrors(result.errors)
          const firstInvalidId = fields.find((f) => result.errors?.[f.id])?.id
          if (firstInvalidId) {
            formRef.current?.querySelector<HTMLElement>(`#${firstInvalidId}`)?.focus()
          }
          toast.error('Please check your input.')
        } else {
          toast.error(result.message || 'An error occurred.')
        }
      } catch (err) {
        toast.error('Failed to submit application. Please try again.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="application-success" role="status" aria-live="polite">
        <p className="section-label">APPLICATION RECEIVED</p>
        <h3>Thanks for putting your process on paper.</h3>
        <p>Marcus will review your answers and follow up if the mentorship looks like a strong fit.</p>
        <p>You should receive a confirmation or next steps by email shortly.</p>
      </div>
    )
  }

  return (
    <form ref={formRef} className="application-form" noValidate onSubmit={handleFormSubmit}>
      <div className="form-grid">
        {fields.map((field) => {
          const error = errors[field.id]
          const describedBy =
            [field.help ? `${field.id}-help` : null, error ? `${field.id}-error` : null]
              .filter(Boolean)
              .join(' ') || undefined

          return (
            <div className="field field-full" key={field.id}>
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
                  placeholder={field.placeholder}
                  onChange={(e) => updateValue(field.id, e.target.value)}
                  onBlur={(e) => validateField(field.id, e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  disabled={isPending}
                />
              ) : field.control === 'select' ? (
                <select
                  id={field.id}
                  name={field.id}
                  value={values[field.id] ?? ''}
                  onChange={(e) => updateValue(field.id, e.target.value)}
                  onBlur={(e) => validateField(field.id, e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  disabled={isPending}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.id}
                  name={field.id}
                  type={field.inputType ?? 'text'}
                  autoComplete={field.autoComplete}
                  value={values[field.id] ?? ''}
                  placeholder={field.placeholder}
                  onChange={(e) => updateValue(field.id, e.target.value)}
                  onBlur={(e) => validateField(field.id, e.target.value)}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  disabled={isPending}
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

      <button
        className="apply-link submit-button w-full"
        type="submit"
        disabled={isPending}
        style={{ opacity: isPending ? 0.7 : 1 }}
      >
        {isPending ? (
          <>
            Submitting application <Loader2 className="animate-spin" size={16} />
          </>
        ) : (
          <>
            Submit application <ArrowUpRight size={16} strokeWidth={1.5} />
          </>
        )}
      </button>
    </form>
  )
}
