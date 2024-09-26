import { NextApiRequest, NextApiResponse } from 'next';
import { removeSubscriber } from '@/services/removeSubscriberService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const { email } = req.body;
    try {
      await removeSubscriber(email);
      res.status(200).json({ message: 'Subscriber removed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing subscriber', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
