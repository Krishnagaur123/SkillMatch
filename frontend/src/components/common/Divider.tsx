import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import styles from './Divider.module.css'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', label, ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          className={[styles.vertical, className].filter(Boolean).join(' ')}
          role="separator"
          aria-orientation="vertical"
          {...props}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={[styles.horizontal, label ? styles.hasLabel : '', className]
          .filter(Boolean)
          .join(' ')}
        role="separator"
        aria-orientation="horizontal"
        {...props}
      >
        {label && <span className={styles.label}>{label}</span>}
      </div>
    )
  }
)
Divider.displayName = 'Divider'
