import axios from 'axios';

// Function to remove a subscriber via the proxy server
export const removeSubscriber = async (email: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:4000/api/remove-subscriber`, // Proxy endpoint
      {
        data: { email }, // Send the email in the request body
      }
    );

    console.log(
      `Subscriber with email ${email} removed successfully!`,
      response.data
    );
    return null;
  } catch (error) {
    console.error(`Error removing subscriber with email ${email}:`, error);
    return null;
  }
};
