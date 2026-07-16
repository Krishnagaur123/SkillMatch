import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'

interface ApplicationTrackingDialogsProps {
  dialogState: 'IDLE' | 'CONFIRM' | 'TRACKING' | 'ALREADY_TRACKED'
  onConfirmContinue: () => void
  onConfirmCancel: () => void
  onTrackingYes: () => void
  onTrackingNo: () => void
  onViewExisting: () => void
}

export function ApplicationTrackingDialogs({
  dialogState,
  onConfirmContinue,
  onConfirmCancel,
  onTrackingYes,
  onTrackingNo,
  onViewExisting
}: ApplicationTrackingDialogsProps) {
  return (
    <>
      <ConfirmationDialog
        isOpen={dialogState === 'CONFIRM'}
        title="Apply on Company Website"
        description="You'll be redirected to the company's official careers page to complete your application. After submitting your application, SkillMatch can automatically begin tracking it for you."
        confirmLabel="Continue"
        cancelLabel="Cancel"
        onConfirm={async () => onConfirmContinue()}
        onCancel={onConfirmCancel}
      />

      <ConfirmationDialog
        isOpen={dialogState === 'TRACKING'}
        title="Did you submit your application?"
        description="If you've successfully submitted your application, SkillMatch can begin tracking its progress."
        confirmLabel="Yes, I Applied"
        cancelLabel="Not Yet"
        onConfirm={async () => onTrackingYes()}
        onCancel={onTrackingNo}
      />

      <ConfirmationDialog
        isOpen={dialogState === 'ALREADY_TRACKED'}
        title="Application Already Tracked"
        description="You're already tracking this application."
        confirmLabel="View Application"
        cancelLabel="Close"
        onConfirm={async () => onViewExisting()}
        onCancel={onTrackingNo}
      />
    </>
  )
}
