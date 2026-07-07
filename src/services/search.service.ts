import { api } from './api';

export const searchService = {
  search: async (q: string) => {
    const { data } = await api.get('/search', { params: { q } });
    return data;
  },
};
