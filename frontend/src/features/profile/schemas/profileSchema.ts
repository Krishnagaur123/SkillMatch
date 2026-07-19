import { z } from 'zod'

const currentYear = new Date().getFullYear()

// Helper: treat empty string as undefined so optional URL fields don't trigger
// URL validation when left blank
const optionalUrl = z
  .string()
  .max(512, 'URL must not exceed 512 characters')
  .refine(
    (val) => !val || /^https?:\/\/.+/.test(val),
    { message: 'Must be a valid URL starting with http:// or https://' }
  )
  .optional()
  .or(z.literal(''))
  .transform((val) => (val === '' ? undefined : val))

export const profileSchema = z.object({
  // Professional Identity
  headline: z
    .string()
    .max(120, 'Headline must not exceed 120 characters')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),

  about: z
    .string()
    .max(1000, 'About must not exceed 1000 characters')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),

  // Education
  institutionName: z
    .string()
    .max(255)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),

  degreeName: z
    .string()
    .max(255)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),

  fieldOfStudy: z
    .string()
    .max(255)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),

  graduationYear: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === '' || val === undefined || val === null) return undefined
      const n = Number(val)
      return isNaN(n) ? undefined : n
    })
    .pipe(
      z
        .number()
        .int('Graduation year must be a whole number')
        .min(1950, 'Graduation year must be 1950 or later')
        .max(currentYear + 10, 'Graduation year is too far in the future')
        .optional()
    ),

  cgpa: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === '' || val === undefined || val === null) return undefined
      const n = Number(val)
      return isNaN(n) ? undefined : n
    })
    .pipe(
      z
        .number()
        .min(0, 'CGPA must be at least 0.0')
        .max(10, 'CGPA must not exceed 10.0')
        .optional()
    ),

  // Experience
  experienceLevel: z
    .enum(['FRESHER', 'ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR', 'LEAD', 'MANAGER', 'EXECUTIVE'])
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v) as
      | 'FRESHER'
      | 'ENTRY_LEVEL'
      | 'MID_LEVEL'
      | 'SENIOR'
      | 'LEAD'
      | 'MANAGER'
      | 'EXECUTIVE'
      | undefined),

  currentOrganization: z
    .string()
    .max(255)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),

  preferredWorkMode: z
    .enum(['REMOTE', 'HYBRID', 'ONSITE'])
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v) as 'REMOTE' | 'HYBRID' | 'ONSITE' | undefined),

  openToWork: z.boolean().optional(),

  // Contact
  phoneNumber: z
    .string()
    .max(20, 'Phone number must not exceed 20 characters')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),

  city: z
    .string()
    .max(100)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),

  state: z
    .string()
    .max(100)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),

  country: z
    .string()
    .max(100)
    .optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),

  // Professional Links
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  leetcodeUrl: optionalUrl,
  codeforcesUrl: optionalUrl,
})

export type ProfileFormValues = z.input<typeof profileSchema>
export type ProfileFormOutput = z.output<typeof profileSchema>
