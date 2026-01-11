import { webRoutes } from '@/routes/web';
import {
  IconLayoutDashboard,
  IconSettings,
  IconCalendar,
  IconUsers,
  IconUserCog,
  IconMassage,
  IconHome,
  IconCreditCard,
} from '@tabler/icons-react';

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: webRoutes.Dashboard,
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Bookings',
    label: '',
    href: webRoutes.bookings.index,
    icon: <IconCalendar size={18} />,
  },
  {
    title: 'Clients',
    label: '',
    href: webRoutes.clients.index,
    icon: <IconUsers size={18} />,
  },
  // {
  //   title: 'Subscriptions',
  //   label: '',
  //   href: webRoutes.subscriptions.index,
  //   icon: <IconTicket size={18} />,
  // },
  // {
  //   title: 'Health Forms',
  //   label: '',
  //   href: webRoutes.healthForms.index,
  //   icon: <IconClipboardCheck size={18} />,
  // },
  {
    title: 'Staff',
    label: '',
    href: webRoutes.staff.index,
    icon: <IconUserCog size={18} />,
  },
  {
    title: 'Services',
    label: '',
    href: webRoutes.services.index,
    icon: <IconMassage size={18} />,
  },
  {
    title: 'Resources',
    label: '',
    href: webRoutes.resources.index,
    icon: <IconHome size={18} />,
  },
  // {
  //   title: 'Hammam Sessions',
  //   label: '',
  //   href: webRoutes.hammamSessions.index,
  //   icon: <IconSwimming size={18} />,
  // },
  {
    title: 'Payments',
    label: '',
    href: webRoutes.payments.index,
    icon: <IconCreditCard size={18} />,
  },
  // {
  //   title: 'Reports',
  //   label: '',
  //   href: webRoutes.reports.index,
  //   icon: <IconChartBar size={18} />,
  // },
  {
    title: 'Settings',
    label: '',
    href: '',
    icon: <IconSettings size={18} />,
    sub: [
      {
        title: 'Type Services',
        href: webRoutes.typeServices.index,
        icon: <IconMassage size={18} />,
      },
      {
        title: 'Type Resources',
        href: webRoutes.typeResources.index,
        icon: <IconHome size={18} />,
      },
      // {
      //   title: 'types of Resources',
      //   href: webRoutes.settings.typeResources,
      //   icon: <IconHome size={18} />,
      // },
      {
        title: 'General Settings',
        href: webRoutes.settings.index,
        icon: <IconUserCog size={18} />,
      }
    ],
  },

];
