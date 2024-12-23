import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollPosition = () => {
  const location = useLocation();

  // Save scroll position
  const saveScrollPosition = useCallback(() => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    sessionStorage.setItem('prevPageKey', location.key);
  }, [location.key]);

  // Restore scroll position
  const restoreScrollPosition = useCallback(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    const prevPageKey = sessionStorage.getItem('prevPageKey');

    if (savedScrollPosition && prevPageKey === location.key) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }, 100);

      sessionStorage.removeItem('scrollPosition');
    }
  }, [location.key]);

  return { saveScrollPosition, restoreScrollPosition };
};
