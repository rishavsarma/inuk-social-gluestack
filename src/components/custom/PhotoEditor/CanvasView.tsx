import {
  Blur,
  Canvas,
  Group,
  Image,
  ImageFormat,
  matchFont,
  Path,
  RuntimeShader,
  Skia,
  SkImage,
  SkPath,
  Text,
  useCanvasRef,
} from "@shopify/react-native-skia";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import {
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { getCombinedShader } from "./shaders";
import { DrawPath, EditorState, StickerItem, TextItem } from "./types";

interface CanvasViewProps {
  imageUri: string;
  width: number;
  height: number;
  editorState: EditorState;
  stickers: StickerItem[];
  texts: TextItem[];
  drawPaths: DrawPath[];
}

export interface CanvasViewRef {
  saveImage: () => Promise<string | null>;
}

// Map filter string to floats for shader uniform (defined outside component for worklet access)
const getFilterTypeVal = (filterName: string): number => {
  "worklet";
  switch (filterName) {
    case "sepia":
      return 1.0;
    case "grayscale":
      return 2.0;
    case "vintage":
      return 3.0;
    case "negative":
      return 4.0;
    case "warm":
      return 5.0;
    case "cool":
      return 6.0;
    default:
      return 0.0;
  }
};

export const CanvasView = forwardRef<CanvasViewRef, CanvasViewProps>(
  (
    { imageUri, width, height, editorState, stickers, texts, drawPaths },
    ref,
  ) => {
    const canvasRef = useCanvasRef();
    const [skImage, setSkImage] = useState<SkImage | null>(null);

    // Animation value for liquid ripples shader (run on GPU)
    const time = useSharedValue(0);

    useEffect(() => {
      time.value = withRepeat(
        withTiming(15, { duration: 6000 }),
        -1, // Loop indefinitely
        false, // Do not reverse
      );
      return () => {
        cancelAnimation(time);
      };
    }, [time]);

    const uniforms = useDerivedValue(() => {
      return {
        imageSize: [width, height],
        brightness: editorState.brightness,
        contrast: editorState.contrast,
        saturation: editorState.saturation,
        pixelate: editorState.pixelate,
        radialPixelAngle: editorState.radialPixelAngle,
        radialPixelRadius: editorState.radialPixelRadius,
        liquidStrength: editorState.liquidStrength,
        liquidFrequency: editorState.liquidFrequency,
        time: time.value,
        filterType: getFilterTypeVal(editorState.filter),
      };
    }, [
      width,
      height,
      editorState.brightness,
      editorState.contrast,
      editorState.saturation,
      editorState.pixelate,
      editorState.radialPixelRadius,
      editorState.radialPixelAngle,
      editorState.liquidStrength,
      editorState.liquidFrequency,
      editorState.filter,
    ]);

    // Load Skia Image from Local URI
    useEffect(() => {
      let active = true;
      const load = async () => {
        try {
          const data = await Skia.Data.fromURI(imageUri);
          if (data && active) {
            const img = Skia.Image.MakeImageFromEncoded(data);
            setSkImage(img);
          }
        } catch (e) {
          console.warn("Error loading Skia image:", e);
        }
      };
      load();
      return () => {
        active = false;
      };
    }, [imageUri]);

    // Get combined shader
    const combinedEffect = useMemo(() => {
      try {
        return getCombinedShader();
      } catch (e) {
        console.warn("Failed to compile Skia shaders:", e);
        return null;
      }
    }, []);

    // Load Fonts for Canvas Drawing (System default Helvetica for iOS, sans-serif for Android)
    const textFont = useMemo(() => {
      const family = Platform.select({
        ios: "Helvetica",
        default: "sans-serif",
      });
      return matchFont({
        fontFamily: family,
        fontSize: 24,
        fontWeight: "bold",
      });
    }, []);

    const stickerFont = useMemo(() => {
      const family = Platform.select({ ios: "System", default: "sans-serif" });
      return matchFont({
        fontFamily: family,
        fontSize: 48, // Base size for stickers
        fontWeight: "bold",
      });
    }, []);

    // Helper: Convert drawing points list into Skia SkPath object
    const getSkiaPath = (pathData: DrawPath): SkPath => {
      const path = Skia.Path.Make();
      const points = pathData.points;
      if (points.length === 0) return path;

      const p1 = points[0];

      if (pathData.type === "free") {
        path.moveTo(p1.x, p1.y);
        for (let i = 1; i < points.length; i++) {
          path.lineTo(points[i].x, points[i].y);
        }
      } else if (pathData.type === "rect") {
        if (points.length >= 2) {
          const p2 = points[points.length - 1];
          path.addRect(
            Skia.XYWHRect(
              Math.min(p1.x, p2.x),
              Math.min(p1.y, p2.y),
              Math.abs(p2.x - p1.x),
              Math.abs(p2.y - p1.y),
            ),
          );
        }
      } else if (pathData.type === "circle") {
        if (points.length >= 2) {
          const p2 = points[points.length - 1];
          const radius = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2),
          );
          path.addCircle(p1.x, p1.y, radius);
        }
      } else if (pathData.type === "arrow") {
        if (points.length >= 2) {
          const p2 = points[points.length - 1];
          path.moveTo(p1.x, p1.y);
          path.lineTo(p2.x, p2.y);

          // Arrowhead math
          const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          const arrowLength = 15;
          const arrowAngle = Math.PI / 6; // 30 deg

          const x3 = p2.x - arrowLength * Math.cos(angle - arrowAngle);
          const y3 = p2.y - arrowLength * Math.sin(angle - arrowAngle);
          const x4 = p2.x - arrowLength * Math.cos(angle + arrowAngle);
          const y4 = p2.y - arrowLength * Math.sin(angle + arrowAngle);

          path.moveTo(p2.x, p2.y);
          path.lineTo(x3, y3);
          path.moveTo(p2.x, p2.y);
          path.lineTo(x4, y4);
        }
      }

      return path;
    };

    // Expose capture/save API to parent
    useImperativeHandle(ref, () => ({
      saveImage: async (): Promise<string | null> => {
        if (!canvasRef.current) return null;
        try {
          // Take snapshot of the Canvas
          const snapshot = canvasRef.current.makeImageSnapshot();
          if (snapshot) {
            // Encode to base64 string
            const base64 = await snapshot.encodeToBase64(ImageFormat.JPEG, 90);
            return base64;
          }
        } catch (e) {
          console.warn("Failed to take Canvas snapshot:", e);
        }
        return null;
      },
    }));

    if (!skImage) return null;

    return (
      <Canvas ref={canvasRef} style={{ width, height, overflow: "hidden" }}>
        {/* Render Original Image + Blur + Adjustments + Custom Shaders */}
        <Group>
          <Image
            image={skImage}
            x={0}
            y={0}
            width={width}
            height={height}
            fit="contain"
          >
            {editorState.blur > 0 && (
              <Blur blur={editorState.blur} mode="clamp" />
            )}
            {combinedEffect && (
              <RuntimeShader source={combinedEffect} uniforms={uniforms} />
            )}
          </Image>
        </Group>

        {/* Draw Shapes and Brush Paths */}
        {drawPaths.map((item) => {
          const skPath = getSkiaPath(item);
          return (
            <Path
              key={item.id}
              path={skPath}
              color={item.color}
              strokeWidth={item.strokeWidth}
              style="stroke"
              strokeCap="round"
              strokeJoin="round"
            />
          );
        })}

        {/* Draw Emoji Stickers */}
        {stickerFont &&
          stickers.map((item) => (
            <Group
              key={item.id}
              origin={{ x: item.x, y: item.y }}
              transform={[{ scale: item.scale }, { rotate: item.rotation }]}
            >
              <Text
                text={item.emoji}
                x={item.x - 24} // Offset half font-size to center
                y={item.y + 16}
                font={stickerFont}
              />
            </Group>
          ))}

        {/* Draw Text Items */}
        {textFont &&
          texts.map((item) => (
            <Group
              key={item.id}
              origin={{ x: item.x, y: item.y }}
              transform={[{ scale: item.scale }, { rotate: item.rotation }]}
            >
              <Text
                text={item.text}
                x={item.x}
                y={item.y}
                color={item.color}
                font={textFont}
              />
            </Group>
          ))}
      </Canvas>
    );
  },
);

CanvasView.displayName = "CanvasView";
