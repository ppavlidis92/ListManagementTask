import axios from 'axios';

// Function to fetch the list of unconfirmed subscribers (emails and names) via the proxy server
export const fetchRecipients = async () => {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/fetch-recipients`, // Proxy endpoint
      {
        params: {
          page: 1,
          pagesize: 100,
        },
      }
    );

    const recipients = response.data.combinedRecipients;
    return recipients;
  } catch (error) {
    console.error('Error fetching recipients from proxy server', error);
    return null;
  }
};
