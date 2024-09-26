import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
  },
  status: {
    color: 'gray',
    fontSize: '12px',
  },
  spinner: {
    marginRight: '10px',
  },

  iconButton: {
    marginLeft: '10px',
  },
});

export default useStyles;
