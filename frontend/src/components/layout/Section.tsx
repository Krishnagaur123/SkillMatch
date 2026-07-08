import type { ReactNode } from 'react'
import styles from './Section.module.css'

interface SectionProps {
  children: ReactNode
  className?: string
}

export default function Section({ children, className }: SectionProps) {
  return <section className={[styles.root, className].filter(Boolean).join(' ')}>{children}</section>
}
