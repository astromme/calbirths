import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to track page views with Google Analytics
 * Automatically sends page view events when the route changes
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Check if gtag is available (it won't be in development without a real GA ID)
    if (typeof window.gtag !== 'undefined') {
      // Send page view to Google Analytics
      window.gtag('config', 'G-5EN6YBVBFM', {
        page_path: location.pathname + location.search + location.hash,
      });
    }
  }, [location]);
}
