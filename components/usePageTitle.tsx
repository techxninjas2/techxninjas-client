
import { useEffect } from 'react';
import { BRAND_NAME } from '../constants';

const usePageTitle = (title: string) => {
  useEffect(() => {
    if (title) {
      document.title = `${BRAND_NAME} - ${title}`;
    } else {
      document.title = BRAND_NAME; // Default title if none provided
    }
    // Optional: Reset title on component unmount if needed, though usually not for page titles
    // return () => { document.title = BRAND_NAME; };
  }, [title]);
};

export default usePageTitle;
