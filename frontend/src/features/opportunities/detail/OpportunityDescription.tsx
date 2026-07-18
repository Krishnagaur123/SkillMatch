import styles from './OpportunityDescription.module.css'

interface OpportunityDescriptionProps {
  description: string
}

export function OpportunityDescription({ description }: OpportunityDescriptionProps) {
  if (!description) {
    return <p className={styles.empty}>No description provided.</p>
  }

  // Basic parsing for line breaks to prevent "wall of text"
  const paragraphs = description.split(/\n{2,}/)

  return (
    <div className={`flex flex-col gap-4 max-w-none ${styles.container}`}>
      {paragraphs.map((paragraph, index) => {
        // Handle single line breaks within paragraphs
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
