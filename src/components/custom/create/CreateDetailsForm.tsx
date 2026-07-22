import { useMemo, useState } from "react";

import { Check, TextInitial, Tag as TagIcon, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";

import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import {
  CAPTION_MAX_LENGTH,
  POST_CATEGORIES,
  TRENDING_TAGS,
  type PostThemeSwatch,
} from "@/constants/create-post";

interface CreateDetailsFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  caption: string;
  onCaptionChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (id: string) => void;
  subcategoryKey: string | null;
  onSubcategoryChange: (key: string) => void;
  theme: PostThemeSwatch["name"];
  onThemeChange: (name: PostThemeSwatch["name"]) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}
const getCategoryColors = (catId: string, isSelected: boolean) => {
  if (!isSelected) {
    return {
      container: "border-border bg-input/20",
      text: "text-muted-foreground font-baloo-semibold",
      dot: "bg-muted-foreground/35",
    };
  }
  switch (catId) {
    case "nature":
      return {
        container: "border-emerald-500 bg-emerald-500/10",
        text: "text-emerald-500 font-baloo-bold",
        dot: "bg-emerald-500",
      };
    case "photography":
      return {
        container: "border-blue-500 bg-blue-500/10",
        text: "text-blue-500 font-baloo-bold",
        dot: "bg-blue-500",
      };
    case "design":
      return {
        container: "border-violet-500 bg-violet-500/10",
        text: "text-violet-500 font-baloo-bold",
        dot: "bg-violet-500",
      };
    case "travel":
      return {
        container: "border-orange-500 bg-orange-500/10",
        text: "text-orange-500 font-baloo-bold",
        dot: "bg-orange-500",
      };
    case "food":
      return {
        container: "border-red-500 bg-red-500/10",
        text: "text-red-500 font-baloo-bold",
        dot: "bg-red-500",
      };
    case "fashion":
      return {
        container: "border-pink-500 bg-pink-500/10",
        text: "text-pink-500 font-baloo-bold",
        dot: "bg-pink-500",
      };
    default:
      return {
        container: "border-theme bg-theme/10",
        text: "text-theme font-baloo-bold",
        dot: "bg-theme",
      };
  }
};

const getSubcategoryColors = (parentCatId: string, isSelected: boolean) => {
  if (!isSelected) {
    return {
      container: "border-border bg-input/20",
      text: "text-muted-foreground font-baloo-semibold",
    };
  }
  switch (parentCatId) {
    case "nature":
      return {
        container: "border-emerald-500 bg-emerald-500/10",
        text: "text-emerald-600 dark:text-emerald-400 font-baloo-bold",
      };
    case "photography":
      return {
        container: "border-blue-500 bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400 font-baloo-bold",
      };
    case "design":
      return {
        container: "border-violet-500 bg-violet-500/10",
        text: "text-violet-600 dark:text-violet-400 font-baloo-bold",
      };
    case "travel":
      return {
        container: "border-orange-500 bg-orange-500/10",
        text: "text-orange-600 dark:text-orange-400 font-baloo-bold",
      };
    case "food":
      return {
        container: "border-red-500 bg-red-500/10",
        text: "text-red-600 dark:text-red-400 font-baloo-bold",
      };
    case "fashion":
      return {
        container: "border-pink-500 bg-pink-500/10",
        text: "text-pink-600 dark:text-pink-400 font-baloo-bold",
      };
    default:
      return {
        container: "border-theme bg-theme/10",
        text: "text-theme font-baloo-bold",
      };
  }
};

