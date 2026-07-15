import { profileService } from "@/services/profile.service";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const NETWORK_PAGE_LIMIT = 20;

export function useGetProfile(profileId: string) {
  return useQuery({
    queryKey: ["profile", profileId],
    queryFn: async () => {
      const [profile, stats] = await Promise.all([
        profileService.getProfile(profileId),
        profileService.getProfileStats(profileId),
      ]);
      return { profile, stats };
    },
    enabled: !!profileId,
    // Profile screen and profile-menu both subscribe to this key — without
    // a staleTime, mounting the second subscriber triggers a background
    // refetch that flips isRefetching (and the pull-to-refresh spinner) on
    // the profile screen underneath, not just the one navigated to.
    staleTime: 30_000,
  });
}

export function useUpdateProfile(profileId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileService.updateProfile(profileId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", profileId] });
    },
  });
}

export function useGetFollowers(profileId: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["followers", profileId],
    enabled: !!profileId && enabled,
    queryFn: ({ pageParam }: { pageParam: number }) =>
      profileService.getFollowers(profileId, pageParam, NETWORK_PAGE_LIMIT),
    getNextPageParam: (
      lastPage: PaginatedListResponse<NetworkProfileItem>,
      allPages,
    ) => {
      const loaded = allPages.flatMap((page) => page.data ?? []).length;
      if (!lastPage?.data || lastPage.data.length < NETWORK_PAGE_LIMIT) {
        return undefined;
      }
      return loaded;
    },
    initialPageParam: 0,
  });
}

export function useGetFollowing(profileId: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["following", profileId],
    enabled: !!profileId && enabled,
    queryFn: ({ pageParam }: { pageParam: number }) =>
      profileService.getFollowing(profileId, pageParam, NETWORK_PAGE_LIMIT),
    getNextPageParam: (
      lastPage: PaginatedListResponse<NetworkProfileItem>,
      allPages,
    ) => {
      const loaded = allPages.flatMap((page) => page.data ?? []).length;
      if (!lastPage?.data || lastPage.data.length < NETWORK_PAGE_LIMIT) {
        return undefined;
      }
      return loaded;
    },
    initialPageParam: 0,
  });
}

export function useSearchProfiles(query: string) {
  const trimmed = query.trim();
  return useInfiniteQuery({
    queryKey: ["profile-search", trimmed],
    // enabled: trimmed.length > 0,
    queryFn: ({ pageParam }: { pageParam: number }) =>
      profileService.searchProfiles(trimmed, pageParam, NETWORK_PAGE_LIMIT),
    getNextPageParam: (
      lastPage: PaginatedListResponse<NetworkProfileItem>,
      allPages,
    ) => {
      const loaded = allPages.flatMap((page) => page.data ?? []).length;
      if (!lastPage?.data || lastPage.data.length < NETWORK_PAGE_LIMIT) {
        return undefined;
      }
      return loaded;
    },
    initialPageParam: 1,
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      followerId,
      followedId,
      action,
    }: {
      followerId: string;
      followedId: string;
      action: "FOLLOW" | "UNFOLLOW";
    }) => profileService.followUser(followerId, followedId, action),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["profile-search"] });
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.followedId],
      });
    },
  });
}
