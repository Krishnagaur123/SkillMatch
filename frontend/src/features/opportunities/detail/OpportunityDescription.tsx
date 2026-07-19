import { Card } from '@/components/common/Card'
import styles from './OpportunityDescription.module.css'

interface OpportunityDescriptionProps {
  description: string
}

export function OpportunityDescription({ description }: OpportunityDescriptionProps) {
  return (
    <Card className="p-6 flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-[var(--text-heading)] m-0">About the Role</h2>
      {!description ? (
        <p className="text-[var(--text-secondary)] m-0">No description provided.</p>
      ) : (
        <div className={`flex flex-col gap-4 max-w-none text-base leading-relaxed text-[var(--text-primary)] ${styles.container}`}>
          {description.split(/\n{2,}/).map((paragraph, index) => {
            const lines = paragraph.split('\n')
            return (
              <p key={index} className="m-0">
                {lines.map((line, lineIdx) => (
                  <span key={lineIdx}>
                    {line}
                    {lineIdx < lines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            )
          })}
        </div>
      )}
    </Card>
  )
}
