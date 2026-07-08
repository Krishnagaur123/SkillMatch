import { OAUTH2_GOOGLE_URL } from '@/config/constants'
import { motion } from 'framer-motion'
import styles from './HeroSection.module.css'

function DashboardPreview() {
  return (
    <div className={styles.preview} aria-hidden="true">
      <div className={styles.previewHeader}>
        <div className={styles.previewDot} />
        <div className={styles.previewDot} />
        <div className={styles.previewDot} />
        <span className={styles.previewTitle}>skillmatch.io/dashboard</span>
      </div>
      <div className={styles.previewBody}>
        <div className={styles.previewSidebar}>
          {['Overview', 'Resumes', 'Opportunities', 'Applications', 'Roadmaps', 'Analytics'].map((item, idx) => (
            <div
              key={item}
              className={[
                styles.previewNavItem,
                idx === 0 ? styles.previewNavItemActive : '',
              ].join(' ')}
            >
              <div className={styles.previewNavDot} />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className={styles.previewMain}>
          <div className={styles.previewStatsRow}>
            {[
              { label: 'Avg Match Score', value: '87%', progress: 87, color: 'var(--accent)' },
              { label: 'Role Coverage', value: '92%', progress: 92, color: '#10b981' },
              { label: 'Applied', value: '24', sub: '+3 this week' },
            ].map((stat) => (
              <div key={stat.label} className={styles.previewStat}>
                <span className={styles.previewStatLabel}>{stat.label}</span>
                <div className={styles.previewStatValGroup}>
                  <span className={styles.previewStatValue}>{stat.value}</span>
                  {stat.sub && <span className={styles.previewStatSub}>{stat.sub}</span>}
                </div>
                {stat.progress !== undefined && (
                  <div className={styles.previewMiniProgressTrack}>
                    <div
                      className={styles.previewMiniProgressFill}
                      style={{ width: `${stat.progress}%`, backgroundColor: stat.color }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.previewContentGrid}>
            <div className={styles.previewPanel}>
              <span className={styles.previewPanelTitle}>Top Matches</span>
              <div className={styles.previewCards}>
                <div className={styles.previewCard}>
                  <div className={styles.previewCardHeader}>
                    <span className={styles.previewCardComp}>Stripe</span>
                    <span className={styles.previewCardBadge}>95% Match</span>
                  </div>
                  <div className={styles.previewCardTitle}>Senior React Architect</div>
                  <div className={styles.previewCardMeta}>Remote · Full-time · $180k–$220k</div>
                  <div className={styles.previewSkillTags}>
                    {['React', 'TypeScript', 'GraphQL'].map((s) => (
                      <span key={s} className={styles.previewSkillTag}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.previewCard}>
                  <div className={styles.previewCardHeader}>
                    <span className={styles.previewCardComp}>Linear</span>
                    <span className={[styles.previewCardBadge, styles.previewCardBadgeMid].join(' ')}>
                      82% Match
                    </span>
                  </div>
                  <div className={styles.previewCardTitle}>Staff UI Engineer</div>
                  <div className={styles.previewCardMeta}>Hybrid · Full-time · $170k–$210k</div>
                  <div className={styles.previewSkillTags}>
                    {['React', 'Design Systems', 'WebAssembly'].map((s) => (
                      <span key={s} className={styles.previewSkillTag}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.previewPanel}>
              <span className={styles.previewPanelTitle}>Skill Gaps & Roadmap</span>
              <div className={styles.previewSkillGaps}>
                <div className={styles.previewGapItem}>
                  <span className={styles.previewGapLabel}>Kubernetes</span>
                  <span className={styles.previewGapStatusMissing}>Missing Skill</span>
                </div>
                <div className={styles.previewGapItem}>
                  <span className={styles.previewGapLabel}>System Design</span>
                  <span className={styles.previewGapStatusMissing}>Missing Skill</span>
                </div>
                <div className={styles.previewGapItem}>
                  <span className={styles.previewGapLabel}>React Server Components</span>
                  <span className={styles.previewGapStatusMatched}>Matched</span>
                </div>
              </div>
              <div className={styles.previewRoadmapCard}>
                <div className={styles.previewRoadmapHeader}>
                  <span className={styles.previewRoadmapTitle}>Active Roadmap</span>
                  <span className={styles.previewRoadmapPerc}>40% done</span>
                </div>
                <span className={styles.previewRoadmapName}>Kubernetes & Cloud Deployments</span>
                <div className={styles.previewMiniProgressTrack}>
                  <div
                    className={styles.previewMiniProgressFill}
                    style={{ width: '40%', backgroundColor: 'var(--accent)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut' as const,
    },
  },
}

export default function HeroSection() {
  return (
    <section className={styles.root} aria-labelledby="hero-heading">
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.eyebrow} variants={itemVariants}>
            Career Opportunity Intelligence
          </motion.div>
          <motion.h1 id="hero-heading" className={styles.headline} variants={itemVariants}>
            Know exactly where you stand in the job market
          </motion.h1>
          <motion.p className={styles.description} variants={itemVariants}>
            SkillMatch analyses your resume, measures your match against real opportunities, surfaces
            your skill gaps, and guides you with a personalised learning roadmap — all in one
            platform.
          </motion.p>
          <motion.ul
            className={styles.bullets}
            aria-label="Key capabilities"
            variants={itemVariants}
          >
            {[
              'Measure opportunity match scores instantly',
              'Discover missing skills for your target roles',
              'Build a prioritised learning roadmap',
              'Track every application in one place',
            ].map((point) => (
              <li key={point} className={styles.bullet}>
                <span className={styles.bulletDot} aria-hidden="true" />
                {point}
              </li>
            ))}
          </motion.ul>
          <motion.div className={styles.actions} variants={itemVariants}>
            <a href={OAUTH2_GOOGLE_URL} className={styles.primaryBtn}>
              Start for Free
            </a>
            <a href="#how-it-works" className={styles.secondaryBtn}>
              See how it works
            </a>
          </motion.div>
        </motion.div>
        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  )
}
