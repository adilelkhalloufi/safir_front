import { webRoutes } from '@/routes/web'
import {
  IconBrandMedium,
  IconLayoutDashboard,
  IconSettings,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: webRoutes.Dashboard,
    icon: <IconLayoutDashboard size={18} />,
  },





  {
    title: 'Settings',
    label: '',
    href: '',
    icon: <IconSettings size={18} />,
    sub: [
      {
        title: 'clear',
        label: '',
        href: webRoutes.clear,
        icon: <IconBrandMedium size={18} />,
      },
     

    ],
  },
]
