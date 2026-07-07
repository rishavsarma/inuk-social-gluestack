import { X } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface GestureOverlayItemProps {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (
    id: string,
    updates: { x: number; y: number; scale: number; rotation: number },
  ) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

export const GestureOverlayItem: React.FC<GestureOverlayItemProps> = ({
  id,
  x,
  y,
  scale,
  rotation,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  children,
}) => {
  // Shared values initialized with props
  const translationX = useSharedValue(x);
  const translationY = useSharedValue(y);
  const scaleValue = useSharedValue(scale);
  const rotationValue = useSharedValue(rotation);

  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const prevScale = useSharedValue(1);
  const prevRotation = useSharedValue(0);

  // Sync positions when props change externally (e.g. on reset)
  useEffect(() => {
    translationX.value = x;
    translationY.value = y;
    scaleValue.value = scale;
    rotationValue.value = rotation;
  }, [x, y, scale, rotation]);

  const notifyChange = () => {
    "worklet";
    runOnJS(onChange)(id, {
      x: translationX.value,
      y: translationY.value,
      scale: scaleValue.value,
      rotation: rotationValue.value,
    });
  };

  // Pan gesture for dragging
  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
      runOnJS(onSelect)(id);
    })
    .onUpdate((event) => {
      translationX.value = prevTranslationX.value + event.translationX;
      translationY.value = prevTranslationY.value + event.translationY;
    })
    .onEnd(() => {
      notifyChange();
    });

  // Pinch gesture for scaling
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      prevScale.value = scaleValue.value;
      runOnJS(onSelect)(id);
    })
    .onUpdate((event) => {
      scaleValue.value = Math.max(
        0.3,
        Math.min(prevScale.value * event.scale, 5.0),
      );
    })
    .onEnd(() => {
      notifyChange();
    });

  // Rotation gesture for rotating
  const rotationGesture = Gesture.Rotation()
    .onStart(() => {
      prevRotation.value = rotationValue.value;
      runOnJS(onSelect)(id);
    })
    .onUpdate((event) => {
      rotationValue.value = prevRotation.value + event.rotation;
    })
    .onEnd(() => {
      notifyChange();
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(onSelect)(id);
  });

  // Combine simultaneously
  const dragPinchRotate = Gesture.Simultaneous(
    panGesture,
    Gesture.Simultaneous(pinchGesture, rotationGesture),
  );

  const combinedGesture = Gesture.Exclusive(tapGesture, dragPinchRotate);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scaleValue.value },
        { rotate: `${(rotationValue.value * 180) / Math.PI}deg` },
      ],
      position: "absolute",
      zIndex: isSelected ? 100 : 10,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <GestureDetector gesture={combinedGesture}>
        <View className="items-center justify-center p-4">
          {/* Border highlight for selected item */}
          <View
            className={`border rounded-lg p-2 ${
              isSelected
                ? "border-primary border-dashed bg-primary/5"
                : "border-transparent"
            }`}
          >
            {children}
          </View>

          {/* Delete Action button overlay */}
          {isSelected && (
            <Pressable
              onPress={() => onDelete(id)}
              className="absolute -top-1 -right-1 bg-destructive p-1 rounded-full border border-background shadow-md z-50 active:scale-95"
            >
              <X className="w-3.5 h-3.5 text-destructive-foreground" />
            </Pressable>
          )}
        </View>
      </GestureDetector>
    </Animated.View>
  );
};
