import { SkillBadge } from '@/components/common/Badge'

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
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
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
