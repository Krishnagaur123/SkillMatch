import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Card, CardContent } from '@/components/common/Card'
import { CompanyLogo } from '@/components/common/CompanyLogo'
import type { OpportunityDetailCompanySummary } from '@/hooks/useOpportunityDetail'
import styles from './CompanyPreview.module.css'

interface CompanyPreviewProps {
  company: OpportunityDetailCompanySummary
}

export function CompanyPreview({ company }: CompanyPreviewProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Card className="flex flex-col">
      <CardContent className="p-6 flex flex-col gap-5">
        <h3 className="text-xl font-semibold text-[var(--text-heading)] m-0">About the Company</h3>
        <div className="flex items-center gap-4">
          <Link to={`/companies/${company.id}`} state={{ from: location.pathname }} className="shrink-0 group">
            <CompanyLogo
              src={company.logoUrl}
              name={company.name}
              className="group-hover:ring-2 ring-accent/20 transition-all"
              iconClassName="w-6 h-6"
            />
          </Link>
          <div className="flex flex-col">
            <Link 
              to={`/companies/${company.id}`}
              state={{ from: location.pathname }}
              className={`text-base font-medium text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors ${styles.companyName}`}
            >
              {company.name}
            </Link>
            <span className="text-sm text-[var(--text-muted)] leading-tight mt-0.5">View profile to see more details and open roles</span>
          </div>
        </div>

        <Button 
          variant="secondary" 
          className="w-full mt-1 gap-2"
          onClick={() => navigate(`/companies/${company.id}`, { state: { from: location.pathname } })}
        >
          View Company <ExternalLink className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
