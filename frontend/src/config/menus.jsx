import { UserRole } from '@/utils/enums';

import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import InventoryIcon from '@mui/icons-material/Inventory';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HomeRepairServiceRoundedIcon from '@mui/icons-material/HomeRepairServiceRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const mainMenus = [
  {
    label: 'Incident Management',
    Icon: WarningIcon,
    submenu: [
      {
        path: '/incident/new',
        label: 'New Incident',
      },
      {
        path: '/incident/all',
        label: 'All Incident Tickets',
      },
      {
        path: '/incident/open',
        label: 'Open Incident Tickets',
      },
      {
        path: '/incident/resolved',
        label: 'Resolved Incident Tickets',
      },
    ],
  },
  {
    path: '/problems',
    label: 'Problem Management',
    Icon: ReportIcon,
    submenu: [
      {
        path: '/problem/new',
        label: 'New Problem',
      },
      {
        path: '/problem/all',
        label: 'Problem Ticket List',
      },
      {
        path: '/problem/open',
        label: 'Open Problem Tickets',
      },
      {
        path: '/problem/resolved',
        label: 'Resolved Problem Tickets',
      },
    ],
  },
  {
    path: '/assets',
    label: 'Asset Management',
    Icon: InventoryIcon,
    submenu: [
      {
        path: '/assets',
        label: 'Assets',
      },
    ],
  },
  {
    path: '/changes',
    label: 'Change Management',
    Icon: SwapHorizontalCircleIcon,
    submenu: [
      {
        path: '/change/new',
        label: 'New Change Request',
      },
      {
        path: '/change/all',
        label: 'Change Request List',
      },
      {
        path: '/change/pending',
        label: 'Pending Request List',
      },
      {
        path: '/change/approved',
        label: 'Approved Request List',
      },
    ],
  },
  {
    path: '/users',
    label: 'User Management',
    Icon: ManageAccountsIcon,
    submenu: [
      {
        path: '/users',
        label: 'Users',
        allowedRoles: [UserRole.ADMIN],
      },
      {
        path: '/classlist',
        label: 'Classlist',
        allowedRoles: [UserRole.STUDENT, UserRole.INSTRUCTOR],
      },
      {
        path: '/sections',
        label: 'Sections',
        allowedRoles: [UserRole.ADMIN],
      },
      {
        path: '/account-requests',
        label: 'Account Requests',
        allowedRoles: [UserRole.ADMIN],
      },
    ],
  },
  {
    path: '/manage',
    label: 'Tools',
    Icon: HomeRepairServiceRoundedIcon,
    allowedRoles: [UserRole.ADMIN],
    submenu: [
      {
        path: '/import',
        label: 'Import',
      },
      {
        path: '/export',
        label: 'Export',
      },
    ],
  },
];

const userMenu = [
  // {
  //   path: '/settings',
  //   label: 'Settings',
  //   Icon: SettingsRoundedIcon,
  // },
  {
    path: '/auth/logout',
    label: 'Logout',
    Icon: LogoutRoundedIcon,
  },
];

export { mainMenus, userMenu };
