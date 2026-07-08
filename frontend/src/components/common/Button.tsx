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
      ghost: styles.ghost,
      icon: styles.icon,
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
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[buttonVariants({ variant, size, fullWidth }), className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {leftIcon && <span className={styles.leftIcon} aria-hidden="true">{leftIcon}</span>}
        {children}
        {rightIcon && <span className={styles.rightIcon} aria-hidden="true">{rightIcon}</span>}
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

export const IconButton = forwardRef<HTMLButtonElement, ButtonWrapperProps>(
  (props, ref) => <Button ref={ref} variant="icon" {...props} />
)
IconButton.displayName = 'IconButton'
