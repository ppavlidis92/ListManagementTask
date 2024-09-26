import 'dotenv/config'; // Import the `dotenv` module

export const fetchRecipients = async () => {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const LIST_ID = process.env.NEXT_PUBLIC_LIST_ID;

  try {
    // Perform both requests using the native fetch API
    const [unconfirmedResponse, activeResponse] = await Promise.all([
      fetch(
        `https://api.createsend.com/api/v3.3/lists/${LIST_ID}/unconfirmed.json`,
        {
          headers: { Authorization: `Basic ${API_KEY}` },
        }
      ),
      fetch(
        `https://api.createsend.com/api/v3.3/lists/${LIST_ID}/active.json`,
        {
          headers: { Authorization: `Basic ${API_KEY}` },
        }
      ),
    ]);

    // Check if the responses are OK (status code 200-299)
    if (!unconfirmedResponse.ok || !activeResponse.ok) {
      throw new Error('Error fetching recipients');
    }

    // Parse the JSON responses
    const unconfirmedData = await unconfirmedResponse.json();
    const activeData = await activeResponse.json();

    // Combine and return the results
    return [...unconfirmedData.Results, ...activeData.Results];
  } catch (error) {
    console.error('Error fetching recipients:', error);
    throw new Error('Error fetching recipients');
  }
};
