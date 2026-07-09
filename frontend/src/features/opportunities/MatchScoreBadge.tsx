import { cn } from '@/lib/utils'

interface MatchScoreBadgeProps {
  score: number
  className?: string
}

export function MatchScoreBadge({ score, className }: MatchScoreBadgeProps) {
  let colorClass: string
  let label: string

  if (score >= 90) {
    colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    label = 'Excellent Match'
  } else if (score >= 75) {
    colorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    label = 'Strong Match'
  } else if (score >= 60) {
    colorClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    label = 'Moderate Match'
  } else {
    colorClass = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
    label = 'Needs Improvement'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className={cn('flex items-center justify-center w-16 h-16 rounded-full font-bold text-xl border-4', 
        score >= 90 ? 'border-emerald-200 dark:border-emerald-800' :
        score >= 75 ? 'border-blue-200 dark:border-blue-800' :
        score >= 60 ? 'border-amber-200 dark:border-amber-800' :
        'border-slate-200 dark:border-slate-800',
        colorClass
      )}>
        {score}%
      </div>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 text-center">{label}</span>
    </div>
  )
}
