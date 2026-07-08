import {
  BarChart2,
  Briefcase,
  Brain,
  ClipboardList,
  FileSearch,
  Map,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import styles from './FeaturesSection.module.css'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-label={`Learn more about ${title}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div className={styles.cardIcon} aria-hidden="true">
        <Icon size={22} className={styles.iconElement} />
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </motion.div>
  )
}

const FEATURES: FeatureCardProps[] = [
  {
    icon: FileSearch,
    title: 'Resume Intelligence',
    description:
      'Automatically extract and structure your skills, experience, and qualifications from any resume format.',
  },
  {
    icon: Briefcase,
    title: 'Opportunity Matching',
    description:
      'Surface job opportunities ranked by compatibility with your unique skill profile and career goals.',
  },
  {
    icon: BarChart2,
    title: 'Career Analytics',
    description:
      'Visualise your career trajectory, skill growth, and market demand trends in one unified dashboard.',
  },
  {
    icon: Brain,
    title: 'Skill Gap Analysis',
    description:
      'Instantly identify which skills are missing for your target roles and how far you are from qualifying.',
  },
  {
    icon: Map,
    title: 'Learning Roadmap',
    description:
      'Get a personalised, prioritised learning plan that bridges the gap between your current and target skill set.',
  },
  {
    icon: ClipboardList,
    title: 'Application Tracking',
    description:
      'Organise every application in one place. Track status, follow-ups, and outcomes across all opportunities.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export default function FeaturesSection() {
  return (
    <section id="features" className={styles.root} aria-labelledby="features-heading">
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.badge}>Capabilities</span>
          <h2 id="features-heading" className={styles.title}>
            Everything you need to accelerate your career
          </h2>
          <p className={styles.subtitle}>
            SkillMatch combines AI-powered analysis with real market data to give you a complete
            picture of your career opportunities.
          </p>
        </div>
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
