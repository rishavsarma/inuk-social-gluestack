import { useCallback, useEffect, useLayoutEffect, useState } from "react";

import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useIsFocused } from "expo-router";
import { useVideoPlayer, VideoView, type VideoPlayer } from "expo-video";

import { Platform, StyleSheet, View } from "react-native";

import { Volume2, VolumeX } from "lucide-react-native";
import { useTranslation } from "react-i18next";

import { useFeedVideoStore } from "@/stores/feed-video.store";

import { useSettingStore } from "@/stores/setting.store";
import { Button, ButtonIcon } from "@/components/ui/button";

interface FeedPostVideoProps {
  id: string;
  uri: string;
  /** Thumbnail shown behind the player while the video buffers its first
   * frame — without it, a freshly recycled/mounted FlashList item shows a
   * blank surface for a beat before playback starts. */
  posterUri?: string;
}

function applyPlayerMuted(player: VideoPlayer, muted: boolean) {
  player.muted = muted;
}

function FeedPostVideo({ id, uri, posterUri }: FeedPostVideoProps) {
  const { t } = useTranslation();
  const { theme } = useSettingStore();
  const isDark = theme === "dark";

  const isActive = useFeedVideoStore((s) => s.activeVideoId === id);
  // The feed list only updates `activeVideoId` on scroll, so it doesn't
  // change when navigating away to another screen (e.g. post detail).
  // Gate playback on focus too, otherwise this video keeps playing behind
  // whatever screen you navigated to.
  const isFocused = useIsFocused();

  const player = useVideoPlayer({ uri }, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (isActive && isFocused) player.play();
    else player.pause();
  }, [isActive, isFocused, player]);

  // Pause on unmount. Must be a layout effect: on unmount React runs
  // layout-effect cleanups before passive-effect cleanups, and
  // useVideoPlayer releases the native player in a passive cleanup
  // declared earlier in this component. A plain useEffect here would run
  // after that release — pause() would throw on the dead object and the
  // native player could keep playing audio until it's deallocated.
  useLayoutEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {}
    };
  }, [player]);

  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    applyPlayerMuted(player, isMuted);
  }, [player, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((muted) => !muted);
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      {!!posterUri && (
        <Image
          source={{ uri: posterUri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          alt={t("feed.video_thumbnail_alt")}
        />
      )}
      <VideoView
        style={{ width: "100%", height: "100%" }}
        player={player}
        nativeControls={false}
        contentFit="cover"
        surfaceType={Platform.OS === "android" ? "textureView" : undefined}
      />
      <View className="absolute bottom-3 right-3 overflow-hidden rounded-full z-100 shadow-lg">
        <BlurView
          intensity={Platform.OS === "android" ? 100 : 70}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
        <Button
          onPress={toggleMute}
          accessibilityRole="button"
          accessibilityLabel={
            isMuted ? t("feed.unmute_video") : t("feed.mute_video")
          }
          className="items-center justify-center bg-white/40 px-3 py-2  dark:bg-black/30"
        >
          <ButtonIcon
            size="lg"
            as={isMuted ? VolumeX : Volume2}
            className="text-foreground"
          />
        </Button>
      </View>
    </View>
  );
}

export { FeedPostVideo };
