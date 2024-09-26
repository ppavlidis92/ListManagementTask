import React from 'react';
import { Snackbar } from '@mui/material';

interface ToastNotificationProps {
  toastOpen: boolean;
  handleToastClose: () => void;
  successMessage: string;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  toastOpen,
  handleToastClose,
  successMessage,
}) => {
  return (
    <Snackbar
      open={toastOpen}
      autoHideDuration={4000}
      onClose={handleToastClose}
      message={successMessage}
    />
  );
};

export default ToastNotification;
