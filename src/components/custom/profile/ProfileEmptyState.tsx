import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ROUTES } from "@/routes";
import { useRouter } from "expo-router";
import {
  CameraIcon,
  FileTextIcon,
  MusicIcon,
  PlusCircleIcon,
  VideoIcon,
  type LucideIcon,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";

const TAB_ICONS: Record<string, LucideIcon> = {
  image: CameraIcon,
  video: VideoIcon,
  audio: MusicIcon,
  text: FileTextIcon,
};

export interface ProfileEmptyStateProps {
  isLoadingPosts: boolean;
  activeTab: string;
  imageSize: number;
  isOtherUser?: boolean;
  userName?: string;
}

export function ProfileEmptyState({
  isLoadingPosts,
  activeTab,
  imageSize,
  isOtherUser = false,
  userName,
}: ProfileEmptyStateProps) {
  const router = useRouter();
  const { t } = useTranslation();

  if (isLoadingPosts) {
    return (
      <Box className="flex-1 flex-row flex-wrap">
        {Array.from({ length: 15 }).map((_, i) => (
          <Box
            key={i}
            style={{ width: imageSize, height: imageSize, padding: 1 }}
          >
            <Box className="flex-1 bg-muted" />
          </Box>
        ))}
      </Box>
    );
  }

  const tabIcon = TAB_ICONS[activeTab] ?? CameraIcon;

  return (
    <VStack space="md" className="mt-14 items-center px-10 pb-10">
      <Box className="h-24 w-24 overflow-hidden rounded-full">
        <LinearGradient
          colors={["rgb(192,57,42)", "rgb(97,29,21)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon as={tabIcon} size={36} className="text-white" />
        </LinearGradient>
      </Box>

      <VStack space="xs" className="items-center">
        <Text className="text-center text-[20px] font-extrabold tracking-tight text-foreground">
          {t("profile.no_posts_yet", { type: t(`profile.${activeTab}`) })}
        </Text>
        <Text className="text-center text-[15px] font-medium leading-5 text-muted-foreground">
          {isOtherUser
            ? t("profile.no_posts_other_user", {
                name: userName || t("common.user"),
                type: t(`profile.${activeTab}`),
              })
            : t("profile.share_first_post", { type: t(`profile.${activeTab}`) })}
        </Text>
      </VStack>

      {!isOtherUser && (
        <Button
          onPress={() => router.push(ROUTES.TABS.CREATE)}
          accessibilityRole="button"
          accessibilityLabel={t("profile.create_post_a11y", {
            type: t(`profile.${activeTab}`),
          })}
          variant="theme"
          size="lg"
          className="mt-2 rounded-full px-6"
        >
          <ButtonIcon as={PlusCircleIcon} />
          <ButtonText className="font-extrabold tracking-wide">
            {t("profile.create_post", { type: t(`profile.${activeTab}`) })}
          </ButtonText>
        </Button>
      )}
    </VStack>
  );
}
