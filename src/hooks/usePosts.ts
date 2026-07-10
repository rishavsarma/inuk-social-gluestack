import { api } from "@/services/api";
import { postService } from "@/services/post.service";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
    queryKey: ["post-details", "photo", postId, mediaId],
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

export function usePostVideoDetailsQuery(
  id: string,
  postId: string,
  mediaId: string,
  profileId: string,
  myProfileId: string,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["post-details", "video", postId, mediaId],
    enabled: !!postId && !!mediaId && enabled,
    queryFn: async () => {
      const data = await postService.getPostVideoDetails(
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

export function useLikePostMutation(postId: string, mediaId: string) {
  const queryClient = useQueryClient();
  const isPostDetailsQuery = (queryKey: readonly unknown[]) =>
    queryKey[0] === "post-details" &&
    queryKey[2] === postId &&
    queryKey[3] === mediaId;

  return useMutation({
    mutationFn: (isLiked: boolean) => postService.likePost(postId, isLiked),
    onMutate: async (isLiked: boolean) => {
      await queryClient.cancelQueries({
        predicate: (query) => isPostDetailsQuery(query.queryKey),
      });
      const previous = queryClient.getQueriesData<any>({
        predicate: (query) => isPostDetailsQuery(query.queryKey),
      });
      previous.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData(key, {
          ...data,
          isLiked: !isLiked,
          likesCount: Math.max(0, (data.likesCount ?? 0) + (isLiked ? -1 : 1)),
        });
      });
      return { previous };
    },
    onError: (_err, _isLiked, context) => {
      context?.previous.forEach(([key, data]: [any, any]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
}

export function useLikeFeedPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isLiked, postId }: { postId: string; isLiked: boolean }) =>
      postService.likePost(postId, isLiked),
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ["feed-posts"] });
      const previous = queryClient.getQueryData<any>(["feed-posts"]);
      queryClient.setQueryData<any>(["feed-posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: (page.data ?? []).map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    is_liked: !isLiked,
                    likes_count: Math.max(
                      0,
                      (post.likes_count ?? 0) + (isLiked ? -1 : 1),
                    ),
                  }
                : post,
            ),
          })),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["feed-posts"], context.previous);
      }
    },
  });
}

export function useCommentsQuery(postId: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["post-comments", postId],
    enabled: !!postId && enabled,
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      return postService.getComments(postId, pageParam, 20);
    },
    getNextPageParam: (lastPage: any) => {
      if (!lastPage?.data?.length) return undefined;
      const nextOffset = (lastPage.offset || 1) + 1;
      const totalPages = Math.ceil(
        (lastPage.total || 0) / (lastPage.limit || 20),
      );
      return nextOffset <= totalPages ? nextOffset : undefined;
    },
    initialPageParam: 1,
  });
}

export function useAddCommentMutation(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => postService.addComment(postId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "post-details" && query.queryKey[2] === postId,
      });
    },
  });
}
