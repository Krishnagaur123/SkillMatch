import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSidebar } from '@/app/providers/SidebarContext'
import Sidebar from './Sidebar'
import styles from './MobileDrawer.module.css'

export default function MobileDrawer() {
  const { drawerOpen, closeDrawer } = useSidebar()
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!drawerOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [drawerOpen, closeDrawer])

  useEffect(() => {
    if (drawerOpen) {
      drawerRef.current?.focus()
    }
  }, [drawerOpen])

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            tabIndex={-1}
            className={styles.drawer}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <Sidebar />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
