import { z } from 'zod'

export const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(100, { message: 'Name cannot exceed 100 characters.' }),
  email: z
    .string()
    .trim()
    .email('Enter a valid email address.'),
  experience: z
    .string()
    .trim()
    .min(2, { message: 'Please describe your trading experience.' })
    .max(200, { message: 'Answer must be under 200 characters.' }),
  market: z
    .string()
    .trim()
    .min(2, { message: 'Please specify the markets you trade.' })
    .max(200, { message: 'Answer must be under 200 characters.' }),
  challenge: z
    .string()
    .trim()
    .min(5, { message: 'Please describe your biggest recurring challenge.' })
    .max(1000, { message: 'Answer cannot exceed 1000 characters.' }),
  process: z
    .string()
    .trim()
    .min(5, { message: 'Please describe your current process.' })
    .max(1000, { message: 'Answer cannot exceed 1000 characters.' }),
  goal: z
    .string()
    .trim()
    .min(5, { message: 'Please describe your goal.' })
    .max(1000, { message: 'Answer cannot exceed 1000 characters.' }),
  commitment: z.enum(['Yes, I can commit', 'I need to understand the schedule first'], {
    error: () => ({ message: 'Please select your level of commitment.' }),
  }),
})

export type ApplicationInput = z.infer<typeof applicationSchema>
