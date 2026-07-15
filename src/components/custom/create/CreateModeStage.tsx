import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import {
  Check,
  CheckCircle2,
  ImagePlus,
  Expand,
  Folder,
  Images,
  Layers,
  RefreshCw,
  Square,
  Video,
  CopyCheck
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "expo-router";
import {
  LayoutChangeEvent,
  ScrollView,
  useColorScheme,
  View,
} from "react-native";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useSettingStore } from "@/stores/setting.store";
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
import { VStack } from "@/components/ui/vstack";

import type { CreatePostMode } from "@/constants/create-post";

const formatDuration = (seconds: number) => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

/** Module-level cache: generated once per app session, survives mode switches */
const videoThumbnailCache = new Map<string, VideoThumbnail | null>();

/** Module-level cache for media gallery assets to survive tab switches/remounts */
let cachedPhotoAssets: GalleryAsset[] = [];
let cachedVideoAssets: GalleryAsset[] = [];
let cachedGalleryPermission: "granted" | "denied" | "undetermined" = "undetermined";

const getVideoThumbnail = async (uri: string): Promise<VideoThumbnail | null> => {
  if (videoThumbnailCache.has(uri)) {
    const cached = videoThumbnailCache.get(uri);
    if (cached) return cached;
  }
  const player = createVideoPlayer(uri);
  try {
    if (player.status !== "readyToPlay") {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("timeout")), 10000);
        const subscription = player.addListener("statusChange", (payload) => {
          if (payload.status === "readyToPlay") {
            clearTimeout(timeout);
            subscription.remove();
            resolve();
          } else if (payload.status === "error") {
            clearTimeout(timeout);
            subscription.remove();
            reject(new Error("player error"));
          }
        });
      });
    }
    const [thumbnail] = await player.generateThumbnailsAsync(0);
    const result = thumbnail ?? null;
    if (result) {
      videoThumbnailCache.set(uri, result);
    }
    return result;
  } catch (error) {
    console.warn("Failed to generate thumbnail for", uri, error);
    return null;
  } finally {
    player.release();
  }
};

type GalleryAsset = { id: string; uri: string; duration: number | null };

interface CreateModeStageProps {
  mode: CreatePostMode;
  onModeChange: (mode: CreatePostMode) => void;
  photos: string[];
  onPhotosChange: (uris: string[]) => void;
  videoUri: string | null;
  onVideoChange: (uri: string | null) => void;
  /** Multiple-video URIs (only populated when multiSelect is active in video mode) */
  videoUris: string[];
  onVideoUrisChange: (uris: string[]) => void;
  text: string;
  onTextChange: (text: string) => void;
  multiSelect: boolean;
  onMultiSelectChange: (multiSelect: boolean) => void;
}

