import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/common/Button'
import type { CompanyDetailResponse } from '@/hooks/useCompanyDetail'
import styles from './CompanyCTA.module.css'

interface CompanyCTAProps {
  company: CompanyDetailResponse
  onViewOpportunities: () => void
}

export function CompanyCTA({ company, onViewOpportunities }: CompanyCTAProps) {
  const { name, website } = company

  return (
    <div className={styles.root}>
      <div className={styles.headline}>
        <p className={styles.title}>Ready to apply?</p>
        <p className={styles.description}>
          Explore matching opportunities at {name} and take the next step in your career.
        </p>
      </div>
      <div className={styles.actions}>
        <Button
          variant="primary"
          fullWidth
          onClick={onViewOpportunities}
          aria-label={`Scroll to open roles at ${name}`}
        >
          View Opportunities
        </Button>
        {website && (
          <Button
            variant="secondary"
            fullWidth
            rightIcon={<ExternalLink size={14} aria-hidden="true" />}
            onClick={() => window.open(website, '_blank', 'noopener,noreferrer')}
            aria-label={`Visit ${name} website (opens in new tab)`}
          >
            Visit Website
          </Button>
        )}
      </div>
    </div>
  )
}
