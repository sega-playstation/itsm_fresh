import { createContext, useContext, useState } from 'react';

const SnackbarContext = createContext();

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }

  return context;
}

export function SnackbarProvider({ autoHideDuration, children }) {
  const [open, setOpen] = useState(false);
  const [alertProps, setAlertProps] = useState({
    severity: 'info',
    message: '',
  });
  const [timer, setTimer] = useState();

  /**
   * Dispatch a notification.
   * @param {'error' | 'warning' | 'info' | 'success'} severity Severity level.
   * @param {string} message The message.
   */
  const dispatch = (severity, message) => {
    console.log(`Dispatching alert to snackbar`, {
      severity: severity,
      message: message,
    });

    if (open) {
      clearTimeout(timer);
      setOpen(false);
      setTimeout(() => show(severity, message), 250);
    } else {
      show(severity, message);
    }
  };

  const show = (severity, newMessage) => {
    setAlertProps({
      severity: severity,
      message: newMessage,
    });
    setOpen(true);

    const timeout = setTimeout(() => setOpen(false), autoHideDuration);
    setTimer(timeout);
  };

  const hide = () => setOpen(false);

  return (
    <SnackbarContext.Provider
      value={{
        open,
        ...alertProps,
        dispatch,
        hide,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
}
