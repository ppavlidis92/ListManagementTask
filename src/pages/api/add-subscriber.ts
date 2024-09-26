import { NextApiRequest, NextApiResponse } from 'next';
import { addSubscriber } from '@/services/addSubscriberService';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    try {
      // Call the service to add a subscriber
      const response = await addSubscriber(name, email);
      console.warn('Response Status from API:', response?.status);

      // Check if the response was successful
      if (response && response.status >= 200 && response.status < 300) {
        return res
          .status(200)
          .json({ message: 'Subscriber added successfully' });
      } else {
        return res.status(response?.status || 500).json({
          message: response?.data?.Message || 'Failed to add subscriber',
        });
      }
    } catch (error) {
      // Narrow down the error type using axios' built-in type guards
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.Message || 'Error adding subscriber';
        return res.status(error.response?.status || 500).json({
          message: errorMessage,
        });
      }

      // Handle unexpected errors
      return res.status(500).json({
        message: 'An unexpected error occurred',
      });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
