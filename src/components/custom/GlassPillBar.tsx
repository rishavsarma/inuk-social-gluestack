import type { ReactNode } from "react";

import { GlassView } from "expo-glass-effect";
import { Platform, View } from "react-native";

/** Shared floating "glass pill" bar used by the bottom tab bar and the create
 * screen's mode switcher. Branches on `Platform.OS` once internally — iOS
 * gets a real blur via `GlassView`, Android gets a flat translucent `View`
 * with a slightly stronger background to compensate for the missing blur. */
function GlassPillBar({
  children,
  isDark,
  bottomInset,
}: {
  children: ReactNode;
  isDark: boolean;
  bottomInset: number;
}) {
  const barStyle = {
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 30 : bottomInset,
    borderRadius: 9999,
    overflow: "hidden" as const,
    borderWidth: 0.1,
    borderColor: isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.10)",
    backgroundColor:
      Platform.OS === "ios"
        ? isDark
          ? "rgba(0,0,0,0.5)"
          : "rgba(245,245,247,0.5)"
        : isDark
          ? "rgba(14,14,14,0.96)"
          : "rgba(245,245,247,0.96)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 32,
    shadowOpacity: isDark ? 0.6 : 0.14,
    elevation: 180,
  };

  return Platform.OS === "ios" ? (
    <GlassView isInteractive style={barStyle} glassEffectStyle="regular">
      {children}
    </GlassView>
  ) : (
    <View style={barStyle}>{children}</View>
  );
}

export default GlassPillBar;
