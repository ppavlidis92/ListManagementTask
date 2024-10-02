import ReactGA from 'react-ga4';

export const initGA = () => {
  // Initialize Google Analytics with your Measurement ID
  ReactGA.initialize('G-MTJP27SLZ9'); // Replace with your actual Measurement ID
};

export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};
