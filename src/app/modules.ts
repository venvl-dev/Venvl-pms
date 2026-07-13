import type { LucideIcon } from 'lucide-react'
import type { Role } from '@/types/domain'
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  MessageCircle,
  Building2,
  Share2,
  Globe,
  Settings,
} from 'lucide-react'

export type ModuleGroup = 'Operations' | 'Distribution' | 'Admin'
export const MODULE_GROUP_ORDER: ModuleGroup[] = ['Operations', 'Distribution', 'Admin']

export interface ModuleDef {
  key: string
  title: string
  path: string
  icon: LucideIcon
  group: ModuleGroup
  roles: Role[]
}

const STAFF: Role[] = ['platform_super_admin', 'org_admin', 'manager']
const FRONT: Role[] = [...STAFF, 'front_desk']


export const MODULES: ModuleDef[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    group: 'Operations',
    roles: [...FRONT, 'housekeeping', 'owner'],
  },
  {
    key: 'calendar',
    title: 'Multi-calendar',
    path: '/calendar',
    icon: CalendarDays,
    group: 'Operations',
    roles: [...FRONT, 'housekeeping'],
  },
  {
    key: 'reservations',
    title: 'Reservations',
    path: '/reservations',
    icon: CalendarCheck,
    group: 'Operations',
    roles: FRONT,
  },
  
  {
    key: 'properties',
    title: 'Properties',
    path: '/properties',
    icon: Building2,
    group: 'Distribution',
    roles: STAFF,
  },
  {
    key: 'channels',
    title: 'Channel Manager',
    path: '/channels',
    icon: Share2,
    group: 'Distribution',
    roles: STAFF,
  },
  {
    key: 'booking-sites',
    title: 'Booking Sites',
    path: '/booking-sites',
    icon: Globe,
    group: 'Distribution',
    roles: ['platform_super_admin', 'org_admin'],
  },
  {
    key: 'settings',
    title: 'Settings',
    path: '/settings',
    icon: Settings,
    group: 'Admin',
    roles: ['platform_super_admin', 'org_admin'],
  },
]

export const DEMO_ROLE: Role = 'org_admin'

export interface NavSection {
  group: ModuleGroup
  modules: ModuleDef[]
}

export function visibleModules(role: Role): ModuleDef[] {
  return MODULES.filter((m) => m.roles.includes(role))
}

export function sectionsFor(role: Role): NavSection[] {
  const visible = visibleModules(role)
  return MODULE_GROUP_ORDER.map((group) => ({
    group,
    modules: visible.filter((m) => m.group === group),
  })).filter((s) => s.modules.length > 0)
}


export function findModuleByPath(pathname: string): ModuleDef | undefined {
  const exact = MODULES.find((m) => m.path === pathname)
  if (exact) return exact
  return MODULES.filter((m) => m.path !== '/' && pathname.startsWith(`${m.path}/`)).sort((a, b) => b.path.length - a.path.length)[0]
}