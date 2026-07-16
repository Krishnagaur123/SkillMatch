import type { ReactNode } from 'react'
import { MapPin, Calendar, Users, Tag, Globe, ExternalLink } from 'lucide-react'
import type { CompanyDetailResponse } from '@/hooks/useCompanyDetail'
import styles from './CompanyQuickFacts.module.css'

interface CompanyQuickFactsProps {
  company: CompanyDetailResponse
}

interface FactItemProps {
  icon: ReactNode
  label: string
  children: ReactNode
}

function FactItem({ icon, label, children }: FactItemProps) {
  return (
    <div className={styles.item}>
      <div className={styles.iconWrap} aria-hidden="true">
        {icon}
      </div>
      <div className={styles.textGroup}>
        <span className={styles.label}>{label}</span>
        <div className={styles.value}>{children}</div>
      </div>
    </div>
  )
}

const Empty = () => <span className={styles.valueEmpty}>Not provided</span>

export function CompanyQuickFacts({ company }: CompanyQuickFactsProps) {
  const { headquarters, foundedYear, employeeCount, industry, website } = company

  return (
    <div className={styles.list} aria-label="Company quick facts">
      <FactItem icon={<MapPin size={15} />} label="Headquarters">
        {headquarters ?? <Empty />}
      </FactItem>

      <FactItem icon={<Calendar size={15} />} label="Founded">
        {foundedYear != null ? foundedYear.toString() : <Empty />}
      </FactItem>

      <FactItem icon={<Users size={15} />} label="Company Size">
        {employeeCount != null
          ? `${employeeCount.toLocaleString()} employees`
          : <Empty />}
      </FactItem>

      <FactItem icon={<Tag size={15} />} label="Industry">
        {industry ?? <Empty />}
      </FactItem>

      <FactItem icon={<Globe size={15} />} label="Website">
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.websiteLink}
            aria-label="Visit company website (opens in new tab)"
          >
            {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            <ExternalLink size={11} aria-hidden="true" />
          </a>
        ) : (
          <Empty />
        )}
      </FactItem>
    </div>
  )
}
