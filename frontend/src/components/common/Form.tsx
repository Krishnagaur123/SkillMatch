import { forwardRef } from 'react'
import type { HTMLAttributes, ButtonHTMLAttributes, LabelHTMLAttributes } from 'react'
import { PrimaryButton } from './Button'
import styles from './Form.module.css'

export type FormProps = HTMLAttributes<HTMLFormElement>

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <form ref={ref} className={[styles.form, className].filter(Boolean).join(' ')} {...props}>
        {children}
      </form>
    )
  }
)
Form.displayName = 'Form'

export type RequiredIndicatorProps = HTMLAttributes<HTMLSpanElement>

export const RequiredIndicator = forwardRef<HTMLSpanElement, RequiredIndicatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[styles.required, className].filter(Boolean).join(' ')}
        aria-hidden="true"
        {...props}
      >
        *
      </span>
    )
  }
)
RequiredIndicator.displayName = 'RequiredIndicator'

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  error?: string
}

export const FieldError = forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, error, children, ...props }, ref) => {
    const content = error || children
    if (!content) return null

    return (
      <p ref={ref} className={[styles.error, className].filter(Boolean).join(' ')} role="alert" {...props}>
        {content}
      </p>
    )
  }
)
FieldError.displayName = 'FieldError'

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
  error?: string
  required?: boolean
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, labelProps, error, required = false, children, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.field, className].filter(Boolean).join(' ')} {...props}>
        {label && (
          <label className={styles.label} {...labelProps}>
            <span>{label}</span>
            {required && <RequiredIndicator />}
          </label>
        )}
        <div className={styles.control}>{children}</div>
        <FieldError error={error} />
      </div>
    )
  }
)
FormField.displayName = 'FormField'

export interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.section, className].filter(Boolean).join(' ')} {...props}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>{title}</h4>
          {description && <p className={styles.sectionDesc}>{description}</p>}
        </div>
        <div className={styles.sectionContent}>{children}</div>
      </div>
    )
  }
)
FormSection.displayName = 'FormSection'

export interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingLabel?: string
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ className, isLoading = false, loadingLabel = 'Saving...', children, disabled, ...props }, ref) => {
    return (
      <PrimaryButton
        ref={ref}
        type="submit"
        disabled={disabled || isLoading}
        className={className}
        {...props}
      >
        {isLoading ? (
          <span className={styles.submitLoading}>
            <span className={styles.submitSpinner} />
            <span>{loadingLabel}</span>
          </span>
        ) : (
          children
        )}
      </PrimaryButton>
    )
  }
)
SubmitButton.displayName = 'SubmitButton'
