import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import {
  Bookmark,
  EyeOff,
  Flag,
  Info,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Fragment, type ReactNode } from "react";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";

export interface PostOptionsActionsheetProps {
  isOpen: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onSave: () => void;
  onAboutAccount: () => void;
  onWhySeeingThis: () => void;
  onInterested: () => void;
  onNotInterested: () => void;
  onHide: () => void;
  onReport: () => void;
}

function OptionGroup({ children }: { children: ReactNode }) {
  return <Box className="overflow-hidden rounded-xl bg-muted">{children}</Box>;
}

export function PostOptionsActionsheet({
  isOpen,
  onClose,
  isSaved = false,
  onSave,
  onAboutAccount,
  onWhySeeingThis,
  onInterested,
  onNotInterested,
  onHide,
  onReport,
}: PostOptionsActionsheetProps) {
  const { t } = useTranslation();

  const runAndClose = (action: () => void) => () => {
    onClose();
    action();
  };

  const infoItems = [
    {
      key: "about_account",
      icon: User,
      label: t("post_options.about_account"),
      onPress: runAndClose(onAboutAccount),
    },
    {
      key: "why_seeing",
      icon: Info,
      label: t("post_options.why_seeing_this_post"),
      onPress: runAndClose(onWhySeeingThis),
    },
    {
      key: "interested",
      icon: ThumbsUp,
      label: t("post_options.interested"),
      onPress: runAndClose(onInterested),
    },
    {
      key: "not_interested",
      icon: ThumbsDown,
      label: t("post_options.not_interested"),
      onPress: runAndClose(onNotInterested),
    },
    {
      key: "hide",
      icon: EyeOff,
      label: t("post_options.hide"),
      onPress: runAndClose(onHide),
    },
  ];

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="bg-background gap-1">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className="bg-muted-foreground mb-2" />
        </ActionsheetDragIndicatorWrapper>

        {/* <OptionGroup> */}
        <Grid
          _extra={{ className: "grid-cols-3" }}
          className="justify-between gap-4 mb-2"
        >
          <GridItem _extra={{ className: "col-span-1" }}>
            <Button
              size="xl"
              variant="ghost"
              accessibilityRole="button"
              accessibilityLabel={t("post_options.save")}
              className="py-4 flex-col items-center bg-card"
            >
              <ButtonIcon as={Bookmark} className={"fill-primary"} />
              <ButtonText>{t("post_options.save")}</ButtonText>
            </Button>
          </GridItem>
          <GridItem _extra={{ className: "col-span-1" }}>
            <Button
              size="xl"
              variant="ghost"
              accessibilityRole="button"
              accessibilityLabel={t("post_options.save")}
              className="py-4 flex-col items-center bg-card"
            >
              <ButtonIcon as={Bookmark} className={"fill-primary"} />
              <ButtonText>{t("post_options.save")}</ButtonText>
            </Button>
          </GridItem>
          <GridItem _extra={{ className: "col-span-1" }}>
            <Button
              size="xl"
              variant="ghost"
              accessibilityRole="button"
              accessibilityLabel={t("post_options.save")}
              className="py-4 flex-col items-center bg-card"
            >
              <ButtonIcon as={Bookmark} className={"fill-background"} />
              <ButtonText>{t("post_options.save")}</ButtonText>
            </Button>
          </GridItem>
        </Grid>
        {/* </OptionGroup> */}

        {infoItems.map((item, index) => (
          <Button
            size="lg"
            variant="ghost"
            key={item.key}
            onPress={item.onPress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            className="px-4 py-5 w-full justify-start bg-card"
          >
            <ButtonIcon as={item.icon} />
            <ButtonText>{item.label}</ButtonText>
          </Button>
        ))}

        <Button
          size="lg"
          variant="ghost"
          onPress={runAndClose(onReport)}
          accessibilityRole="button"
          accessibilityLabel={t("post_options.report")}
          className="px-4 py-5 w-full justify-start bg-card"
        >
          <ButtonIcon as={Flag} className="text-destructive" />
          <ButtonText className="text-destructive">
            {t("post_options.report")}
          </ButtonText>
        </Button>
        <Box className="h-10"></Box>
      </ActionsheetContent>
    </Actionsheet>
  );
}
