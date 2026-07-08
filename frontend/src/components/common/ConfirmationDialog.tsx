import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Card } from './Card'
import { Button } from './Button'
import styles from './ConfirmationDialog.module.css'

export interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  isDestructive?: boolean
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    // Focus confirmation dialog or first button
    const focusable = containerRef.current?.querySelectorAll('button')
    if (focusable && focusable.length > 0) {
      focusable[0].focus()
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isLoading, onCancel])

  if (!isOpen) return null

  return createPortal(
    <div className={styles.overlay} onClick={() => !isLoading && onCancel()}>
      <div
        ref={containerRef}
        className={styles.container}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className={styles.dialogCard} padding="lg">
          <h2 id="confirm-dialog-title" className={styles.title}>
            {title}
          </h2>
          <p id="confirm-dialog-desc" className={styles.description}>
            {description}
          </p>
          <div className={styles.actions}>
            <Button
              variant="secondary"
              size="md"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={isDestructive ? 'primary' : 'primary'}
              className={isDestructive ? styles.destructiveBtn : undefined}
              size="md"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : confirmLabel}
            </Button>
          </div>
        </Card>
      </div>
    </div>,
    document.body
  )
}
