import { DialogTitle, Divider, ModalClose, ModalDialog } from '@mui/joy';
import ScrollableModal from '@/components/joy/ScrollableModal';
import { Helmet } from 'react-helmet-async';
import useNavigateParams from '@/hooks/useNavigateParams';

export default function ModalPage({
  title = '',
  Icon,
  nested = false,
  alertDialog = false,
  color = 'primary',
  closeTo,
  Component,
  ...props
}) {
  const nav = useNavigateParams();
  const navClose = () => nav(closeTo);

  let width = '650px';
  let height = '500px';

  if (nested) {
    width = '500px';
    height = '600px';
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ScrollableModal
        open={true}
        onClose={(e, reason) => {
          if (reason !== 'backdropClick') navClose();
        }}
      >
        <ModalDialog
          variant="outlined"
          color={color}
          size="sm"
          sx={
            alertDialog
              ? {}
              : {
                  width: width,
                  height: height,
                }
          }
        >
          <ModalClose />
          <DialogTitle>
            {Icon && <Icon />}
            {title}
          </DialogTitle>
          <Divider />
          <Component
            color={color}
            handleClose={navClose}
            closeTo={closeTo}
            {...props}
          />
        </ModalDialog>
      </ScrollableModal>
    </>
  );
}
