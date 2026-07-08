import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ROUTES } from "@/routes";
import { useRouter } from "expo-router";
import {
  CameraIcon,
  FileTextIcon,
  MusicIcon,
  PlusCircleIcon,
  VideoIcon,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

export interface ProfileEmptyStateProps {
  isLoadingPosts: boolean;
  activeTab: string;
  imageSize: number;
}

export function ProfileEmptyState({
  isLoadingPosts,
  activeTab,
  imageSize,
}: ProfileEmptyStateProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { t } = useTranslation();

  if (isLoadingPosts) {
    return (
      <View className="flex-1 flex-row flex-wrap">
        {Array.from({ length: 15 }).map((_, i) => (
          <View
            key={i}
            style={{ width: imageSize, height: imageSize, padding: 1 }}
          >
            <View className="flex-1 bg-muted" />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className="mt-12 items-center px-8">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full border border-border bg-muted">
        {activeTab === "image" && (
          <Icon as={CameraIcon} size={40} color={isDark ? "#555" : "#ccc"} />
        )}
        {activeTab === "video" && (
          <Icon as={VideoIcon} size={40} color={isDark ? "#555" : "#ccc"} />
        )}
        {activeTab === "audio" && (
          <Icon as={MusicIcon} size={40} color={isDark ? "#555" : "#ccc"} />
        )}
        {activeTab === "text" && (
          <Icon as={FileTextIcon} size={40} color={isDark ? "#555" : "#ccc"} />
        )}
      </View>
      <Text className="text-center text-[20px] font-extrabold tracking-tight text-foreground">
        {t("profile.no_posts_yet", { type: t(`profile.${activeTab}`) })}
      </Text>
      <Text className="mt-2 text-center text-[15px] font-medium text-muted-foreground">
        {t("profile.share_first_post", { type: t(`profile.${activeTab}`) })}
      </Text>
      <Pressable
        onPress={() => router.push(ROUTES.TABS.CREATE)}
        accessibilityRole="button"
        accessibilityLabel={t("profile.create_post_a11y", {
          type: t(`profile.${activeTab}`),
        })}
        className="mt-8 flex-row items-center gap-2 rounded-full bg-[#E50914] px-6 py-3.5 shadow-md shadow-red-500/20 active:opacity-80"
      >
        <Icon as={PlusCircleIcon} size={20} color="#fff" />
        <Text className="text-[15px] font-extrabold tracking-wide text-white">
          {t("profile.create_post", { type: t(`profile.${activeTab}`) })}
        </Text>
      </Pressable>
    </View>
  );
}
