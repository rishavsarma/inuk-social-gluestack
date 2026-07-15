import { api } from './api';

export const notificationService = {
  /** Response shape isn't documented in api-docs.json — defensively accepts
   * either a bare array or a `{ data: [...] }` / `{ notifications: [...] }`
   * wrapper rather than assuming one. */
  getNotifications: async (): Promise<NotificationItem[]> => {
    const { data } = await api.get('/notifications');
    if (Array.isArray(data)) return data;
    return data?.data ?? data?.notifications ?? [];
  },
};
