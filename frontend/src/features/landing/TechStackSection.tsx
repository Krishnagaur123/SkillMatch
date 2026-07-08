import { motion } from 'framer-motion'
import styles from './TechStackSection.module.css'

interface TechBadgeProps {
  name: string
  planned?: boolean
}

function TechBadge({ name, planned = false }: TechBadgeProps) {
  return (
    <motion.span
      className={[styles.badge, planned ? styles.planned : styles.current].join(' ')}
      role="button"
      tabIndex={0}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      {name}
      {planned && <span className={styles.plannedLabel}>Planned</span>}
    </motion.span>
  )
}

interface TechGroupProps {
  title: string
  techs: readonly string[]
  planned?: boolean
}

function TechGroup({ title, techs, planned = false }: TechGroupProps) {
  return (
    <div className={styles.group}>
      <h3 className={styles.groupTitle}>{title}</h3>
      <div className={styles.groupBadges}>
        {techs.map((tech) => (
          <TechBadge key={tech} name={tech} planned={planned} />
        ))}
      </div>
    </div>
  )
}

const BACKEND_TECH = ['Java 21', 'Spring Boot', 'PostgreSQL', 'Spring Security'] as const
const FRONTEND_TECH = ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS'] as const
const FUTURE_TECH = ['Redis', 'Apache Kafka', 'AWS', 'Kubernetes', 'Elasticsearch'] as const

export default function TechStackSection() {
  return (
    <section id="tech-stack" className={styles.root} aria-labelledby="tech-heading">
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.headingBadge}>Technology</span>
          <h2 id="tech-heading" className={styles.title}>
            Built on a modern, production-grade stack
          </h2>
          <p className={styles.subtitle}>
            SkillMatch is engineered for reliability and scale using battle-tested technologies,
            with a clear roadmap for infrastructure expansion.
          </p>
        </div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.div
            className={styles.currentCard}
            variants={{
              hidden: { opacity: 0, x: -15 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
            }}
          >
            <p className={styles.cardLabel}>Current Stack</p>
            <div className={styles.groups}>
              <TechGroup title="Backend" techs={BACKEND_TECH} />
              <div className={styles.divider} role="separator" />
              <TechGroup title="Frontend" techs={FRONTEND_TECH} />
            </div>
          </motion.div>

          <motion.div
            className={styles.futureCard}
            variants={{
              hidden: { opacity: 0, x: 15 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
            }}
          >
            <p className={styles.cardLabel}>Planned Infrastructure</p>
            <TechGroup title="Scaling & Messaging" techs={FUTURE_TECH} planned />
            <p className={styles.futureNote}>
              Designed with these integrations in mind from day one.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
