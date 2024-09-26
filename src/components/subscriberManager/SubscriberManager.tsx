import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import SubscriberList from '@/components/subscriberList/SubscriberList';
import AddSubscriberModal from '@/components/addSubscriberModal/AddSubscriberModal';
import { pollForRemoval, pollForAddition } from '@/utils/pollingHelperFunction';
import { Recipient } from '@/types/Recipient';
import useStyles from './styles'; // Import the styles

interface SubscriberManagerProps {
  setToastOpen: (open: boolean) => void;
  setSuccessMessage: (message: string) => void;
}

const SubscriberManager: React.FC<SubscriberManagerProps> = ({
  setToastOpen,
  setSuccessMessage,
}) => {
  const classes = useStyles(); // Use the styles

  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUnsubscribe, setLoadingUnsubscribe] = useState<string | null>(
    null
  );
  const [removedSubscriber, setRemovedSubscriber] = useState<string | null>(
    null
  );
  const [addedSubscriber, setAddedSubscriber] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      const response = await fetch('/api/fetch-recipients');
      const data = await response.json();
      setRecipients(data.combinedRecipients);
    };

    fetchRecipients();
  }, [removedSubscriber, addedSubscriber]);

  const handleUnsubscribe = async (email: string) => {
    setLoadingUnsubscribe(email);
    try {
      await fetch('/api/remove-subscriber', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      pollForRemoval(
        email,
        setLoadingUnsubscribe,
        setSuccessMessage,
        setRemovedSubscriber,
        setToastOpen
      );
    } catch (error) {
      setLoadingUnsubscribe(null);
      setErrorMessage(`Failed to remove subscriber: ${error}`);
    }
  };

  const handleAddSubscriber = async () => {
    setErrorMessage('');
    setLoading(true);

    if (name && email) {
      try {
        const response = await fetch('/api/add-subscriber', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email }),
        });

        const result = await response.json();

        if (!response.ok) {
          setLoading(false);
          setErrorMessage(result.message || 'Failed to add subscriber');
          return;
        }

        pollForAddition(
          email,
          setLoading,
          setSuccessMessage,
          setAddedSubscriber,
          setToastOpen,
          setOpen
        );
      } catch (error) {
        setLoading(false);
        setErrorMessage(`Failed to add subscriber. ${error} Please try again.`);
      }
    } else {
      setLoading(false);
      setErrorMessage('Name and email are required.');
    }
  };

  return (
    <Box>
      <Box className={classes.container}>
        <Typography className={classes.title}>
          Mailing List Subscribers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
          className={classes.button}
        >
          Add Subscriber
        </Button>
      </Box>

      <SubscriberList
        recipients={recipients}
        loadingUnsubscribe={loadingUnsubscribe}
        handleUnsubscribe={handleUnsubscribe}
      />

      <AddSubscriberModal
        open={open}
        name={name}
        email={email}
        loading={loading}
        errorMessage={errorMessage}
        handleClose={() => setOpen(false)}
        handleAddSubscriber={handleAddSubscriber}
        setName={setName}
        setEmail={setEmail}
      />
    </Box>
  );
};

export default SubscriberManager;
