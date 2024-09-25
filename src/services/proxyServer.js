/* eslint-disable no-undef */
import express from 'express';
import axios from 'axios';
import 'dotenv/config'; // Import the `dotenv` module
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const LIST_ID = process.env.NEXT_PUBLIC_LIST_ID; // Your list ID

// Fetch unconfirmed and active recipients
app.get('/api/fetch-recipients', async (req, res) => {
  try {
    const [unconfirmedResponse, activeResponse] = await Promise.all([
      axios.get(
        `https://api.createsend.com/api/v3.3/lists/${LIST_ID}/unconfirmed.json`,
        {
          headers: { Authorization: `Basic ${API_KEY}` },
        }
      ),
      axios.get(
        `https://api.createsend.com/api/v3.3/lists/${LIST_ID}/active.json`,
        {
          headers: { Authorization: `Basic ${API_KEY}` },
        }
      ),
    ]);

    const combinedRecipients = [
      ...unconfirmedResponse.data.Results,
      ...activeResponse.data.Results,
    ];
    res.json({ combinedRecipients });
  } catch (error) {
    handleError(error, res);
  }
});

// Add subscriber
app.post('/api/add-subscriber', async (req, res) => {
  const { name, email } = req.body;
  try {
    const url = `https://api.createsend.com/api/v3.3/subscribers/${LIST_ID}.json`;
    const subscriber = {
      EmailAddress: email,
      Name: name,
      ConsentToTrack: 'Yes',
      Resubscribe: true,
    };

    const response = await axios.post(url, subscriber, {
      headers: {
        Authorization: `Basic ${API_KEY}`, // Use the properly encoded API key
      },
    });

    res.json({
      message: `Subscriber ${name} added successfully!`,
      data: response.data,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Remove subscriber
app.delete('/api/remove-subscriber', async (req, res) => {
  const { email } = req.body;
  try {
    const url = `https://api.createsend.com/api/v3.3/subscribers/${LIST_ID}.json?email=${encodeURIComponent(email)}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Basic ${API_KEY}`, // Use the properly encoded API key
      },
    });

    res.json({
      message: `Subscriber with email ${email} removed successfully!`,
      data: response.data,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Error handling function
function handleError(error, res) {
  if (axios.isAxiosError(error)) {
    console.error(
      'Error from Campaign Monitor:',
      error.response?.data || error.message
    );
    res.status(500).send(error.response?.data || error.message);
  } else {
    console.error('Unexpected error:', error);
    res.status(500).send('An unexpected error occurred.');
  }
}

app.listen(PORT, () => {
  console.warn(`Proxy server running on http://localhost:${PORT}`);
});
