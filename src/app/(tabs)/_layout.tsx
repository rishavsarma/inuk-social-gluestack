import CustomTabBar from "@/components/custom/BottomTabs/TabBar";
import { TabBarProvider } from "@/components/custom/BottomTabs/TabBarContext";
import { Tabs } from "expo-router";

// ─── Layout ──────────────────────────────────────────────────────────
const TabLayout = () => {
  return (
    <TabBarProvider>
      <Tabs
        initialRouteName="feed"
        backBehavior="history"
        tabBar={() => <CustomTabBar />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="feed" />
        <Tabs.Screen name="discover" />
        <Tabs.Screen name="create" />
        <Tabs.Screen name="contest" />
        <Tabs.Screen name="awards" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </TabBarProvider>
  );
};

export default TabLayout;
