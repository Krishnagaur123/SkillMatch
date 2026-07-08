import styles from './AppBrand.module.css'

export default function AppBrand() {
  return (
    <div className={styles.root}>
      <span className={styles.logoMark} aria-hidden="true">
        S
      </span>
      <span className={styles.name}>SkillMatch</span>
    </div>
  )
}
