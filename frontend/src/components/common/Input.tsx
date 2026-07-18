import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, success, fullWidth = true, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          styles.input,
          error ? styles.error : '',
          success ? styles.success : '',
          fullWidth ? styles.fullWidth : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
