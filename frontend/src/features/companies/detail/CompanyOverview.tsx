import styles from './CompanyOverview.module.css'

interface CompanyOverviewProps {
  description?: string | null
}

export function CompanyOverview({ description }: CompanyOverviewProps) {
  if (!description) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>No company description has been provided yet.</p>
      </div>
    )
  }

  const paragraphs = description.split(/\n{2,}/).filter(Boolean)

  return (
    <div className={styles.prose}>
      {paragraphs.map((paragraph, index) => {
        const lines = paragraph.split('\n')
        return (
          <p key={index} className={styles.paragraph}>
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
  )
}
