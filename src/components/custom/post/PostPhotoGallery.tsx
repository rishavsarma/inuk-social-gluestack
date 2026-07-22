import { Box } from "@/components/ui/box";
import {
  ImageViewer,
  ImageViewerCloseButton,
  ImageViewerContent,
  ImageViewerCounter,
  ImageViewerNavigation,
} from "@/components/ui/image-viewer";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { VStack } from "@/components/ui/vstack";
import { POST_CONSTANTS } from "@/constants";
import { useMediaPagerIndex } from "@/hooks/useMediaPagerIndex";
import { Image } from "expo-image";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { IndicatorDot } from "./IndicatorDot";
import PostAuthorHeader from "./PostAuthorHeader";

const PostPhotoGallery = React.memo(function PostMediaGallery({
  post,
  onFollowPress,
  isFollowLoading,
}: PostMediaGalleryProps) {
  const { t } = useTranslation();
  const { currentIndex: currentMediaIndex, onScroll } = useMediaPagerIndex();
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const media = post.post.media;

  if (!media || media.length === 0) {
    return <View style={StyleSheet.absoluteFill} className="bg-neutral-800" />;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {media.map(
          (
            m: { url?: string; uri?: string; thumbnail_url?: string },
            idx: number,
          ) => (
            <Pressable
              key={idx}
              onPress={() => {
                setCurrentIndex(idx);
                setIsFullScreen(true);
              }}
              accessibilityRole="button"
              accessibilityLabel={t("post_detail.view_photo_a11y", {
                index: idx + 1,
                count: media.length,
              })}
            >
              <Image
                source={{ uri: m.url || m.uri }}
                style={{
                  width: POST_CONSTANTS.SCREEN_WIDTH,
                  height: POST_CONSTANTS.HERO_HEIGHT,
                }}
                contentFit="cover"
                placeholder={
                  m.thumbnail_url
                    ? {
                        blurhash: m.thumbnail_url,
                        width: POST_CONSTANTS.SCREEN_WIDTH,
                        height: POST_CONSTANTS.HERO_HEIGHT,
                      }
                    : undefined
                }
                transition={500}
                alt={t("post_detail.photo_alt", {
                  index: idx + 1,
                  name: post.author.display_name,
                })}
              />
            </Pressable>
          ),
        )}
      </ScrollView>

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 180,
        }}
        pointerEvents="none"
      />

      {/* ── Overlay inside the image at bottom ── */}
      <View
        className="absolute bottom-4 left-4 right-4 z-10 flex-row items-center justify-between"
        pointerEvents="box-none"
      >
        <VStack className="h-full w-full">
          {/* Mapped Indicator dots for main feed/view */}
          {post.post.media.length > 1 && (
            <Box className="flex-row items-center gap-2 bg-black/40 px-3 py-2 rounded-full justify-center flex-1">
              {post.post.media.map((_: unknown, idx: number) => (
                <IndicatorDot key={idx} isActive={idx === currentMediaIndex} />
              ))}
            </Box>
          )}
          {/* Avatar and name info pill */}
          <PostAuthorHeader
            post={post}
            onFollowPress={onFollowPress}
            isFollowLoading={isFollowLoading}
          />
        </VStack>
      </View>

      <ImageViewer
        images={media}
        isOpen={isFullScreen}
        onOpenChange={setIsFullScreen}
        onIndexChange={setCurrentIndex}
        initialIndex={currentIndex}
      >
        <ImageViewerContent>
          <ImageViewerCloseButton />
          <ImageViewerNavigation />
          {media.length > 1 && (
            <ImageViewerCounter variant="dots" className="pb-8" />
          )}
        </ImageViewerContent>
      </ImageViewer>
    </View>
  );
});

export default PostPhotoGallery;