function VideoPreview({ uri, isActive }: { uri: string; isActive: boolean }) {
  const isFocused = useIsFocused();
  const player = useVideoPlayer({ uri }, (p) => {
    p.loop = true;
  });

  useEffect(() => {
    if (isActive && isFocused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isFocused, player]);

  useLayoutEffect(() => {
    return () => {
      try {
        player.pause();
      } catch { }
    };
  }, [player]);

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
  // Initialise from cache synchronously so there is zero flash on remount
  const [thumbnail, setThumbnail] = useState<VideoThumbnail | null>(
    () => videoThumbnailCache.get(uri) ?? null
  );

  useEffect(() => {
    // Already cached — nothing to do
    if (videoThumbnailCache.has(uri)) return;
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
  videoUris,
  onVideoUrisChange,
  text,
  onTextChange,
  multiSelect,
  onMultiSelectChange,
}: CreateModeStageProps) {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset indexes when the mode changes
  useEffect(() => {
    setPhotoIndex(0);
    setVideoIndex(0);
  }, [mode]);

  useEffect(() => {
    setVideoIndex(0);
  }, [multiSelect]);



  const [galleryPermission, setGalleryPermission] = useState<"granted" | "denied" | "undetermined">(() => cachedGalleryPermission);

  // Separate caches per media type — fetched once, never cleared on mode switch
  const [photoAssets, setPhotoAssets] = useState<GalleryAsset[]>(() => cachedPhotoAssets);
  const [videoAssets, setVideoAssets] = useState<GalleryAsset[]>(() => cachedVideoAssets);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const photoFetchedRef = useRef(false);
  const videoFetchedRef = useRef(false);

  // Convenience: currently visible assets & loading state based on active mode
  const galleryAssets = mode === "video" ? videoAssets : photoAssets;
  const loadingAssets = mode === "video" ? videoLoading : photoLoading;

  const handleStageLayout = useCallback((e: LayoutChangeEvent) => {
    setStageWidth(e.nativeEvent.layout.width);
  }, []);

  useEffect(() => {
    if (!isFocused) return;
    let active = true;
    const fetchMedia = async (mediaMode: "photo" | "video") => {
      // Skip if already fetched for this type
      if (mediaMode === "photo" && photoFetchedRef.current) return;
      if (mediaMode === "video" && videoFetchedRef.current) return;

      const setLoading = mediaMode === "photo" ? setPhotoLoading : setVideoLoading;
      const setAssets = mediaMode === "photo" ? setPhotoAssets : setVideoAssets;
      const fetchedRef = mediaMode === "photo" ? photoFetchedRef : videoFetchedRef;

      try {
        if (!active) return;
        const currentAssets = mediaMode === "photo" ? photoAssets : videoAssets;
        if (currentAssets.length === 0) {
          setLoading(true);
        }
        const perm = await getPermissionsAsync();
        if (!active) return;
        setGalleryPermission(perm.status);
        cachedGalleryPermission = perm.status;
        if (perm.status === "granted") {
          const mediaType = mediaMode === "video" ? MediaType.VIDEO : MediaType.IMAGE;
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
          setAssets(resolved);
          if (mediaMode === "photo") {
            cachedPhotoAssets = resolved;
          } else {
            cachedVideoAssets = resolved;
          }
          fetchedRef.current = true;
        }
      } catch (e) {
        console.error("Error loading gallery:", e);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (mode === "photo") fetchMedia("photo");
    else if (mode === "video") fetchMedia("video");

    return () => {
      active = false;
    };
  }, [mode, isFocused, photoAssets.length, videoAssets.length]);

  useEffect(() => {
    if (!isFocused) {
      photoFetchedRef.current = false;
      videoFetchedRef.current = false;
    }
  }, [isFocused]);

  const requestGalleryPermission = useCallback(async () => {
    const perm = await requestPermissionsAsync();
    setGalleryPermission(perm.status);
    cachedGalleryPermission = perm.status;
    if (perm.status === "granted") {
      const fetchBoth = async () => {
        for (const mediaMode of ["photo", "video"] as const) {
          const setLoading = mediaMode === "photo" ? setPhotoLoading : setVideoLoading;
          const setAssets = mediaMode === "photo" ? setPhotoAssets : setVideoAssets;
          const fetchedRef = mediaMode === "photo" ? photoFetchedRef : videoFetchedRef;
          try {
            setLoading(true);
            const mediaType = mediaMode === "video" ? MediaType.VIDEO : MediaType.IMAGE;
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
            setAssets(resolved);
            if (mediaMode === "photo") {
              cachedPhotoAssets = resolved;
            } else {
              cachedVideoAssets = resolved;
            }
            fetchedRef.current = true;
          } catch (e) {
            console.error("Error loading gallery after permission:", e);
          } finally {
            setLoading(false);
          }
        }
      };
      fetchBoth();
    }
  }, []);

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
      allowsMultipleSelection: multiSelect,
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.length) return;
    if (multiSelect) {
      const newUris = result.assets.map((a) => a.uri);
      const merged = [...new Set([...videoUris, ...newUris])];
      onVideoUrisChange(merged);
      onVideoChange(merged[0] ?? null);
    } else {
      onVideoChange(result.assets[0].uri);
      onVideoUrisChange([]);
    }
  }, [onVideoChange, multiSelect, videoUris, onVideoUrisChange]);

  const pickPhotosFromFiles = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      multiple: true,
    });
    if (result.canceled || !result.assets?.length) return;
    onPhotosChange([...photos, ...result.assets.map((a) => a.uri)]);
  }, [photos, onPhotosChange]);

  const pickVideoFromFiles = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      multiple: multiSelect,
    });
    if (result.canceled || !result.assets?.length) return;
    if (multiSelect) {
      const newUris = result.assets.map((a) => a.uri);
      const merged = [...new Set([...videoUris, ...newUris])];
      onVideoUrisChange(merged);
      onVideoChange(merged[0] ?? null);
    } else {
      onVideoChange(result.assets[0].uri);
      onVideoUrisChange([]);
    }
  }, [onVideoChange, multiSelect, videoUris, onVideoUrisChange]);

  // ── Helpers for tap selection ──────────────────────────────────────────────

  const handlePhotoTap = useCallback(
    (uri: string) => {
      if (multiSelect) {
        // Toggle on/off
        if (photos.includes(uri)) {
          onPhotosChange(photos.filter((p) => p !== uri));
        } else {
          onPhotosChange([...photos, uri]);
        }
      } else {
        // Single: replace with just this one
        if (photos[0] === uri) {
          onPhotosChange([]);
        } else {
          onPhotosChange([uri]);
        }
      }
    },
    [multiSelect, photos, onPhotosChange]
  );

  const handleVideoTap = useCallback(
    (uri: string) => {
      if (multiSelect) {
        if (videoUris.includes(uri)) {
          const updated = videoUris.filter((v) => v !== uri);
          onVideoUrisChange(updated);
          onVideoChange(updated[0] ?? null);
        } else {
          const updated = [...videoUris, uri];
          onVideoUrisChange(updated);
          onVideoChange(updated[0] ?? null);
        }
      } else {
        if (videoUri === uri) {
          onVideoChange(null);
          onVideoUrisChange([]);
        } else {
          onVideoChange(uri);
          onVideoUrisChange([]);
        }
      }
    },
    [multiSelect, videoUri, videoUris, onVideoChange, onVideoUrisChange]
  );

  // In multi-video mode show all selected videos; fall back to single videoUri
  const activeVideoUris = multiSelect && videoUris.length > 0 ? videoUris : (videoUri ? [videoUri] : []);

  return (
    <VStack space="sm">
      <Box
        onLayout={handleStageLayout}
        className="relative h-96 overflow-hidden bg-card"
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
                  const innerWidth = stageWidth > 2 ? stageWidth : stageWidth;
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
                <Icon as={ImagePlus} size="lg" className="text-white" />
              </Box>
              <Text size="sm" className="font-semibold text-muted-foreground">
                {t("create_post.mode_photo")}
              </Text>
            </Box>
          )
        ) : null}

        {mode === "video" ? (
          activeVideoUris.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const innerWidth = stageWidth > 2 ? stageWidth : stageWidth;
                  setVideoIndex(
                    Math.round(e.nativeEvent.contentOffset.x / (innerWidth || 1)),
                  );
                }}
                className="h-full w-full"
              >
                {activeVideoUris.map((uri, index) => {
                  const innerWidth = stageWidth > 2 ? stageWidth - 2 : stageWidth;
                  return (
                    <View key={uri} style={{ width: innerWidth }}>
                      <VideoPreview uri={uri} isActive={index === videoIndex} />
                    </View>
                  );
                })}
              </ScrollView>
              {/* Multi-video count badge */}
              {multiSelect && videoUris.length > 1 && (
                <Box className="absolute left-2.5 top-2.5 z-10 flex-row items-center gap-1 rounded-full bg-black/60 px-2.5 py-1">
                  <Icon as={Layers} size="xs" className="text-white" />
                  <Text className="text-[11px] font-bold text-white">{videoUris.length}</Text>
                </Box>
              )}
              {/* Dot indicators for multiple videos */}
              {activeVideoUris.length > 1 ? (
                <Box className="absolute left-1/2 bottom-3 z-10 -translate-x-1/2 flex-row gap-1">
                  {activeVideoUris.map((uri, i) => (
                    <Box
                      key={uri}
                      className={
                        i === videoIndex
                          ? "h-1.5 w-4 rounded-full bg-white"
                          : "h-1.5 w-1.5 rounded-full bg-white/50"
                      }
                    />
                  ))}
                </Box>
              ) : null}
            </>
          ) : (
            <Box className="h-full w-full items-center justify-center gap-2">
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
          <Box className="p-4 h-full w-full">
            <Textarea className="h-full w-full border-none bg-card rounded-2xl p-4">
              <TextareaInput
                placeholder={t("create_post.text_placeholder")}
                value={text}
                onChangeText={onTextChange}
                className="text-foreground text-base"
                multiline
                textAlignVertical="top"
              />
            </Textarea>
          </Box>
        ) : null}
      </Box>

      {/* Gallery — always mounted, hidden in text mode to preserve image cache */}
      <VStack
        className="py-3 bg-card"
        space="md"
        style={{ display: mode === "text" ? "none" : "flex" }}
      >
        {/* ── Gallery header ── */}
        <HStack className="items-center justify-between px-4">
          <HStack space="sm" className="items-center">
            <Heading size="md" className="font-baloo-bold text-foreground">
              {t("create_post.gallery_title")}
            </Heading>
            {/* Selection count badge when in multi-select mode */}

          </HStack>

          <HStack space="xs" className="items-center flex-wrap justify-end">
            {/* ── Multiple toggle pill ── */}


            <Button
              variant="outline"
              className="rounded-full px-3 shadow-none"
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
            <Button
              variant={multiSelect ? "theme" : "outline"}
              className={cn("rounded-full px-3 border")}
              onPress={() => {
                const next = !multiSelect;
                // Switching TO single mode: keep only first selected item
                if (!next) {
                  if (mode === "photo" && photos.length > 1) {
                    onPhotosChange([photos[0]]);
                  }
                  if (mode === "video" && videoUris.length > 1) {
                    onVideoUrisChange([videoUris[0]]);
                    onVideoChange(videoUris[0]);
                  }
                }
                onMultiSelectChange(next);
              }}

              accessibilityRole="button"
              accessibilityLabel={
                multiSelect
                  ? t("create_post.select_single")
                  : t("create_post.select_multiple")
              }

            >
              <ButtonIcon
                as={CopyCheck}
                size="lg"
              />
              <ButtonText
                className={
                  "font-baloo-semibold"
                }
              >
                {t("create_post.select_multiple")}
              </ButtonText>
            </Button>
          </HStack>
        </HStack>

        {galleryPermission === "denied" && (
          <Box className="rounded-md border border-border bg-input p-6 items-center justify-center gap-3">
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
          <Box className="rounded-md border border-border bg-input p-6 items-center justify-center gap-3">
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
                    _extra={{ className: "col-span-1 bg-background" }}
                  >
                    <Box
                      className="rounded-md bg-muted animate-pulse"
                      style={{ width: "100%", aspectRatio: 1 }}
                    />
                  </GridItem>
                ))}
              </Grid>
            ) : galleryAssets.length === 0 ? (
              <Box className="mx-4 p-20 items-center justify-center bg-input rounded-md border border-border">
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
                  const isPhotoSelected = photos.includes(asset.uri);
                  const isVideoSelected = multiSelect
                    ? videoUris.includes(asset.uri)
                    : videoUri === asset.uri;
                  const isSelected = mode === "photo" ? isPhotoSelected : isVideoSelected;

                  // Ordered index for badge numbering
                  const photoIdx = mode === "photo" && multiSelect
                    ? photos.indexOf(asset.uri)
                    : -1;
                  const videoIdx = mode === "video" && multiSelect
                    ? videoUris.indexOf(asset.uri)
                    : -1;

                  return (
                    <GridItem
                      key={asset.id}
                      _extra={{ className: "col-span-1 bg-background" }}
                    >
                      <Pressable
                        onPress={() => {
                          if (mode === "photo") {
                            handlePhotoTap(asset.uri);
                          } else {
                            handleVideoTap(asset.uri);
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

                        {/* Selection overlay */}
                        {isSelected && (
                          <Box className="absolute inset-0 bg-theme/10 border-2 border-theme rounded-md" />
                        )}

                        {/* ── Photo badges ── */}
                        {mode === "photo" && multiSelect && isSelected && (
                          <Box className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-theme items-center justify-center border border-white">
                            <Text size="xs" className="font-bold text-white leading-none">
                              {photoIdx + 1}
                            </Text>
                          </Box>
                        )}
                        {mode === "photo" && multiSelect && !isSelected && (
                          <Box className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-black/40 items-center justify-center border border-white/50" />
                        )}
                        {mode === "photo" && !multiSelect && isSelected && (
                          <Box className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-theme items-center justify-center border border-white">
                            <Icon as={Check} size="2xs" className="text-white" />
                          </Box>
                        )}

                        {/* ── Video badges ── */}
                        {mode === "video" && (
                          <>
                            {multiSelect && isSelected && (
                              <Box className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-theme items-center justify-center border border-white">
                                <Text size="xs" className="font-bold text-white leading-none">
                                  {videoIdx + 1}
                                </Text>
                              </Box>
                            )}
                            {multiSelect && !isSelected && (
                              <Box className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-black/40 items-center justify-center border border-white/50" />
                            )}
                            {!multiSelect && isSelected && (
                              <Box className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-theme items-center justify-center border border-white">
                                <Icon as={Check} size="2xs" className="text-white" />
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
    </VStack>
  );
}
