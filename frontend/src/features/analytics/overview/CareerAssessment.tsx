import styles from './CareerAssessment.module.css'

interface CareerAssessmentProps {
  summary: string
}

export function CareerAssessment({ summary }: CareerAssessmentProps) {
  return (
    <section className={styles.container} aria-label="Career Assessment">
      <h2 className={styles.title}>Career Assessment</h2>
      <p className={styles.summary}>{summary}</p>
    </section>
  )
}
