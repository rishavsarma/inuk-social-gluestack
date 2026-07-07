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
