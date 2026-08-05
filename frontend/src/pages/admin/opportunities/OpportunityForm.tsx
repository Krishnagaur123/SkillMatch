import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormSection, SubmitButton } from '@/components/common/Form'
import { Input } from '@/components/common/Input'
import { useCompanies } from '@/hooks/useCompanies'
import inputStyles from '@/components/common/Input.module.css'
import type { OpportunityIngestionRequest } from '@/hooks/useAdminOpportunities'
import type { OpportunityDetailResponse } from '@/hooks/useOpportunityDetail'

const opportunitySchema = z.object({
  companyId: z.string().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  workMode: z.enum(['REMOTE', 'ONSITE', 'HYBRID', '']).optional().transform(v => v === '' ? undefined : v as any),
  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP', '']).optional().transform(v => v === '' ? undefined : v as any),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'EXECUTIVE', '']).optional().transform(v => v === '' ? undefined : v as any),
  applyUrl: z.string().optional(),
  source: z.string().optional(),
  externalId: z.string().optional(),
  postedAt: z.string().optional(),
  expiresAt: z.string().optional(),
  active: z.boolean(),
})

export type OpportunityFormValues = z.infer<typeof opportunitySchema>

interface OpportunityFormProps {
  initialData?: OpportunityDetailResponse
  onSubmit: (data: OpportunityIngestionRequest) => void
  isLoading?: boolean
}

export function OpportunityForm({ initialData, onSubmit, isLoading }: OpportunityFormProps) {
  const { data: companies, isLoading: companiesLoading } = useCompanies()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      companyId: '',
      title: '',
      description: '',
      location: '',
      workMode: undefined,
      employmentType: undefined,
      experienceLevel: undefined,
      applyUrl: '',
      source: '',
      externalId: '',
      postedAt: '',
      expiresAt: '',
      active: true,
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        companyId: initialData.company.id,
        title: initialData.title,
        description: initialData.description || '',
        location: initialData.location || '',
        workMode: undefined, // not available in public detail response
        employmentType: initialData.employmentType || undefined,
        experienceLevel: initialData.experienceLevel || undefined,
        applyUrl: initialData.applyUrl || '',
        source: initialData.source || '',
        externalId: '', // not available in public detail response
        postedAt: initialData.postedAt ? initialData.postedAt.slice(0, 16) : '',
        expiresAt: initialData.expiresAt ? initialData.expiresAt.slice(0, 16) : '',
        active: initialData.active,
      })
    }
  }, [initialData, reset])

  const onFormSubmit = (values: OpportunityFormValues) => {
    onSubmit({
      ...values,
      postedAt: values.postedAt ? new Date(values.postedAt).toISOString() : undefined,
      expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
    } as OpportunityIngestionRequest)
  }

  return (
    <Form onSubmit={handleSubmit((values) => onFormSubmit(values as OpportunityFormValues))}>
      <FormSection title="Basic Details">
        <FormField label="Company" required error={errors.companyId?.message as string | undefined}>
          <select
            className={inputStyles.input}
            disabled={companiesLoading || isLoading}
            {...register('companyId')}
          >
            <option value="">Select a company</option>
            {companies?.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Title" required error={errors.title?.message as string | undefined}>
          <Input placeholder="e.g. Senior Frontend Engineer" disabled={isLoading} {...register('title')} />
        </FormField>
      </FormSection>

      <FormSection title="Logistics">
        <FormField label="Location" error={errors.location?.message as string | undefined}>
          <Input placeholder="e.g. San Francisco, CA" disabled={isLoading} {...register('location')} />
        </FormField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <FormField label="Work Mode" error={errors.workMode?.message as string | undefined}>
            <select className={inputStyles.input} disabled={isLoading} {...register('workMode')}>
              <option value="">Select...</option>
              <option value="REMOTE">Remote</option>
              <option value="ONSITE">Onsite</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </FormField>

          <FormField label="Employment Type" error={errors.employmentType?.message as string | undefined}>
            <select className={inputStyles.input} disabled={isLoading} {...register('employmentType')}>
              <option value="">Select...</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="FREELANCE">Freelance</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </FormField>

          <FormField label="Experience Level" error={errors.experienceLevel?.message as string | undefined}>
            <select className={inputStyles.input} disabled={isLoading} {...register('experienceLevel')}>
              <option value="">Select...</option>
              <option value="ENTRY">Entry Level</option>
              <option value="MID">Mid Level</option>
              <option value="SENIOR">Senior Level</option>
              <option value="EXECUTIVE">Executive</option>
            </select>
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Description & Tracking">
        <FormField label="Apply URL" error={errors.applyUrl?.message as string | undefined}>
          <Input placeholder="https://..." disabled={isLoading} {...register('applyUrl')} />
        </FormField>
        
        <FormField label="Source" error={errors.source?.message as string | undefined}>
          <Input placeholder="e.g. LinkedIn, Internal, Lever" disabled={isLoading} {...register('source')} />
        </FormField>

        <FormField label="External ID" error={errors.externalId?.message as string | undefined}>
          <Input placeholder="e.g. ATS specific ID" disabled={isLoading} {...register('externalId')} />
        </FormField>
      </FormSection>

      <FormSection title="Timing & Status">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <FormField label="Posted At" error={errors.postedAt?.message as string | undefined}>
            <Input type="datetime-local" disabled={isLoading} {...register('postedAt')} />
          </FormField>

          <FormField label="Expires At" error={errors.expiresAt?.message as string | undefined}>
            <Input type="datetime-local" disabled={isLoading} {...register('expiresAt')} />
          </FormField>
        </div>

        <FormField label="Active" error={errors.active?.message as string | undefined}>
          <div style={{ display: 'flex', alignItems: 'center', height: '2.5rem' }}>
            <input type="checkbox" disabled={isLoading} {...register('active')} style={{ width: '1.25rem', height: '1.25rem' }} />
            <span style={{ marginLeft: '0.5rem' }}>Opportunity is visible and active</span>
          </div>
        </FormField>
      </FormSection>
      
      <FormField label="Description" error={errors.description?.message as string | undefined}>
        <textarea 
          className={inputStyles.input} 
          style={{ height: '120px', resize: 'vertical' }}
          disabled={isLoading} 
          {...register('description')} 
        />
      </FormField>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <SubmitButton isLoading={isLoading}>
          {initialData ? 'Save Changes' : 'Create Opportunity'}
        </SubmitButton>
      </div>
    </Form>
  )
}
