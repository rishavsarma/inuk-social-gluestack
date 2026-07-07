import React, { createContext, useContext } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

// ─── Context ─────────────────────────────────────────────────────────
// ─── Types ────────────────────────────────────────────────────────────
type TabBarContextType = {
  /** 0 = fully visible, positive value (e.g. 120) = fully hidden below screen */
  tabBarTranslateY: SharedValue<number>;
  previousTab: string | null;
  setPreviousTab: (tab: string | null) => void;
};

export type TabBarState =
  | {
      isInsideTabBar: true;
      tabBarTranslateY: SharedValue<number>;
      previousTab: string | null;
      setPreviousTab: (tab: string | null) => void;
    }
  | {
      isInsideTabBar: false;
      tabBarTranslateY: null;
      previousTab: null;
      setPreviousTab: (tab: string | null) => void;
    };

const TabBarContext = createContext<TabBarContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────
export function TabBarProvider({ children }: { children: React.ReactNode }) {
  const tabBarTranslateY = useSharedValue(0);
  const [previousTab, setPreviousTab] = React.useState<string | null>(null);

  return (
    <TabBarContext.Provider
      value={{ tabBarTranslateY, previousTab, setPreviousTab }}
    >
      {children}
    </TabBarContext.Provider>
  );
}

export function useTabBar(): TabBarState {
  const ctx = useContext(TabBarContext);
  if (!ctx) {
    return {
      isInsideTabBar: false,
      tabBarTranslateY: null,
      previousTab: null,
      setPreviousTab: () => {},
    };
  }
  return {
    isInsideTabBar: true,
    tabBarTranslateY: ctx.tabBarTranslateY,
    previousTab: ctx.previousTab,
    setPreviousTab: ctx.setPreviousTab,
  };
}
