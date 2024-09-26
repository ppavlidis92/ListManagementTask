import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useStyles from './styles'; // Import the styles

interface AddSubscriberModalProps {
  open: boolean;
  name: string;
  email: string;
  loading: boolean;
  errorMessage: string;
  handleClose: () => void;
  handleAddSubscriber: () => void;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
}

const AddSubscriberModal: React.FC<AddSubscriberModalProps> = ({
  open,
  name,
  email,
  loading,
  errorMessage,
  handleClose,
  handleAddSubscriber,
  setName,
  setEmail,
}) => {
  const classes = useStyles(); // Use the styles

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Add New Subscriber
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className={classes.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errorMessage}
        />
        {loading && <CircularProgress className={classes.spinner} />}
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
  );
};

export default AddSubscriberModal;
