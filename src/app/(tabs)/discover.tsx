import { useCallback, useState } from "react";

import { useTranslation } from "react-i18next";

import CategoryDetailModal from "@/components/custom/discover/CategoryDetailModal";
import CategoryLens from "@/components/custom/discover/CategoryLens";
import LocationLens from "@/components/custom/discover/LocationLens";
import PlaceHubModal from "@/components/custom/discover/PlaceHubModal";
import TagLens from "@/components/custom/discover/TagLens";
import TrendingLens from "@/components/custom/discover/TrendingLens";
import { KeyboardAvoidingScrollView } from "@/components/custom/KeyboardAvoidingScrollView";

import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";

import { THEME_ACCENT_COLOR } from "@/constants";
import { type WebTrendingTag } from "@/constants/discover-web-data";
import { WEB_FONT_ROUND } from "@/constants/web-reference-theme";

const LENSES = ["Location", "Category", "Tag", "Trending"] as const;
type DiscoverLens = (typeof LENSES)[number];

const LENS_LABEL_KEYS: Record<DiscoverLens, string> = {
  Location: "discover.tab_location",
  Category: "discover.tab_category",
  Tag: "discover.tab_tag",
  Trending: "discover.tab_trending",
};

const DiscoverScreen = () => {
  const { t } = useTranslation();
  const [lens, setLens] = useState<DiscoverLens>("Category");
  const [openCat, setOpenCat] = useState<TaxonomyCategory | null>(null);
  const [subject, setSubject] = useState<DiscoverSubject | null>(null);

  const openEntity = useCallback(
    (name: string, cat: TaxonomyCategory, sub: string) => {
      setSubject({
        name,
        breadcrumb: `${cat.displayTitle} · ${sub}`,
        colour: cat.colour,
        onColour: cat.onColour,
        background: cat.background,
        text: cat.text,
        icon: cat.icon,
        theme: cat.theme,
      });
    },
    [],
  );

  const openTag = useCallback(
    (tag: WebTrendingTag) => {
      setSubject({
        name: "#" + tag.tag,
        breadcrumb: t("discover.tag_breadcrumb", {
          count: tag.posts.toLocaleString(),
        }),
        colour: THEME_ACCENT_COLOR,
        onColour: "#FFFFFF",
        icon: "mdi:pound",
        theme: null,
      });
    },
    [t],
  );

  return (
    <>
      <KeyboardAvoidingScrollView
        alwaysShowBar
        showSearch
        searchPlaceholder={t("discover.search_placeholder")}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-4 py-3"
        >
          {LENSES.map((l) => (
            <Pressable
              key={l}
              onPress={() => setLens(l)}
              accessibilityRole="button"
              accessibilityLabel={t(LENS_LABEL_KEYS[l])}
              className={`h-8.5 items-center justify-center rounded-full px-4 ${
                lens === l ? "bg-theme" : "bg-muted/40 dark:bg-input/30"
              }`}
            >
              <Text
                className={`${lens === l ? `${WEB_FONT_ROUND[700]} text-white` : `${WEB_FONT_ROUND[500]} text-muted-foreground`} text-sm`}
              >
                {t(LENS_LABEL_KEYS[l])}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {lens === "Category" ? (
          <CategoryLens onCat={setOpenCat} onEntity={openEntity} />
        ) : null}
        {lens === "Location" ? <LocationLens onPlace={setSubject} /> : null}
        {lens === "Tag" ? <TagLens onTag={openTag} /> : null}
        {lens === "Trending" ? <TrendingLens onEntity={openEntity} /> : null}
      </KeyboardAvoidingScrollView>

      <CategoryDetailModal
        category={openCat}
        onClose={() => setOpenCat(null)}
        onEntity={openEntity}
      />
      <PlaceHubModal subject={subject} onClose={() => setSubject(null)} />
    </>
  );
};

export default DiscoverScreen;
