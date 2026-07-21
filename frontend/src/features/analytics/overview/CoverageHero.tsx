import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ArrowRight, ArrowDown, Lightbulb, CheckCircle2, ChevronRight, BookOpen, Sparkles, Info, FileText } from 'lucide-react'
import styles from './CoverageHero.module.css'
import { getCoverageCategory, type CoverageCategory } from '../utils'
import type { LearningRoadmapItem } from '@/hooks/useCareerAnalytics'

interface CoverageHeroProps {
  coverage: number
  resumeStatus: string
  learningRoadmap: LearningRoadmapItem[]
}

export function CoverageHero({ coverage, resumeStatus, learningRoadmap }: CoverageHeroProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const category: CoverageCategory = getCoverageCategory(coverage)

  const topSkills = useMemo(() => learningRoadmap.slice(0, 3), [learningRoadmap])
  const remainingCount = Math.max(0, learningRoadmap.length - 3)
  const topSkill = topSkills.length > 0 ? topSkills[0] : null

  const hoveredSkill = hoveredIndex !== null ? topSkills[hoveredIndex] : null
  const projectedGain = hoveredSkill ? hoveredSkill.estimatedCoverageGain : 0
  const missing = Math.max(0, 100 - coverage - projectedGain)
  const projectedCategory: CoverageCategory = getCoverageCategory(coverage + projectedGain)

  const donutData = useMemo(() => [
    { name: 'Covered', value: coverage, fill: 'var(--color-brand)' },
    { name: 'Projected', value: projectedGain, fill: 'var(--color-success)' },
    { name: 'Missing', value: missing, fill: 'var(--surface-highlight)' },
  ], [coverage, projectedGain, missing])

  const scrollToRoadmap = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    document.querySelector('#learning-roadmap')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className={styles.hero}>
      <div className={styles.mainGrid}>
        
        {/* LEFT COLUMN: Summary */}
        <div className={styles.summaryCol}>
          <div className={styles.header}>
            <h1 className={styles.title}>Career Readiness Report</h1>
            <p className={styles.subtitle}>Personalized insights based on your resume, skills, and target roles.</p>
          </div>

          <div className={styles.metricsGrid}>
            {/* Market Readiness */}
            <div className={styles.metricBlock}>
              <div className={styles.metricGroupRow}>
                <span className={styles.metricValueHuge} data-category={category}>
                  {Math.round(coverage)}%
                </span>
                <span className={styles.categoryPill} data-category={category}>
                  {category}
                </span>
              </div>
              <div className={styles.metricLabelRow}>
                <span className={styles.metricLabel}>Market Readiness</span>
                <Info size={14} className={styles.infoIcon} />
              </div>
              <p className={styles.metricDesc}>
                You currently satisfy approximately {Math.round(coverage)}% of the weighted market demand across your selected target roles.
              </p>
            </div>

            {/* Resume */}
            <div className={styles.metricBlock}>
              <div className={styles.resumeLabelRow}>
                <FileText size={16} className={styles.resumeIcon} />
                <span className={styles.metricLabel}>Resume Status</span>
              </div>
              <span className={styles.metricValueLarge} data-status={resumeStatus}>
                {resumeStatus}
              </span>
              <p className={styles.metricDesc}>
                {resumeStatus === 'Resume Synced' 
                  ? 'Your active resume perfectly aligns with your profile skills.' 
                  : 'Updating your active resume will improve recruiter visibility.'}
              </p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Visualization */}
        <div className={styles.chartCol}>
          <div className={styles.chartHint}>
            <Sparkles size={14} className={styles.hintIcon} />
            <span>Hover a recommended skill to preview your projected market coverage.</span>
          </div>
          
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius="75%"
                  outerRadius="95%"
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={500}
                  animationEasing="ease-out"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className={styles.chartCenter}>
              {hoveredSkill ? (
                <div className={styles.projectedCenter}>
                  <span className={styles.chartValueSmall}>CURRENT</span>
                  <span className={styles.chartValueCenter} data-category={category}>{Math.round(coverage)}%</span>
                  <ArrowDown size={16} className={styles.projectedArrow} />
                  <span className={styles.chartValueSmall}>PROJECTED</span>
                  <span className={styles.chartValueProjected} data-category={projectedCategory}>{Math.round(coverage + projectedGain)}%</span>
                </div>
              ) : (
                <div className={styles.defaultCenter}>
                  <span className={styles.chartValueSmall}>CURRENT</span>
                  <span className={styles.chartValueHugeCenter} data-category={category}>{Math.round(coverage)}%</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: 'var(--color-brand)' }} />
              <span>Current Coverage ({Math.round(coverage)}%)</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: 'var(--surface-highlight)' }} />
              <span>Gap ({100 - Math.round(coverage)}%)</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recommendations */}
        <div className={styles.recsCol}>
          <div className={styles.rightHeader}>
            <h3 className={styles.rightTitle}>Top Skills to Improve</h3>
          </div>
          
          {topSkills.length > 0 ? (
            <div className={styles.recommendationList}>
              {topSkills.map((skill, index) => (
                <div 
                  key={skill.skillName} 
                  className={styles.recCard}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  data-hovered={hoveredIndex === index}
                  data-dimmed={hoveredIndex !== null && hoveredIndex !== index}
                >
                  <div className={styles.recRank}>{index + 1}</div>
                  <div className={styles.recContent}>
                    <div className={styles.recTop}>
                      <span className={styles.recName}>{skill.skillName}</span>
                      <span className={styles.recGain}>+{skill.estimatedCoverageGain.toFixed(1)}%</span>
                    </div>
                    <div className={styles.recBottom}>
                      <span className={styles.recImpact}>
                        {skill.marketImportance >= 8 ? 'High Impact' : skill.marketImportance >= 5 ? 'Medium Impact' : 'Low Impact'}
                      </span>
                    </div>
                    <div className={styles.recProgressBar}>
                      <div 
                        className={styles.recProgressFill} 
                        style={{ 
                          width: `${Math.min(100, (skill.estimatedCoverageGain / 15) * 100)}%`,
                          background: hoveredIndex === index ? 'var(--color-success)' : 'var(--color-brand)'
                        }}
                      />
                    </div>
                  </div>
                  <ChevronRight size={16} className={styles.recArrow} />
                </div>
              ))}
              
              {remainingCount > 0 && (
                <button className={styles.moreButton} onClick={scrollToRoadmap}>
                  <div className={styles.moreIcon}>
                    <BookOpen size={16} />
                  </div>
                  <div className={styles.moreText}>
                    <span className={styles.moreTitle}>+{remainingCount} Additional Recommendations</span>
                    <span className={styles.moreSubtitle}>View Complete Learning Roadmap &rarr;</span>
                  </div>
                </button>
              )}
            </div>
          ) : (
            <div className={styles.emptyRecommendations}>
              <p>No further skill recommendations at this time.</p>
            </div>
          )}
        </div>

        {/* BOTTOM BANNER: Next Best Action spans left and center */}
        <div className={styles.bottomBannerCol}>
          {topSkill ? (
            <div className={styles.actionCard}>
              <div className={styles.actionLeft}>
                <div className={styles.actionHeader}>
                  <Lightbulb size={18} className={styles.actionIcon} />
                  <span className={styles.actionHeaderTitle}>NEXT BEST ACTION</span>
                </div>
                <span className={styles.actionSkill}>Learn {topSkill.skillName}</span>
                <p className={styles.actionExplanation}>
                  Highest impact recommendation for your selected roles.
                </p>
              </div>
              <div className={styles.actionMiddle}>
                <span className={styles.gainLabel}>ESTIMATED GAIN</span>
                <span className={styles.gainValue}>+{topSkill.estimatedCoverageGain.toFixed(1)}%</span>
              </div>
              <div className={styles.actionRight}>
                <button onClick={scrollToRoadmap} className={styles.actionButton}>
                  View Learning Roadmap <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.actionCardEmpty}>
              <CheckCircle2 size={24} className={styles.successIcon} />
              <div className={styles.actionEmptyText}>
                <span className={styles.actionSkill}>Market Ready</span>
                <p className={styles.actionExplanation}>
                  You're already covering the major market requirements for your selected roles.
                </p>
              </div>
            </div>
          )}
          
          <div className={styles.footerNote}>
            <Lightbulb size={14} className={styles.footerIcon} />
            <span>Recommendations are based on market demand, importance, and your current profile coverage.</span>
          </div>
        </div>

      </div>
    </section>
  )
}
