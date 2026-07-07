import { ROUTES } from "@/routes";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect } from "expo-router";

/**
 * Entry point — checks first launch and authentication to route correctly.
 */
export default function Index() {
  // const hasLaunchedBefore = useJourneyStore((s) => s.hasLaunchedBefore);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // if (!hasLaunchedBefore) {
  //   return <Redirect href={ROUTES.ONBOARDING.LANGUAGE} />;
  // }

  if (isAuthenticated) {
    return <Redirect href={ROUTES.TABS.FEED} />;
  }

  return <Redirect href={ROUTES.AUTH.HOME} />;
}
