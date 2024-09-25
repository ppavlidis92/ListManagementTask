'use client';

import React, { useEffect, useState } from 'react';
import { fetchRecipients, removeSubscriber, addSubscriber } from '@/services'; // Add addSubscriber import
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

  // Fetch recipients on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRecipients();
      if (data) {
        setRecipients(data);
      }
    };

    fetchData();
  }, []);

  // Handle unsubscribe logic
  const handleUnsubscribe = async (email: string) => {
    try {
      await removeSubscriber(email);

      // After successful unsubscribe, refresh the recipient list
      const updatedRecipients = await fetchRecipients();
      setRecipients(updatedRecipients);
    } catch (error) {
      console.error(`Failed to unsubscribe ${email}:`, error);
    }
  };

  // Handle add subscriber logic
  const handleAddSubscriber = async () => {
    if (name && email) {
      await addSubscriber(name, email);
      setName(''); // Clear name field
      setEmail(''); // Clear email field
      const data = await fetchRecipients();
      setRecipients(data); // Refresh the list after adding a new subscriber
    } else {
      console.warn('Name and email are required to add a subscriber.');
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Typography variant="h4" className={styles.title}>
          Mailing List Subscribers
        </Typography>
        <List className={styles.list}>
          {recipients.map((recipient, index) => (
            <React.Fragment key={recipient.EmailAddress}>
              <ListItem
                className={styles.listItem}
                secondaryAction={
                  <IconButton
                    className={styles.iconButton}
                    edge="end"
                    aria-label="unsubscribe"
                    // Correctly call the async function here
                    onClick={async () =>
                      await handleUnsubscribe(recipient.EmailAddress)
                    }
                  >
                    <UnsubscribeIcon />
                  </IconButton>
                }
              >
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
              onChange={(e) => setName(e.target.value)} // Update name input
              className={styles.inputField}
            />
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email input
              className={styles.inputField}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSubscriber}
              className={styles.addButton}
            >
              Add Subscriber
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
