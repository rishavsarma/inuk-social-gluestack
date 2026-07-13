import React from "react";

import { Baloo2_800ExtraBold, useFonts } from "@expo-google-fonts/baloo-2";
import { Image } from "expo-image";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "../ui/heading";

type LogoProps = {
  size?: number;
};

export function LogoIcon({ size = 34 }: { size: number }) {
  return (
    <Image
      source={require("@/assets/images/logo.svg")}
      style={{ width: size, height: size, borderRadius: 5 }}
      contentFit="contain"
      accessibilityIgnoresInvertColors
    />
  );
}

export function LogoWordmark() {
  const [fontsLoaded] = useFonts({ Baloo2_800ExtraBold });
  const fontFamily = fontsLoaded ? "Baloo2_800ExtraBold" : undefined;

  const textStyle = {
    fontFamily,
    fontWeight: "normal" as const,
  };

  return (
    <HStack className="items-center">
      <Heading
        size="3xl"
        className="text-foreground leading-none tracking-tight"
        style={textStyle}
      >
        soc
      </Heading>
      <Heading
        size="3xl"
        style={textStyle}
        className="underline text-theme leading-none tracking-tight"
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
