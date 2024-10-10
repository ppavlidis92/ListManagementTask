import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import ReactGA from 'react-ga4'; // Import ReactGA for tracking events
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

  const [typingStartTime, setTypingStartTime] = useState<number | null>(null); // Track typing start time
  const [pageLoadTime, setPageLoadTime] = useState<number>(Date.now()); // Track time since page load

  // List of "generic" email providers
  const genericDomains = [
    'gmail.com',
    'outlook.com',
    'yahoo.com',
    'hotmail.com',
  ];

  const isGenericEmail = (email: string): boolean => {
    const emailDomain = email.split('@')[1]?.toLowerCase();
    return genericDomains.includes(emailDomain);
  };

  const trackError = (errorMessage: string, errorCategory: string) => {
    ReactGA.event({
      category: 'Error',
      action: `Error in ${errorCategory}`,
      label: errorMessage,
      value: 1,
      nonInteraction: true,
    });
  };

  const trackActionTime = (actionType: 'Add' | 'Remove') => {
    const timeTaken = (Date.now() - pageLoadTime) / 1000; // Time since page load
    ReactGA.event({
      category: 'Subscriber',
      action: `${actionType} Subscriber - Time Taken`,
      label: actionType,
      value: timeTaken,
    });
    // Reset timer for the next action
    setPageLoadTime(Date.now());
  };

  useEffect(() => {
    const fetchRecipients = async () => {
      const response = await fetch('/api/fetch-recipients');
      const data = await response.json();
      setRecipients(data.combinedRecipients);
      ReactGA.gtag('set', 'user_properties', {
        user_table_length: data.combinedRecipients.length.toString(), // Send as user property
      });
    };

    fetchRecipients();
  }, [removedSubscriber, addedSubscriber]);

  const handleUnsubscribe = async (email: string) => {
    const startTime = Date.now();
    setLoadingUnsubscribe(email);

    // Find the index of the subscriber in the list
    const subscriberIndex = recipients.findIndex(
      (recipient) => recipient.EmailAddress === email
    );

    const timeTaken = (Date.now() - startTime) / 1000;

    if (subscriberIndex === -1) {
      const errorMessage = `Subscriber not found in the list.`;
      setErrorMessage(errorMessage);
      setLoadingUnsubscribe(null);

      // Track the error event with the appropriate category
      ReactGA.event({
        category: 'Subscriber',
        action: 'Remove Subscriber - Error',
        label: email,
        value: timeTaken,
      });

      // Track the error separately with error message
      trackError(errorMessage, 'Remove Subscriber');
      return;
    }

    const totalSubscribers = recipients.length;
    const positionRatio = `${subscriberIndex + 1}/${totalSubscribers}`;
    const emailType = isGenericEmail(email) ? 'generic' : 'personal';

    try {
      // Perform unsubscribe request
      const response = await fetch('/api/remove-subscriber', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Track the unsubscribe action, log the time even if an error occurs
      ReactGA.event({
        category: 'Subscriber',
        action: 'Remove Subscriber',
        label: email,
        value: timeTaken,
      });

      if (!response.ok) {
        const errorMessage = `Failed to remove subscriber: ${response.statusText}`;
        setErrorMessage(errorMessage);
        setLoadingUnsubscribe(null);

        // Track the error event
        trackError(errorMessage, 'Remove Subscriber');

        return; // Stop further processing if error occurs
      }

      // Only track email type and position when the removal is successful
      ReactGA.event({
        category: 'Subscriber',
        action: `Remove Subscriber - Email Type: ${emailType}`,
        label: emailType,
        value: 1,
      });

      ReactGA.event({
        category: 'Subscriber',
        action: 'Remove Subscriber - Position in List',
        label: positionRatio,
        value: 1,
      });

      // Track the action time for removing the subscriber
      trackActionTime('Remove');

      // If successful, proceed with pollForRemoval
      pollForRemoval(
        email,
        setLoadingUnsubscribe,
        setSuccessMessage,
        setRemovedSubscriber,
        setToastOpen
      );
    } catch (error) {
      if (error instanceof Error) {
        setLoadingUnsubscribe(null);
        const errorMessage = `Failed to remove subscriber: ${error.message}`;
        setErrorMessage(errorMessage);

        // Track error event for exceptions
        ReactGA.event({
          category: 'Subscriber',
          action: 'Remove Subscriber - Error',
          label: email,
          value: timeTaken,
        });

        // Track the error separately with the error message
        trackError(errorMessage, 'Remove Subscriber');
      } else {
        // Handle cases where error is not an instance of Error (unlikely in fetch)
        const errorMessage = `An unknown error occurred.`;
        setErrorMessage(errorMessage);
        trackError(errorMessage, 'Remove Subscriber');
      }
    }
  };
  const handleAddSubscriber = async () => {
    if (!typingStartTime) return;
    const timeTakenToSubmit = (Date.now() - typingStartTime) / 1000;

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

        // Determine email type
        const emailType = isGenericEmail(email) ? 'generic' : 'personal';

        // Track the event of adding a subscriber (regardless of success or error)
        ReactGA.event({
          category: 'Subscriber',
          action: 'Add Subscriber',
          label: email,
          value: timeTakenToSubmit,
        });

        ReactGA.event({
          category: 'Subscriber',
          action: `Add Subscriber - Email Type: ${emailType}`,
          label: emailType,
          value: 1,
        });

        if (!response.ok) {
          // Handle error scenario in add subscriber
          setLoading(false);
          const errorMessage = result.message || 'Failed to add subscriber';
          setErrorMessage(errorMessage);

          // Track the error event with the appropriate category
          trackError(errorMessage, 'Add Subscriber');

          return; // Stop further processing if error occurs
        }

        // Track the action time for adding the subscriber
        trackActionTime('Add');

        // Proceed with the addition if no error
        pollForAddition(
          email,
          setLoading,
          setSuccessMessage,
          setAddedSubscriber,
          setToastOpen,
          setOpen
        );
      } catch (error: unknown) {
        // Handle any exception during the add process
        setLoading(false);

        let errorMessage = 'An unknown error occurred.';

        if (error instanceof Error) {
          errorMessage = `Failed to add subscriber: ${error.message}`;
        }

        setErrorMessage(errorMessage);

        trackError(errorMessage, 'Add Subscriber');
      }
    } else {
      // Handle case of missing name or email
      setLoading(false);
      const errorMessage = 'Name and email are required.';
      setErrorMessage(errorMessage);

      trackError(errorMessage, 'Add Subscriber');
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
          onClick={() => {
            setOpen(true);
          }}
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
        setTypingStartTime={setTypingStartTime} // Pass down the typing start time handler
      />
    </Box>
  );
};

export default SubscriberManager;
