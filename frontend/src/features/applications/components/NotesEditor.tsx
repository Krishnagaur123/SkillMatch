import { useState } from 'react'
import { Button } from '@/components/common/Button'
import { Check } from 'lucide-react'
import styles from './NotesEditor.module.css'

interface NotesEditorProps {
  notes: string
  onSave: (notes: string) => Promise<void>
}

export function NotesEditor({ notes, onSave }: NotesEditorProps) {
  const [value, setValue] = useState(notes)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const hasChanged = value !== notes

  const handleSave = async () => {
    if (!hasChanged) return
    setIsSaving(true)
    try {
      await onSave(value)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.editor}>
      <p className={styles.helperText}>
        Keep track of interviewers, questions asked, impressions, and next steps.
      </p>
      
      <div className={styles.textareaWrapper}>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add your personal notes here..."
        />
        
        {/* We can show autosave text, but right now it saves when user clicks Save button, per existing behavior. The prompt asks for an "Autosave indicator" without changing save behavior. I will just show "Saved automatically" near the button or inside it if the save happens. Actually, since it doesn't change save behavior, the button says "Save Notes". After save, it can show "Saved". */}
      </div>

      <div className={styles.footer}>
        <div className={styles.savedIndicator}>
          {showSaved && (
            <>
              <Check className={styles.savedIcon} />
              <span>Saved</span>
            </>
          )}
        </div>
        {hasChanged && (
          <div className={styles.actions}>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setValue(notes)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Notes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
