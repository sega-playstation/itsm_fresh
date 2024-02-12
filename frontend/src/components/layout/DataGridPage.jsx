import { Outlet } from 'react-router-dom';
import { Button, Stack, Typography as T } from '@mui/joy';
import useNavigateParams from '@/hooks/useNavigateParams';

export default function DataGridPage({
  title,
  disableActionButton,
  ActionIcon,
  actionLabel,
  actionTo,
  element,
}) {
  const navigateSearch = useNavigateParams();
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between"
        gap={1}
        sx={{ my: 1, mb: '30px' }}
      >
        <T level="h2">{title}</T>
        {!disableActionButton && (
          <Button
            color="primary"
            startDecorator={<ActionIcon />}
            size="sm"
            onClick={() => navigateSearch(actionTo)}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
      {element}
      <Outlet />
    </>
  );
}
