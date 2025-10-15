import { useEffect } from 'react';

// Custom hook to forcibly remove scroll lock from <body>
export function useRemoveBodyScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const fixScrollLock = () => {
      if (html.style.overflow === 'hidden') html.style.overflow = '';
      if (html.style.paddingRight) html.style.paddingRight = '';
      if (body.style.overflow === 'hidden') body.style.overflow = '';
      if (body.style.paddingRight) body.style.paddingRight = '';
    };

    const observer = new MutationObserver(fixScrollLock);
    observer.observe(html, { attributes: true, attributeFilter: ['style'] });
    observer.observe(body, { attributes: true, attributeFilter: ['style'] });

    return () => observer.disconnect();
  }, []);
}