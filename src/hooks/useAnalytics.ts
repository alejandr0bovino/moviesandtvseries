import { usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import * as gtag from '../lib/gtag';

interface GAEventParams {
  action: string;
  category: string;
  label?: string;
  value?: string | number;
}

export const useAnalytics = () => {
  const pathname = usePathname();

  // Track pageviews automatically
  useEffect(() => {
    gtag.pageview(pathname);
  }, [pathname]);

  // Return a callback for tracking events
  const trackEvent = useCallback((params: GAEventParams) => {
    gtag.event(params);
  }, []);

  return { trackEvent };
};
