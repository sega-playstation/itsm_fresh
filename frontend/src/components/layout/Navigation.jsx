import React, { useContext } from 'react';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Option,
  Select,
  Stack,
  Typography as T,
} from '@mui/joy';
import { Link as RouterLink } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { mainMenus, userMenu } from '@/config/menus';
import UserContext from '../UserContext';
// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HubIcon from '@mui/icons-material/Hub';

// Styles
import { listItemButtonClasses } from '@mui/material';
import ColorSchemeToggle from './ColorSchemeToggle';
import { UserRole } from '@/utils/enums';
import { useCourses } from '@/hooks/query/courses/useCourses';

function Toggler({ defaultExpanded = false, renderToggle, children }) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          'display': 'grid',
          'gridTemplateRows': open ? '1fr' : '0fr',
          'transition': '0.2s ease',
          '& > *': {
            overflow: 'hidden',
          },
        }}
      >
        {children}
      </Box>
    </>
  );
}

function EnvironmentIndicator() {
  // TODO: It would be best to get this from the backend
  let deployEnv = 'production';

  if (
    ['localhost', '127.0.0.1', '', '::1'].includes(window.location.hostname)
  ) {
    deployEnv = 'local';
  } else if (window.location.hostname.split('.')[0] === 'staging') {
    deployEnv = 'staging';
  }

  return (
    deployEnv !== 'production' && (
      <T
        level="title-lg"
        color={deployEnv === 'staging' ? 'warning' : 'success'}
        variant="solid"
        sx={{
          margin: '-16px -16px 0 -16px',
          padding: '4px',
          borderRadius: 0,
          textAlign: 'center',
          textTransform: 'capitalize',
        }}
      >
        {deployEnv}
      </T>
    )
  );
}

export default function Navigation() {
  const { user, selectedCourse, setSelectedCourse } = useContext(UserContext);
  const { status, data } = useCourses();

  const handleChange = (e, newValue) => setSelectedCourse(newValue);

  return (
    <>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <EnvironmentIndicator />
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton
            component={RouterLink}
            to="/"
            variant="soft"
            color="primary"
            size="sm"
          >
            <HubIcon />
          </IconButton>
          <T level="title-lg" sx={{ userSelect: 'none' }}>
            ITSM
          </T>
          <ColorSchemeToggle sx={{ ml: 'auto' }} />
        </Stack>
        <Box
          sx={{
            display: 'flex',
            overflow: 'hidden auto',
            flexDirection: 'column',
            flexGrow: 1,
            [`& .${listItemButtonClasses.root}`]: {
              gap: 1.5,
            },
          }}
        >
          <List
            size="sm"
            sx={{
              'gap': 1,
              '--List-nestedInsetStart': '30px',
              // "--ListItem-radius": (theme) => theme.vars.radius.sm,
              '--ListItem-radius': '8px',
            }}
          >
            {mainMenus
              .filter((menu) =>
                menu.allowedRoles
                  ? menu.allowedRoles.includes(user.roleId)
                  : true,
              )
              .map((menu) =>
                menu.submenu ? (
                  <ListItem key={`menu-${menu.label}`} nested>
                    <Toggler
                      renderToggle={({ open, setOpen }) => (
                        <ListItemButton onClick={() => setOpen(!open)}>
                          <menu.Icon fontSize="small" />
                          <ListItemContent sx={{ userSelect: 'none' }}>
                            <T level="title-sm">{menu.label}</T>
                          </ListItemContent>
                          <KeyboardArrowDownIcon
                            sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                          />
                        </ListItemButton>
                      )}
                    >
                      <List sx={{ gap: 0.5 }}>
                        {menu.submenu
                          .filter((submenu) =>
                            submenu.allowedRoles
                              ? submenu.allowedRoles.includes(user.roleId)
                              : true,
                          )
                          .map((submenu, index) => (
                            <ListItem
                              key={`menu-${menu.label}-submenu-${submenu.label}`}
                              sx={{ mt: index === 0 ? 0.5 : 0 }}
                            >
                              <NavLink
                                to={submenu.path}
                                style={{
                                  display: 'block',
                                  textDecoration: 'none',
                                  width: '100%',
                                }}
                              >
                                {({ isActive }) => (
                                  <ListItemButton selected={isActive}>
                                    {submenu.label}
                                  </ListItemButton>
                                )}
                              </NavLink>
                            </ListItem>
                          ))}
                      </List>
                    </Toggler>
                  </ListItem>
                ) : (
                  <ListItem key={menu.label}>
                    <NavLink
                      to={menu.path}
                      style={{
                        display: 'block',
                        textDecoration: 'none',
                        width: '100%',
                      }}
                    >
                      {({ isActive }) => (
                        <ListItemButton selected={isActive}>
                          <ListItemDecorator>
                            <menu.icon fontSize="small" />
                          </ListItemDecorator>
                          <ListItemContent>
                            <T level="title-sm">{menu.label}</T>
                          </ListItemContent>
                        </ListItemButton>
                      )}
                    </NavLink>
                  </ListItem>
                ),
              )}
          </List>
          <List
            size="sm"
            sx={{
              'mt': 'auto',
              'flexGrow': 0,
              '--ListItem-radius': (theme) => theme.vars.radius.sm,
              'gap': 0.5,
              // mb: 2,
            }}
          >
            {userMenu.map((item) => (
              <ListItem key={`userMenu-${item.label}`}>
                <NavLink
                  to={item.path}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    width: '100%',
                  }}
                >
                  {({ isActive }) => (
                    <ListItemButton selected={isActive}>
                      <ListItemDecorator>
                        <item.Icon fontSize="small" />
                      </ListItemDecorator>
                      <ListItemContent sx={{ userSelect: 'none' }}>
                        {item.label}
                      </ListItemContent>
                    </ListItemButton>
                  )}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
        <Stack direction="row" gap={1} alignItems="center">
          <Avatar size="sm" variant="solid" />
          <Box>
            <T level="title-sm">{user.firstName + ' ' + user.lastName}</T>
            <T level="body-xs">{user.email}</T>
          </Box>
        </Stack>
        {user.roleId === UserRole.INSTRUCTOR && (
          <Select
            value={selectedCourse}
            onChange={handleChange}
            size="sm"
            sx={{ width: '100%' }}
            slotProps={{
              listbox: {
                placement: 'top-start',
              },
            }}
          >
            {status !== 'pending' &&
              data
                .filter((course) => user.courseId.includes(course.id))
                .map((course) => (
                  <Option key={course.id} value={course.id}>
                    {course.section} - {course.name}
                  </Option>
                ))}
          </Select>
        )}
      </Box>
    </>
  );
}
