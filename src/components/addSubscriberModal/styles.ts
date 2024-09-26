// src/components/addSubscriberModal/styles.ts
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  closeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  dialogContent: {
    marginBottom: '20px',
  },
  spinner: {
    display: 'block',
    margin: '20px auto',
  },
});

export default useStyles;
