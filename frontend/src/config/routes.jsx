import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/auth/Login';
import Logout from '@/pages/auth/Logout';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import IncidentRouter from '@/pages/deprecated/incident/IncidentRouter';
import IncidentsPage from '@/pages/deprecated/incident/all';
import OpenIncidentTicketsPage from '@/pages/deprecated/incident/open';
import ResolvedIncidentTicketsPage from '@/pages/deprecated/incident/resolved';
import NewProblemPage from '@/pages/deprecated/problem/new';
import ProblemsPage from '@/pages/deprecated/problem/all';
import OpenProblemPage from '@/pages/deprecated/problem/open';
import ResolvedProblemPage from '@/pages/deprecated/problem/resolved';
import ViewProblemPage from '@/pages/deprecated/problem/problem';
import EditProblemPage from '@/pages/deprecated/problem/edit';
import ChangeRouter from '@/pages/deprecated/change/ChangeRouter';
import ChangeListRouter from '@/pages/deprecated/change/ChangeListRouter';
import Users from '@/pages/users/Users';
import NoMatch from '@/pages/NoMatch';
import Sections from '@/pages/sections/Sections';
import ModalPage from '@/components/layout/ModalPage';
import SectionForm from '@/pages/sections/modals/SectionForm';
import SectionView from '@/pages/sections/modals/SectionView';
import SectionDelete from '@/pages/sections/modals/SectionDelete';
import UserForm from '@/pages/users/modals/UserForm';
import UserView from '@/pages/users/modals/UserView';
import UserDelete from '@/pages/users/modals/UserDelete';
import AccountReview from '@/pages/users/modals/AccountReview';
import ImportPage from '@/pages/deprecated/import';
import ExportPage from '@/pages/deprecated/export';
import InstructionsPage from '@/pages/deprecated/instructions';
import Layout from '@/pages/Layout';
import AuthenticatedRoutes from '@/pages/AuthenticatedRoutes';
import Settings from '@/pages/Settings';
import AccountRequests from '@/pages/users/AccountRequests';
import RoleRoutes from '@/pages/RoleRoutes';
import Classlist from '@/pages/users/Classlist';
import AssetForm from '@/pages/assets/modals/AssetForm';
import AssetDelete from '@/pages/assets/modals/AssetDelete';
import AssetView from '@/pages/assets/modals/AssetView';
import Assets from '@/pages/assets/Assets';
import { UserRole } from '@/utils/enums';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumberedRounded';
import InventoryIcon from '@mui/icons-material/Inventory';
import LinkIcon from '@mui/icons-material/Link';

