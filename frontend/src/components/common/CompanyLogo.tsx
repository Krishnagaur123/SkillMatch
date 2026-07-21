import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { clsx } from 'clsx'
import styles from './CompanyLogo.module.css'

export interface CompanyLogoProps {
  id?: string
  src?: string
  name: string
  className?: string
  iconClassName?: string
}

const PALETTES = [
  'var(--color-brand)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-indigo)',
  'var(--color-purple)',
  'var(--color-cyan)',
  'var(--color-error)',
]

export function CompanyLogo({ id, src, name, className = '', iconClassName = '' }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false)

  // Get first letter of each word (up to 2 characters) for initials fallback
  const getInitials = (companyName: string) => {
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  const getSemanticColor = (identifier: string) => {
    let hash = 0
    for (let i = 0; i < identifier.length; i++) {
      hash = identifier.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % PALETTES.length
    return PALETTES[index]
  }

  const combinedClasses = clsx(styles.root, className)

  if (src && !hasError) {
    return (
      <div className={combinedClasses}>
        <img 
          src={src} 
          alt={`${name} logo`} 
          className={styles.image} 
          onError={() => setHasError(true)}
        />
      </div>
    )
  }

  if (name) {
    const baseColor = getSemanticColor(id || name)
    return (
      <div 
        className={combinedClasses}
        style={{
          backgroundColor: `color-mix(in srgb, ${baseColor} 15%, transparent)`,
          borderColor: `color-mix(in srgb, ${baseColor} 30%, transparent)`
        }}
      >
        <span className={styles.initials} style={{ color: baseColor }}>
          {getInitials(name)}
        </span>
      </div>
    )
  }

  return (
    <div className={combinedClasses}>
      <Building2 className={clsx(styles.icon, iconClassName)} />
    </div>
  )
}
