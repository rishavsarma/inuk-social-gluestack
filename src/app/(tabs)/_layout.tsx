import CustomTabBar from "@/components/custom/bottom-tabs/TabBar";
import { TabBarProvider } from "@/components/custom/bottom-tabs/TabBarContext";
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
        <Tabs.Screen name="arena" />
        <Tabs.Screen name="awards" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </TabBarProvider>
  );
};

export default TabLayout;
