import { Card, Stack, Typography as T, Divider } from '@mui/joy';
import { Helmet } from 'react-helmet-async';

export function CardPage({ title = '', Icon, children }) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Stack direction="column" alignItems="center">
        <img src="/images/logo.svg" height="240" />
        <Card
          variant="outlined"
          size="sm"
          sx={{
            width: { md: '500px' },
            '--Card-padding': '1rem',
            '& .MuiCardContent-root': {
              margin: '-0.5rem -1rem -0.5rem -1rem',
              padding: '0.5rem 1rem 0.5rem 1rem',
              backgroundColor: 'background.body',
            },
            '& .MuiCardActions-root': {
              padding: 'calc(0.5 * var(--Card-padding)) 0 0 0',
            },
          }}
        >
          <T level="title-md" startDecorator={Icon && <Icon />}>
            {title}
          </T>
          <Divider />
          {children}
        </Card>
      </Stack>
    </>
  );
}
