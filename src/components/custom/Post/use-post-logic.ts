import { useLikePostMutation } from '@/hooks/apis/use-queries';
import { formatDistanceToNow } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Dimensions, Share } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { toast } from 'sonner-native';

export function usePostLogic(post: Post) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const likeMutation = useLikePostMutation();

  const handleLike = React.useCallback(() => {
    likeMutation.mutate({ postId: post.id, liked: post.is_liked });
  }, [likeMutation, post.id, post.is_liked]);

  const handleShare = React.useCallback(() => {
    Share.share({
      message: post.caption ?? '',
      ...(post.media?.[0]?.url ? { url: post.media[0].url } : {}),
    });
  }, [post.caption, post.media]);

  const timeAgo = React.useMemo(() => {
    try {
      return formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
    } catch {
      return '';
    }
  }, [post.created_at]);

  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
      opacity: heartOpacity.value,
    };
  });

  const showHeartAnimation = React.useCallback(() => {
    heartScale.value = 0;
    heartOpacity.value = 0.9;
    heartScale.value = withTiming(1.3, { duration: 150 }, () => {
      heartScale.value = withTiming(1, { duration: 100 }, () => {
        heartOpacity.value = withTiming(0, { duration: 180 });
        heartScale.value = withTiming(0, { duration: 180 });
      });
    });
  }, [heartScale, heartOpacity]);

  const doubleTapGesture = React.useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(2)
        .runOnJS(true)
        .onEnd(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          if (!post.is_liked) {
            handleLike();
          }
          showHeartAnimation();
        }),
    [post.is_liked, handleLike, showHeartAnimation]
  );

  const singleTapGesture = React.useMemo(
    () =>
      Gesture.Tap()
        .numberOfTaps(1)
        .requireExternalGestureToFail(doubleTapGesture)
        .runOnJS(true)
        .onEnd(() => {
          toast.info('In Progress');
        }),
    [doubleTapGesture]
  );

  const gesture = React.useMemo(
    () => Gesture.Exclusive(doubleTapGesture, singleTapGesture),
    [doubleTapGesture, singleTapGesture]
  );

  const { width: windowWidth } = Dimensions.get('window');
  const cardWidth = windowWidth;
  const firstMedia = post.media?.[0];
  const aspectRatio =
    firstMedia?.width && firstMedia?.height ? firstMedia.width / firstMedia.height : 4 / 5;
  const mediaHeight = Math.min(cardWidth / aspectRatio, cardWidth * 1.3);

  return {
    isDark,
    router,
    timeAgo,
    handleLike,
    handleShare,
    animatedHeartStyle,
    gesture,
    cardWidth,
    mediaHeight,
  };
}
