import { POST_CONSTANTS } from "@/constants";
import { useMediaPagerIndex } from "@/hooks/useMediaPagerIndex";
import { useEvent } from "expo";
import { Image } from "expo-image";
import { useIsFocused } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { IndicatorDot } from "./IndicatorDot";

// ─── Exposed Controls State ────────────────────────────────────────────────

export interface VideoControlsState {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  /** Whether the control chrome (seekbar/play/mute/fullscreen) is showing.
   * Tapping the video toggles this; while it's false the caller should show
   * the author/user-detail overlay instead. */
  showControls: boolean;
  currentTime: number;
  duration: number;
  trackWidth: number;
  progressAnimStyle: object;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onToggleControls: () => void;
  onSeek: (e: any) => void;
  onTrackLayout: (e: any) => void;
  formatTime: (s: number) => string;
}

// ─── Props ────────────────────────────────────────────────────────────────

export interface PostVideoHeroProps {
  post: PostDetail;
  scrollY: SharedValue<number>;
  /** Whether the hero is currently scrolled into view. Playback pauses
   * when it isn't, even though the screen itself stays focused. */
  isVisible?: boolean;
  onControlsReady?: (state: VideoControlsState) => void;
}

// ─── Component ───────────────────────────────────────────────────────────

const PostVideoHero = React.memo(function PostVideoHero({
  post,
  scrollY,
  isVisible = true,
  onControlsReady,
}: PostVideoHeroProps) {
  const { currentIndex: currentMediaIndex, onScroll } = useMediaPagerIndex();

  if (!post.post.media || post.post.media.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} className="bg-black">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
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
              isVisible={isVisible}
              onControlsReady={
                idx === currentMediaIndex ? onControlsReady : undefined
              }
            />
          </View>
        ))}
      </ScrollView>

      {post.post.media.length > 1 && (
        <View
          className="absolute bottom-34 left-0 right-0 z-10 flex-row items-center justify-center gap-1"
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
  isVisible,
  onControlsReady,
}: {
  mediaObj: any;
  scrollY: SharedValue<number>;
  isActive: boolean;
  isVisible: boolean;
  onControlsReady?: (state: VideoControlsState) => void;
}) {
  const { t } = useTranslation();
  const videoViewRef = React.useRef<VideoView>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isBuffering, setIsBuffering] = React.useState(true);

  const heroImage = mediaObj?.url || mediaObj?.uri;

  const player = useVideoPlayer({ uri: heroImage || "" }, (p) => {
    p.loop = false;
    p.muted = false;
    p.timeUpdateEventInterval = 0.1;
  });

  // Tie playback directly to a reactive focus flag rather than an effect
  // cleanup — cleanup-based pausing depends on exactly when React runs it
  // relative to the screen's blur/unmount, which isn't reliable during
  // back navigation. `useIsFocused` re-renders this component the instant
  // the screen loses focus, so play/pause always reflects current reality.
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isActive && isFocused && isVisible) player.play();
    else player.pause();
  }, [isActive, isFocused, isVisible, player]);

  // Pause on unmount. Must be a layout effect: on unmount React runs
  // layout-effect cleanups before passive-effect cleanups, and
  // useVideoPlayer releases the native player in a passive cleanup
  // declared earlier in this component. A plain useEffect here would run
  // after that release — pause() would throw on the dead object and the
  // native AVPlayer would keep playing audio until it's deallocated.
  React.useLayoutEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {}
    };
  }, [player]);

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
  // Author details show by default; the settings button and the controls'
  // close (X) button explicitly toggle between the two panels.
  const [showControls, setShowControls] = React.useState(false);

  const togglePlay = React.useCallback(() => {
    if (player.playing) player.pause();
    else player.play();
  }, [player]);

  const toggleControls = React.useCallback(() => {
    setShowControls((v) => !v);
  }, []);

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
      isFullscreen,
      showControls,
      currentTime,
      duration: player.duration,
      trackWidth,
      progressAnimStyle,
      onTogglePlay: togglePlay,
      onToggleMute: toggleMute,
      onToggleFullscreen: toggleFullscreen,
      onToggleControls: toggleControls,
      onSeek: handleSeek,
      onTrackLayout: (e: any) => setTrackWidth(e.nativeEvent.layout.width),
      formatTime,
    });
  }, [
    isPlaying,
    isMuted,
    isFullscreen,
    showControls,
    currentTime,
    player.duration,
    trackWidth,
    isActive,
  ]);

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
          alt={t("post_detail.video_poster_alt")}
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
        <Pressable
          onPress={togglePlay}
          accessibilityRole="button"
          accessibilityLabel={
            isPlaying
              ? t("post_detail.pause_video")
              : t("post_detail.play_video")
          }
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  );
}

export default PostVideoHero;
