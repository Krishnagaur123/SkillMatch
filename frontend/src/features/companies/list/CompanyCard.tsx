import { Link, useLocation } from 'react-router-dom'
import { MapPin, Briefcase } from 'lucide-react'
import { Badge, MatchBadge } from '@/components/common/Badge'
import { CompanyLogo } from '@/components/common/CompanyLogo'
import type { CompanyListItem } from '@/pages/companies/CompaniesPage'
import styles from './CompanyCard.module.css'

interface CompanyCardProps {
  item: CompanyListItem
}


export function CompanyCard({ item }: CompanyCardProps) {
  const location = useLocation()
  const { company, averageMatch, topSkills, hiringStatus } = item
  const { id, name, logoUrl, industry, headquarters, openRolesCount, description } = company

  return (
    <Link 
      to={`/companies/${id}`} 
      state={{ from: location.pathname }}
      className={styles.root}
      aria-label={`View ${name} details`}
    >
      <div className={styles.header}>
        <CompanyLogo
          id={id}
          src={logoUrl}
          name={name}
          className={styles.logo}
          iconClassName="w-6 h-6"
        />
        <div className={styles.meta}>
          <h3 className={styles.name}>{name}</h3>
          <div className={styles.badgeRow}>
            {industry && <Badge variant="neutral">{industry}</Badge>}
            <Badge variant={hiringStatus === 'Active' ? 'success' : 'neutral'}>
              {hiringStatus}
            </Badge>
          </div>
        </div>
      </div>

      {description && (
        <p className={styles.description}>{description}</p>
      )}

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Open Roles</span>
          <span className={styles.statValue}>
            <Briefcase size={14} style={{ color: 'var(--text-secondary)' }} aria-hidden="true" />
            <span style={{ color: 'var(--color-brand)' }}>{openRolesCount}</span>
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Avg Match</span>
          <div className="mt-1">
            {averageMatch !== null ? (
              <MatchBadge score={averageMatch} />
            ) : (
              <span className={styles.statValue}>—</span>
            )}
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Location</span>
          <span className={styles.statValue}>
            <MapPin size={14} style={{ color: 'var(--text-secondary)' }} aria-hidden="true" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{headquarters || 'Remote'}</span>
          </span>
        </div>
      </div>

      {topSkills.length > 0 && (
        <div className={styles.tech}>
          <span className={styles.techLabel}>Top Tech Stack</span>
          <div className={styles.techBadges}>
            {topSkills.slice(0, 4).map(skill => (
              <span key={skill} className={styles.techBadge}>
                {skill}
              </span>
            ))}
            {topSkills.length > 4 && (
              <span className={styles.techBadge}>+{topSkills.length - 4}</span>
            )}
          </div>
        </div>
      )}
    </Link>
  )
}
