// lib/gtag.ts
export const GA_TRACKING_ID = 'G-C2P2EH1374'; // Replace with your GA4 ID

// Pageview tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined') {
    window.gtag?.('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Event tracking interface
interface GTagEvent {
  action: string;
  category: string;
  label?: string;
  value?: string | number;
}

// Event tracking
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== 'undefined') {
    window.gtag?.('event', action, { event_category: category, event_label: label, value });
  }
};
