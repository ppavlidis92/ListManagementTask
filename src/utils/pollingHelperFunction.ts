import { Recipient } from '@/types/Recipient';
import ReactGA from 'react-ga4';

export const pollForRemoval = async (
  email: string,
  setLoadingUnsubscribe: (email: string | null) => void,
  setSuccessMessage: (message: string) => void,
  setRemovedSubscriber: (email: string | null) => void,
  setToastOpen: (isOpen: boolean) => void
) => {
  const pollInterval = setInterval(async () => {
    const response = await fetch('/api/fetch-recipients');
    const data = await response.json();

    const userStillExists = data.combinedRecipients.some(
      (recipient: Recipient) => recipient.EmailAddress === email
    );

    if (!userStillExists) {
      clearInterval(pollInterval);
      setLoadingUnsubscribe(null);
      setSuccessMessage('Subscriber removed successfully!');
      setToastOpen(true);
      setRemovedSubscriber(email);
      ReactGA.set({
        user_table_length: data.combinedRecipients.length.toString(), // Send as string
      });
    }
  }, 1000);
};

export const pollForAddition = async (
  email: string,
  setLoading: (loading: boolean) => void,
  setSuccessMessage: (message: string) => void,
  setAddedSubscriber: (email: string | null) => void,
  setToastOpen: (isOpen: boolean) => void,
  setOpen: (isOpen: boolean) => void
) => {
  const pollInterval = setInterval(async () => {
    const response = await fetch('/api/fetch-recipients');
    const data = await response.json();

    const userExists = data.combinedRecipients.some(
      (recipient: Recipient) => recipient.EmailAddress === email
    );

    if (userExists) {
      clearInterval(pollInterval);
      setLoading(false);
      setSuccessMessage('Subscriber added successfully!');
      setToastOpen(true);
      setOpen(false);
      setAddedSubscriber(email);
      ReactGA.set({
        user_table_length: data.combinedRecipients.length.toString(), // Send as string
      });
    }
  }, 1000);
};
