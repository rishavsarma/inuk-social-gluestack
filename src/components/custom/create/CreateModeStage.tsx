import { useCallback, useEffect, useRef, useState } from "react";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import {
  ImageViewer,
  ImageViewerCloseButton,
  ImageViewerContent,
  ImageViewerCounter,
  ImageViewerNavigation,
} from "@/components/ui/image-viewer";
import {
  createVideoPlayer,
  useVideoPlayer,
  VideoView,
  type VideoThumbnail,
} from "expo-video";
import {
  Camera,
  Expand,
  Folder,
  Images,
  RefreshCw,
  Video,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  LayoutChangeEvent,
  ScrollView,
  View,
} from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import {
  AssetField,
  MediaType,
  Query,
  getPermissionsAsync,
  requestPermissionsAsync,
} from "expo-media-library";

import { LinearGradient } from "@/components/ui/linear-gradient";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Grid, GridItem } from "@/components/ui/grid";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";

import type { CreatePostMode } from "@/constants/create-post";

const formatDuration = (seconds: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const getVideoThumbnail = async (uri: string) => {
  const player = createVideoPlayer(uri);
  try {
    const [thumbnail] = await player.generateThumbnailsAsync(0);
    return thumbnail ?? null;
  } catch {
    return null;
  } finally {
    player.release();
  }
};

interface CreateModeStageProps {
  mode: CreatePostMode;
  onModeChange: (mode: CreatePostMode) => void;
  photos: string[];
  onPhotosChange: (uris: string[]) => void;
  videoUri: string | null;
  onVideoChange: (uri: string | null) => void;
  text: string;
  onTextChange: (text: string) => void;
}

function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer({ uri }, (p) => {
    p.loop = true;
  });
  return (
    <VideoView
      style={{ width: "100%", height: "100%" }}
      player={player}
      nativeControls
      contentFit="cover"
    />
  );
}

function GalleryVideoThumbnail({ uri }: { uri: string }) {
  const [thumbnail, setThumbnail] = useState<VideoThumbnail | null>(null);

  useEffect(() => {
    let active = true;
    getVideoThumbnail(uri).then((result) => {
      if (active) setThumbnail(result);
    });
    return () => {
      active = false;
    };
  }, [uri]);

  if (!thumbnail) {
    return <Box className="h-full w-full bg-muted animate-pulse" />;
  }

  return (
    <Image
      source={thumbnail}
      style={{ width: "100%", height: "100%" }}
      contentFit="cover"
    />
  );
}

