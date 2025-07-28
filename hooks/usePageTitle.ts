// src/hooks/usePageTitle.ts
import { useEffect } from 'react';

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | ${process.env.REACT_APP_SITE_NAME || 'Your Site'}`;
    return () => {
      document.title = process.env.REACT_APP_SITE_NAME || 'Your Site';
    };
  }, [title]);
};

export default usePageTitle;