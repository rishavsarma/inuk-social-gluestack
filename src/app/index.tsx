import { useEffect, useState } from "react";
import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect } from "expo-router";
import AnimatedSplash from "@/components/custom/AnimatedSplash";

const MIN_SPLASH_DURATION_MS = 2200;

/**
 * Entry point — checks first launch and authentication to route correctly.
 * Waits for Zustand persist rehydration from SecureStore before routing
 * so the persisted auth state is available.
 */
export default function Index() {
  // const hasLaunchedBefore = useJourneyStore((s) => s.hasLaunchedBefore);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const [minDurationPassed, setMinDurationPassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setMinDurationPassed(true),
      MIN_SPLASH_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  // Block rendering until SecureStore rehydration completes AND the splash
  // animation has had time to play — hydration can resolve in a few ms for
  // an already-authenticated user, which would otherwise skip it entirely.
  if (!hasHydrated || !minDurationPassed) {
    return <AnimatedSplash />;
  }

  // if (!hasLaunchedBefore) {
  //   return <Redirect href={ROUTES.ONBOARDING.LANGUAGE} />;
  // }

  if (isAuthenticated) {
    return <Redirect href={ROUTES.TABS.FEED} />;
  }

  return <Redirect href={ROUTES.AUTH.HOME} />;
}
