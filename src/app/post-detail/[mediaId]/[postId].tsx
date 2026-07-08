import {
  KeyboardAvoidingScrollView,
  useKeyboardAvoidingScrollViewScrollY,
} from "@/components/custom/KeyboardAvoidingScrollView";
import { PostCameraCard } from "@/components/custom/Post/PostCameraCard";
import PostCaption from "@/components/custom/Post/PostCaption";
import { PostEnvironmentCard } from "@/components/custom/Post/PostEnvironmentCard";
import { PostAwardsCard } from "@/components/custom/Post/PostAwardsCard";
import { PostFloatingActions } from "@/components/custom/Post/PostFloatingActions";
import { PostPerformanceCard } from "@/components/custom/Post/PostPerformanceCard";
import PostPhotoGallery from "@/components/custom/Post/PostPhotoGallery";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { POST_CONSTANTS } from "@/constants";
import { useAppBottomInset } from "@/hooks/useAppInsets";
import { usePostPhotoDetailsQuery } from "@/hooks/usePosts";
import { useAuthStore } from "@/stores/auth.store";
import { useLocalSearchParams } from "expo-router";
import {
  CameraIcon,
  ClockIcon,
  CompassIcon,
  LucideIcon,
  MapPinIcon,
  MountainIcon,
  SunIcon,
} from "lucide-react-native";
import { useMemo } from "react";
import { useColorScheme, View } from "react-native";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const PostDetailContent = ({ formattedPost }: { formattedPost: any }) => {
  const scrollY = useKeyboardAvoidingScrollViewScrollY();

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
      <PostPhotoGallery post={formattedPost} />
    </Animated.View>
  );
};

const PostDetail = () => {
  const { mediaId, postId, id, profile_id, type } = useLocalSearchParams<{
    mediaId: string;
    postId: string;
    id: string;
    profile_id: string;
    type: string;
  }>();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const user = useAuthStore((s) => s.user);
  const my_profile_id = user?.profileId || profile_id;
  const bottomInset = useAppBottomInset();

  const { data: postDetails, isLoading } = usePostPhotoDetailsQuery(
    id,
    postId,
    mediaId,
    profile_id,
    my_profile_id,
  );

  const formattedPost = useMemo<PostDetail | null>(() => {
    if (!postDetails || !postDetails.post) return null;

    const apiProfile = postDetails.profile?.data[0];
    const apiPost = postDetails.post?.data[0];
    const apiExif = postDetails.exif?.data?.[0];
    const apiFollowing = postDetails.following;
    const apiLiked = postDetails?.isLiked ?? false;

    // ── Build arrays first, then reference them ─────────────────────
    const cameraExif: { icon: LucideIcon; label: string; value: string }[] = [];
    const weatherInfo: { icon: LucideIcon; label: string; value: string }[] =
      [];

    if (apiExif) {
      if (apiExif.cameraMake || apiExif.cameraModel)
        cameraExif.push({
          icon: CameraIcon,
          label: "Camera",
          value:
            `${apiExif.cameraMake || ""} ${apiExif.cameraModel || ""}`.trim(),
        });
      if (apiExif.lensModel)
        cameraExif.push({
          icon: CameraIcon,
          label: "Lens",
          value: apiExif.lensModel,
        });
      if (apiExif.focalLengthMm)
        cameraExif.push({
          icon: CameraIcon,
          label: "Focal Length",
          value: `${apiExif.focalLengthMm}mm`,
        });
      if (apiExif.fnumber)
        cameraExif.push({
          icon: CameraIcon,
          label: "Aperture",
          value: `f/${apiExif.fnumber}`,
        });
      if (apiExif.exposureTimeText || apiExif.exposureTimeSeconds)
        cameraExif.push({
          icon: CameraIcon,
          label: "Shutter",
          value: apiExif.exposureTimeText || `${apiExif.exposureTimeSeconds}s`,
        });
      if (apiExif.iso)
        cameraExif.push({
          icon: SunIcon,
          label: "ISO",
          value: apiExif.iso.toString(),
        });
      if (apiExif.takenAt)
        cameraExif.push({
          icon: ClockIcon,
          label: "Date Taken",
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
          label: "Date Uploaded",
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
        label: "Location",
        value: apiPost.place,
      });

    if (apiExif?.latitude && apiExif?.longitude) {
      const lat = Number(apiExif.latitude);
      const lng = Number(apiExif.longitude);
      if (!isNaN(lat) && !isNaN(lng))
        weatherInfo.push({
          icon: CompassIcon,
          label: "Coordinates",
          value: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
    }

    if (apiExif?.altitude) {
      const alt = Number(apiExif.altitude);
      if (!isNaN(alt))
        weatherInfo.push({
          icon: MountainIcon,
          label: "Altitude",
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
      is_following: apiFollowing?.status === "PENDING",
      date_joined: apiProfile?.dateCreated
        ? new Date(apiProfile.dateCreated).toISOString()
        : null,
      is_me: apiProfile?.id === my_profile_id,
    };

    const media =
      postDetails.media?.data && postDetails.media.data.length > 0
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
  }, [postDetails, id, type, my_profile_id]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Loading…</Text>
      </View>
    );
  }

  if (!formattedPost) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Post not found.</Text>
      </View>
    );
  }

  const isVideo = formattedPost.post.type === "video";

  console.log(formattedPost.post.id);

  return (
    <View className="flex-1">
      <KeyboardAvoidingScrollView disableTopInset>
        <PostDetailContent formattedPost={formattedPost} />
        <VStack space="sm" className="bg-background pb-40">
          <PostCaption post={formattedPost} />
          {formattedPost.camera.cameraExif && (
            <Animated.View entering={FadeInDown.delay(150).duration(400)}>
              <PostCameraCard cameraExif={formattedPost.camera.cameraExif} />
            </Animated.View>
          )}
          <PostEnvironmentCard post={formattedPost} />
          <PostPerformanceCard
            likesCount={formattedPost.post.likes_count}
            commentsCount={formattedPost.post.comments_count}
            viewsCount={0}
            sharesCount={0}
            awardsCount={0}
            score={0}
          />
          <PostAwardsCard />
        </VStack>
      </KeyboardAvoidingScrollView>
      <PostFloatingActions
        likesCount={formattedPost.post.likes_count}
        commentsCount={formattedPost.post.comments_count}
        isLiked={formattedPost.post.is_liked}
        // isDark={isDark}
        bottomInset={bottomInset}
      />
    </View>
  );
};

export default PostDetail;
