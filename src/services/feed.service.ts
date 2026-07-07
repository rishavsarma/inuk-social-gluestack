import { api } from './api';

export const feedService = {
  getFeed: async (tab: 'for_you' | 'following', page: number, limit: number = 20) => {
    const { data } = await api.get('/feed', { params: { tab, page, limit } });
    return data;
  },
};
