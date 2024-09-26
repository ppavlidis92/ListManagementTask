import 'dotenv/config'; // Import the `dotenv` module

export const removeSubscriber = async (email: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const LIST_ID = process.env.NEXT_PUBLIC_LIST_ID;

  try {
    const response = await fetch(
      `https://api.createsend.com/api/v3.3/subscribers/${LIST_ID}.json?email=${encodeURIComponent(email)}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Basic ${API_KEY}` },
      }
    );

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`Failed to remove subscriber: ${email}`);
    }

    console.warn('Removing Subscriber:', email);
  } catch (error) {
    console.error(`Error removing subscriber ${email}:`, error);
    throw error; // Ensure the error is thrown for handling in API or UI
  }
};
