import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/common/Card'

interface CompanyInfoCardProps {
  title: string
  value: ReactNode
  icon: ReactNode
}

export function CompanyInfoCard({ title, value, icon }: CompanyInfoCardProps) {
  if (!value) return null

  return (
    <Card className="hover:shadow-sm transition-shadow duration-200 border-slate-100 dark:border-slate-800">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="shrink-0 p-2.5 rounded-lg bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          {icon}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="font-semibold text-slate-900 dark:text-white truncate whitespace-normal break-words">
            {value}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
