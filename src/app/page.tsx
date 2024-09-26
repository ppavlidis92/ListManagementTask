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
} from '@mui/material';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
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

  // Fetch recipients initially
  useEffect(() => {
    const fetchRecipients = async () => {
      const response = await fetch('/api/fetch-recipients');
      const data = await response.json();
      setRecipients(data.combinedRecipients);
    };

    fetchRecipients();
  }, []);

  // Handle unsubscribe logic
  const handleUnsubscribe = async (email: string) => {
    await fetch('/api/remove-subscriber', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const updatedRecipients = recipients.filter(
      (recipient) => recipient.EmailAddress !== email
    );
    setRecipients(updatedRecipients);
  };

  // Handle add subscriber logic
  const handleAddSubscriber = async () => {
    setErrorMessage('');
    setSuccessMessage('');

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
          // If the response is not OK, set the error message
          setErrorMessage(result.message || 'Failed to add subscriber');
          return;
        }

        // If successful, add the subscriber to the list and show the success message
        setRecipients([
          ...recipients,
          { Name: name, EmailAddress: email, Date: '', State: 'Unconfirmed' },
        ]);
        setName('');
        setEmail('');
        setSuccessMessage('Subscriber added successfully!');
        setErrorMessage(''); // Clear any previous error message
      } catch (error) {
        setErrorMessage(`Failed to add subscriber. ${error} Please try again.`);
      }
    } else {
      setErrorMessage('Name and email are required.');
    }
  };

  return (
    <div className={styles.page}>
      <Typography variant="h4" className={styles.title}>
        Mailing List Subscribers
      </Typography>
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
                <UnsubscribeIcon />
              </IconButton>
            </ListItem>
            {index < recipients.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Add Subscriber Section */}
      <div className={styles.addSubscriber}>
        <Typography variant="h5">Add Subscriber</Typography>
        <div className={styles.form}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
            error={!!errorMessage} // Set error if there's an error message
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSubscriber}
            className={styles.addButton}
          >
            Add Subscriber
          </Button>

          {/* Error message display */}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {/* Success message display */}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </div>
      </div>
    </div>
  );
}
