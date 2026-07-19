
import styles from './ProfileDisplayField.module.css'

interface ProfileDisplayFieldProps {
  label: string
  value?: string | number | null
  isUrl?: boolean
}

/**
 * Standardizes how read-only profile data is displayed in View Mode.
 * Handles empty states elegantly.
 */
export function ProfileDisplayField({ label, value, isUrl = false }: ProfileDisplayFieldProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {!value || value === '' ? (
        <span className={styles.notAdded}>— Not Added —</span>
      ) : isUrl ? (
        <a href={value as string} target="_blank" rel="noopener noreferrer" className={styles.link}>
          {value}
        </a>
      ) : (
        <span className={styles.value}>{value}</span>
      )}
    </div>
  )
}
