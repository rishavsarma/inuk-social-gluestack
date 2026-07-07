import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import {
  ImageViewer,
  ImageViewerCloseButton,
  ImageViewerContent,
  ImageViewerCounter,
  ImageViewerNavigation,
} from "@/components/ui/image-viewer";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { POST_CONSTANTS } from "@/constants";
import { useTimeAgo } from "@/hooks/use-time-ago";
import { Image } from "expo-image";
import { UserPlus } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const PostPhotoGallery = React.memo(function PostMediaGallery({
  post,
}: PostMediaGalleryProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const media = post.post.media;
  const is_me = post.author.is_me;
  const createdAt = useTimeAgo(post.post.created_at);

  if (!media || media.length === 0) {
    return <View style={StyleSheet.absoluteFill} className="bg-neutral-800" />;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
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
            <Box className="flex-row items-center gap-1.5 bg-black/40 px-3 py-2 rounded-full justify-center flex-1">
              {post.post.media.map((_: unknown, idx: number) => (
                <IndicatorDot key={idx} isActive={idx === currentMediaIndex} />
              ))}
            </Box>
          )}
          {/* Avatar and name info pill */}
          <HStack space="md" className="items-center flex-1">
            <Avatar className="h-16 w-16">
              <AvatarFallbackText className="text-white">
                {post.author.display_name}
              </AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: post.author.avatar_url,
                }}
              />
            </Avatar>
            <HStack className="justify-between items-center w-full flex-1">
              <VStack className="justify-start items-start">
                <Heading size="lg" className="text-white">
                  {post.author.display_name}
                </Heading>
                <Text size="sm" className="text-secondary">
                  {createdAt || `@${post.author.username}`}
                </Text>
              </VStack>
              {!is_me && (
                <Button className="rounded-full">
                  <ButtonIcon as={UserPlus} />
                  <ButtonText>Follow</ButtonText>
                </Button>
              )}
            </HStack>
          </HStack>
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

function IndicatorDot({ isActive }: { isActive: boolean }) {
  const animStyle = useAnimatedStyle(() => ({
    width: withTiming(isActive ? 16 : 5, { duration: 150 }),
    backgroundColor: withTiming(
      isActive ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)",
      {
        duration: 150,
      },
    ),
  }));

  return <Animated.View className="h-1.5 rounded-full" style={animStyle} />;
}

export default PostPhotoGallery;
