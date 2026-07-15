import "@/globals.css";
import "@/locales/i18n";
import {
  Baloo2_400Regular,
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/baloo-2";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { THEME_RGB } from "@/constants";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { useSettingStore } from "@/stores/setting.store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/stores/auth.store";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: THEME_RGB.dark.background,
    card: THEME_RGB.dark.card,
    text: THEME_RGB.dark.foreground,
    border: THEME_RGB.dark.border,
    primary: THEME_RGB.dark.primary,
  },
};

const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: THEME_RGB.light.background,
    card: THEME_RGB.light.card,
    text: THEME_RGB.light.foreground,
    border: THEME_RGB.light.border,
    primary: THEME_RGB.light.primary,
  },
};

const RootLayout = () => {
  const theme = useSettingStore((state) => state.theme);
  const language = useSettingStore((state) => state.language);
  const isDark = useIsDarkMode();
  const { i18n } = useTranslation();
  const [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <GluestackUIProvider mode={theme}>
            <ThemeProvider
              value={isDark ? CustomDarkTheme : CustomDefaultTheme}
            >
              {Platform.OS === "android" && <StatusBar animated />}
              <Stack
                key={language}
                screenOptions={{ headerShown: false, animation: "fade" }}
              />
            </ThemeProvider>
          </GluestackUIProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
