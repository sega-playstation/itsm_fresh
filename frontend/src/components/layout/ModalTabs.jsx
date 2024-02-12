import { Children, cloneElement, isValidElement } from 'react';
import { Tab, TabList, TabPanel, Tabs, styled } from '@mui/joy';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const StyledTabPanel = styled(TabPanel)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.body,
  overflowY: 'auto',
}));

function ModalTabs({ errors, children }) {
  let tabsWithErrors = [];

  if (errors) {
    tabsWithErrors = Children.toArray(children).reduce((acc, child) => {
      if (!isValidElement(child)) {
        return acc;
      }

      const inputs = Children.toArray(child.props.children);

      if (
        inputs.some(function hasInputError(element) {
          // We're making sure it's a valid React element and checking if the `name` prop is in the errors object
          if (!isValidElement(element)) {
            return false;
          }
          if (errors[element.props.name]) {
            return true;
          }

          // Otherwise we check to see if the element has children and if so, perform recursion
          return (
            Array.isArray(element.props.children) &&
            element.props.children.some(hasInputError)
          );
        })
      ) {
        return [...acc, child.props.label];
      }

      return acc;
    }, []);
  }

  return (
    <Tabs
      size="sm"
      sx={{
        height: '100%',
      }}
    >
      <TabList>
        {children.map((tab, index) => {
          const hasErrors = tabsWithErrors.includes(tab.props.label);
          return (
            <Tab
              key={`tab-${index}`}
              value={index}
              color={hasErrors ? 'danger' : 'neutral'}
            >
              {hasErrors && <InfoOutlinedIcon fontSize="small" />}
              {tab.props.label}
            </Tab>
          );
        })}
      </TabList>
      {Children.map(children, (tab, index) =>
        cloneElement(tab, { value: index })
      )}
    </Tabs>
  );
}

ModalTabs.Tab = StyledTabPanel;
export default ModalTabs;
