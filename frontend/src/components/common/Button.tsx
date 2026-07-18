import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import styles from './Button.module.css'

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      outline: styles.outline,
      ghost: styles.ghost,
      destructive: styles.destructive,
    },
    size: {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    },
    fullWidth: {
      true: styles.fullWidth,
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, leftIcon, rightIcon, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          buttonVariants({ variant, size, fullWidth }), 
          isLoading ? styles.loading : '',
          className
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className={styles.spinner} aria-hidden="true" />}
        {!isLoading && leftIcon && <span className={styles.leftIcon} aria-hidden="true">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className={styles.rightIcon} aria-hidden="true">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'

export type ButtonWrapperProps = Omit<ButtonProps, 'variant'>

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  (props, ref) => <Button ref={ref} variant="primary" {...props} />
)
PrimaryButton.displayName = 'PrimaryButton'

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  (props, ref) => <Button ref={ref} variant="secondary" {...props} />
)
SecondaryButton.displayName = 'SecondaryButton'

export const GhostButton = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  (props, ref) => <Button ref={ref} variant="ghost" {...props} />
)
GhostButton.displayName = 'GhostButton'

export const OutlineButton = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  (props, ref) => <Button ref={ref} variant="outline" {...props} />
)
OutlineButton.displayName = 'OutlineButton'

export const DestructiveButton = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  (props, ref) => <Button ref={ref} variant="destructive" {...props} />
)
DestructiveButton.displayName = 'DestructiveButton'
