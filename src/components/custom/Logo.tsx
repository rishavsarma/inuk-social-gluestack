import React from "react";

import { Baloo2_800ExtraBold, useFonts } from "@expo-google-fonts/baloo-2";
import { HStack } from "@/components/ui/hstack";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { THEME_ACCENT_COLOR } from "@/constants";
import { Heading } from "../ui/heading";

type LogoProps = {
  size?: number;
};

export function LogoIcon({ size = 34 }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect
        x={0}
        y={0}
        width={100}
        height={100}
        rx={14}
        fill={THEME_ACCENT_COLOR}
      />
      <Circle cx={33} cy={24} r={8} fill="white" />
      <Path
        d="M33 40 V58 A17 17 0 0 0 67 58 V18"
        stroke="white"
        strokeWidth={12}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export function LogoWordmark() {
  const [fontsLoaded] = useFonts({ Baloo2_800ExtraBold });
  const fontFamily = fontsLoaded ? "Baloo2_800ExtraBold" : undefined;

  const textStyle = {
    fontFamily,
  };

  return (
    <HStack className="items-center">
      <Heading
        size="2xl"
        className="text-foreground leading-0 tracking-tight"
        style={textStyle}
      >
        soc
      </Heading>
      <Heading
        size="2xl"
        style={textStyle}
        className="underline  text-theme leading-0 tracking-tight"
      >
        ial
      </Heading>
    </HStack>
  );
}

function Logo({ size = 36 }: LogoProps) {
  return (
    <HStack
      space="xs"
      className="items-center"
      accessibilityRole="image"
      accessibilityLabel="social"
    >
      <LogoIcon size={size} />
      <LogoWordmark />
    </HStack>
  );
}

export default Logo;
