import axios from 'axios';

// Function to add a subscriber via the proxy server
export const addSubscriber = async (name: string, email: string) => {
  try {
    const response = await axios.post(
      `http://localhost:4000/api/add-subscriber`, // Proxy endpoint
      {
        name, // Send the name and email in the request body
        email,
      }
    );

    console.warn(`Subscriber ${name} added successfully!`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error adding subscriber ${name}:`, error);
    return null;
  }
};
