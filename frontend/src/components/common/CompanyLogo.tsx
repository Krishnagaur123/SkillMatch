import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { clsx } from 'clsx'
import styles from './CompanyLogo.module.css'

export interface CompanyLogoProps {
  src?: string
  name: string
  className?: string
  iconClassName?: string
}

export function CompanyLogo({ src, name, className = '', iconClassName = '' }: CompanyLogoProps) {
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

  // Generate a consistent color based on company name
  const getColor = (name: string) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const h = hash % 360
    return `hsl(${h}, 70%, 40%)` // darkish color
  }

  const combinedClasses = clsx(styles.root, className)

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={`${name} logo`}
        className={clsx(combinedClasses, styles.image)}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    )
  }

  // Fallback to initials if name is provided, else generic building icon
  if (name) {
    return (
      <div 
        className={clsx(combinedClasses, styles.initials)}
        style={{ backgroundColor: getColor(name), color: 'white' }}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <div className={combinedClasses}>
      <Building2 className={clsx(styles.icon, iconClassName)} />
    </div>
  )
}