export function CreateModeStage({
  mode,
  onModeChange,
  photos,
  onPhotosChange,
  videoUri,
  onVideoChange,
  text,
  onTextChange,
}: CreateModeStageProps) {
  const { t } = useTranslation();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const textEditor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: text,
    onChange: () => {
      textEditor.getHTML().then((html) => {
        onTextChange(html);
      });
    },
    theme: {
      toolbar: {
        toolbarBody: {
          backgroundColor: "#1A1A1A",
          borderBottomColor: "rgba(255,255,255,0.08)",
        },
      },
    },
  });


  const [galleryPermission, setGalleryPermission] = useState<"granted" | "denied" | "undetermined">("undetermined");
  const [galleryAssets, setGalleryAssets] = useState<{ id: string; uri: string; duration: number | null }[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  const handleStageLayout = useCallback((e: LayoutChangeEvent) => {
    setStageWidth(e.nativeEvent.layout.width);
  }, []);

  useEffect(() => {
    let active = true;
    const fetchMedia = async () => {
      if (mode === "text") return;
      try {
        await Promise.resolve();
        if (!active) return;
        setLoadingAssets(true);
        const perm = await getPermissionsAsync();
        if (!active) return;
        setGalleryPermission(perm.status);
        if (perm.status === "granted") {
          const mediaType = mode === "video" ? MediaType.VIDEO : MediaType.IMAGE;
          const q = new Query()
            .eq(AssetField.MEDIA_TYPE, mediaType)
            .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
            .limit(30);
          const assets = await q.exe();
          const resolved = await Promise.all(
            assets.map(async (asset) => {
              const uri = await asset.getUri();
              const durationMs = asset.getDuration ? await asset.getDuration() : null;
              return {
                id: asset.id,
                uri,
                duration: durationMs ? durationMs / 1000 : null,
              };
            })
          );
          if (!active) return;
          setGalleryAssets(resolved);
        }
      } catch (e) {
        console.error("Error loading gallery:", e);
      } finally {
        if (active) {
          setLoadingAssets(false);
        }
      }
    };

    fetchMedia();
    return () => {
      active = false;
    };
  }, [mode]);

  const requestGalleryPermission = useCallback(async () => {
    const perm = await requestPermissionsAsync();
    setGalleryPermission(perm.status);
    if (perm.status === "granted") {
      try {
        setLoadingAssets(true);
        const mediaType = mode === "video" ? MediaType.VIDEO : MediaType.IMAGE;
        const q = new Query()
          .eq(AssetField.MEDIA_TYPE, mediaType)
          .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
          .limit(30);
        const assets = await q.exe();
        const resolved = await Promise.all(
          assets.map(async (asset) => {
            const uri = await asset.getUri();
            const durationMs = asset.getDuration ? await asset.getDuration() : null;
            return {
              id: asset.id,
              uri,
              duration: durationMs ? durationMs / 1000 : null,
            };
          })
        );
        setGalleryAssets(resolved);
      } catch (e) {
        console.error("Error loading gallery after permission:", e);
      } finally {
        setLoadingAssets(false);
      }
    }
  }, [mode]);

  const pickPhotosFromLibrary = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.length) return;
    onPhotosChange([...photos, ...result.assets.map((a) => a.uri)]);
  }, [photos, onPhotosChange]);

  const pickVideoFromLibrary = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.length) return;
    onVideoChange(result.assets[0].uri);
  }, [onVideoChange]);

  const pickPhotosFromFiles = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      multiple: true,
    });
    if (result.canceled || !result.assets?.length) return;
    onPhotosChange([...photos, ...result.assets.map((a) => a.uri)]);
  }, [photos, onPhotosChange]);

  const pickVideoFromFiles = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });
    if (result.canceled || !result.assets?.length) return;
    onVideoChange(result.assets[0].uri);
  }, [onVideoChange]);

  // modeSwitcher moved to parent component

  return (
    <>
      <Box
        onLayout={handleStageLayout}
        className="relative h-96 overflow-hidden rounded-md border border-border bg-input"
      >
        {mode === "photo" ? (
          photos.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const innerWidth = stageWidth > 2 ? stageWidth - 2 : stageWidth;
                  setPhotoIndex(
                    Math.round(e.nativeEvent.contentOffset.x / (innerWidth || 1)),
                  );
                }}
                className="h-full w-full"
              >
                {photos.map((uri, index) => {
                  const innerWidth = stageWidth > 2 ? stageWidth - 2 : stageWidth;
                  return (
                    <Pressable
                      key={uri}
                      onPress={() => {
                        setPhotoIndex(index);
                        setIsFullscreen(true);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={t("create_post.view_fullscreen_a11y")}
                    >
                      <Image
                        source={{ uri }}
                        style={{ width: innerWidth, height: 384 }}
                        contentFit="cover"
                      />
                    </Pressable>
                  );
                })}
              </ScrollView>
              {photos.length > 1 ? (
                <Box className="absolute left-1/2 top-3 z-10 -translate-x-1/2 flex-row gap-1">
                  {photos.map((uri, i) => (
                    <Box
                      key={uri}
                      className={
                        i === photoIndex
                          ? "h-1.5 w-4 rounded-full bg-white"
                          : "h-1.5 w-1.5 rounded-full bg-white/50"
                      }
                    />
                  ))}
                </Box>
              ) : null}
              <Pressable
                onPress={() => setIsFullscreen(true)}
                accessibilityRole="button"
                accessibilityLabel={t("create_post.view_fullscreen_a11y")}
                className="absolute right-2.5 top-2.5 z-10 h-9 w-9 items-center justify-center rounded-full bg-black/45"
              >
                <Icon as={Expand} size="sm" className="text-white" />
              </Pressable>
              <LinearGradient
                pointerEvents="none"
                colors={["transparent", "rgba(0,0,0,0.45)"]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 70,
                }}
              />
            </>
          ) : (
            <Box className="h-full w-full items-center justify-center gap-2">
              <Box className="h-14 w-14 items-center justify-center rounded-full bg-theme">
                <Icon as={Camera} size="lg" className="text-white" />
              </Box>
              <Text size="sm" className="font-semibold text-muted-foreground">
                {t("create_post.mode_photo")}
              </Text>
            </Box>
          )
        ) : null}

        {mode === "video" ? (
          videoUri ? (
            <>
              <VideoPreview uri={videoUri} />
              <Pressable
                onPress={pickVideoFromLibrary}
                accessibilityRole="button"
                accessibilityLabel={t("create_post.change_video_a11y")}
                className="absolute right-2.5 top-2.5 z-10 h-9 w-9 items-center justify-center rounded-full bg-black/45"
              >
                <Icon as={RefreshCw} size="sm" className="text-white" />
              </Pressable>
            </>
          ) : (
            <Box className="h-full w-full items-center justify-center gap-2 bg-input">
              <Box className="h-14 w-14 items-center justify-center rounded-full bg-theme">
                <Icon as={Video} size="lg" className="text-white" />
              </Box>
              <Text size="sm" className="font-semibold text-muted-foreground">
                {t("create_post.mode_video")}
              </Text>
            </Box>
          )
        ) : null}


        {mode === "text" ? (
          <View style={{ minHeight: 44, width: "100%" }}>
            <Toolbar editor={textEditor} hidden={false} />
          </View>
        ) : null}
        {mode === "text" ? (
          <Box className="h-full w-full bg-card flex-col">
            <RichText editor={textEditor} className="flex-1 bg-transparent" />
          </Box>
        ) : null}
      </Box>
      {(mode === "photo" || mode === "video") && (
        <VStack className="mt-6" space="md">
          <HStack className="items-center justify-between px-4">
            <Heading size="md" className="font-baloo-bold text-foreground">
              {t("create_post.gallery_title")}
            </Heading>
            <HStack space="xs">
              <Button
                variant="outline"
                className="rounded-full px-3"
                onPress={mode === "photo" ? pickPhotosFromLibrary : pickVideoFromLibrary}
              >
                <ButtonIcon as={Images} size="lg" />
                <ButtonText className="font-baloo-semibold">
                  {t("create_post.choose_from_library_short")}
                </ButtonText>
              </Button>
              <Button
                variant="outline"

                className="rounded-full"
                onPress={mode === "photo" ? pickPhotosFromFiles : pickVideoFromFiles}
              >
                <ButtonIcon as={Folder} size="lg" />
                <ButtonText className="font-baloo-semibold">
                  {t("create_post.choose_file_short")}
                </ButtonText>
              </Button>
            </HStack>
          </HStack>

          {galleryPermission === "denied" && (
            <Box className="rounded-2xl border border-border bg-input p-6 items-center justify-center gap-3">
              <Icon as={Images} size="xl" className="text-muted-foreground" />
              <Text size="sm" className="text-center font-semibold text-foreground">
                {t("create_post.gallery_permission_title")}
              </Text>
              <Text size="xs" className="text-center text-muted-foreground px-4">
                {t("create_post.gallery_permission_desc")}
              </Text>
              <Button
                variant="theme"
                size="sm"
                onPress={requestGalleryPermission}
                className="rounded-full px-5 mt-2"
              >
                <ButtonText>{t("create_post.grant_access")}</ButtonText>
              </Button>
            </Box>
          )}

          {galleryPermission === "undetermined" && !loadingAssets && (
            <Box className="rounded-2xl border border-border bg-input p-6 items-center justify-center gap-3">
              <Button
                variant="theme"
                size="sm"
                onPress={requestGalleryPermission}
                className="rounded-full px-5"
              >
                <ButtonText>{t("create_post.grant_access")}</ButtonText>
              </Button>
            </Box>
          )}

          {galleryPermission === "granted" && (
            <>
              {loadingAssets ? (
                <Grid
                  _extra={{ className: "grid-cols-3" }}
                  className="gap-1 px-4"
                  paddingLeft={16}
                  paddingRight={16}
                >
                  {Array.from({ length: 9 }).map((_, i) => (
                    <GridItem
                      key={i}
                      _extra={{ className: "col-span-1" }}
                    >
                      <Box
                        className="rounded-md bg-muted animate-pulse"
                        style={{ width: "100%", aspectRatio: 1 }}
                      />
                    </GridItem>
                  ))}
                </Grid>
              ) : galleryAssets.length === 0 ? (
                <Box className="mx-4 p-8 items-center justify-center bg-input rounded-2xl border border-border">
                  <Text size="sm" className="text-muted-foreground font-semibold">
                    {t("create_post.no_media_found")}
                  </Text>
                </Box>
              ) : (
                <Grid
                  _extra={{ className: "grid-cols-3" }}
                  className="gap-1 px-4"
                  paddingLeft={16}
                  paddingRight={16}
                >
                  {galleryAssets.map((asset) => {
                    const isSelected = mode === "photo"
                      ? photos.includes(asset.uri)
                      : videoUri === asset.uri;

                    const photoIdx = mode === "photo" ? photos.indexOf(asset.uri) : -1;

                    return (
                      <GridItem
                        key={asset.id}
                        _extra={{ className: "col-span-1" }}
                      >
                        <Pressable
                          onPress={() => {
                            if (mode === "photo") {
                              if (isSelected) {
                                onPhotosChange(photos.filter((p) => p !== asset.uri));
                              } else {
                                onPhotosChange([...photos, asset.uri]);
                              }
                            } else {
                              if (isSelected) {
                                onVideoChange(null);
                              } else {
                                onVideoChange(asset.uri);
                              }
                            }
                          }}
                          style={{ width: "100%", aspectRatio: 1 }}
                          className="relative rounded-md overflow-hidden active:opacity-80"
                        >
                          {mode === "video" ? (
                            <GalleryVideoThumbnail uri={asset.uri} />
                          ) : (
                            <Image
                              source={{ uri: asset.uri }}
                              style={{ width: "100%", height: "100%" }}
                              contentFit="cover"
                            />
                          )}
                          {isSelected && (
                            <Box className="absolute inset-0 bg-theme/10 border-2 border-theme rounded-md" />
                          )}

                          {mode === "photo" && isSelected && (
                            <Box className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-theme items-center justify-center border border-white">
                              <Text size="2xs" className="font-bold text-white leading-none">
                                {photoIdx + 1}
                              </Text>
                            </Box>
                          )}

                          {mode === "photo" && !isSelected && (
                            <Box className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-black/40 items-center justify-center border border-white/50" />
                          )}

                          {mode === "video" && (
                            <>
                              {isSelected && (
                                <Box className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-theme items-center justify-center border border-white">
                                  <Text className="font-bold text-white text-[10px]">✓</Text>
                                </Box>
                              )}
                              {asset.duration !== null && (
                                <Box className="absolute bottom-1 right-1 bg-black/60 rounded px-1 py-0.5">
                                  <Text className="text-[10px] font-medium text-white">
                                    {formatDuration(asset.duration)}
                                  </Text>
                                </Box>
                              )}
                            </>
                          )}
                        </Pressable>
                      </GridItem>
                    );
                  })}
                </Grid>
              )}
            </>
          )}
        </VStack>
      )}

      <ImageViewer
        images={photos.map((uri) => ({ url: uri }))}
        isOpen={isFullscreen}
        onOpenChange={setIsFullscreen}
        onIndexChange={setPhotoIndex}
        initialIndex={photoIndex}
      >
        <ImageViewerContent>
          <ImageViewerCloseButton />
          <ImageViewerNavigation />
          {photos.length > 1 ? (
            <ImageViewerCounter variant="dots" className="pb-8" />
          ) : null}
        </ImageViewerContent>
      </ImageViewer>
    </>
  );
}
