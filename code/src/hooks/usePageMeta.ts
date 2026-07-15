import { useEffect } from 'react';

const SITE_NAME = "shreya's digital diary";

/**
 * Per-page <title> + meta description for a client-rendered SPA.
 * Call at the top of each page component.
 */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }

    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description]);
}
