import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'
import { AlertTriangle } from 'lucide-react'
import styles from './DangerZone.module.css'

interface DangerZoneProps {
  onDelete: () => Promise<void>
}

export function DangerZone({ onDelete }: DangerZoneProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className={styles.dangerZone}>
      <div className={styles.header}>
        <AlertTriangle className={styles.icon} />
        <h2 className={styles.title}>Danger Zone</h2>
      </div>
      <p className={styles.description}>
        Deleting this application will remove all tracking history and personal notes. This action cannot be undone.
      </p>
      <Button 
        variant="secondary" 
        className={styles.deleteButton}
        onClick={() => setIsDialogOpen(true)}
      >
        Delete Application
      </Button>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Delete Application?"
        description="Are you sure you want to delete this application? All associated tracking history and personal notes will be permanently removed."
        confirmLabel={isDeleting ? 'Deleting...' : 'Yes, Delete'}
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setIsDialogOpen(false)}
      />
    </div>
  )
}
