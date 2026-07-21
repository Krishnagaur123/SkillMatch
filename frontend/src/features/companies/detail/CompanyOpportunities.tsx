import { Link } from 'react-router-dom'
import { MapPin, Briefcase, ChevronRight } from 'lucide-react'
import { MatchBadge } from '@/components/common/Badge'
import type { OpportunityRecommendation } from '@/hooks/useOpportunities'
import styles from './CompanyOpportunities.module.css'

interface CompanyOpportunitiesProps {
  opportunities: OpportunityRecommendation[]
  companyName: string
}

function formatType(type: string): string {
  return type.toLowerCase().replace(/_/g, ' ')
}

export function CompanyOpportunities({ opportunities, companyName }: CompanyOpportunitiesProps) {
  if (opportunities.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <p className={styles.emptyTitle}>No recommendations found for this company</p>
        <p className={styles.emptyDesc}>
          Visit the Opportunities page to discover all roles at {companyName}.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.list} role="list">
      {opportunities.map((opp) => (
        <Link
          key={opp.opportunityId}
          to={`/opportunities/${opp.opportunityId}`}
          className={styles.oppRow}
          role="listitem"
          aria-label={`${opp.title}, ${opp.matchPercentage}% match`}
        >
          <div className={styles.oppMain}>
            <h3 className={styles.oppTitle}>{opp.title}</h3>
            <div className={styles.oppMeta}>
              {opp.location && (
                <span className={styles.oppMetaItem}>
                  <MapPin size={13} aria-hidden="true" />
                  {opp.location}
                </span>
              )}
              {opp.employmentType && (
                <span className={styles.oppMetaItem}>
                  <Briefcase size={13} aria-hidden="true" />
                  {formatType(opp.employmentType)}
                </span>
              )}
            </div>
          </div>

          <div className={styles.oppRight}>
            <MatchBadge score={opp.matchPercentage} />
            <ChevronRight size={16} className={styles.arrow} aria-hidden="true" />
          </div>
        </Link>
      ))}
    </div>
  )
}
