import {
  KeyboardAvoidingScrollView,
  useKeyboardAvoidingScrollViewScrollY,
} from "@/components/custom/KeyboardAvoidingScrollView";
import { PostCameraCard } from "@/components/custom/Post/PostCameraCard";
import PostCaption from "@/components/custom/Post/PostCaption";
import { PostEnvironmentCard } from "@/components/custom/Post/PostEnvironmentCard";
import PostAuthorHeader from "@/components/custom/Post/PostAuthorHeader";
import { PostAwardsCard } from "@/components/custom/Post/PostAwardsCard";
import { PostBadgesCard } from "@/components/custom/Post/PostBadgesCard";
import { PostCommentsModal } from "@/components/custom/Post/PostCommentsModal";
import { PostDetailSkeleton } from "@/components/custom/Post/PostDetailSkeleton";
import { PostFloatingActions } from "@/components/custom/Post/PostFloatingActions";
import { PostPerformanceCard } from "@/components/custom/Post/PostPerformanceCard";
import PostPhotoGallery from "@/components/custom/Post/PostPhotoGallery";
import PostVideoHero, {
  VideoControlsState,
} from "@/components/custom/Post/PostVideoHero";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Toast, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { POST_CONSTANTS } from "@/constants";
import { useAppBottomInset, useAppTopInset } from "@/hooks/useAppInsets";
import {
  useAddCommentMutation,
  useCommentsQuery,
  useLikePostMutation,
  usePostPhotoDetailsQuery,
  usePostVideoDetailsQuery,
} from "@/hooks/usePosts";
import { useFollowUser } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import {
  CameraIcon,
  ClockIcon,
  CompassIcon,
  LucideIcon,
  MapPinIcon,
  Maximize,
  MountainIcon,
  Pause,
  Play,
  SunIcon,
  Volume2,
  VolumeX,
  X,
} from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  Pressable,
  Share,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  interpolate,
  runOnJS,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";

