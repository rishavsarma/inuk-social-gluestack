import { api } from './api';

export const notificationService = {
  getNotifications: async () => {
    const { data } = await api.get('/notifications');
    return data;
  },
};
