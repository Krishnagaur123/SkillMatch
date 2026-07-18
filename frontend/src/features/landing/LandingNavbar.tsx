import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AppBrand } from '@/components/navigation'
import { ROUTES } from '@/constants/routes'
import styles from './LandingNavbar.module.css'

const NAV_LINKS = [
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'how-it-works', label: 'How it Works', href: '#how-it-works' },
  { id: 'tech-stack', label: 'Tech Stack', href: '#tech-stack' },
] as const

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const targetId = location.hash.replace('#', '')
      const el = document.getElementById(targetId)
      if (el) {
        const t = setTimeout(() => {
          const offset = 72
          const elementPosition = el.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.scrollY - offset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }, 120)
        return () => clearTimeout(t)
      }
    }
  }, [location])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)

      // Simple ScrollSpy active section detection
      const offsets = NAV_LINKS.map((link) => {
        const el = document.getElementById(link.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // Check if top of section is near or above middle screen
          return { id: link.id, top: rect.top + window.scrollY, height: rect.height }
        }
        return null
      }).filter(Boolean) as Array<{ id: string; top: number; height: number }>

      const scrollPos = window.scrollY + 100 // add offset
      const current = offsets.find(
        (sec) => scrollPos >= sec.top && scrollPos < sec.top + sec.height
      )
      setActiveSection(current ? current.id : '')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileOpen(false)

    if (location.pathname !== '/') {
      e.preventDefault()
      navigate('/#' + targetId)
      return
    }

    e.preventDefault()
    const el = document.getElementById(targetId)
    if (el) {
      const offset = 72 // sticky navbar height
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <nav
      className={[styles.root, scrolled ? styles.scrolled : ''].join(' ')}
      aria-label="Main navigation"
    >
      <div className={styles.inner}>
        <Link to={ROUTES.LANDING} className={styles.brand} aria-label="SkillMatch home">
          <AppBrand />
        </Link>

        <ul className={styles.links} role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className={[
                  styles.link,
                  activeSection === link.id ? styles.linkActive : '',
                ].join(' ')}
                onClick={(e) => handleLinkClick(e, link.id)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Link
            to={`${ROUTES.AUTH}?mode=signin`}
            className={styles.ctaBtn}
            aria-label="Login"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          className={styles.mobileToggle}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          <ul className={styles.mobileLinks} role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={[
                    styles.mobileLink,
                    activeSection === link.id ? styles.mobileLinkActive : '',
                  ].join(' ')}
                  onClick={(e) => handleLinkClick(e, link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Link to={`${ROUTES.AUTH}?mode=signin`} className={styles.mobileCta}>
            Login
          </Link>
        </div>
      )}
    </nav>
  )
}
