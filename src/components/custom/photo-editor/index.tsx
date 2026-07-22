import * as FileSystem from "expo-file-system/legacy";
import { FlipType, manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
  Brush,
  Check,
  Crop,
  Droplet,
  RotateCcw,
  RotateCw,
  Sliders,
  Smile,
  Sparkles,
  Type,
  X,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  Text as RNText,
  ScrollView,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { Text } from "@/components/ui/text";
import { useAppBottomInset, useAppTopInset } from "@/hooks/useAppInsets";

import { CanvasView, CanvasViewRef } from "./CanvasView";
import { GestureOverlayItem } from "./GestureOverlay";
import {
  DrawPath,
  EditorState,
  EditorTab,
  PhotoEditorProps,
  Point,
  StickerItem,
  TextItem,
} from "./types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Popular emoji list for stamps
const EMOJIS = [
  "😀",
  "😂",
  "😎",
  "😍",
  "😘",
  "😜",
  "🤓",
  "😇",
  "🔥",
  "💯",
  "❤️",
  "💖",
  "✨",
  "🎉",
  "🚀",
  "🌟",
  "👍",
  "👏",
  "🙌",
  "👀",
  "💡",
  "👑",
  "🍕",
  "🍩",
  "🐶",
  "🐱",
  "🦄",
  "🌈",
  "👽",
  "👾",
  "🎮",
  "🎵",
];

// Color palette for drawing and text formatting
const COLORS = [
  "#FFFFFF",
  "#000000",
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#4CD964",
  "#5AC8FA",
  "#007AFF",
  "#5856D6",
  "#FF2D55",
];

const INITIAL_STATE: EditorState = {
  brightness: 1.0,
  contrast: 1.0,
  saturation: 1.0,
  blur: 0,
  filter: "none",
  pixelate: 1.0,
  radialPixelAngle: 0.0,
  radialPixelRadius: 0.0,
  liquidStrength: 0.0,
  liquidFrequency: 10.0,
};

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  visible,
  imageUri,
  initialFilter = "none",
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const topInset = useAppTopInset();
  const bottomInset = useAppBottomInset();

  const canvasRef = useRef<CanvasViewRef>(null);

  // Core Editor states
  const [currentUri, setCurrentUri] = useState(imageUri);
  const [editorState, setEditorState] = useState<EditorState>({
    ...INITIAL_STATE,
    filter: initialFilter,
  });

  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [drawPaths, setDrawPaths] = useState<DrawPath[]>([]);

  // UI state controls
  const [activeTab, setActiveTab] = useState<EditorTab>("transform");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Text overlay modal variables
  const [showTextModal, setShowTextModal] = useState(false);
  const [textInputVal, setTextInputVal] = useState("");
  const [textColor, setTextColor] = useState("#FFFFFF");

  // Brush variables
  const [brushColor, setBrushColor] = useState("#FF3B30");
  const [brushWidth, setBrushWidth] = useState(6);
  const [drawType, setDrawType] = useState<
    "free" | "rect" | "circle" | "arrow"
  >("free");
  const activePathIdRef = useRef<string | null>(null);

  // Dimension scaling states
  const [imgDimensions, setImgDimensions] = useState({
    width: 300,
    height: 300,
  });
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 300,
    height: 300,
  });

  // Update original URI if external changes occur
  useEffect(() => {
    setCurrentUri(imageUri);
  }, [imageUri]);

  // Load natural dimensions of current image to calculate aspect ratio scale
  useEffect(() => {
    if (currentUri) {
      Image.getSize(
        currentUri,
        (w, h) => {
          setImgDimensions({ width: w, height: h });
        },
        (err) => {
          console.warn("Failed to retrieve image size:", err);
        },
      );
    }
  }, [currentUri]);

  // Compute bounding canvas dimensions based on screenspace container size
  useEffect(() => {
    const maxCanvasWidth = SCREEN_WIDTH - 32;
    const maxCanvasHeight = SCREEN_HEIGHT - topInset - bottomInset - 320; // safe space for overlays

    const ratio = Math.min(
      maxCanvasWidth / imgDimensions.width,
      maxCanvasHeight / imgDimensions.height,
    );

    setCanvasDimensions({
      width: Math.round(imgDimensions.width * ratio),
      height: Math.round(imgDimensions.height * ratio),
    });
  }, [imgDimensions, topInset, bottomInset]);

  // Reset to original settings
  const handleReset = () => {
    setEditorState({ ...INITIAL_STATE });
    setStickers([]);
    setTexts([]);
    setDrawPaths([]);
    setSelectedItemId(null);
    setCurrentUri(imageUri);
  };

  // Image manipulation utilities (rotate and flips)
  const handleRotate = async () => {
    setIsSaving(true);
    try {
      const result = await manipulateAsync(currentUri, [{ rotate: 90 }], {
        compress: 0.9,
        format: SaveFormat.JPEG,
      });
      setCurrentUri(result.uri);
    } catch (e) {
      console.warn("Rotate failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFlip = async (type: "horizontal" | "vertical") => {
    setIsSaving(true);
    try {
      const result = await manipulateAsync(
        currentUri,
        [
          {
            flip:
              type === "horizontal" ? FlipType.Horizontal : FlipType.Vertical,
          },
        ],
        { compress: 0.9, format: SaveFormat.JPEG },
      );
      setCurrentUri(result.uri);
    } catch (e) {
      console.warn("Flip failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Aspect Ratio Cropping from Image Center
  const handleCrop = async (ratio: "1:1" | "16:9" | "4:3") => {
    setIsSaving(true);
    try {
      const w = imgDimensions.width;
      const h = imgDimensions.height;
      let cropW = w;
      let cropH = h;
      let originX = 0;
      let originY = 0;

      if (ratio === "1:1") {
        const size = Math.min(w, h);
        cropW = size;
        cropH = size;
        originX = (w - size) / 2;
        originY = (h - size) / 2;
      } else if (ratio === "16:9") {
        if (w / h > 16 / 9) {
          cropH = h;
          cropW = h * (16 / 9);
          originX = (w - cropW) / 2;
          originY = 0;
        } else {
          cropW = w;
          cropH = w * (9 / 16);
          originX = 0;
          originY = (h - cropH) / 2;
        }
      } else if (ratio === "4:3") {
        if (w / h > 4 / 3) {
          cropH = h;
          cropW = h * (4 / 3);
          originX = (w - cropW) / 2;
          originY = 0;
        } else {
          cropW = w;
          cropH = w * (3 / 4);
          originX = 0;
          originY = (h - cropH) / 2;
        }
      }

      const result = await manipulateAsync(
        currentUri,
        [
          {
            crop: {
              originX: Math.round(originX),
              originY: Math.round(originY),
              width: Math.round(cropW),
              height: Math.round(cropH),
            },
          },
        ],
        { compress: 0.9, format: SaveFormat.JPEG },
      );
      setCurrentUri(result.uri);
    } catch (e) {
      console.warn("Crop failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Sticker Stamp Addition
  const handleAddSticker = (emoji: string) => {
    const newSticker: StickerItem = {
      id: `sticker_${Date.now()}`,
      emoji,
      x: canvasDimensions.width / 2,
      y: canvasDimensions.height / 2,
      scale: 1.0,
      rotation: 0.0,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedItemId(newSticker.id);
  };

  // Text Addition Dialog Handling
  const handleAddText = () => {
    if (!textInputVal.trim()) return;
    const newText: TextItem = {
      id: `text_${Date.now()}`,
      text: textInputVal.trim(),
      color: textColor,
      fontSize: 24,
      x: canvasDimensions.width / 2 - 50,
      y: canvasDimensions.height / 2,
      scale: 1.0,
      rotation: 0.0,
    };
    setTexts((prev) => [...prev, newText]);
    setSelectedItemId(newText.id);
    setTextInputVal("");
    setShowTextModal(false);
  };

  // Drag-Pinch callbacks from gesture items
  const handleUpdateItem = (
    id: string,
    updates: { x: number; y: number; scale: number; rotation: number },
  ) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  const handleDeleteItem = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    setTexts((prev) => prev.filter((t) => t.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };

  // Drawing gesture handlers on Canvas Preview wrapper
  const startDrawing = (p: Point) => {
    const newId = `path_${Date.now()}`;
    activePathIdRef.current = newId;
    const newPath: DrawPath = {
      id: newId,
      points: [p],
      color: brushColor,
      strokeWidth: brushWidth,
      type: drawType,
    };
    setDrawPaths((prev) => [...prev, newPath]);
  };

  const updateDrawing = (p: Point) => {
    const currentId = activePathIdRef.current;
    if (!currentId) return;
    setDrawPaths((prev) =>
      prev.map((path) => {
        if (path.id === currentId) {
          return {
            ...path,
            points: [...path.points, p],
          };
        }
        return path;
      }),
    );
  };

  const endDrawing = () => {
    activePathIdRef.current = null;
  };

  const drawPanGesture = Gesture.Pan()
    .minDistance(0)
    .onStart((e) => {
      if (activeTab !== "draw") return;
      runOnJS(startDrawing)({ x: e.x, y: e.y });
    })
    .onUpdate((e) => {
      if (activeTab !== "draw") return;
      runOnJS(updateDrawing)({ x: e.x, y: e.y });
    })
    .onEnd(() => {
      if (activeTab !== "draw") return;
      runOnJS(endDrawing)();
    });

  // Save the full Skia snapshot compilation
  const handleSave = async () => {
    if (!canvasRef.current) return;
    setIsSaving(true);
    try {
      const base64Data = await canvasRef.current.saveImage();
      if (base64Data) {
        const filename = `edited_${Date.now()}.jpg`;
        const tempUri = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(tempUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        onSave(tempUri, editorState.filter);
      }
    } catch (e) {
      console.warn("Saving canvas snapshot failed:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Quick helper to render filter options
  const filterList = [
    { id: "none", label: "filter_none" },
    { id: "sepia", label: "filter_sepia" },
    { id: "grayscale", label: "filter_none" }, // will fall back to Monochrome / Original translated
    { id: "vintage", label: "filter_vintage" },
    { id: "warm", label: "filter_warm" },
    { id: "cool", label: "filter_cool" },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView className="flex-1 bg-zinc-950">
        <View
          className="flex-grow justify-between relative"
          style={{ paddingTop: topInset, paddingBottom: bottomInset }}
        >
          {/* Top Bar Header */}
          <Box className="flex-row justify-between items-center px-4 py-3 border-b border-zinc-900 bg-zinc-950">
            <Button
              size="sm"
              variant="link"
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t("auth.close")}
            >
              <ButtonIcon as={X} className="text-zinc-400" />
            </Button>

            <Heading size="md" className="text-white font-bold tracking-wide">
              {t("auth.image_editor_title")}
            </Heading>

            <Box className="flex-row items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-zinc-800"
                onPress={handleReset}
                accessibilityRole="button"
                accessibilityLabel={t("auth.reset")}
              >
                <ButtonIcon as={RotateCcw} className="text-zinc-300 mr-1" />
                <ButtonText className="text-zinc-300 text-xs">
                  {t("auth.reset")}
                </ButtonText>
              </Button>
              <Button
                size="sm"
                className="bg-primary px-3 rounded-full"
                onPress={handleSave}
                disabled={isSaving}
                accessibilityRole="button"
                accessibilityLabel={t("auth.save")}
                accessibilityState={{ disabled: isSaving }}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <ButtonIcon as={Check} className="text-white" />
                )}
              </Button>
            </Box>
          </Box>

          {/* Central Image Render Container */}
          <Pressable
            onPress={() => setSelectedItemId(null)}
            className="flex-1 items-center justify-center bg-zinc-900/40 p-4"
            accessibilityRole="button"
            accessibilityLabel={t("auth.deselect_item")}
          >
            <Box
              style={{
                width: canvasDimensions.width,
                height: canvasDimensions.height,
                position: "relative",
              }}
              className="justify-center items-center rounded-xl overflow-hidden shadow-2xl bg-zinc-950 border border-zinc-900"
            >
              {/* 1. Underlying Skia Canvas Renders filters, drawings, text, stickers */}
              <CanvasView
                ref={canvasRef}
                imageUri={currentUri}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
                editorState={editorState}
                stickers={stickers}
                texts={texts}
                drawPaths={drawPaths}
              />

              {/* 2. Overlays of Interactive Stickers */}
              {activeTab !== "draw" &&
                stickers.map((s) => (
                  <GestureOverlayItem
                    key={s.id}
                    id={s.id}
                    x={s.x}
                    y={s.y}
                    scale={s.scale}
                    rotation={s.rotation}
                    isSelected={selectedItemId === s.id}
                    onSelect={setSelectedItemId}
                    onChange={handleUpdateItem}
                    onDelete={handleDeleteItem}
                  >
                    <Text className="text-4xl text-center select-none">
                      {s.emoji}
                    </Text>
                  </GestureOverlayItem>
                ))}

              {/* 3. Overlays of Interactive Text boxes */}
              {activeTab !== "draw" &&
                texts.map((t) => (
                  <GestureOverlayItem
                    key={t.id}
                    id={t.id}
                    x={t.x}
                    y={t.y}
                    scale={t.scale}
                    rotation={t.rotation}
                    isSelected={selectedItemId === t.id}
                    onSelect={setSelectedItemId}
                    onChange={handleUpdateItem}
                    onDelete={handleDeleteItem}
                  >
                    <RNText
                      style={{ color: t.color, fontSize: t.fontSize }}
                      className="font-extrabold text-center tracking-wide"
                    >
                      {t.text}
                    </RNText>
                  </GestureOverlayItem>
                ))}

              {/* 4. Drawing Touch Overlay (Only visible & active when in 'draw' tab) */}
              {activeTab === "draw" && (
                <GestureDetector gesture={drawPanGesture}>
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 90,
                    }}
                    className="bg-transparent"
                  />
                </GestureDetector>
              )}

              {/* Spinner loading blocker */}
              {isSaving && (
                <Box className="absolute inset-0 bg-black/60 justify-center items-center z-50">
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </Box>
              )}
            </Box>
          </Pressable>

          {/* Lower Tool Control panel */}
          <Box className="bg-zinc-950 border-t border-zinc-900 py-4 px-4 min-h-[140px] justify-center">
            {/* TRANSFORM TAB */}
            {activeTab === "transform" && (
              <Box className="flex-col gap-4">
                <Box className="flex-row justify-evenly gap-2">
                  <Button
                    variant="outline"
                    className="border-zinc-800 flex-1 py-2 rounded-xl"
                    onPress={handleRotate}
                    accessibilityRole="button"
                    accessibilityLabel={t("auth.rotate")}
                  >
                    <ButtonIcon as={RotateCw} className="text-zinc-300 mr-2" />
                    <ButtonText className="text-zinc-300 text-sm">
                      {t("auth.rotate")}
                    </ButtonText>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-zinc-800 flex-1 py-2 rounded-xl"
                    onPress={() => handleFlip("horizontal")}
                    accessibilityRole="button"
                    accessibilityLabel={t("auth.flip_h")}
                  >
                    <ButtonText className="text-zinc-300 text-sm">
                      {t("auth.flip_h")}
                    </ButtonText>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-zinc-800 flex-1 py-2 rounded-xl"
                    onPress={() => handleFlip("vertical")}
                    accessibilityRole="button"
                    accessibilityLabel={t("auth.flip_v")}
                  >
                    <ButtonText className="text-zinc-300 text-sm">
                      {t("auth.flip_v")}
                    </ButtonText>
                  </Button>
                </Box>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-zinc-800 px-3 rounded-full"
                    onPress={() => handleCrop("1:1")}
                    accessibilityRole="button"
                    accessibilityLabel={t("auth.crop_square")}
                  >
                    <ButtonText className="text-zinc-300">
                      {t("auth.crop_square")}
                    </ButtonText>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-zinc-800 px-3 rounded-full"
                    onPress={() => handleCrop("16:9")}
                    accessibilityRole="button"
                    accessibilityLabel={t("auth.crop_ratio_16_9")}
                  >
                    <ButtonText className="text-zinc-300">
                      {t("auth.crop_ratio_16_9")}
                    </ButtonText>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-zinc-800 px-3 rounded-full"
                    onPress={() => handleCrop("4:3")}
                    accessibilityRole="button"
                    accessibilityLabel={t("auth.crop_ratio_4_3")}
                  >
                    <ButtonText className="text-zinc-300">
                      {t("auth.crop_ratio_4_3")}
                    </ButtonText>
                  </Button>
                </ScrollView>
              </Box>
            )}

            {/* ADJUST TAB */}
            {activeTab === "adjust" && (
              <Box className="flex-col gap-3 w-full px-2">
                {/* Brightness */}
                <Box className="flex-row items-center gap-4">
                  <Text className="text-zinc-400 text-xs w-20">
                    {t("auth.brightness")}
                  </Text>
                  <View className="flex-1">
                    <Slider
                      value={editorState.brightness * 50} // Map 0.5-1.5 to 25-75
                      minValue={25}
                      maxValue={75}
                      onChange={(v) =>
                        setEditorState((prev) => ({
                          ...prev,
                          brightness: v / 50,
                        }))
                      }
                    >
                      <SliderTrack className="bg-zinc-800">
                        <SliderFilledTrack className="bg-primary" />
                      </SliderTrack>
                      <SliderThumb className="bg-white border-2 border-primary" />
                    </Slider>
                  </View>
                </Box>
                {/* Contrast */}
                <Box className="flex-row items-center gap-4">
                  <Text className="text-zinc-400 text-xs w-20">
                    {t("auth.contrast")}
                  </Text>
                  <View className="flex-1">
                    <Slider
                      value={editorState.contrast * 50}
                      minValue={25}
                      maxValue={75}
                      onChange={(v) =>
                        setEditorState((prev) => ({
                          ...prev,
                          contrast: v / 50,
                        }))
                      }
                    >
                      <SliderTrack className="bg-zinc-800">
                        <SliderFilledTrack className="bg-primary" />
                      </SliderTrack>
                      <SliderThumb className="bg-white border-2 border-primary" />
                    </Slider>
                  </View>
                </Box>
                {/* Saturation */}
                <Box className="flex-row items-center gap-4">
                  <Text className="text-zinc-400 text-xs w-20">
                    {t("auth.saturation")}
                  </Text>
                  <View className="flex-1">
                    <Slider
                      value={editorState.saturation * 50} // Map 0-2 to 0-100
                      minValue={0}
                      maxValue={100}
                      onChange={(v) =>
                        setEditorState((prev) => ({
                          ...prev,
                          saturation: v / 50,
                        }))
                      }
                    >
                      <SliderTrack className="bg-zinc-800">
                        <SliderFilledTrack className="bg-primary" />
                      </SliderTrack>
                      <SliderThumb className="bg-white border-2 border-primary" />
                    </Slider>
                  </View>
                </Box>
              </Box>
            )}

            {/* FILTERS TAB */}
            {activeTab === "filters" && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
              >
                {filterList.map((f) => {
                  const isActive = editorState.filter === f.id;
                  const filterLabel =
                    f.id === "grayscale"
                      ? t("auth.filter_grayscale")
                      : t(`auth.${f.label}`);
                  return (
                    <Pressable
                      key={f.id}
                      onPress={() =>
                        setEditorState((prev) => ({ ...prev, filter: f.id }))
                      }
                      className={`px-4 py-2 rounded-xl border ${
                        isActive
                          ? "bg-primary border-primary"
                          : "bg-zinc-900 border-zinc-800"
                      }`}
                      accessibilityRole="button"
                      accessibilityLabel={filterLabel}
                      accessibilityState={{ selected: isActive }}
                    >
                      <Text
                        className={
                          isActive ? "text-white font-bold" : "text-zinc-400"
                        }
                      >
                        {filterLabel}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}

            {/* EFFECTS TAB */}
            {activeTab === "effects" && (
              <Box className="flex-col gap-3 w-full px-2">
                {/* Pixelate */}
                <Box className="flex-row items-center gap-4">
                  <Text className="text-zinc-400 text-xs w-20">
                    {t("auth.pixelate")}
                  </Text>
                  <View className="flex-1">
                    <Slider
                      value={editorState.pixelate}
                      minValue={1.0}
                      maxValue={30.0}
                      onChange={(v) =>
                        setEditorState((prev) => ({ ...prev, pixelate: v }))
                      }
                    >
                      <SliderTrack className="bg-zinc-800">
                        <SliderFilledTrack className="bg-primary" />
                      </SliderTrack>
                      <SliderThumb className="bg-white border-2 border-primary" />
                    </Slider>
                  </View>
                </Box>

                {/* Radial Pixel */}
                <Box className="flex-row items-center gap-4">
                  <Text className="text-zinc-400 text-xs w-20">
                    {t("auth.radial_pixel")}
                  </Text>
                  <View className="flex-1">
                    <Slider
                      value={editorState.radialPixelRadius}
                      minValue={0.0}
                      maxValue={20.0}
                      onChange={(v) =>
                        setEditorState((prev) => ({
                          ...prev,
                          radialPixelRadius: v,
                          radialPixelAngle: v > 0 ? 0.05 : 0.0,
                        }))
                      }
                    >
                      <SliderTrack className="bg-zinc-800">
                        <SliderFilledTrack className="bg-primary" />
                      </SliderTrack>
                      <SliderThumb className="bg-white border-2 border-primary" />
                    </Slider>
                  </View>
                </Box>

                {/* Liquid Distortion Ripple */}
                <Box className="flex-row items-center gap-4">
                  <Text className="text-zinc-400 text-xs w-20">
                    {t("auth.liquid_warp")}
                  </Text>
                  <View className="flex-1">
                    <Slider
                      value={editorState.liquidStrength}
                      minValue={0.0}
                      maxValue={25.0}
                      onChange={(v) =>
                        setEditorState((prev) => ({
                          ...prev,
                          liquidStrength: v,
                        }))
                      }
                    >
                      <SliderTrack className="bg-zinc-800">
                        <SliderFilledTrack className="bg-primary" />
                      </SliderTrack>
                      <SliderThumb className="bg-white border-2 border-primary" />
                    </Slider>
                  </View>
                </Box>
              </Box>
            )}

            {/* BLUR TAB */}
            {activeTab === "blur" && (
              <Box className="flex-row items-center gap-4">
                <Text className="text-zinc-400 text-xs w-20">
                  {t("auth.blur")}
                </Text>
                <View className="flex-grow flex-1">
                  <Slider
                    value={editorState.blur}
                    minValue={0.0}
                    maxValue={25.0}
                    onChange={(v) =>
                      setEditorState((prev) => ({ ...prev, blur: v }))
                    }
                  >
                    <SliderTrack className="bg-zinc-800">
                      <SliderFilledTrack className="bg-primary" />
                    </SliderTrack>
                    <SliderThumb className="bg-white border-2 border-primary" />
                  </Slider>
                </View>
              </Box>
            )}

            {/* STICKERS TAB */}
            {activeTab === "stickers" && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {EMOJIS.map((item, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleAddSticker(item)}
                    className="w-12 h-12 bg-zinc-900/60 rounded-full justify-center items-center active:opacity-80"
                    accessibilityRole="button"
                    accessibilityLabel={t("auth.sticker_label", {
                      emoji: item,
                    })}
                  >
                    <Text className="text-2xl text-center select-none">
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* TEXT TAB */}
            {activeTab === "text" && (
              <Box className="flex-row justify-center py-2">
                <Button
                  className="bg-primary rounded-xl px-6 py-3"
                  onPress={() => setShowTextModal(true)}
                  accessibilityRole="button"
                  accessibilityLabel={t("auth.add_text")}
                >
                  <ButtonIcon as={Type} className="text-white mr-2" />
                  <ButtonText className="text-white font-bold">
                    {t("auth.add_text")}
                  </ButtonText>
                </Button>
              </Box>
            )}

            {/* DRAW SHAPES TAB */}
            {activeTab === "draw" && (
              <Box className="flex-col gap-4">
                {/* Brush size and types */}
                <Box className="flex-row justify-between items-center gap-4">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 6 }}
                  >
                    <Button
                      size="sm"
                      className={`px-3 rounded-full ${drawType === "free" ? "bg-primary" : "bg-zinc-900 border border-zinc-800"}`}
                      onPress={() => setDrawType("free")}
                      accessibilityRole="button"
                      accessibilityLabel={t("auth.draw_free")}
                      accessibilityState={{ selected: drawType === "free" }}
                    >
                      <ButtonText
                        className={
                          drawType === "free"
                            ? "text-white font-bold"
                            : "text-zinc-400"
                        }
                      >
                        {t("auth.draw_free")}
                      </ButtonText>
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 rounded-full ${drawType === "rect" ? "bg-primary" : "bg-zinc-900 border border-zinc-800"}`}
                      onPress={() => setDrawType("rect")}
                      accessibilityRole="button"
                      accessibilityLabel={t("auth.draw_rect")}
                      accessibilityState={{ selected: drawType === "rect" }}
                    >
                      <ButtonText
                        className={
                          drawType === "rect"
                            ? "text-white font-bold"
                            : "text-zinc-400"
                        }
                      >
                        {t("auth.draw_rect")}
                      </ButtonText>
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 rounded-full ${drawType === "circle" ? "bg-primary" : "bg-zinc-900 border border-zinc-800"}`}
                      onPress={() => setDrawType("circle")}
                      accessibilityRole="button"
                      accessibilityLabel={t("auth.draw_circle")}
                      accessibilityState={{ selected: drawType === "circle" }}
                    >
                      <ButtonText
                        className={
                          drawType === "circle"
                            ? "text-white font-bold"
                            : "text-zinc-400"
                        }
                      >
                        {t("auth.draw_circle")}
                      </ButtonText>
                    </Button>
                    <Button
                      size="sm"
                      className={`px-3 rounded-full ${drawType === "arrow" ? "bg-primary" : "bg-zinc-900 border border-zinc-800"}`}
                      onPress={() => setDrawType("arrow")}
                      accessibilityRole="button"
                      accessibilityLabel={t("auth.draw_arrow")}
                      accessibilityState={{ selected: drawType === "arrow" }}
                    >
                      <ButtonText
                        className={
                          drawType === "arrow"
                            ? "text-white font-bold"
                            : "text-zinc-400"
                        }
                      >
                        {t("auth.draw_arrow")}
                      </ButtonText>
                    </Button>
                  </ScrollView>

                  <Box className="flex-row items-center gap-2">
                    <Text className="text-zinc-500 text-2xs">
                      {t("auth.brush_size")}
                    </Text>
                    <Slider
                      value={brushWidth}
                      minValue={2}
                      maxValue={20}
                      style={{ width: 80 }}
                      onChange={setBrushWidth}
                    >
                      <SliderTrack className="bg-zinc-800">
                        <SliderFilledTrack className="bg-primary" />
                      </SliderTrack>
                      <SliderThumb className="bg-white border-2 border-primary" />
                    </Slider>
                  </Box>
                </Box>

                {/* Color swatches */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10 }}
                >
                  {COLORS.map((c) => {
                    const isActive = brushColor === c;
                    return (
                      <Pressable
                        key={c}
                        onPress={() => setBrushColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full border-2 ${
                          isActive
                            ? "border-primary scale-110 shadow-lg"
                            : "border-zinc-900"
                        }`}
                        accessibilityRole="button"
                        accessibilityLabel={`${t("auth.brush_color")}: ${c}`}
                        accessibilityState={{ selected: isActive }}
                      />
                    );
                  })}
                </ScrollView>
              </Box>
            )}
          </Box>

          {/* Bottom Tabs Selector Menu */}
          <Box className="bg-zinc-950 border-t border-zinc-900 px-2 py-2 flex-row justify-around">
            <Pressable
              onPress={() => {
                setActiveTab("transform");
                setSelectedItemId(null);
              }}
              className="items-center py-2 flex-grow"
              accessibilityRole="button"
              accessibilityLabel={t("auth.transform")}
              accessibilityState={{ selected: activeTab === "transform" }}
            >
              <Crop
                className={`w-5 h-5 ${activeTab === "transform" ? "text-primary" : "text-zinc-500"}`}
              />
              <Text
                className={`text-xs mt-1 ${activeTab === "transform" ? "text-primary font-bold" : "text-zinc-500"}`}
              >
                {t("auth.transform")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setActiveTab("adjust");
                setSelectedItemId(null);
              }}
              className="items-center py-2 flex-grow"
              accessibilityRole="button"
              accessibilityLabel={t("auth.adjust")}
              accessibilityState={{ selected: activeTab === "adjust" }}
            >
              <Sliders
                className={`w-5 h-5 ${activeTab === "adjust" ? "text-primary" : "text-zinc-500"}`}
              />
              <Text
                className={`text-xs mt-1 ${activeTab === "adjust" ? "text-primary font-bold" : "text-zinc-500"}`}
              >
                {t("auth.adjust")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setActiveTab("filters");
                setSelectedItemId(null);
              }}
              className="items-center py-2 flex-grow"
              accessibilityRole="button"
              accessibilityLabel={t("auth.filters")}
              accessibilityState={{ selected: activeTab === "filters" }}
            >
              <Sparkles
                className={`w-5 h-5 ${activeTab === "filters" ? "text-primary" : "text-zinc-500"}`}
              />
              <Text
                className={`text-xs mt-1 ${activeTab === "filters" ? "text-primary font-bold" : "text-zinc-500"}`}
              >
                {t("auth.filters")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setActiveTab("effects");
                setSelectedItemId(null);
              }}
              className="items-center py-2 flex-grow"
              accessibilityRole="button"
              accessibilityLabel={t("auth.effects")}
              accessibilityState={{ selected: activeTab === "effects" }}
            >
              <Zap
                className={`w-5 h-5 ${activeTab === "effects" ? "text-primary" : "text-zinc-500"}`}
              />
              <Text
                className={`text-xs mt-1 ${activeTab === "effects" ? "text-primary font-bold" : "text-zinc-500"}`}
              >
                {t("auth.effects")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setActiveTab("blur");
                setSelectedItemId(null);
              }}
              className="items-center py-2 flex-grow"
              accessibilityRole="button"
              accessibilityLabel={t("auth.blur")}
              accessibilityState={{ selected: activeTab === "blur" }}
            >
              <Droplet
                className={`w-5 h-5 ${activeTab === "blur" ? "text-primary" : "text-zinc-500"}`}
              />
              <Text
                className={`text-xs mt-1 ${activeTab === "blur" ? "text-primary font-bold" : "text-zinc-500"}`}
              >
                {t("auth.blur")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setActiveTab("stickers");
                setSelectedItemId(null);
              }}
              className="items-center py-2 flex-grow"
              accessibilityRole="button"
              accessibilityLabel={t("auth.stickers")}
              accessibilityState={{ selected: activeTab === "stickers" }}
            >
              <Smile
                className={`w-5 h-5 ${activeTab === "stickers" ? "text-primary" : "text-zinc-500"}`}
              />
              <Text
                className={`text-xs mt-1 ${activeTab === "stickers" ? "text-primary font-bold" : "text-zinc-500"}`}
              >
                {t("auth.stickers")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setActiveTab("text");
                setSelectedItemId(null);
              }}
              className="items-center py-2 flex-grow"
              accessibilityRole="button"
              accessibilityLabel={t("auth.text")}
              accessibilityState={{ selected: activeTab === "text" }}
            >
              <Type
                className={`w-5 h-5 ${activeTab === "text" ? "text-primary" : "text-zinc-500"}`}
              />
              <Text
                className={`text-xs mt-1 ${activeTab === "text" ? "text-primary font-bold" : "text-zinc-500"}`}
              >
                {t("auth.text")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setActiveTab("draw");
                setSelectedItemId(null);
              }}
              className="items-center py-2 flex-grow"
              accessibilityRole="button"
              accessibilityLabel={t("auth.draw")}
              accessibilityState={{ selected: activeTab === "draw" }}
            >
              <Brush
                className={`w-5 h-5 ${activeTab === "draw" ? "text-primary" : "text-zinc-500"}`}
              />
              <Text
                className={`text-xs mt-1 ${activeTab === "draw" ? "text-primary font-bold" : "text-zinc-500"}`}
              >
                {t("auth.draw")}
              </Text>
            </Pressable>
          </Box>
        </View>

        {/* Text Input Modal Overlay */}
        <Modal
          visible={showTextModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTextModal(false)}
        >
          <View className="flex-grow justify-center items-center bg-black/85 p-6">
            <View className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
              <Box className="flex-row justify-between items-center mb-6">
                <Text className="text-white font-bold text-lg">
                  {t("auth.add_text")}
                </Text>
                <Pressable
                  onPress={() => setShowTextModal(false)}
                  className="p-1 rounded-full bg-zinc-800 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel={t("auth.close")}
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </Pressable>
              </Box>

              <Input className="w-full min-h-[90px] border border-zinc-800 bg-zinc-950 rounded-2xl mb-6">
                <InputField
                  autoFocus
                  multiline
                  placeholder={t("auth.type_text")}
                  placeholderTextColor="#71717A"
                  value={textInputVal}
                  onChangeText={setTextInputVal}
                  style={{ color: textColor }}
                  className="w-full h-full text-lg font-bold text-center tracking-wide text-white py-4 px-4"
                />
              </Input>

              {/* Color selectors */}
              <Text className="text-zinc-400 text-xs font-semibold mb-3">
                {t("auth.text_color")}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingBottom: 6 }}
                className="mb-8"
              >
                {COLORS.map((c) => {
                  const isActive = textColor === c;
                  return (
                    <Pressable
                      key={c}
                      onPress={() => setTextColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-full border-2 ${
                        isActive
                          ? "border-primary scale-110 shadow-lg"
                          : "border-zinc-950"
                      }`}
                      accessibilityRole="button"
                      accessibilityLabel={`${t("auth.text_color")}: ${c}`}
                      accessibilityState={{ selected: isActive }}
                    />
                  );
                })}
              </ScrollView>

              <Button
                className="bg-primary py-3 rounded-2xl w-full"
                onPress={handleAddText}
                accessibilityRole="button"
                accessibilityLabel={t("auth.save")}
              >
                <ButtonText className="text-white font-bold">
                  {t("auth.save")}
                </ButtonText>
              </Button>
            </View>
          </View>
        </Modal>
      </GestureHandlerRootView>
    </Modal>
  );
};
