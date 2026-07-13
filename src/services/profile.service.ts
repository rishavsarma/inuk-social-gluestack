import { useAuthStore } from "@/stores/auth.store";
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

  getFollowingConnection: async (followedId: string) => {
    const { data } = await api.get<FollowConnectionResponse>(
      `/iam/following/connection/${followedId}`,
    );
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

  searchProfiles: async (
    query: string,
    offset: number,
    limit: number = 15,
  ): Promise<PaginatedListResponse<NetworkProfileItem>> => {
    const myProfileId = useAuthStore.getState().user?.profileId;
    const safeQuery = query.replace(/"/g, '\\"');
    const searchStr = `{ "dataOption": "any", "criteria": [ { "filterKey":"firstName", "operation": "cn", "value": "${safeQuery}" }, { "filterKey":"lastName", "operation": "cn", "value": "${safeQuery}" }, { "filterKey":"username", "operation": "cn", "value": "${safeQuery}" } ] }`;

    const { data } = await api.get<PaginatedListResponse<ProfileResponse>>(
      `/iam/profile/search?search=${searchStr}`,
      { params: { offset, limit } },
    );
    const profiles = data?.data ?? [];

    const isFollowingByProfileId = new Map(
      await Promise.all(
        profiles.map(
          async (profile) =>
            [
              profile.id,
              await getFollowingConnectionSafe(profile.id, myProfileId).then(
                (connection) => connection?.status === "ACTIVE",
              ),
            ] as const,
        ),
      ),
    );

    return {
      ...data,
      data: profiles.map((profile) => ({
        id: profile.id,
        avatar: profile.avatar ?? undefined,
        firstName: profile.firstName ?? undefined,
        lastName: profile.lastName ?? undefined,
        username: profile.username ?? undefined,
        bio: profile.bio ?? undefined,
        isFollowing: isFollowingByProfileId.get(profile.id) ?? false,
      })),
    };
  },
};

// The connection endpoint 404s when no connection exists yet, so this must
// never throw — a rejection here would fail whatever batch call it's part of.
export async function getFollowingConnectionSafe(
  profileId: string,
  myProfileId: string | undefined,
): Promise<FollowConnectionResponse | null> {
  if (!myProfileId || profileId === myProfileId) return null;
  try {
    return await profileService.getFollowingConnection(profileId);
  } catch (e) {
    return null;
  }
}
