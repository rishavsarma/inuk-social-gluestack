import { useCallback, useEffect, useRef, useState } from "react";

import { BlurView } from "expo-blur";
import { useVideoPlayer, VideoView, type VideoPlayer } from "expo-video";

import { Dimensions, Platform, StyleSheet, View } from "react-native";

import { Volume2, VolumeX } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useAnimatedReaction } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { useFeedVideoStore } from "@/stores/feed-video.store";

import { useKeyboardAvoidingScrollViewScrollY } from "@/components/custom/KeyboardAvoidingScrollView";
import { useSettingStore } from "@/stores/setting.store";
import { Button, ButtonIcon } from "@/components/ui/button";

const VISIBILITY_SCROLL_DELTA = 4;

interface FeedPostVideoProps {
  id: string;
  uri: string;
}

function applyPlayerMuted(player: VideoPlayer, muted: boolean) {
  player.muted = muted;
}

function FeedPostVideo({ id, uri }: FeedPostVideoProps) {
  const { t } = useTranslation();
  const { theme } = useSettingStore();
  const isDark = theme === "dark";

  const containerRef = useRef<View>(null);
  const scrollY = useKeyboardAvoidingScrollViewScrollY();
  const reportVisibility = useFeedVideoStore((s) => s.reportVisibility);
  const removeVideo = useFeedVideoStore((s) => s.removeVideo);
  const isActive = useFeedVideoStore((s) => s.activeVideoId === id);

  const measureVisibility = useCallback(() => {
    containerRef.current?.measure((_x, _y, width, height, _pageX, pageY) => {
      if (!height) return;
      const windowHeight = Dimensions.get("window").height;
      const visibleTop = Math.max(pageY, 0);
      const visibleBottom = Math.min(pageY + height, windowHeight);
      const visibleHeight = Math.max(visibleBottom - visibleTop, 0);
      reportVisibility(id, visibleHeight / height);
    });
  }, [id, reportVisibility]);

  useAnimatedReaction(
    () => scrollY?.value ?? 0,
    (current, previous) => {
      if (
        previous === null ||
        Math.abs(current - previous) > VISIBILITY_SCROLL_DELTA
      ) {
        scheduleOnRN(measureVisibility);
      }
    },
  );

  useEffect(() => {
    measureVisibility();
    return () => removeVideo(id);
  }, [measureVisibility, removeVideo, id]);

  const player = useVideoPlayer({ uri }, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (isActive) player.play();
    else player.pause();
  }, [isActive, player]);

  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    applyPlayerMuted(player, isMuted);
  }, [player, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((muted) => !muted);
  }, []);

  return (
    <View
      ref={containerRef}
      style={StyleSheet.absoluteFill}
      onLayout={measureVisibility}
    >
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