export function CreateDetailsForm({
  title,
  onTitleChange,
  caption,
  onCaptionChange,
  categoryId,
  onCategoryChange,
  subcategoryKey,
  onSubcategoryChange,
  theme,
  onThemeChange,
  tags,
  onTagsChange,
}: CreateDetailsFormProps) {
  const { t } = useTranslation();
  const [tagDraft, setTagDraft] = useState("");

  const selectedCategory = useMemo(
    () => POST_CATEGORIES.find((c) => c.id === categoryId) ?? POST_CATEGORIES[0],
    [categoryId],
  );


  const addTag = (raw: string) => {
    const clean = raw.trim().replace(/^#/, "");
    if (!clean || tags.includes(clean)) return;
    onTagsChange([...tags, clean]);
    setTagDraft("");
  };

  return (
    <KeyboardAvoidingScrollView disableTopInset disableTabBarHide hideHeader>
      <VStack space="sm" className="pb-6 bg-background">
        <FormControl className="w-full py-2 px-4 bg-card" isRequired={true}>
          <FormControlLabel className="">
            <FormControlLabelText className="font-baloo-bold text-foreground/80">
              {t("create_post.title_label")}
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="rounded-md">
            <InputSlot>
              <InputIcon as={TextInitial} />
            </InputSlot>
            <InputField
              value={title}
              onChangeText={onTitleChange}

              placeholder={t("create_post.title_placeholder")}
              accessibilityLabel={t("create_post.title_label")}
              className="text-base"
            />
          </Input>
        </FormControl>

        <FormControl className="w-full py-2 px-4 bg-card" isRequired={true}>
          <FormControlLabel className="">
            <FormControlLabelText className="font-baloo-bold text-foreground/80">
              {t("create_post.caption_label")}
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="w-full h-40 rounded-md">
            <InputSlot>
              <InputIcon as={TextInitial} />
            </InputSlot>
            <InputField
              value={caption}
              onChangeText={onCaptionChange}
              placeholder={t("create_post.caption_placeholder")}
              accessibilityLabel={t("create_post.caption_label")}
              className="text-base py-2 h-full"
              style={{ textAlignVertical: "top" }}
              multiline={true}
            />
            <Text size="xs" className="self-end text-muted-foreground mb-2 font-medium">
              {t("create_post.char_count", {
                count: (caption || "").length,
                max: CAPTION_MAX_LENGTH,
              })}
            </Text>
          </Input>
        </FormControl>

        <VStack space="sm" className="py-2 bg-card">
          <Text className="font-baloo-bold text-foreground/80 px-4">
            {t("create_post.category_label")} *
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="">
            <HStack space="sm" className="px-4">
              {POST_CATEGORIES.map((cat) => {
                const isSelected = cat.id === categoryId;
                const colors = getCategoryColors(cat.id, isSelected);
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => {
                      onCategoryChange(cat.id);
                      onSubcategoryChange(cat.subcategoryLabelKeys[0]);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={t(cat.labelKey)}
                    className={[
                      "flex-row items-center gap-2 rounded-full border px-4 py-2 active:opacity-75",
                      colors.container
                    ].join(" ")}
                  >
                    <Box className={["h-2 w-2 rounded-full", colors.dot].join(" ")} />
                    <Text
                      size="sm"
                      className={colors.text}
                    >
                      {t(cat.labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </HStack>
          </ScrollView>
        </VStack>

        <VStack space="sm" className=" py-2 bg-card">
          <Text className="font-baloo-bold text-foreground/80 px-4">
            {t("create_post.subcategory_label")} *
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack space="sm" className="px-4">
              {selectedCategory.subcategoryLabelKeys.map((key) => {
                const isSelected = key === subcategoryKey;
                const colors = getSubcategoryColors(categoryId, isSelected);
                return (
                  <Pressable
                    key={key}
                    onPress={() => onSubcategoryChange(key)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={t(key)}
                    className={[
                      "rounded-full border px-4 py-2 active:opacity-75",
                      colors.container
                    ].join(" ")}
                  >
                    <Text
                      size="sm"
                      className={colors.text}
                    >
                      {t(key)}
                    </Text>
                  </Pressable>
                );
              })}
            </HStack>
          </ScrollView>
        </VStack>

        <FormControl className="w-full py-2 px-4 bg-card" isRequired={true}>
          <FormControlLabel className="">
            <FormControlLabelText className="font-baloo-bold text-foreground/80">
              {t("create_post.tags_label")}
            </FormControlLabelText>
          </FormControlLabel>
          <Input className="h-auto  flex-row flex-wrap items-center gap-2 px-3 py-3 rounded-md">
            {tags.map((tag) => (
              <HStack
                key={tag}
                space="xs"
                className="items-center rounded-full bg-theme/10 border border-theme/20 py-1 pl-3 pr-2"
              >
                <Text size="xs" className="font-semibold text-theme">
                  #{tag}
                </Text>
                <Pressable
                  onPress={() => onTagsChange(tags.filter((tg) => tg !== tag))}
                  accessibilityRole="button"
                  accessibilityLabel={t("create_post.remove_tag_a11y", { tag })}
                  className="h-4 w-4 items-center justify-center rounded-full bg-theme/10"
                >
                  <Icon as={X} size="xs" className="text-theme" />
                </Pressable>
              </HStack>
            ))}
            <InputField
              value={tagDraft}
              onChangeText={setTagDraft}
              onSubmitEditing={() => addTag(tagDraft)}
              placeholder={t("create_post.tags_placeholder")}
              accessibilityLabel={t("create_post.tags_label")}
              returnKeyType="next"
              blurOnSubmit={false}
              className="flex-1 text-sm text-foreground px-2 h-8"
            />
          </Input>
        </FormControl>
      </VStack>
    </KeyboardAvoidingScrollView>
  );
}
