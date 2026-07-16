import { StatCard } from '@/components/common/StatCard'
import { Briefcase, Code, FileText, AlertCircle } from 'lucide-react'
import styles from './KPIOverview.module.css'

interface KPIOverviewProps {
  totalSkills: number
  targetRoles: number
  resumeStatus: string
  resumeGaps: number
}

export function KPIOverview({
  totalSkills,
  targetRoles,
  resumeStatus,
  resumeGaps
}: KPIOverviewProps) {
  return (
    <div className={styles.grid}>
      <StatCard
        title="Total Profile Skills"
        value={totalSkills}
        icon={<Code className="w-4 h-4" />}
        description="Skills identified in your profile"
      />
      <StatCard
        title="Target Roles"
        value={targetRoles}
        icon={<Briefcase className="w-4 h-4" />}
        description="Roles you are targeting"
      />
      <StatCard
        title="Resume Status"
        value={resumeStatus}
        icon={<FileText className="w-4 h-4" />}
        description={resumeStatus === 'Resume Synced' ? 'Ready to apply' : 'Update recommended'}
      />
      <StatCard
        title="Skills Missing From Resume"
        value={resumeGaps}
        icon={<AlertCircle className="w-4 h-4" />}
        description="Profile skills not on active resume"
      />
    </div>
  )
}
