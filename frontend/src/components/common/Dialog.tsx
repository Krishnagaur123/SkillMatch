import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Card } from './Card'
import styles from './Dialog.module.css'

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  preventClose?: boolean
}

export function Dialog({ isOpen, onClose, children, className, preventClose }: DialogProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, preventClose])

  if (!isOpen) return null

  return createPortal(
    <div className={styles.overlay} onClick={() => !preventClose && onClose()}>
      <div
        ref={containerRef}
        className={[styles.container, className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <Card variant="default" padding="lg" className={styles.dialogCard}>
          {children}
        </Card>
      </div>
    </div>,
    document.body
  )
}

export function DialogHeader({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={[styles.header, className].filter(Boolean).join(' ')}>{children}</div>
}

export function DialogTitle({ children, className }: { children: ReactNode, className?: string }) {
  return <h2 className={[styles.title, className].filter(Boolean).join(' ')}>{children}</h2>
}

export function DialogDescription({ children, className }: { children: ReactNode, className?: string }) {
  return <p className={[styles.description, className].filter(Boolean).join(' ')}>{children}</p>
}

export function DialogContent({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={[styles.content, className].filter(Boolean).join(' ')}>{children}</div>
}

export function DialogFooter({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={[styles.footer, className].filter(Boolean).join(' ')}>{children}</div>
}
