import { api } from "./api";

export const locationService = {
  searchLocations: async (
    query: string,
    limit: number = 8,
    lang: string = "en",
  ) => {
    const { data } = await api.get<LocationSearchResult[]>(
      "/bhugol/api/locations/search",
      { params: { q: query, limit, lang } },
    );
    return data;
  },
};
