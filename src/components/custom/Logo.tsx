import React from "react";

import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "../ui/heading";

type LogoProps = {
  size?: number;
};

export function LogoIcon({ size = 34 }: { size: number }) {
  const { t } = useTranslation();

  return (
    <Image
      source={require("@/assets/images/logo.svg")}
      style={{ width: size, height: size, borderRadius: 5 }}
      contentFit="contain"
      accessibilityIgnoresInvertColors
      alt={t("common.app_logo_alt")}
    />
  );
}

export function LogoWordmark() {
  return (
    <HStack className="items-center">
      <Heading
        size="3xl"
        className="font-baloo-extrabold font-normal text-foreground leading-none tracking-tight"
      >
        soc
      </Heading>
      <Heading
        size="3xl"
        className="font-baloo-extrabold font-normal underline text-theme leading-none tracking-tight"
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
