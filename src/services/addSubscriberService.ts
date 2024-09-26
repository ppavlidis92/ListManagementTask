import axios from 'axios';
import 'dotenv/config'; // Import the `dotenv` module

export const addSubscriber = async (name: string, email: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const LIST_ID = process.env.NEXT_PUBLIC_LIST_ID;

  try {
    const subscriber = {
      EmailAddress: email,
      Name: name,
      ConsentToTrack: 'Yes',
      Resubscribe: true, // Resubscribe if previously unsubscribed
    };

    const response = await axios.post(
      `https://api.createsend.com/api/v3.3/subscribers/${LIST_ID}.json`,
      subscriber,
      {
        headers: { Authorization: `Basic ${API_KEY}` },
      }
    );
    return response;
  } catch (error) {
    console.error(`Error adding subscriber ${name}:`, error);
    throw error; // Re-throw the error so the calling code can handle it
  }
};
