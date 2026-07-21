import { useMemo } from 'react'
import { Briefcase, TrendingUp, Zap, Activity } from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import type { CompanyDetailResponse } from '@/hooks/useCompanyDetail'
import type { OpportunityRecommendation } from '@/hooks/useOpportunities'
import styles from './CompanyMetrics.module.css'

interface CompanyMetricsProps {
  company: CompanyDetailResponse
  opportunities: OpportunityRecommendation[]
}

export function CompanyMetrics({ company, opportunities }: CompanyMetricsProps) {
  const count = company.openOpportunities ?? 0

  const { avgMatch, bestMatch } = useMemo(() => {
    if (opportunities.length === 0) return { avgMatch: null, bestMatch: null }
    const scores = opportunities.map((o) => o.matchPercentage)
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const best = Math.max(...scores)
    return { avgMatch: avg, bestMatch: best }
  }, [opportunities])

  const hiringStatus = count > 0 ? 'Active' : 'Paused'

  const getMatchColor = (score: number | null) => {
    if (score === null) return undefined
    if (score >= 90) return 'var(--color-success)'
    if (score >= 75) return 'var(--color-emerald)'
    if (score >= 60) return 'var(--color-warning)'
    if (score >= 40) return 'var(--color-orange)'
    return 'var(--color-error)'
  }

  return (
    <div className={styles.grid} role="region" aria-label="Company key metrics">
      <StatCard
        title="Open Roles"
        value={count}
        valueColor="var(--color-brand)"
        icon={<Briefcase size={16} aria-hidden="true" />}
        description={count === 1 ? 'position available' : 'positions available'}
      />
      <StatCard
        title="Avg Match"
        value={avgMatch != null ? `${avgMatch}%` : '—'}
        valueColor={getMatchColor(avgMatch)}
        icon={<TrendingUp size={16} aria-hidden="true" />}
        description={avgMatch != null ? 'across your matched roles' : 'Browse opportunities to see match'}
      />
      <StatCard
        title="Best Match"
        value={bestMatch != null ? `${bestMatch}%` : '—'}
        valueColor={getMatchColor(bestMatch)}
        icon={<Zap size={16} aria-hidden="true" />}
        description={bestMatch != null ? 'your top matching role' : 'No match data yet'}
      />
      <StatCard
        title="Hiring Status"
        value={hiringStatus}
        valueColor={count > 0 ? 'var(--color-success)' : undefined}
        icon={<Activity size={16} aria-hidden="true" />}
        description={
          count > 0
            ? `${count} ${count === 1 ? 'role' : 'roles'} accepting applications`
            : 'No active listings right now'
        }
      />
    </div>
  )
}
