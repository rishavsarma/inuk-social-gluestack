import "@/globals.css";
import "@/locales/i18n";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
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
    background: "rgb(10, 10, 10)",
    card: "rgb(23, 23, 23)",
    text: "rgb(250, 250, 250)",
    border: "rgb(46, 46, 46)",
    primary: "rgb(255, 245, 245)",
  },
};

const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "rgb(255, 255, 255)",
    card: "rgb(255, 255, 255)",
    text: "rgb(10, 10, 10)",
    border: "rgb(229, 229, 229)",
    primary: "rgb(23, 23, 23)",
  },
};

export default function RootLayout() {
  const theme = useSettingStore((state) => state.theme);
  const language = useSettingStore((state) => state.language);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <GluestackUIProvider mode={theme}>
            <ThemeProvider
              value={theme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
            >
              {Platform.OS === "android" && <StatusBar animated />}
              <Stack key={language} screenOptions={{ headerShown: false }} />
            </ThemeProvider>
          </GluestackUIProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
