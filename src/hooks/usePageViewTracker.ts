import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '@/lib/apiClient';

function getSessionId(): string {
  const key = 'kites_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function usePageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    const sessionId = getSessionId();
    apiClient
      .post('/analytics/event', {
        eventType: 'page_view',
        sessionId,
        properties: { page: location.pathname },
      })
      .catch(() => {});
  }, [location.pathname]);
}
