import { Globe, ExternalLink, Briefcase } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { CompanyLogo } from '@/components/common/CompanyLogo'
import type { CompanyDetailResponse } from '@/hooks/useCompanyDetail'
import styles from './CompanyHero.module.css'

interface CompanyHeroProps {
  company: CompanyDetailResponse
  onViewOpportunities: () => void
}

export function CompanyHero({ company, onViewOpportunities }: CompanyHeroProps) {
  const { name, logoUrl, website, industry, openOpportunities } = company
  const count = openOpportunities ?? 0

  return (
    <div className={styles.hero}>
      <div className={styles.topRow}>
        {/* Identity */}
        <div className={styles.identity}>
          <CompanyLogo
            key={logoUrl}
            src={logoUrl}
            name={name}
            className={styles.logo}
          />
          <div className={styles.meta}>
            <h1 className={styles.name}>{name}</h1>

            <div className={styles.badgeRow}>
              {industry && <Badge variant="secondary">{industry}</Badge>}
              <Badge variant="secondary">
                <span className={styles.rolesBadgeInner}>
                  <Briefcase size={12} aria-hidden="true" />
                  {count} Open {count === 1 ? 'Role' : 'Roles'}
                </span>
              </Badge>
            </div>

            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
                aria-label={`Visit ${name} website (opens in new tab)`}
              >
                <Globe size={13} aria-hidden="true" />
                {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                <ExternalLink size={11} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="md"
            onClick={onViewOpportunities}
            aria-label={`Scroll to open roles at ${name}`}
          >
            View Roles
          </Button>
          {website && (
            <Button
              variant="primary"
              size="md"
              rightIcon={<ExternalLink size={14} aria-hidden="true" />}
              onClick={() => window.open(website, '_blank', 'noopener,noreferrer')}
              aria-label={`Visit ${name} website (opens in new tab)`}
            >
              Visit Website
            </Button>
          )}
        </div>
      </div>

      <hr className={styles.divider} aria-hidden="true" />
    </div>
  )
}
