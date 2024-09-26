import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import useStyles from './styles'; // Import the styles from styles.ts
import { Recipient } from '@/types/Recipient';

interface SubscriberListProps {
  recipients: Recipient[];
  loadingUnsubscribe: string | null;
  handleUnsubscribe: (email: string) => void;
}

const SubscriberList: React.FC<SubscriberListProps> = ({
  recipients,
  loadingUnsubscribe,
  handleUnsubscribe,
}) => {
  const classes = useStyles(); // Initialize styles

  return (
    <List>
      {recipients.map((recipient, index) => (
        <React.Fragment key={recipient.EmailAddress}>
          <ListItem className={classes.listItem}>
            <ListItemAvatar>
              <Avatar>{recipient.Name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={recipient.Name}
              secondary={
                <>
                  {recipient.EmailAddress}
                  <br />
                  <span className={classes.status}>
                    Status: <b>{recipient.State}</b>
                  </span>
                </>
              }
            />
            <IconButton
              edge="end"
              aria-label="unsubscribe"
              onClick={() => handleUnsubscribe(recipient.EmailAddress)}
            >
              {loadingUnsubscribe === recipient.EmailAddress ? (
                <CircularProgress size={24} className={classes.spinner} />
              ) : (
                <UnsubscribeIcon />
              )}
            </IconButton>
          </ListItem>
          {index < recipients.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default SubscriberList;
