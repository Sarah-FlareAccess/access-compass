import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | Access Compass` : 'Access Compass';
  }, [title]);
}
