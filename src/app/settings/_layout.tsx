import { Stack } from "expo-router";
import { Platform } from "react-native";

const SettingsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "android" ? "default" : "fade",
      }}
    />
  );
};

export default SettingsLayout;
