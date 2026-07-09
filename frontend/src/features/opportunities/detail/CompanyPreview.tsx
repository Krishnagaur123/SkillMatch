import { Link, useNavigate } from 'react-router-dom'
import { Building2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Card, CardHeader, CardContent } from '@/components/common/Card'
import type { OpportunityDetailCompanySummary } from '@/hooks/useOpportunityDetail'

interface CompanyPreviewProps {
  company: OpportunityDetailCompanySummary
}

export function CompanyPreview({ company }: CompanyPreviewProps) {
  const navigate = useNavigate()

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">About the Company</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Link to={`/companies/${company.id}`} className="shrink-0 group">
            {company.logoUrl ? (
              <img 
                src={company.logoUrl} 
                alt={`${company.name} logo`} 
                className="w-14 h-14 rounded-lg object-cover border border-slate-100 group-hover:ring-2 ring-primary/20 transition-all"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:ring-2 ring-primary/20 transition-all">
                <Building2 className="w-6 h-6 text-slate-400" />
              </div>
            )}
          </Link>
          <div className="flex flex-col">
            <Link 
              to={`/companies/${company.id}`} 
              className="font-medium text-slate-900 dark:text-white hover:text-primary transition-colors text-base"
            >
              {company.name}
            </Link>
            <span className="text-sm text-slate-500">View full profile to see more details and open roles</span>
          </div>
        </div>

        <Button 
          variant="secondary" 
          className="w-full mt-2 gap-2"
          onClick={() => navigate(`/companies/${company.id}`)}
        >
          View Company <ExternalLink className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
