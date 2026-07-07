import { POST_CONSTANTS } from "@/constants";
import { useEvent } from "expo";
import { Image } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";
import * as React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// ─── Exposed Controls State ────────────────────────────────────────────────

export interface VideoControlsState {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  trackWidth: number;
  progressAnimStyle: object;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onSeek: (e: any) => void;
  onTrackLayout: (e: any) => void;
  formatTime: (s: number) => string;
}

// ─── Props ────────────────────────────────────────────────────────────────

export interface PostVideoHeroProps {
  post: PostDetail;
  scrollY: SharedValue<number>;
  onControlsReady?: (state: VideoControlsState) => void;
}

// ─── Component ───────────────────────────────────────────────────────────

const PostVideoGallery = React.memo(function PostVideoHero({
  post,
  scrollY,
  onControlsReady,
}: PostVideoHeroProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);

  if (!post.post.media || post.post.media.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} className="bg-black">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) =>
          setCurrentMediaIndex(
            Math.round(
              e.nativeEvent.contentOffset.x / POST_CONSTANTS.SCREEN_WIDTH,
            ),
          )
        }
        scrollEventThrottle={16}
      >
        {post.post.media.map((m: any, idx: number) => (
          <View
            key={idx}
            style={{ width: POST_CONSTANTS.SCREEN_WIDTH, height: "100%" }}
          >
            <PostVideoHeroItem
              mediaObj={m}
              scrollY={scrollY}
              isActive={idx === currentMediaIndex}
              onControlsReady={
                idx === currentMediaIndex ? onControlsReady : undefined
              }
            />
          </View>
        ))}
      </ScrollView>

      {post.post.media.length > 1 && (
        <View
          className="absolute bottom-[136px] left-0 right-0 z-10 flex-row items-center justify-center gap-1"
          pointerEvents="none"
        >
          {post.post.media.map((_: unknown, idx: number) => (
            <IndicatorDot key={idx} isActive={idx === currentMediaIndex} />
          ))}
        </View>
      )}
    </View>
  );
});

// ─── Item ─────────────────────────────────────────────────────────────────

function PostVideoHeroItem({
  mediaObj,
  scrollY,
  isActive,
  onControlsReady,
}: {
  mediaObj: any;
  scrollY: SharedValue<number>;
  isActive: boolean;
  onControlsReady?: (state: VideoControlsState) => void;
}) {
  const videoViewRef = React.useRef<VideoView>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(true);

  const heroImage = mediaObj?.url || mediaObj?.uri;

  const player = useVideoPlayer({ uri: heroImage || "" }, (p) => {
    p.loop = true;
    p.muted = false;
    p.timeUpdateEventInterval = 0.1;
    if (isActive) p.play();
  });

  React.useEffect(() => {
    if (isActive) player.play();
    else player.pause();
  }, [isActive, player]);

  const playingEvent = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const isPlaying = playingEvent ? playingEvent.isPlaying : player.playing;

  const timeEvent = useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    currentOffsetFromLive: null,
    currentLiveTimestamp: null,
    bufferedPosition: 0,
  });
  const currentTime = timeEvent ? timeEvent.currentTime : player.currentTime;

  const mutedEvent = useEvent(player, "mutedChange", {
    muted: player.muted,
    oldMuted: undefined,
  });
  const isMuted = mutedEvent ? mutedEvent.muted : player.muted;

  useEvent(player, "statusChange", {
    status: player.status,
    oldStatus: undefined,
    error: undefined,
  });
  React.useEffect(() => {
    const status = player.status;
    if (status === "readyToPlay") {
      const t = setTimeout(() => setIsBuffering(false), 80);
      return () => clearTimeout(t);
    } else if (status === "loading" || status === "idle") {
      setIsBuffering(true);
    }
  }, [player.status]);

  const [trackWidth, setTrackWidth] = React.useState(0);

  const togglePlay = React.useCallback(() => {
    if (player.playing) player.pause();
    else player.play();
  }, [player]);

  const toggleMute = React.useCallback(() => {
    player.muted = !player.muted;
  }, [player]);

  const toggleFullscreen = React.useCallback(() => {
    videoViewRef.current?.enterFullscreen();
  }, []);

  const formatTime = React.useCallback((seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }, []);

  const handleSeek = React.useCallback(
    (e: any) => {
      if (trackWidth === 0) return;
      const x = e.nativeEvent.locationX;
      player.currentTime = (x / trackWidth) * (player.duration || 1);
    },
    [player, trackWidth],
  );

  const progressPercent =
    player.duration > 0 ? (currentTime / player.duration) * 100 : 0;
  const progressShared = useSharedValue(0);
  React.useEffect(() => {
    progressShared.value = progressPercent;
  }, [progressPercent, progressShared]);

  const progressAnimStyle = useAnimatedStyle(() => ({
    width: `${progressShared.value}%` as any,
  }));

  // Expose controls state to the parent so it can render them
  React.useEffect(() => {
    if (!onControlsReady || !isActive) return;
    onControlsReady({
      isPlaying,
      isMuted,
      currentTime,
      duration: player.duration,
      trackWidth,
      progressAnimStyle,
      onTogglePlay: togglePlay,
      onToggleMute: toggleMute,
      onToggleFullscreen: toggleFullscreen,
      onSeek: handleSeek,
      onTrackLayout: (e: any) => setTrackWidth(e.nativeEvent.layout.width),
      formatTime,
    });
  }, [isPlaying, isMuted, currentTime, player.duration, trackWidth, isActive]);

  const posterUri =
    mediaObj?.thumbnail_url || mediaObj?.url || mediaObj?.uri || null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView
        ref={videoViewRef}
        style={StyleSheet.absoluteFill}
        player={player}
        nativeControls={isFullscreen}
        contentFit="cover"
        onFullscreenEnter={() => setIsFullscreen(true)}
        onFullscreenExit={() => setIsFullscreen(false)}
      />

      {isBuffering && posterUri && (
        <Image
          source={{ uri: posterUri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={0}
        />
      )}

      {isBuffering && (
        <View
          style={StyleSheet.absoluteFill}
          className="items-center justify-center"
          pointerEvents="none"
        >
          <View className="h-12 w-12 items-center justify-center rounded-full bg-black/50">
            <ActivityIndicator size="small" color="#fff" />
          </View>
        </View>
      )}

      {!isFullscreen && (
        <Pressable onPress={togglePlay} style={StyleSheet.absoluteFill} />
      )}
    </View>
  );
}

// ─── Indicator Dot ─────────────────────────────────────────────────────────

function IndicatorDot({ isActive }: { isActive: boolean }) {
  const animStyle = useAnimatedStyle(() => ({
    width: withTiming(isActive ? 16 : 5, { duration: 150 }),
    backgroundColor: withTiming(
      isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)",
      { duration: 150 },
    ),
  }));
  return <Animated.View className="h-1.5 rounded-full" style={animStyle} />;
}

export default PostVideoGallery;
