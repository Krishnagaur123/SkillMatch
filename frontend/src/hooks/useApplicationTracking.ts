import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCreateApplication, useApplications } from '@/hooks/useApplications'

export function useApplicationTracking() {
  const navigate = useNavigate()
  const { data: applications } = useApplications()
  const { mutateAsync: createApplication } = useCreateApplication()

  const [activeOpportunity, setActiveOpportunity] = useState<{ id: string; applyUrl: string } | null>(null)
  const [dialogState, setDialogState] = useState<'IDLE' | 'CONFIRM' | 'TRACKING' | 'ALREADY_TRACKED'>('IDLE')

  const handleApplyClick = useCallback((id: string, applyUrl: string) => {
    setActiveOpportunity({ id, applyUrl })

    // Check if already tracked
    const isAlreadyTracked = applications?.some((app) => app.opportunity.id === id)
    if (isAlreadyTracked) {
      setDialogState('ALREADY_TRACKED')
    } else {
      setDialogState('CONFIRM')
    }
  }, [applications])

  const handleConfirmContinue = useCallback(() => {
    if (!activeOpportunity) return
    
    // Open external URL
    toast.info('Opening company careers page...')
    window.open(activeOpportunity.applyUrl, '_blank', 'noopener,noreferrer')
    
    // Transition to tracking prompt
    setDialogState('TRACKING')
  }, [activeOpportunity])

  const handleConfirmCancel = useCallback(() => {
    setDialogState('IDLE')
    setActiveOpportunity(null)
  }, [])

  const handleTrackingYes = useCallback(async () => {
    if (!activeOpportunity) return
    
    try {
      const response = await createApplication({ 
        opportunityId: activeOpportunity.id,
        status: 'APPLIED'
      })
      toast.success('Application successfully added. Now tracking your application.')
      setDialogState('IDLE')
      setActiveOpportunity(null)
      navigate(`/applications/${response.applicationId}`)
    } catch {
      toast.error('Failed to create application.')
    }
  }, [activeOpportunity, createApplication, navigate])

  const handleTrackingNo = useCallback(() => {
    setDialogState('IDLE')
    setActiveOpportunity(null)
  }, [])

  const handleViewExisting = useCallback(() => {
    if (!activeOpportunity || !applications) return
    const existing = applications.find(app => app.opportunity.id === activeOpportunity.id)
    if (existing) {
      navigate(`/applications/${existing.applicationId}`)
    }
    setDialogState('IDLE')
    setActiveOpportunity(null)
  }, [activeOpportunity, applications, navigate])

  return {
    handleApplyClick,
    activeOpportunity,
    dialogState,
    handleConfirmContinue,
    handleConfirmCancel,
    handleTrackingYes,
    handleTrackingNo,
    handleViewExisting
  }
}
