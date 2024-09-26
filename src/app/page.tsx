'use client';

import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Box,
} from '@mui/material';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import CloseIcon from '@mui/icons-material/Close';
import styles from './page.module.css';

// Define the type for each recipient
interface Recipient {
  EmailAddress: string;
  Name: string;
  Date: string;
  State: string;
}

export default function Home() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [name, setName] = useState<string>(''); // State for name input
  const [email, setEmail] = useState<string>(''); // State for email input
  const [errorMessage, setErrorMessage] = useState<string>(''); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string>(''); // State for success messages
  const [open, setOpen] = useState(false); // State for modal open/close
  const [loading, setLoading] = useState(false); // State for spinner/loading
  const [toastOpen, setToastOpen] = useState(false); // State for toast visibility
  const [loadingUnsubscribe, setLoadingUnsubscribe] = useState<string | null>(
    null
  ); // To handle the unsubscribe loading state
  const [removedSubscriber, setRemovedSubscriber] = useState<string | null>(
    null
  ); // State to track the removed subscriber
  const [addedSubscriber, setAddedSubscriber] = useState<string | null>(null); // State to track the added subscriber

  // Fetch recipients initially or after a subscriber is added/removed
  useEffect(() => {
    const fetchRecipients = async () => {
      const response = await fetch('/api/fetch-recipients');
      const data = await response.json();
      setRecipients(data.combinedRecipients);
    };

    fetchRecipients(); // Fetch when component mounts or after add/remove
  }, [removedSubscriber, addedSubscriber]); // Re-fetch when removedSubscriber or addedSubscriber changes

  // Polling function to ensure the user has been removed
  const pollForRemoval = async (email: string) => {
    const pollInterval = setInterval(async () => {
      const response = await fetch('/api/fetch-recipients');
      const data = await response.json();

      const userStillExists = data.combinedRecipients.some(
        (recipient: Recipient) => recipient.EmailAddress === email
      );

      if (!userStillExists) {
        clearInterval(pollInterval); // Stop polling once user is removed
        setLoadingUnsubscribe(null); // Stop the spinner
        setSuccessMessage('Subscriber removed successfully!');
        setToastOpen(true); // Show toast notification
        setRemovedSubscriber(email); // Trigger the useEffect to re-fetch the list
      }
    }, 1000); // Poll every 1 second
  };

  // Polling function to ensure the user has been added
  const pollForAddition = async (email: string) => {
    const pollInterval = setInterval(async () => {
      const response = await fetch('/api/fetch-recipients');
      const data = await response.json();

      const userExists = data.combinedRecipients.some(
        (recipient: Recipient) => recipient.EmailAddress === email
      );

      if (userExists) {
        clearInterval(pollInterval); // Stop polling once the user is added
        setLoading(false); // Stop the spinner
        setSuccessMessage('Subscriber added successfully!');
        setToastOpen(true); // Show toast notification
        setOpen(false); // Close the modal
        setAddedSubscriber(email); // Trigger the list re-fetch for added subscriber
      }
    }, 1000); // Poll every 1 second
  };

  // Handle unsubscribe logic with polling
  const handleUnsubscribe = async (email: string) => {
    setLoadingUnsubscribe(email); // Show spinner for this email

    try {
      await fetch('/api/remove-subscriber', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Poll until the user is actually removed from the list
      pollForRemoval(email);
    } catch (error) {
      setLoadingUnsubscribe(null); // Stop spinner
      setErrorMessage(`Failed to remove subscriber: ${error}`);
    }
  };

  // Handle add subscriber logic with polling
  const handleAddSubscriber = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true); // Show spinner when adding

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
          setLoading(false); // Stop spinner
          setErrorMessage(result.message || 'Failed to add subscriber');
          return;
        }

        // Start polling to ensure the subscriber has been added before closing the modal
        pollForAddition(email);
      } catch (error) {
        setLoading(false); // Stop spinner
        setErrorMessage(`Failed to add subscriber. ${error} Please try again.`);
      }
    } else {
      setLoading(false); // Stop spinner
      setErrorMessage('Name and email are required.');
    }
  };

  // Open modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Close the toast message
  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <Box className={styles.page}>
      <Box className={styles.title}>
        <Typography variant="h4">Mailing List Subscribers</Typography>

        {/* Button to open the Add Subscriber modal */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          className={styles.addButton}
        >
          Add Subscriber
        </Button>
      </Box>
      <List className={styles.list}>
        {recipients.map((recipient, index) => (
          <React.Fragment key={recipient.EmailAddress}>
            <ListItem className={styles.listItem}>
              <ListItemAvatar>
                <Avatar>{recipient.Name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={recipient.Name}
                secondary={
                  <>
                    {recipient.EmailAddress} <br />
                    <Typography component="span" className={styles.status}>
                      Status: <b>{recipient.State}</b>
                    </Typography>
                  </>
                }
              />
              <IconButton
                className={styles.iconButton}
                edge="end"
                aria-label="unsubscribe"
                onClick={() => handleUnsubscribe(recipient.EmailAddress)}
              >
                {loadingUnsubscribe === recipient.EmailAddress ? (
                  <CircularProgress size={24} />
                ) : (
                  <UnsubscribeIcon />
                )}
              </IconButton>
            </ListItem>
            {index < recipients.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Modal for adding subscriber */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Add New Subscriber
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            error={!!errorMessage} // Set error if there's an error message
          />
          {loading && <CircularProgress className={styles.spinner} />}{' '}
          {/* Spinner while loading */}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddSubscriber}
            color="primary"
            disabled={loading}
          >
            Add Subscriber
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={handleToastClose}
        message={successMessage}
      />
    </Box>
  );
}