const routes = [
  {
    element: <Layout />,
    children: [
      // Auth
      {
        path: 'auth',
        children: [
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'logout',
            element: <Logout />,
          },
          {
            path: 'forgot',
            element: <ForgotPassword />,
          },
          {
            path: 'reset/:resetToken',
            element: <ResetPassword />,
          },
        ],
      },
      // 404
      {
        path: '*',
        element: <NoMatch />,
      },
      // Protected Routes
      {
        element: <AuthenticatedRoutes />,
        children: [
          // Core
          {
            path: '/dash?', // matches '/' or '/dash'
            element: <Dashboard />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
          // Incident Management
          {
            path: 'incident/all',
            element: <IncidentsPage />,
          },
          {
            path: 'incident/open',
            element: <OpenIncidentTicketsPage />,
          },
          {
            path: 'incident/resolved',
            element: <ResolvedIncidentTicketsPage />,
          },
          {
            path: 'incident/new',
            element: <IncidentRouter />,
          },
          {
            path: 'incident/view',
            element: <IncidentRouter />,
          },
          {
            path: 'incident/edit',
            element: <IncidentRouter />,
          },
          // Problem Management
          {
            path: 'problem/all',
            element: <ProblemsPage />,
          },
          {
            path: 'problem/open',
            element: <OpenProblemPage />,
          },
          {
            path: 'problem/resolved',
            element: <ResolvedProblemPage />,
          },
          {
            path: 'problem/new',
            element: <NewProblemPage />,
          },
          {
            path: 'problem/view',
            element: <ViewProblemPage />,
          },
          {
            path: 'problem/edit',
            element: <EditProblemPage />,
          },
          // Asset Management
          {
            path: '/assets',
            element: <Assets />,
            children: [
              {
                path: 'add',
                element: (
                  <ModalPage
                    title="New Asset"
                    Icon={InventoryIcon}
                    color="primary"
                    closeTo="/assets"
                    Component={AssetForm}
                    type="create"
                  />
                ),
              },
              {
                path: ':assetId',
                element: (
                  <ModalPage
                    title="View Asset"
                    Icon={InventoryIcon}
                    color="neutral"
                    closeTo="/assets"
                    Component={AssetView}
                    type="view"
                  />
                ),
                children: [
                  {
                    path: 'dependency/:dependencyId',
                    element: (
                      <ModalPage
                        title="View Dependency"
                        Icon={LinkIcon}
                        nested={true}
                        color="neutral"
                        closeTo="/assets/:assetId"
                        Component={AssetView}
                        type="dependency"
                      />
                    ),
                  },
                ],
              },
              {
                path: 'edit/:assetId',
                element: (
                  <ModalPage
                    title="Edit Asset"
                    Icon={InventoryIcon}
                    color="warning"
                    closeTo="/assets"
                    Component={AssetForm}
                    type="update"
                  />
                ),
              },
              {
                path: 'delete/:assetId',
                element: (
                  <ModalPage
                    title="Delete Asset"
                    Icon={InventoryIcon}
                    color="danger"
                    closeTo="/assets"
                    Component={AssetDelete}
                    alertDialog
                  />
                ),
              },
            ],
          },
          // Change Management
          {
            path: '/change/all',
            element: <ChangeListRouter />,
          },
          {
            path: '/change/pending',
            element: <ChangeListRouter />,
          },
          {
            path: '/change/approved',
            element: <ChangeListRouter />,
          },
          {
            path: '/change/new',
            element: <ChangeRouter />,
          },
          {
            path: '/change/view',
            element: <ChangeRouter />,
          },
          {
            path: '/change/edit',
            element: <ChangeRouter />,
          },
          // Sections
          {
            path: '/sections',
            element: <Sections />,
            children: [
              {
                path: ':sectionId',
                element: (
                  <ModalPage
                    title="View Section"
                    Icon={FormatListNumberedIcon}
                    color="neutral"
                    closeTo="/sections"
                    Component={SectionView}
                  />
                ),
              },
              {
                path: 'add',
                element: (
                  <ModalPage
                    title="New Section"
                    Icon={FormatListNumberedIcon}
                    color="primary"
                    closeTo="/sections"
                    Component={SectionForm}
                    type="create"
                  />
                ),
              },
              {
                path: 'edit/:sectionId',
                element: (
                  <ModalPage
                    title="Edit Section"
                    Icon={FormatListNumberedIcon}
                    color="warning"
                    closeTo="/sections"
                    Component={SectionForm}
                    type="update"
                  />
                ),
              },
              {
                path: 'delete/:sectionId',
                element: (
                  <ModalPage
                    title="Delete Section"
                    Icon={FormatListNumberedIcon}
                    color="danger"
                    closeTo="/sections"
                    Component={SectionDelete}
                    alertDialog
                  />
                ),
              },
            ],
          },
          // User Management
          {
            element: (
              <RoleRoutes
                allowedRoles={[UserRole.STUDENT, UserRole.INSTRUCTOR]}
              />
            ),
            children: [
              {
                path: '/classlist',
                element: <Classlist />,
              },
            ],
          },
          {
            element: <RoleRoutes allowedRoles={[UserRole.ADMIN]} />,
            children: [
              {
                path: '/users',
                element: <Users />,
                children: [
                  {
                    path: ':userId',
                    element: (
                      <ModalPage
                        title="View User"
                        Icon={PersonIcon}
                        color="neutral"
                        closeTo="/users"
                        Component={UserView}
                      />
                    ),
                  },
                  {
                    path: 'add',
                    element: (
                      <ModalPage
                        title="Add User"
                        Icon={PersonIcon}
                        color="primary"
                        closeTo="/users"
                        Component={UserForm}
                        type="create"
                      />
                    ),
                  },
                  {
                    path: 'edit/:userId',
                    element: (
                      <ModalPage
                        title="Edit User"
                        Icon={PersonIcon}
                        color="warning"
                        closeTo="/users"
                        Component={UserForm}
                        type="update"
                      />
                    ),
                  },
                  {
                    path: 'delete/:userId',
                    element: (
                      <ModalPage
                        title="Delete User"
                        Icon={PersonIcon}
                        color="danger"
                        closeTo="/users"
                        Component={UserDelete}
                        alertDialog
                      />
                    ),
                  },
                ],
              },
              {
                path: 'account-requests',
                element: <AccountRequests />,
                children: [
                  {
                    path: 'review/:userId',
                    element: (
                      <ModalPage
                        title="Review Account"
                        Icon={PersonIcon}
                        color="neutral"
                        closeTo="/account-requests"
                        Component={AccountReview}
                      />
                    ),
                  },
                ],
              },
            ],
          },
          // Tools
          {
            path: 'import',
            element: <ImportPage />,
          },
          {
            path: 'export',
            element: <ExportPage />,
          },
          {
            path: 'instructions',
            element: <InstructionsPage />,
          },
        ],
      },
    ],
  },
];

export default routes;
