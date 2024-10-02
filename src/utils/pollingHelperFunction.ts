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

      // Send event to Google Analytics with user_table_length
      ReactGA.event({
        category: 'Subscriber',
        action: 'Remove Subscriber',
        label: email,
        value: 1, // Or any relevant value you want to track
        nonInteraction: true,
      });

      // Track the updated user table length as user property
      ReactGA.set({
        user_table_length: data.combinedRecipients.length.toString(), // Send as user property
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

      // Send event to Google Analytics with user_table_length
      ReactGA.event({
        category: 'Subscriber',
        action: 'Add Subscriber',
        label: email,
        value: 1, // Or any relevant value you want to track
        nonInteraction: true,
      });

      // Track the updated user table length as user property
      ReactGA.set({
        user_table_length: data.combinedRecipients.length.toString(), // Send as user property
      });
    }
  }, 1000);
};
