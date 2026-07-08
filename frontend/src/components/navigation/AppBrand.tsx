import styles from './AppBrand.module.css'

interface AppBrandProps {
  collapsed?: boolean
}

export default function AppBrand({ collapsed = false }: AppBrandProps) {
  return (
    <div className={styles.root}>
      <span className={styles.logoMark} aria-hidden="true">
        S
      </span>
      {!collapsed && <span className={styles.name}>SkillMatch</span>}
    </div>
  )
}
