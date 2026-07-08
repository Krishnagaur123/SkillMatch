import { motion } from 'framer-motion'
import styles from './HowItWorksSection.module.css'

interface StepCardProps {
  number: number
  title: string
  description: string
  isLast?: boolean
}

function StepCard({ number, title, description, isLast = false }: StepCardProps) {
  return (
    <motion.div
      className={styles.step}
      variants={{
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
      }}
      whileHover="hover"
    >
      <div className={styles.stepLeft}>
        <motion.div
          className={styles.stepNumber}
          aria-hidden="true"
          variants={{
            hover: { scale: 1.08, backgroundColor: 'var(--accent-hover)' },
          }}
          transition={{ duration: 0.2 }}
        >
          {String(number).padStart(2, '0')}
        </motion.div>
        {!isLast && (
          <div className={styles.stepConnector} aria-hidden="true">
            <motion.div
              className={styles.stepConnectorFill}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            />
          </div>
        )}
      </div>
      <div className={styles.stepContent}>
        <h3 className={styles.stepTitle}>{title}</h3>
        <p className={styles.stepDescription}>{description}</p>
      </div>
    </motion.div>
  )
}

const STEPS = [
  {
    title: 'Upload Your Resume',
    description:
      'Import your existing resume in any format. SkillMatch parses and structures your experience automatically.',
  },
  {
    title: 'Skills Are Extracted',
    description:
      'AI identifies your technical skills, soft skills, years of experience, and seniority level with high accuracy.',
  },
  {
    title: 'Configure Target Roles',
    description:
      'Tell SkillMatch what kinds of roles, industries, or companies you are targeting for your next position.',
  },
  {
    title: 'Market Is Analysed',
    description:
      'Real job listings are scanned and matched against your profile. Salary bands and demand data are surfaced.',
  },
  {
    title: 'Discover Opportunities',
    description:
      'Browse ranked opportunities with match scores. See exactly why each role is a strong or weak fit.',
  },
  {
    title: 'Track Applications',
    description:
      'Log applications, set follow-up reminders, and monitor outcomes across every company you apply to.',
  },
] as const

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className={styles.root} aria-labelledby="how-heading">
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.badge}>Process</span>
          <h2 id="how-heading" className={styles.title}>
            From resume to offer in six steps
          </h2>
          <p className={styles.subtitle}>
            SkillMatch guides you from raw resume to qualified opportunity in a structured, repeatable
            workflow.
          </p>
        </div>
        <motion.div
          className={styles.steps}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {STEPS.map((step, index) => (
            <StepCard
              key={step.title}
              number={index + 1}
              title={step.title}
              description={step.description}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
