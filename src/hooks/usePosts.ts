import { useMemo } from "react";

import { api } from "@/services/api";
import { postService } from "@/services/post.service";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/** Shape shared by getPostPhotoList/getPostVideoList — both return an
 * untyped raw envelope from the content search endpoints. */
interface PaginatedMediaResponse {
  data?: unknown[];
  total?: number;
}

export function useGetPhotoPosts(profileId: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["profile-photos", profileId],
    enabled: !!profileId && enabled,
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number;
    }): Promise<PaginatedMediaResponse> => {
      const { data } = await postService.getPostPhotoList(
        profileId,
        pageParam,
        50,
      );
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const allItems = allPages.flatMap((p) => p.data || []);
      if (allItems.length < (lastPage?.total ?? 0)) {
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
    queryFn: async ({
      pageParam,
    }: {
      pageParam: number;
    }): Promise<PaginatedMediaResponse> => {
      const { data } = await postService.getPostVideoList(
        profileId,
        pageParam,
        50,
      );
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const allItems = allPages.flatMap((p) => p.data || []);
      if (allItems.length < (lastPage?.total ?? 0)) {
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
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.length) return undefined;
      const nextOffset = (lastPage.offset || 1) + 1;
      const totalPages = Math.ceil(
        (lastPage.total || 0) / (lastPage.limit || 10),
      );
      return nextOffset <= totalPages ? nextOffset : undefined;
    },
    initialPageParam: 1,
    // Feed and category screens both subscribe to this key — without a
    // staleTime, mounting the second subscriber triggers a background
    // refetch that flips isRefetching (and the pull-to-refresh spinner)
    // on every screen sharing this query, not just the one navigated to.
    staleTime: 30_000,
  });
}

/** `useGetFeedPosts` flattened to the page items every consumer actually
 * wants — shared by the Feed screen and the category detail screen. */
export function useFeedPostsList() {
  const query = useGetFeedPosts();
  const posts = useMemo(
    () => query.data?.pages.flatMap((page) => page?.data ?? []) ?? [],
    [query.data],
  );
  return { ...query, posts };
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

type FeedPostsPage = Awaited<ReturnType<typeof postService.getFeedPosts>>;
interface FeedPostsInfiniteData {
  pages: FeedPostsPage[];
  pageParams: unknown[];
}

/** Feed and post-detail screens cache the same post under different query
 * keys ("feed-posts" vs "post-details") — liking from either place needs to
 * patch both, or the one you didn't just look at shows stale state until
 * its next refetch. */
function patchFeedPostsLikeCache(
  queryClient: ReturnType<typeof useQueryClient>,
  postId: string,
  isLiked: boolean,
) {
  const previous = queryClient.getQueryData<FeedPostsInfiniteData>([
    "feed-posts",
  ]);
  queryClient.setQueryData<FeedPostsInfiniteData>(["feed-posts"], (old) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: (page.data ?? []).map((post) =>
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
  return previous;
}

export function useLikePostMutation(postId: string, mediaId: string) {
  const queryClient = useQueryClient();
  const isPostDetailsQuery = (queryKey: readonly unknown[]) =>
    queryKey[0] === "post-details" &&
    queryKey[2] === postId &&
    queryKey[3] === mediaId;

  // Both usePostPhotoDetailsQuery and usePostVideoDetailsQuery cache under
  // "post-details" — only the fields this mutation actually reads/writes
  // are modeled here rather than the full photo/video detail union.
  interface PostDetailsCache {
    isLiked?: boolean;
    likesCount?: number;
  }

  return useMutation({
    mutationFn: (isLiked: boolean) => postService.likePost(postId, isLiked),
    onMutate: async (isLiked: boolean) => {
      await queryClient.cancelQueries({
        predicate: (query) => isPostDetailsQuery(query.queryKey),
      });
      await queryClient.cancelQueries({ queryKey: ["feed-posts"] });

      const previous = queryClient.getQueriesData<PostDetailsCache>({
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

      const previousFeedPosts = patchFeedPostsLikeCache(
        queryClient,
        postId,
        isLiked,
      );
      return { previous, previousFeedPosts };
    },
    onError: (_err, _isLiked, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      if (context?.previousFeedPosts) {
        queryClient.setQueryData(["feed-posts"], context.previousFeedPosts);
      }
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
      const previous = patchFeedPostsLikeCache(queryClient, postId, isLiked);
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
    getNextPageParam: (lastPage) => {
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
