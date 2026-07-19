import { useState, type ReactNode } from 'react'
import { Pencil, Check, X, type LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/common/Button'
import styles from './FormSection.module.css'

interface EditableSectionProps {
  title: string
  icon: LucideIcon
  isEmpty?: boolean
  viewContent: ReactNode
  editContent: ReactNode
  onCancel: () => void
}

/**
 * Reusable wrapper for a profile section that supports View and Edit modes.
 * Defaults to Edit mode if the section `isEmpty`.
 */
export function EditableSection({
  title,
  icon: Icon,
  isEmpty = false,
  viewContent,
  editContent,
  onCancel,
}: EditableSectionProps) {
  // If the section has no data, default to edit mode.
  const [isEditing, setIsEditing] = useState(isEmpty)



  const handleCancel = () => {
    onCancel()
    setIsEditing(false)
  }

  const handleDone = () => {
    // This just exits edit mode locally. The global form handles submission.
    setIsEditing(false)
  }

  return (
    <div className={styles.section}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.triggerLeft}>
          <Icon size={18} className={styles.triggerIcon} aria-hidden="true" />
          <h3 className={styles.triggerTitle}>{title}</h3>
        </div>
        {!isEditing && (
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => setIsEditing(true)}
            aria-label={`Edit ${title}`}
          >
            <Pencil size={14} />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Body with Framer Motion transitions */}
      <div className={styles.body}>
        <AnimatePresence mode="wait" initial={false}>
          {!isEditing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className={styles.viewMode}
            >
              <div className={styles.bodyInner}>{viewContent}</div>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className={styles.editMode}
            >
              <div className={styles.bodyInner}>
                {editContent}
                
                {/* Section-level actions */}
                <div className={styles.sectionActions}>
                  <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                    <X size={14} className={styles.btnIcon} />
                    Cancel
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={handleDone}>
                    <Check size={14} className={styles.btnIcon} />
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
