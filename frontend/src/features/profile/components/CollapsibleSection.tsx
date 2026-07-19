import { useState, type ReactNode } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './FormSection.module.css'

interface CollapsibleSectionProps {
  title: string
  icon: LucideIcon
  defaultOpen?: boolean
  children: ReactNode
}

/**
 * Shared animated collapsible wrapper used by all profile form sections.
 * Uses Framer Motion (already in the project) for smooth height animation.
 */
export function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const headerId = `collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`
  const bodyId = `${headerId}-body`

  return (
    <div className={styles.section}>
      <button
        id={headerId}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <span className={styles.triggerLeft}>
          <Icon size={16} className={styles.triggerIcon} aria-hidden="true" />
          <span className={styles.triggerTitle}>{title}</span>
        </span>
        <ChevronDown
          size={16}
          className={[
            styles.triggerChevron,
            open ? styles.triggerChevronOpen : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={bodyId}
            role="region"
            aria-labelledby={headerId}
            className={styles.body}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.bodyInner}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
