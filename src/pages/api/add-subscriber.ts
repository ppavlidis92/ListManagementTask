import { NextApiRequest, NextApiResponse } from 'next';
import { addSubscriber } from '@/services/addSubscriberService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    try {
      // Call the service to add a subscriber
      const response = await addSubscriber(name, email);
      console.warn('Response Status from API:', response.status);
      // Check if the response was successful
      if (response && response.status >= 200 && response.status < 300) {
        return res
          .status(200)
          .json({ message: 'Subscriber added successfully' });
      }
    } catch (error) {
      // Check if there's an error message from the API
      const errorMessage =
        error.response?.data?.Message || 'Error adding subscriber';
      return res
        .status(error.response?.status || 500)
        .json({ message: errorMessage });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
