import { useNavigate } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { EmptyState as BaseEmptyState } from '@/components/feedback'
import { ROUTES } from '@/constants/routes'

export function EmptyState() {
  const navigate = useNavigate()

  return (
    <BaseEmptyState
      icon={<ClipboardList size={36} />}
      title="No applications yet"
      description="Applications you save or apply for will appear here. Browse opportunities to start tracking your career journey."
      actionLabel="Browse Opportunities"
      onAction={() => navigate(ROUTES.OPPORTUNITIES)}
    />
  )
}
