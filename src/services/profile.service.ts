import { api } from "./api";

export const profileService = {
  getProfile: async (profileId: string) => {
    const { data } = await api.get<ProfileResponse>(
      `/iam/profile/${profileId}`,
    );
    return data;
  },

  getProfileStats: async (profileId: string) => {
    const { data } = await api.get<ProfileStatsResponse>(
      `/iam/profile-stat/${profileId}`,
    );
    return data;
  },

  updateProfile: async (id: string, payload: UpdateProfilePayload) => {
    const { data } = await api.put(`/iam/profile/${id}`, payload);
    return data;
  },

  followUser: async (
    followerId: string,
    followedId: string,
    action: "FOLLOW" | "UNFOLLOW",
  ) => {
    const { data } = await api.put(`/iam/connection-action/apply`, {
      followerId,
      followedId,
      action,
    });
    return data;
  },

  getFollowers: async (userId: string, offset: number, limit: number = 15) => {
    const { data } = await api.get<PaginatedListResponse<NetworkProfileItem>>(
      "/iam/followers",
      { params: { profileId: userId, offset, limit } },
    );
    return data;
  },

  getFollowing: async (userId: string, offset: number, limit: number = 15) => {
    const { data } = await api.get<PaginatedListResponse<NetworkProfileItem>>(
      "/iam/following",
      { params: { profileId: userId, offset, limit } },
    );
    return data;
  },

  searchProfiles: async (query: string, offset: number, limit: number = 15) => {
    const { data } = await api.get<PaginatedListResponse<NetworkProfileItem>>(
      "/iam/profile/search",
      { params: { search: query, offset, limit } },
    );
    return data;
  },
};
