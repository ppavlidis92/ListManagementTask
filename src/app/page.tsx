'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import SubscriberManager from '@/components/subscriberManager/SubscriberManager';
import ToastNotification from '@/components/snackbarNotifications/SnackbarNotifications';
import styles from './page.module.css';

export default function Home() {
  const [toastOpen, setToastOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  return (
    <Box className={styles.page}>
      <SubscriberManager
        setToastOpen={setToastOpen}
        setSuccessMessage={setSuccessMessage}
      />

      <ToastNotification
        toastOpen={toastOpen}
        handleToastClose={() => setToastOpen(false)}
        successMessage={successMessage}
      />
    </Box>
  );
}
