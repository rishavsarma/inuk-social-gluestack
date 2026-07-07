import { api } from './api';

export const storyService = {
  getStories: async () => {
    const { data } = await api.get('/stories');
    return data;
  },
};
