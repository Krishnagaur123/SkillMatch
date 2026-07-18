import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import styles from './CallToActionSection.module.css'

export default function CallToActionSection() {
  return (
    <section className={styles.root} aria-labelledby="cta-heading">
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 id="cta-heading" className={styles.title}>
            Ready to take control of your career?
          </h2>
          <p className={styles.subtitle}>
            Join SkillMatch and start measuring your opportunity match, discovering skill gaps, and
            tracking your applications — all in one place.
          </p>
          <div className={styles.actions}>
            <Link
              to={`${ROUTES.AUTH}?mode=signup`}
              className={styles.primaryBtn}
            >
              Sign Up
              <ArrowRight size={20} className={styles.btnIcon} />
            </Link>
            <motion.a
              href="#features"
              className={styles.secondaryBtn}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById('features')
                if (el) {
                  const offset = 72
                  const elementPosition = el.getBoundingClientRect().top
                  const offsetPosition = elementPosition + window.scrollY - offset
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                  })
                }
              }}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.15 }}
            >
              Explore Features
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
