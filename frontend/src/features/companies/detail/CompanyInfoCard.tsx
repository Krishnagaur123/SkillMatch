import { Card, CardContent } from '@/components/common/Card'
import styles from './CompanyInfoCard.module.css'

import type { ReactNode } from 'react'

interface CompanyInfoCardProps {
  title: string
  value: ReactNode
  icon: ReactNode
}

export function CompanyInfoCard({ title, value, icon }: CompanyInfoCardProps) {
  if (!value) return null

  return (
    <Card variant="interactive">
      <CardContent className="p-5 flex items-start gap-4">
        <div className={`shrink-0 p-2.5 rounded-lg ${styles.iconWrapper}`}>
          {icon}
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <p className={`text-sm font-medium ${styles.title}`}>
            {title}
          </p>
          <div className={`font-semibold truncate whitespace-normal break-words ${styles.value}`}>
            {value}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