const PostDetailContent = ({
  formattedPost,
  onFollowPress,
  isFollowLoading,
}: {
  formattedPost: any;
  onFollowPress: () => void;
  isFollowLoading?: boolean;
}) => {
  const scrollY = useKeyboardAvoidingScrollViewScrollY();
  const { t } = useTranslation();
  const isVideo = formattedPost.post.type === "video";
  const [videoControls, setVideoControls] = useState<VideoControlsState | null>(
    null,
  );

  const handleControlsReady = useCallback((state: VideoControlsState) => {
    setVideoControls(state);
  }, []);

  // The hero video sits at the top of the scroll content, not pinned —
  // scrolling past it moves it off-screen without unmounting or blurring
  // the route, so playback must be gated on scroll position too, not just
  // navigation focus.
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  useAnimatedReaction(
    () => (scrollY ? scrollY.value < POST_CONSTANTS.HERO_HEIGHT : true),
    (visible, previous) => {
      if (visible !== previous) runOnJS(setIsHeroVisible)(visible);
    },
  );

  const heroAnimatedStyle = useAnimatedStyle(() => {
    const scrollYValue = scrollY ? scrollY.value : 0;
    return {
      transform: [
        {
          translateY: interpolate(
            scrollYValue,
            [-POST_CONSTANTS.HERO_HEIGHT, 0, POST_CONSTANTS.HERO_HEIGHT],
            [
              -POST_CONSTANTS.HERO_HEIGHT / 2,
              0,
              POST_CONSTANTS.HERO_HEIGHT * 0.4,
            ],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollYValue,
            [-POST_CONSTANTS.HERO_HEIGHT, 0],
            [1.8, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        heroAnimatedStyle,
        {
          height: POST_CONSTANTS.HERO_HEIGHT,
          width: POST_CONSTANTS.SCREEN_WIDTH,
          overflow: "hidden",
        },
      ]}
    >
      {isVideo ? (
        <>
          <PostVideoHero
            post={formattedPost}
            scrollY={scrollY!}
            isVisible={isHeroVisible}
            onControlsReady={handleControlsReady}
          />
          {videoControls &&
            !videoControls.isFullscreen &&
            (videoControls.showControls ? (
              <Animated.View
                key="controls"
                entering={SlideInRight.duration(280).easing(
                  Easing.out(Easing.cubic),
                )}
                exiting={SlideOutRight.duration(220).easing(
                  Easing.in(Easing.cubic),
                )}
                className="absolute bottom-4 left-4 right-4 z-20 overflow-hidden rounded-full shadow-lg"
                pointerEvents="box-none"
              >
                <BlurView
                  intensity={Platform.OS === "android" ? 100 : 70}
                  tint="dark"
                  style={StyleSheet.absoluteFill}
                />
                <HStack
                  space="sm"
                  className="items-center bg-black/45 py-2 pl-2 pr-3"
                >
                  <Pressable
                    onPress={videoControls.onTogglePlay}
                    accessibilityRole="button"
                    accessibilityLabel={
                      videoControls.isPlaying
                        ? t("post_detail.pause_video")
                        : t("post_detail.play_video")
                    }
                    hitSlop={8}
                    className="h-9 w-9 items-center justify-center"
                  >
                    <Icon
                      as={videoControls.isPlaying ? Pause : Play}
                      size="md"
                      className="text-white"
                    />
                  </Pressable>
                  <Text className="text-[12px] font-medium text-white">
                    {videoControls.formatTime(videoControls.currentTime)}
                  </Text>
                  <Pressable
                    onPress={videoControls.onSeek}
                    onLayout={videoControls.onTrackLayout}
                    hitSlop={{ top: 12, bottom: 12 }}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
                  >
                    <Animated.View
                      style={videoControls.progressAnimStyle}
                      className="h-full rounded-full bg-theme"
                    />
                  </Pressable>
                  <Text className="text-[12px] font-medium text-white">
                    {videoControls.formatTime(videoControls.duration)}
                  </Text>
                  <Pressable
                    onPress={videoControls.onToggleMute}
                    accessibilityRole="button"
                    accessibilityLabel={
                      videoControls.isMuted
                        ? t("feed.unmute_video")
                        : t("feed.mute_video")
                    }
                    hitSlop={8}
                    className="h-9 w-9 items-center justify-center"
                  >
                    <Icon
                      as={videoControls.isMuted ? VolumeX : Volume2}
                      size="md"
                      className="text-white"
                    />
                  </Pressable>
                  <Pressable
                    onPress={videoControls.onToggleFullscreen}
                    accessibilityRole="button"
                    accessibilityLabel={t("post_detail.fullscreen_video")}
                    hitSlop={8}
                    className="h-9 w-9 items-center justify-center"
                  >
                    <Icon as={Maximize} size="md" className="text-white" />
                  </Pressable>
                  <Pressable
                    onPress={videoControls.onToggleControls}
                    accessibilityRole="button"
                    accessibilityLabel={t("post_detail.close_video")}
                    hitSlop={8}
                    className="h-9 w-9 items-center justify-center"
                  >
                    <Icon as={X} size="md" className="text-white" />
                  </Pressable>
                </HStack>
              </Animated.View>
            ) : (
              <Animated.View
                key="author"
                entering={SlideInLeft.duration(280).easing(
                  Easing.out(Easing.cubic),
                )}
                exiting={SlideOutLeft.duration(220).easing(
                  Easing.in(Easing.cubic),
                )}
                className="absolute bottom-4 left-4 right-4 z-20"
                pointerEvents="box-none"
              >
                <PostAuthorHeader
                  post={formattedPost}
                  onOptionsPress={videoControls.onToggleControls}
                  onFollowPress={onFollowPress}
                  isFollowLoading={isFollowLoading}
                />
              </Animated.View>
            ))}
        </>
      ) : (
        <PostPhotoGallery
          post={formattedPost}
          onFollowPress={onFollowPress}
          isFollowLoading={isFollowLoading}
        />
      )}
    </Animated.View>
  );
};

const PostDetail = () => {
  const {
    mediaId,
    postId,
    id,
    profile_id,
    type,
    comments: openComments,
  } = useLocalSearchParams<{
    mediaId: string;
    postId: string;
    id: string;
    profile_id: string;
    type: string;
    comments?: string;
  }>();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const user = useAuthStore((s) => s.user);
  const my_profile_id = user?.profileId || profile_id;
  const bottomInset = useAppBottomInset();
  const topInset = useAppTopInset();
  const { t } = useTranslation();
  const toast = useToast();

  const isVideoPost = type === "video";

  const [showComments, setShowComments] = useState(
    () => openComments === "true",
  );
  const [commentText, setCommentText] = useState("");
  const [followOverride, setFollowOverride] = useState<boolean | null>(null);

  const likeMutation = useLikePostMutation(postId, mediaId);
  const { mutate: toggleFollow, isPending: isFollowPending } = useFollowUser();

  // Reset the optimistic override when navigating to a different profile's
  // post, per React's "adjusting state when a prop changes" pattern.
  const [followOverrideProfileId, setFollowOverrideProfileId] =
    useState(profile_id);
  if (profile_id !== followOverrideProfileId) {
    setFollowOverrideProfileId(profile_id);
    setFollowOverride(null);
  }
  const commentsQuery = useCommentsQuery(postId, showComments);
  const addCommentMutation = useAddCommentMutation(postId);

  const comments = useMemo<PostComment[]>(
    () =>
      commentsQuery.data?.pages.flatMap((page: any) => page?.data ?? []) ?? [],
    [commentsQuery.data],
  );

  const { data: photoDetails, isLoading: isLoadingPhoto } =
    usePostPhotoDetailsQuery(
      id,
      postId,
      mediaId,
      profile_id,
      my_profile_id,
      !isVideoPost,
    );
  const { data: videoDetails, isLoading: isLoadingVideo } =
    usePostVideoDetailsQuery(
      id,
      postId,
      mediaId,
      profile_id,
      my_profile_id,
      isVideoPost,
    );

  const postDetails = isVideoPost ? videoDetails : photoDetails;
  const isLoading = isVideoPost ? isLoadingVideo : isLoadingPhoto;

  const formattedPost = useMemo<PostDetail | null>(() => {
    if (!postDetails || !postDetails.post) return null;

    const apiProfile = postDetails.profile?.data[0];
    const apiPost = postDetails.post?.data[0];
    const apiExif = postDetails.exif?.data?.[0];
    const apiFollowing = postDetails.following;
    const apiLiked = postDetails?.isLiked ?? false;

    // ── Build arrays first, then reference them ─────────────────────
    const cameraExif: {
      icon: LucideIcon;
      type: string;
      label: string;
      value: string;
    }[] = [];
    const weatherInfo: {
      icon: LucideIcon;
      type: string;
      label: string;
      value: string;
    }[] = [];

    if (apiExif) {
      if (apiExif.cameraMake || apiExif.cameraModel)
        cameraExif.push({
          icon: CameraIcon,
          type: "camera",
          label: t("post_detail.camera"),
          value:
            `${apiExif.cameraMake || ""} ${apiExif.cameraModel || ""}`.trim(),
        });
      if (apiExif.lensModel)
        cameraExif.push({
          icon: CameraIcon,
          type: "lens",
          label: t("post_detail.lens"),
          value: apiExif.lensModel,
        });
      if (apiExif.focalLengthMm)
        cameraExif.push({
          icon: CameraIcon,
          type: "focal_length",
          label: t("post_detail.focal_length"),
          value: `${apiExif.focalLengthMm}mm`,
        });
      if (apiExif.fnumber)
        cameraExif.push({
          icon: CameraIcon,
          type: "aperture",
          label: t("post_detail.aperture"),
          value: `f/${apiExif.fnumber}`,
        });
      if (apiExif.exposureTimeText || apiExif.exposureTimeSeconds)
        cameraExif.push({
          icon: CameraIcon,
          type: "shutter",
          label: t("post_detail.shutter"),
          value: apiExif.exposureTimeText || `${apiExif.exposureTimeSeconds}s`,
        });
      if (apiExif.iso)
        cameraExif.push({
          icon: SunIcon,
          type: "iso",
          label: t("post_detail.iso"),
          value: apiExif.iso.toString(),
        });
      if (apiExif.takenAt)
        cameraExif.push({
          icon: ClockIcon,
          type: "date_taken",
          label: t("post_detail.date_taken"),
          value: new Date(apiExif.takenAt * 1000).toLocaleDateString(
            undefined,
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          ),
        });
      if (apiPost?.dateCreated)
        cameraExif.push({
          icon: ClockIcon,
          type: "date_uploaded",
          label: t("post_detail.date_uploaded"),
          value: new Date(apiPost.dateCreated).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        });
    }

    if (apiPost?.place)
      weatherInfo.push({
        icon: MapPinIcon,
        type: "location",
        label: t("post_detail.location"),
        value: apiPost.place,
      });

    if (apiExif?.latitude && apiExif?.longitude) {
      const lat = Number(apiExif.latitude);
      const lng = Number(apiExif.longitude);
      if (!isNaN(lat) && !isNaN(lng))
        weatherInfo.push({
          icon: CompassIcon,
          type: "coordinates",
          label: t("post_detail.coordinates"),
          value: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
    }

    if (apiExif?.altitude) {
      const alt = Number(apiExif.altitude);
      if (!isNaN(alt))
        weatherInfo.push({
          icon: MountainIcon,
          type: "altitude",
          label: t("post_detail.altitude"),
          value: `${Math.round(alt)}m`,
        });
    }

    const author = {
      profile_id: apiProfile?.id,
      username: apiProfile?.username ?? "user",
      display_name:
        apiProfile?.givenName ||
        `${apiProfile?.firstName ?? ""} ${apiProfile?.lastName ?? ""}`.trim() ||
        "User",
      avatar_url:
        apiProfile?.avatar && apiProfile?.avatar !== "string"
          ? `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${apiProfile.avatar}/jpeg/720`
          : "https://randomuser.me/api/portraits/men/32.jpg",
      is_following:
        followOverride ??
        (apiFollowing?.status === "ACTIVE" ||
          apiFollowing?.status === "PENDING"),
      date_joined: apiProfile?.dateCreated
        ? new Date(apiProfile.dateCreated).toISOString()
        : null,
      is_me: apiProfile?.id === my_profile_id,
    };

    const hasApiMedia =
      postDetails.media?.data && postDetails.media.data.length > 0;

    const media = isVideoPost
      ? hasApiMedia
        ? postDetails.media.data.map((m: Record<string, unknown>) => ({
            id: (m?.id as string) || id,
            url: m?.hlsMasterUrl as string,
            type: "video",
            width: (m?.width as number) || 1080,
            height: (m?.height as number) || 1920,
            thumbnail_url: m?.thumbnailUrl as string,
          }))
        : []
      : hasApiMedia
        ? postDetails.media.data.map((m: Record<string, unknown>) => ({
            id: (m?.id as string) || id,
            url: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${(m?.mediaId as string) || id}/jpg/1080`,
            type: "image",
            width: 1080,
            height: 1080,
            thumbnail_url: m?.blurHash as string,
          }))
        : [
            {
              id,
              url: `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${id}/jpg/1080`,
              type: "image",
              width: 1080,
              height: 1080,
            },
          ];

    return {
      author,
      post: {
        id: apiPost.id,
        title: apiPost.title,
        caption: apiPost.description || apiPost.title || "",
        type: apiPost.postType?.toLowerCase() || type || "photo",
        media,
        is_liked: apiLiked,
        likes_count: postDetails?.likesCount ?? (apiPost.stats?.likes || 0),
        comments_count:
          postDetails?.commentsCount ?? (apiPost.stats?.replies || 0),
        is_saved: false,
        created_at: new Date(apiPost.dateCreated).toISOString(),
      },
      camera: { cameraExif },
      performance: {
        likesCount: postDetails?.likesCount ?? 0,
        commentsCount: postDetails?.commentsCount ?? 0,
        viewsCount: 0,
        sharesCount: 0,
        awardsCount: 0,
        score: 0,
      },
      awards: { postId: apiPost.id },
      enviroment: {
        weatherInfo,
        latitude: apiExif?.latitude ? Number(apiExif.latitude) : undefined,
        longitude: apiExif?.longitude ? Number(apiExif.longitude) : undefined,
        place: apiPost.place,
      },
    };
  }, [postDetails, id, type, isVideoPost, my_profile_id, followOverride, t]);

  const handleFollowToggle = useCallback(() => {
    if (!formattedPost?.author.profile_id || !my_profile_id) return;
    const currentlyFollowing = formattedPost.author.is_following;
    setFollowOverride(!currentlyFollowing);
    toggleFollow({
      followerId: my_profile_id,
      followedId: formattedPost.author.profile_id,
      action: currentlyFollowing ? "UNFOLLOW" : "FOLLOW",
    });
  }, [formattedPost, my_profile_id, toggleFollow]);

  const handleLike = useCallback(() => {
    if (!formattedPost) return;
    likeMutation.mutate(formattedPost.post.is_liked, {
      onError: () => {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={`toast-${id}`} action="error" variant="solid">
              <ToastDescription>{t("post_detail.like_error")}</ToastDescription>
            </Toast>
          ),
        });
      },
    });
  }, [formattedPost, likeMutation, t, toast]);

  const handleShare = useCallback(async () => {
    if (!formattedPost) return;
    try {
      await Share.share({
        message: formattedPost.post.caption || formattedPost.post.title || "",
        ...(formattedPost.post.media?.[0]?.url
          ? { url: formattedPost.post.media[0].url }
          : {}),
      });
    } catch {
      // user dismissed the share sheet — nothing to do
    }
  }, [formattedPost]);

  const handleSubmitComment = useCallback(() => {
    const text = commentText.trim();
    if (!text) return;
    addCommentMutation.mutate(text, {
      onSuccess: () => setCommentText(""),
      onError: () => {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={`toast-${id}`} action="error" variant="solid">
              <ToastDescription>
                {t("post_detail.comments_modal.post_error")}
              </ToastDescription>
            </Toast>
          ),
        });
      },
    });
  }, [addCommentMutation, commentText, t, toast]);

  if (isLoading) {
    return (
      <KeyboardAvoidingScrollView disableTopInset showBackButton>
        <PostDetailSkeleton />
      </KeyboardAvoidingScrollView>
    );
  }

  if (!formattedPost) {
    return (
      <View
        style={{ paddingTop: topInset }}
        className="flex-1 bg-background items-center justify-center"
      >
        <Text className="text-muted-foreground">
          {t("post_detail.not_found")}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <KeyboardAvoidingScrollView
        disableTopInset
        showBackButton
        title={formattedPost.post.title || t("post_detail.title")}
        contentContainerStyle={{ paddingBottom: bottomInset + 40 }}
      >
        <PostDetailContent
          formattedPost={formattedPost}
          onFollowPress={handleFollowToggle}
          isFollowLoading={isFollowPending}
        />
        <VStack space="sm" className="bg-background">
          {formattedPost.post.caption && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <PostCaption post={formattedPost} />
            </Animated.View>
          )}

          <PostPerformanceCard
            likesCount={formattedPost.post.likes_count}
            commentsCount={formattedPost.post.comments_count}
            viewsCount={0}
            sharesCount={0}
            awardsCount={0}
            score={0}
          />
          {formattedPost.camera.cameraExif && (
            <Animated.View entering={FadeInDown.delay(150).duration(400)}>
              <PostCameraCard cameraExif={formattedPost.camera.cameraExif} />
            </Animated.View>
          )}
          <PostEnvironmentCard post={formattedPost} />
          <PostAwardsCard />
          <PostBadgesCard />
        </VStack>
      </KeyboardAvoidingScrollView>
      <PostFloatingActions
        likesCount={formattedPost.post.likes_count}
        commentsCount={formattedPost.post.comments_count}
        isLiked={formattedPost.post.is_liked}
        isDark={isDark}
        bottomInset={bottomInset}
        onLike={handleLike}
        onShare={handleShare}
        onComment={() => setShowComments(true)}
      />
      <PostCommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        comments={comments}
        totalComments={
          commentsQuery.data?.pages[0]?.total ??
          formattedPost.post.comments_count
        }
        isLoading={commentsQuery.isLoading}
        isFetchingNextPage={commentsQuery.isFetchingNextPage}
        isRefetching={commentsQuery.isRefetching}
        onEndReached={() => {
          if (commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage) {
            commentsQuery.fetchNextPage();
          }
        }}
        onRefresh={() => commentsQuery.refetch()}
        commentText={commentText}
        onChangeCommentText={setCommentText}
        onSubmitComment={handleSubmitComment}
        isSubmitting={addCommentMutation.isPending}
      />
    </View>
  );
};

export default PostDetail;
