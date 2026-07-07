import { api } from "./api";

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
      followingRes,
      postRes,
      photoRes,
      exifRes,
      weatherRes,
      isLikedRes,
      statRes,
    ] = await Promise.all([
      api.get(`/iam/profile/search?search=${profileSearchStr}`),
      api.get(`/iam/following/connection/${profileId}`),
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
      following: followingRes.data,
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
      followingRes,
      postRes,
      videoRes,
      exifRes,
      weatherRes,
      isLikedRes,
      statRes,
    ] = await Promise.all([
      api.get(`/iam/profile/search?search=${profileSearchStr}`),
      api.get(`/iam/following/connection/${profileId}`),
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
      following: followingRes.data,
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
};
