import {
  LayoutDashboard,
  FileText,
  Briefcase,
  ClipboardList,
  BarChart2,
  Building2,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROUTES } from '@/constants/routes'

export interface NavItem {
  id: string
  title: string
  icon: LucideIcon
  route: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard, route: ROUTES.DASHBOARD },
  { id: 'resumes', title: 'Resumes', icon: FileText, route: ROUTES.RESUMES },
  { id: 'opportunities', title: 'Opportunities', icon: Briefcase, route: ROUTES.OPPORTUNITIES },
  { id: 'applications', title: 'Applications', icon: ClipboardList, route: ROUTES.APPLICATIONS },
  { id: 'analytics', title: 'Analytics', icon: BarChart2, route: ROUTES.ANALYTICS },
  { id: 'companies', title: 'Companies', icon: Building2, route: ROUTES.COMPANIES },
  { id: 'profile', title: 'Profile', icon: User, route: ROUTES.PROFILE },
]
