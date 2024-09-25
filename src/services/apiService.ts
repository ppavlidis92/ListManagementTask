import axios from 'axios';

const API_KEY =
  '7m0yHwZsAMB/NYLxR8Dkim+QRf2uzWs6imwhl/Z3f+ZZEFHHSJBszU+eWYU+zw88G+OMj2K/8IBhMFguxHQ1b9W/cBV5ukrffv952KChmWtSICGX3fQ2cgPcOlaj0TxuNqs53kAHKosJ0FfJVcP7iw=='; // Replace with your Campaign Monitor API key
const CAMPAIGN_ID = 'af3a3acf5edf0e6d517e9a16dc6f7ddc'; // Replace with the campaign ID

// Fetch campaign recipients
const fetchRecipients = async () => {
  try {
    // Use btoa for Base64 encoding
    const authHeader = `Basic ${btoa(API_KEY + ':')}`;

    const response = await axios.get(
      `https://api.createsend.com/api/v3.3/campaigns/${CAMPAIGN_ID}/recipients.json`,
      {
        headers: {
          Authorization: authHeader, // Set the Authorization header
        },
        params: {
          page: 1, // optional, specify pagination
          pagesize: 100, // optional, specify the number of results per page
          orderfield: 'email',
          orderdirection: 'asc',
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching recipients:', error);
  }
};

fetchRecipients();
