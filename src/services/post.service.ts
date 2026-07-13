import { useAuthStore } from "@/stores/auth.store";
import { api } from "./api";
import { getFollowingConnectionSafe, profileService } from "./profile.service";

export const postService = {
  createPost: async (payload: any) => {
    const { data } = await api.post("/content/api/post", payload);
    return data;
  },

  likePost: async (postId: string, liked: boolean) => {
    if (liked) {
      const { data } = await api.delete(`/content/api/posts/${postId}/like`);
      return data;
    } else {
      const { data } = await api.post(`/content/api/posts/${postId}/like`);
      return data;
    }
  },

  // deletePost: async (postId: string) => {
  //   const { data } = await api.delete(`content/api/posts/${postId}`);
  //   return data;
  // },

  getComments: async (postId: string, offset: number, limit: number = 5) => {
    const { data } = await api.get(`/content/api/comment/content/${postId}`, {
      params: { contentType: "POST", offset, limit },
    });

    if (data && data.data && data.data.length > 0) {
      const uniqueProfileIds = Array.from(
        new Set(data.data.map((c: any) => c.profileId).filter(Boolean)),
      ) as string[];

      try {
        const profilesRes = await Promise.all(
          uniqueProfileIds.map((id) =>
            api.get(`/iam/profile/${id}`).catch(() => null),
          ),
        );
        const profileMap = new Map<string, any>();

        profilesRes.forEach((res, idx) => {
          if (res?.data) {
            profileMap.set(uniqueProfileIds[idx], res.data.data || res.data);
          }
        });

        data.data = data.data.map((c: any) => ({
          ...c,
          profile: profileMap.get(c.profileId),
        }));
      } catch (error) {
        console.warn("Failed to fetch some profiles for comments:", error);
      }
    }
    return data;
  },

  addComment: async (
    postId: string,
    text: string,
    parentCommentId?: string,
  ) => {
    const { data } = await api.post("/content/api/comment", {
      contentId: postId,
      contentType: "POST",
      text,
      parentCommentId: parentCommentId || null,
    });
    return data;
  },

  getPostAwards: async (postId: string): Promise<Award[]> => {
    try {
      const searchStr = JSON.stringify({
        dataOption: "all",
        criteria: [{ filterKey: "postId", operation: "eq", value: postId }],
      });
      const response = await api.get<any>(
        `/content/api/award/search?search=${encodeURIComponent(searchStr)}`,
      );
      const awardsArray = response.data?.data || response.data;
      if (Array.isArray(awardsArray) && awardsArray.length > 0) {
        return awardsArray;
      }
    } catch (error) {
      console.warn(
        `[postService.getPostAwards] Failed to fetch awards from API for post ${postId}, falling back to mock data:`,
        error,
      );
    }

    // Mock fallback data based on postId
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate networking

    return [
      {
        id: `mock-award-spotlight-${postId}`,
        postId,
        shape: "shield",
        theme: "gold",
        period: "WEEK 25",
        rank: "1",
        suffix: "ST",
        label: "SPOTLIGHT",
        value: "1st Place Winner",
        description:
          "Ranked #1 in Uttarakhand weekly spotlight contest for outstanding cinematography.",
      },
      {
        id: `mock-award-creator-${postId}`,
        postId,
        shape: "octagon",
        theme: "silver",
        period: "JUNE 2026",
        rank: "5",
        suffix: "%",
        label: "CREATOR",
        value: "Top 5% Votes",
        description:
          "Awarded to creators who received votes placing them in the top 5% overall for June.",
      },
      {
        id: `mock-award-himalayan-${postId}`,
        postId,
        shape: "octagon-round",
        theme: "bronze",
        period: "2026",
        rank: "10",
        suffix: "%",
        label: "HIMALAYAN",
        value: "Top 10% Votes",
        description:
          "Recognized for ranking in the top 10% of overall engagement and community votes.",
      },
      {
        id: `mock-award-hidden-${postId}`,
        postId,
        shape: "scallop",
        theme: "#EF4444",
        period: "Q2 2026",
        rank: "WIN",
        suffix: "",
        label: "CHOICE",
        value: "Spotlight Choice",
        description:
          "Recognized for uncovering and documenting a unique, off-the-beaten-path Himalayan destination.",
      },
      {
        id: `mock-award-favorite-${postId}`,
        postId,
        shape: "circle",
        theme: "#3B82F6",
        period: "WEEK 24",
        rank: "TOP",
        suffix: "",
        label: "FAVORITE",
        value: "Most Loved Post",
        description:
          "Awarded for receiving the highest number of comments and community interactions in a single week.",
      },
    ];
  },

  getProfileMedia: async (
    profileId: string,
    offset: number,
    limit: number = 100,
  ) => {
    const searchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"profileId", "operation": "eq", "value": "${profileId}" } ] }`;
    const { data } = await api.get(
      `/content/api/photo/search?search=${searchStr}`,
      {
        params: { offset: offset + 1, limit },
      },
    );
    return data;
  },

  getPostPhotoList: async (
    profileId: string,
    offset: number = 1,
    limit: number = 50,
  ) => {
    const mediaSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"profileId", "operation": "eq", "value": "${profileId}" } ] }`;
    const mediaSortStr = `{ "criteria": [ { "by": "dateUpdated", "order": "desc" } ] }`;
    const limitStr = `&offset=${offset}&limit=${limit}`;

    const { data } = await api.get(
      `/content/api/photo/search?search=${mediaSearchStr}&sort=${mediaSortStr}${limitStr}`,
    );
    return data;
  },
  getPostVideoList: async (
    profileId: string,
    offset: number = 1,
    limit: number = 50,
  ) => {
    const mediaSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"profileId", "operation": "eq", "value": "${profileId}" } ] }`;
    const mediaSortStr = `{ "criteria": [ { "by": "dateUpdated", "order": "desc" } ] }`;
    const limitStr = `&offset=${offset}&limit=${limit}`;

    const { data } = await api.get(
      `/content/api/video/search?sort=${mediaSortStr}${limitStr}`,
    );
    return data;
  },

  getPostPhotoDetails: async (
    id: string,
    postId: string,
    mediaId: string,
    profileId: string,
    myProfileId: string,
  ) => {
    const profileSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"id", "operation": "eq", "value": "${profileId}" } ] }`;
    const postSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"id", "operation": "eq", "value": "${postId}" } ] }`;
    const mediaSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"postId", "operation": "eq", "value": "${postId}" } ] }`;
    const mediaSortStr = `{ "criteria": [ { "by": "dateUpdated", "order": "desc" } ] }`;
    const exifSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"entityId", "operation": "eq", "value": "${id}"}, { "filterKey":"entityType", "operation": "eq", "value": "PHOTO"}]}`;
    const exifSortStr = `{ "criteria": [ { "by": "dateUpdated", "order": "desc" } ] }`;
    const weatherSearchStr = `{ "dataOption": "any", "criteria": [ { "filterKey":"mediaId", "operation": "eq", "value": "${mediaId}"}]}`;

    const [
      profileRes,
      following,
      postRes,
      photoRes,
      exifRes,
      weatherRes,
      isLikedRes,
      statRes,
    ] = await Promise.all([
      api.get(`/iam/profile/search?search=${profileSearchStr}`),
      getFollowingConnectionSafe(profileId, myProfileId),
      api.get(`/content/api/post/search?search=${postSearchStr}`),
      api.get(
        `/content/api/photo/search?search=${mediaSearchStr}&sort=${mediaSortStr}`,
      ),
      api.get(
        `/content/api/exif/search?search=${exifSearchStr}&sort=${exifSortStr}`,
      ),
      api.get(`/content/api/weather/search?search=${weatherSearchStr}`),
      api.get(
        `/content/api/like/interaction/${postId}?contentType=POST&profileId=${myProfileId}`,
      ),
      api.get(`/content/api/stat/content?contentId=${postId}&contentType=POST`),
    ]);

    const statData = statRes.data || [];
    const likesCount =
      statData.find((s: any) => s.statType === "LIKE")?.count || 0;
    const commentsCount =
      statData.find((s: any) => s.statType === "COMMENT")?.count || 0;

    return {
      profile: profileRes.data,
      following,
      post: postRes.data,
      media: photoRes.data,
      exif: exifRes.data,
      weather: weatherRes.data,
      isLiked: isLikedRes.data.length > 0,
      likesCount,
      commentsCount,
    };
  },

  getPostVideoDetails: async (
    id: string,
    postId: string,
    mediaId: string,
    profileId: string,
    myProfileId: string,
  ) => {
    const profileSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"id", "operation": "eq", "value": "${profileId}" } ] }`;
    const postSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"id", "operation": "eq", "value": "${postId}" } ] }`;
    const mediaSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"postId", "operation": "eq", "value": "${postId}" } ] }`;
    const mediaSortStr = '{"criteria":[{"by":"dateUpdated","order": "desc"}]}';
    const exifSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"entityId", "operation": "eq", "value": "${id}"}, { "filterKey":"entityType", "operation": "eq", "value": "VIDEO"}]}`;
    const exifSortStr = '{"criteria":[{"by":"dateUpdated","order": "desc"}]}';
    const weatherSearchStr = `{ "dataOption": "any", "criteria": [ { "filterKey":"mediaId", "operation": "eq", "value": "${mediaId}"}]}`;

    const [
      profileRes,
      following,
      postRes,
      videoRes,
      exifRes,
      weatherRes,
      isLikedRes,
      statRes,
    ] = await Promise.all([
      api.get(`/iam/profile/search?search=${profileSearchStr}`),
      getFollowingConnectionSafe(profileId, myProfileId),
      api.get(`/content/api/post/search?search=${postSearchStr}`),
      api.get(
        `/content/api/video/search?search=${mediaSearchStr}&sort=${mediaSortStr}`,
      ),
      api.get(
        `/content/api/exif/search?search=${exifSearchStr}&sort=${exifSortStr}`,
      ),
      api.get(`/content/api/weather/search?search=${weatherSearchStr}`),
      api.get(
        `/content/api/like/interaction/${postId}?contentType=POST&profileId=${myProfileId}`,
      ),
      api.get(`/content/api/stat/content?contentId=${postId}&contentType=POST`),
    ]);

    const statData = statRes.data || [];
    const likesCount =
      statData.find((s: any) => s.statType === "LIKE")?.count || 0;
    const commentsCount =
      statData.find((s: any) => s.statType === "COMMENT")?.count || 0;

    return {
      profile: profileRes.data,
      following,
      post: postRes.data,
      media: videoRes.data,
      exif: exifRes.data,
      weather: weatherRes.data,
      isLiked: isLikedRes.data.length > 0,
      likesCount,
      commentsCount,
    };
  },

  likeContent: async (postId: string) => {
    const payload = {
      contentId: postId,
      contentType: "POST",
    };
    const { data } = await api.post(`/content/api/like`, payload);
    return data;
  },

  commentContent: async (
    postId: string,
    comments: string,
    parentCommentId?: string,
  ) => {
    const { data } = await api.post(
      `/content/api/stat/content?contentId=${postId}&contentType=POST&statType=COMMENT`,
      { comments, parentCommentId },
    );
    return data;
  },
  getUserPosts: async (userId: string, offset: number, limit: number = 10) => {
    const { data } = await api.get(`/content/api/post`, {
      params: { profileId: userId, offset, limit },
    });
    if (data?.data) {
      data.data = data.data.map((post: any) => ({
        ...post,
        type: (post.postType || "text").toLowerCase(),
        media: post.media || [],
        created_at: post.dateCreated || new Date().toISOString(),
        is_liked: false,
        is_saved: false,
        likes_count: post.stats?.likes || 0,
        comments_count: post.stats?.comments || 0,
      }));
    }
    return data;
  },

  getProfileVideos: async (
    profileId: string,
    offset: number,
    limit: number = 10,
  ) => {
    const searchStr = `{ "dataOption": "all", "criteria": [ { "filterKey":"profileId", "operation": "eq", "value": "${profileId}" } ] }`;
    const searchSort = '{"criteria":[{"by":"dateUpdated","order": "desc"}]}';
    const { data } = await api.get(
      `/content/api/video/search?search=${searchStr}&sort=${searchSort}`,
      {
        params: { offset: offset + 1, limit },
      },
    );
    return data;
  },

  getFeedPosts: async (pageParam: number = 1, limit: number = 10) => {
    const myProfileId = useAuthStore.getState().user?.profileId;
    const response = await api.get<any>(`/content/api/post/search`, {
      params: {
        offset: pageParam,
        limit,
      },
    });
    const postsData = response.data?.data || response.data;
    const postsArray = Array.isArray(postsData) ? postsData : [];

    // Get unique profile IDs from the returned posts
    const uniqueProfileIds = Array.from(
      new Set(postsArray.map((p: any) => p.profileId).filter(Boolean)),
    ) as string[];

    // Fetch the profiles, and whether the current user follows each one, in parallel
    const profilePromises = uniqueProfileIds.map(async (profileId) => {
      const profilePromise = (async () => {
        try {
          const { data: profileRes } = await api.get(
            `/iam/profile/${profileId}`,
          );
          return profileRes?.data?.[0] || profileRes?.data || profileRes;
        } catch (e) {
          console.warn(`Failed to fetch profile for ID ${profileId}:`, e);
          return null;
        }
      })();

      const isFollowingPromise = (async () => {
        if (!myProfileId || profileId === myProfileId) return false;
        try {
          const connection =
            await profileService.getFollowingConnection(profileId);

          return (
            connection?.status === "ACTIVE" || connection?.status === "PENDING"
          );
        } catch (e) {
          return false;
        }
      })();

      const [profile, isFollowing] = await Promise.all([
        profilePromise,
        isFollowingPromise,
      ]);
      return { profileId, profile, isFollowing };
    });
    const profilesRes = await Promise.all(profilePromises);
    const profileMap = new Map(
      profilesRes.map((p) => [p.profileId, p.profile]),
    );
    const followingMap = new Map(
      profilesRes.map((p) => [p.profileId, p.isFollowing]),
    );

    // Fetch media, stats, and like interaction status for all retrieved posts in parallel
    const postDetailsPromises = postsArray.map(async (post: any) => {
      const isVideo = (post.postType || "PHOTO").toUpperCase() === "VIDEO";

      const mediaPromise = (async () => {
        try {
          if (isVideo) {
            const videoId = post.mediaId || post.videoId || post.id;
            const videoSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey": "id", "operation": "eq", "value": "${videoId}" } ] }`;
            const { data: mediaRes } = await api.get(
              `/content/api/video/search?search=${encodeURIComponent(videoSearchStr)}`,
            );
            if (!mediaRes?.data || mediaRes.data.length === 0) {
              const videoSearchByPostStr = `{ "dataOption": "all", "criteria": [ { "filterKey": "postId", "operation": "eq", "value": "${post.id}" } ] }`;
              const { data: fallbackRes } = await api.get(
                `/content/api/video/search?search=${encodeURIComponent(videoSearchByPostStr)}`,
              );
              return fallbackRes?.data || [];
            }
            return mediaRes?.data || [];
          } else {
            const mediaSearchStr = `{ "dataOption": "all", "criteria": [ { "filterKey": "postId", "operation": "eq", "value": "${post.id}" } ] }`;
            const mediaSortStr = `{ "criteria": [ { "by": "dateUpdated", "order": "desc" } ] }`;
            const { data: mediaRes } = await api.get(
              `/content/api/photo/search?search=${encodeURIComponent(mediaSearchStr)}&sort=${encodeURIComponent(mediaSortStr)}`,
            );
            return mediaRes?.data || [];
          }
        } catch (e) {
          return [];
        }
      })();

      const statsPromise = (async () => {
        try {
          const { data } = await api.get(
            `/content/api/stat/content?contentId=${post.id}&contentType=POST`,
          );
          return data?.data || data || [];
        } catch (e) {
          return [];
        }
      })();

      const likePromise = (async () => {
        try {
          if (!myProfileId) return false;
          const { data } = await api.get(
            `/content/api/like/interaction/${post.id}?contentType=POST&profileId=${myProfileId}`,
          );
          return Array.isArray(data) && data.length > 0;
        } catch (e) {
          return false;
        }
      })();

      const [media, stats, isLiked] = await Promise.all([
        mediaPromise,
        statsPromise,
        likePromise,
      ]);

      return {
        postId: post.id,
        media,
        stats,
        isLiked,
      };
    });

    const allPostDetails = await Promise.all(postDetailsPromises);
    const postDetailsMap = new Map(allPostDetails.map((d) => [d.postId, d]));

    const mapped = postsArray.map((post: any): PostDetail => {
      const postDetail = postDetailsMap.get(post.id);
      const mediaItems = postDetail?.media || [];
      const isVideo = (post.postType || "PHOTO").toUpperCase() === "VIDEO";
      const mappedMedia: PostMedia[] = mediaItems.map((m: any) => ({
        id: m.id || m.mediaId || String(Math.random()),
        url: isVideo
          ? m.hlsMasterUrl
          : `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${m.mediaId || m.id}/jpg/1080`,
        type: isVideo ? "video" : "image",
        width: m.width || 1080,
        height: m.height || 1080,
        thumbnail_url: isVideo ? m.thumbnailUrl : m.blurHash,
      }));

      const authorProfile = profileMap.get(post.profileId);
      const username = authorProfile?.username || "user";
      const display_name =
        authorProfile?.givenName ||
        `${authorProfile?.firstName || ""} ${authorProfile?.lastName || ""}`.trim() ||
        "Inuk User";
      const avatar_url =
        authorProfile?.avatar && authorProfile?.avatar !== "string"
          ? `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${authorProfile.avatar}/jpeg/720`
          : null;

      const stats = postDetail?.stats || [];
      const likes_count =
        stats.find((s: any) => s.statType === "LIKE")?.count || 0;
      const comments_count =
        stats.find((s: any) => s.statType === "COMMENT")?.count || 0;
      const shares_count =
        stats.find((s: any) => s.statType === "SHARE")?.count || 0;
      const saves_count =
        stats.find((s: any) => s.statType === "SAVE")?.count || 0;
      const is_liked = postDetail?.isLiked || false;

      const authorId = post.profileId || "84064d0c11c84e15bc3df02a2080ffe6";

      return {
        id: post.id,
        type: (post.postType || "photo").toLowerCase() as any,
        author: {
          id: authorId,
          username,
          display_name,
          avatar_url,
          is_verified: false,
          is_following: followingMap.get(post.profileId) ?? false,
          is_me: !!myProfileId && authorId === myProfileId,
        },
        caption: post.description || post.title || "",
        media: mappedMedia,
        likes_count,
        comments_count,
        shares_count,
        saves_count,
        is_liked,
        is_saved: false,
        location: post.place || null,
        tags: Array.isArray(post.tags) ? post.tags : [],
        created_at: post.dateCreated
          ? new Date(post.dateCreated).toISOString()
          : new Date().toISOString(),
        updated_at: post.dateUpdated
          ? new Date(post.dateUpdated).toISOString()
          : new Date().toISOString(),
      };
    });

    return {
      data: mapped,
      offset: response.data?.offset || pageParam,
      limit: response.data?.limit || 10,
      total: response.data?.total || 0,
    };
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage: any) => {
    if (!lastPage || !lastPage.data || lastPage.data.length === 0)
      return undefined;
    const nextOffset = (lastPage.offset || 1) + 1;
    const totalPages = Math.ceil(
      (lastPage.total || 0) / (lastPage.limit || 10),
    );
    return nextOffset <= totalPages ? nextOffset : undefined;
  },
};
