import styles from './PageSpinner.module.css'

export default function PageSpinner() {
  return (
    <div className={styles.root} aria-label="Loading" role="status">
      <span className={styles.spinner} />
    </div>
  )
}
