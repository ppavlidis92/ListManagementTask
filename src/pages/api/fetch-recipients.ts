import { NextApiRequest, NextApiResponse } from 'next';
import { fetchRecipients } from '@/services/fetchRecipientsService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const recipients = await fetchRecipients();
      res.status(200).json({ combinedRecipients: recipients });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recipients', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
