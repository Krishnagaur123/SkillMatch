import { SkillBadge } from '@/components/common/Badge'
import styles from './SkillGroup.module.css'

interface SkillGroupProps {
  title: React.ReactNode
  skills: string[]
  isMissing?: boolean
}

export function SkillGroup({ title, skills, isMissing = false }: SkillGroupProps) {
  if (!skills || skills.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-1.5">
      <h4 className={`flex items-center gap-1.5 ${styles.title}`}>
        {title}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <SkillBadge 
            key={skill} 
            name={skill} 
            isMissing={isMissing} 
            variant="resume" // Assuming matched skills look like resume skills
          />
        ))}
      </div>
    </div>
  )
}
