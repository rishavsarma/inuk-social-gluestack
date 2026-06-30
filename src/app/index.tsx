import React from "react";
import { useTranslation } from "react-i18next";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { MessageSquare, Shield } from "lucide-react-native";
import { Redirect } from "expo-router";
import { ROUTES } from "@/routes";

/**
 * Entry point — checks first launch and authentication to route correctly.
 */
export default function Index() {
  // const hasLaunchedBefore = useJourneyStore((s) => s.hasLaunchedBefore);
  // const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // if (!hasLaunchedBefore) {
  //   return <Redirect href={ROUTES.ONBOARDING.LANGUAGE} />;
  // }

  // if (isAuthenticated) {
  //   return <Redirect href={ROUTES.TABS.FEED} />;
  // }

  return <Redirect href={ROUTES.AUTH.HOME} />;
}
