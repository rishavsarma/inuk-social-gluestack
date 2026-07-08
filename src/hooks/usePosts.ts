import { api } from "@/services/api";
import { postService } from "@/services/post.service";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useGetPhotoPosts(profileId: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["profile-photos", profileId],
    enabled: !!profileId && enabled,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const { data } = await postService.getPostPhotoList(
        profileId,
        pageParam,
        50,
      );
      return data;
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const allItems = allPages.flatMap((p: any) => p.data || []);
      if (allItems.length < lastPage?.total) {
        return allItems.length;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
export function useGetVideoPosts(profileId: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["profile-videos", profileId],
    enabled: !!profileId && enabled,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const { data } = await postService.getPostVideoList(
        profileId,
        pageParam,
        50,
      );
      return data;
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const allItems = allPages.flatMap((p: any) => p.data || []);
      if (allItems.length < lastPage?.total) {
        return allItems.length;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
export function useGetFeedPosts() {
  return useInfiniteQuery({
    queryKey: ["feed-posts"],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return postService.getFeedPosts(pageParam, 5);
    },
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.data?.length) return undefined;
      const nextOffset = (lastPage.offset || 1) + 1;
      const totalPages = Math.ceil(
        (lastPage.total || 0) / (lastPage.limit || 10),
      );
      return nextOffset <= totalPages ? nextOffset : undefined;
    },
    initialPageParam: 1,
  });
}

export function usePostPhotoDetailsQuery(
  id: string,
  postId: string,
  mediaId: string,
  profileId: string,
  myProfileId: string,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["post-details", postId, mediaId],
    enabled: !!postId && !!mediaId && enabled,
    queryFn: async () => {
      const data = await postService.getPostPhotoDetails(
        id,
        postId,
        mediaId,
        profileId,
        myProfileId,
      );
      return data;
    },
  });
}
