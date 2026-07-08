import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect } from "expo-router";

/**
 * Entry point — checks first launch and authentication to route correctly.
 * Waits for Zustand persist rehydration from SecureStore before routing
 * so the persisted auth state is available.
 */
export default function Index() {
  // const hasLaunchedBefore = useJourneyStore((s) => s.hasLaunchedBefore);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  // Block rendering until SecureStore rehydration is complete
  if (!hasHydrated) {
    return null;
  }

  // if (!hasLaunchedBefore) {
  //   return <Redirect href={ROUTES.ONBOARDING.LANGUAGE} />;
  // }

  if (isAuthenticated) {
    return <Redirect href={ROUTES.TABS.FEED} />;
  }

  return <Redirect href={ROUTES.AUTH.HOME} />;
}
