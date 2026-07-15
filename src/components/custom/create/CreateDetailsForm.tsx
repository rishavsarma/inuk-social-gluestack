import { useMemo, useState, useEffect } from "react";

import { Check, Tag as TagIcon, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  ScrollView, KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";

import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
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

  const editor = useEditorBridge({
    autofocus: false,
    initialContent: caption,
    onChange: () => {
      editor.getHTML().then((html) => {
        onCaptionChange(html);
      });
    },
    theme: {
      toolbar: {
        toolbarBody: {
          backgroundColor: "#1A1A1A",
          borderBottomColor: "rgba(255,255,255,0.08)",
        },
      },
    },
  });

  const addTag = (raw: string) => {
    const clean = raw.trim().replace(/^#/, "");
    if (!clean || tags.includes(clean)) return;
    onTagsChange([...tags, clean]);
    setTagDraft("");
  };

  return (
    <VStack space="xl" className="pb-6">
      <FormControl className="w-full">
        <FormControlLabel className="mb-2">
          <FormControlLabelText className="font-baloo-bold text-sm text-foreground/80">
            {t("create_post.title_label")}
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="rounded-xl border border-border bg-input/40 focus:border-theme h-12">
          <InputField
            value={title}
            onChangeText={onTitleChange}
            placeholder={t("create_post.title_placeholder")}
            accessibilityLabel={t("create_post.title_label")}
            className="text-sm font-medium text-foreground px-4"
          />
        </Input>
      </FormControl>

      <FormControl className="w-full">
        <FormControlLabel className="mb-2">
          <FormControlLabelText className="font-baloo-bold text-sm text-foreground/80">
            {t("create_post.caption_label")}
          </FormControlLabelText>
        </FormControlLabel>
        <Box className="relative h-56 rounded-xl border border-border bg-input/40 overflow-hidden flex-col">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 0,
            }}
          >
            <Toolbar editor={editor} />
          </KeyboardAvoidingView>
          <RichText editor={editor} className="flex-1 bg-transparent" />
        </Box>
        <Text size="xs" className="self-end text-muted-foreground mt-1.5 font-medium">
          {t("create_post.char_count", {
            count: (caption || "").replace(/<[^>]*>/g, "").length,
            max: CAPTION_MAX_LENGTH,
          })}
        </Text>
      </FormControl>

      <VStack space="sm">
        <Text className="font-baloo-bold text-xs uppercase tracking-wider text-foreground/50 mb-1 px-1">
          {t("create_post.category_label")}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="sm" className="px-1">
            {POST_CATEGORIES.map((cat) => {
              const isSelected = cat.id === categoryId;
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
                  className={
                    isSelected
                      ? `flex-row items-center gap-2 rounded-full border border-theme bg-theme/10 px-4.5 py-2.5`
                      : "flex-row items-center gap-2 rounded-full border border-border bg-muted/30 px-4.5 py-2.5"
                  }
                >
                  <Box className={`h-2.5 w-2.5 rounded-full ${isSelected ? cat.dotColorClassName : "bg-foreground/35"}`} />
                  <Text
                    size="sm"
                    className={
                      isSelected
                        ? "font-baloo-bold text-theme"
                        : "font-baloo-semibold text-foreground/60"
                    }
                  >
                    {t(cat.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </HStack>
        </ScrollView>
      </VStack>

      <VStack space="sm">
        <Text className="font-baloo-bold text-xs uppercase tracking-wider text-foreground/50 mb-1 px-1">
          {t("create_post.subcategory_label")}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="sm" className="px-1">
            {selectedCategory.subcategoryLabelKeys.map((key) => {
              const isSelected = key === subcategoryKey;
              return (
                <Pressable
                  key={key}
                  onPress={() => onSubcategoryChange(key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={t(key)}
                  className={
                    isSelected
                      ? `rounded-full border border-theme bg-theme/10 px-4.5 py-2.5`
                      : "rounded-full border border-border bg-muted/30 px-4.5 py-2.5"
                  }
                >
                  <Text
                    size="sm"
                    className={
                      isSelected
                        ? "font-baloo-bold text-theme"
                        : "font-baloo-semibold text-foreground/60"
                    }
                  >
                    {t(key)}
                  </Text>
                </Pressable>
              );
            })}
          </HStack>
        </ScrollView>
      </VStack>

      <FormControl className="w-full">
        <FormControlLabel className="mb-2">
          <FormControlLabelText className="font-baloo-bold text-sm text-foreground/80">
            {t("create_post.tags_label")}
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="h-auto min-h-12 flex-row flex-wrap items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-input/40 focus:border-theme">
          {tags.map((tag) => (
            <HStack
              key={tag}
              space="xs"
              className="items-center rounded-full bg-theme/10 border border-theme/20 py-1 pl-3 pr-1.5"
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
            returnKeyType="done"
            className="min-w-25 flex-1 text-sm text-foreground px-2 h-8"
          />
        </Input>
        <HStack space="xs" className="mt-2 items-center px-1">
          <Icon as={TagIcon} size="xs" className="text-muted-foreground" />
          <Text size="xs" className="text-muted-foreground font-medium">
            {t("create_post.tags_trending", { tags: TRENDING_TAGS.map((tg) => `#${tg}`).join(" ") })}
          </Text>
        </HStack>
      </FormControl>
    </VStack>
  );
}
