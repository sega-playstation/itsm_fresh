import LabelText from '@/components/joy/LabelText';
import ModalTabs from '@/components/layout/ModalTabs';
import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListSubheader,
  Sheet,
  Stack,
} from '@mui/joy';
import { startCase, toLower, groupBy } from 'lodash';
import useNavigateParams from '@/hooks/useNavigateParams';
import { Outlet, useParams } from 'react-router-dom';
import { useChange } from '@/hooks/query/changes/useChange';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import NavigateParams from '@/components/NavigateParams';
import { useContext } from 'react';
import UserContext from '@/components/UserContext';
// import { ChangeStatus } from '@/utils/enums';

export default function ChangeView({ type, color, handleClose, closeTo }) {
  const { selectedCourse } = useContext(UserContext);
  const navigate = useNavigateParams();
  const { changeId, dependencyId } = useParams();
  const { status, data } = useChange(
    type === 'dependency' ? dependencyId : changeId,
    selectedCourse,
  );

  if (status === 'pending') return <LoadingSpinner />;
  if (status === 'error') return <NavigateParams to={closeTo} />;

  const groupedChange = groupBy(data.change_dependencies_details, 'category');

  return (
    <>
      <DialogContent sx={{ padding: '0 !important' }}>
        <ModalTabs>
          <ModalTabs.Tab label="General">
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <LabelText label="Change Name">{data.change_name}</LabelText>
              <LabelText label="Serial Number">{data.serial_number}</LabelText>
              <LabelText label="Category">
                {startCase(toLower(data.category))}
              </LabelText>
              <LabelText label="Status">
                {startCase(
                  toLower(
                    Object.keys(ChangeStatus).find(
                      (key) => ChangeStatus[key] === data.status,
                    ),
                  ),
                )}
              </LabelText>
              <LabelText label="Location">{data.location}</LabelText>
              <LabelText label="IP Address">{data.ip_address}</LabelText>
              <LabelText label="Description">{data.description}</LabelText>
            </Stack>
          </ModalTabs.Tab>
          <ModalTabs.Tab label="License">
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <LabelText label="Vendor Name">{data.vendor_name}</LabelText>
              <LabelText label="Product Name">{data.product_name}</LabelText>
              <LabelText label="Current Version">
                {data.current_version}
              </LabelText>
              <LabelText label="License Name">{data.license_name}</LabelText>
              <LabelText label="License Type">{data.license_type}</LabelText>
              <LabelText label="Vendor Support">
                {data.vendor_support?.toString()}
              </LabelText>
              <LabelText label="License Cost">{data.license_cost}</LabelText>
            </Stack>
          </ModalTabs.Tab>
          <ModalTabs.Tab label="Dependencies">
            <Sheet
              variant="outlined"
              sx={{
                height: '100%',
                overflowY: 'auto',
                borderRadius: 'sm',
                boxShadow:
                  'var(--joy-shadowRing, 0 0 #000),0px 1px 2px 0px rgba(var(--joy-shadowChannel, 21 21 21) / var(--joy-shadowOpacity, 0.08))',
              }}
            >
              <List size="sm" name="change_dependencies" label="Changes">
                {Object.entries(groupedChanges).map(
                  ([cat, changes], catIndex) => (
                    <ListItem nested key={catIndex}>
                      <ListSubheader sticky>{cat}</ListSubheader>
                      <List>
                        {changes.map((change, changeIndex) => (
                          <ListItem key={changeIndex}>
                            {type === 'dependency' ? (
                              <ListItemContent>
                                {change.change_name}
                              </ListItemContent>
                            ) : (
                              <ListItemButton
                                sx={{ userSelect: 'none' }}
                                disabled={type === 'dependency'}
                                onClick={() =>
                                  navigate('dependency/' + change.id)
                                }
                              >
                                {change.change_name}
                              </ListItemButton>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </ListItem>
                  ),
                )}
              </List>
            </Sheet>
          </ModalTabs.Tab>
        </ModalTabs>
      </DialogContent>
      <Divider inset="context" />
      <DialogActions buttonFlex="none">
        <Button variant="solid" color="neutral" onClick={handleClose} size="sm">
          Close
        </Button>
      </DialogActions>
      <Outlet />
    </>
  );
}
