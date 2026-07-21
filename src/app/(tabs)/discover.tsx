import { useCallback, useMemo, useState } from "react";

import { Search } from "lucide-react-native";

import CategoryDetailModal from "@/components/custom/discover/CategoryDetailModal";
import CategoryLens from "@/components/custom/discover/CategoryLens";
import LocationLens from "@/components/custom/discover/LocationLens";
import PlaceHubModal from "@/components/custom/discover/PlaceHubModal";
import TagLens from "@/components/custom/discover/TagLens";
import TrendingLens from "@/components/custom/discover/TrendingLens";

import { Box } from "@/components/ui/box";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";

import { THEME_ACCENT_COLOR } from "@/constants";
import { TAX, type WebTrendingTag } from "@/constants/discover-web-data";
import { WEB_FONT_ROUND } from "@/constants/web-reference-theme";

const LENSES = ["Location", "Category", "Tag", "Trending"] as const;
type DiscoverLens = (typeof LENSES)[number];

const DiscoverScreen = () => {
  const [lens, setLens] = useState<DiscoverLens>("Category");
  const [openCat, setOpenCat] = useState<TaxonomyCategory | null>(null);
  const [subject, setSubject] = useState<DiscoverSubject | null>(null);
  const [q, setQ] = useState("");

  const openEntity = useCallback((name: string, cat: TaxonomyCategory, sub: string) => {
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
  }, []);

  const openTag = useCallback((t: WebTrendingTag) => {
    setSubject({
      name: "#" + t.tag,
      breadcrumb: `Tag · ${t.posts.toLocaleString()} posts`,
      colour: THEME_ACCENT_COLOR,
      onColour: "#FFFFFF",
      icon: "mdi:pound",
      theme: null,
    });
  }, []);

  const results = useMemo(() => {
    const trimmed = q.trim();
    if (!trimmed) return null;
    const needle = trimmed.toLowerCase();
    return TAX.categories.filter((x) =>
      (x.displayTitle + " " + x.title + " " + x.subs.map((s) => s.title).join(" "))
        .toLowerCase()
        .includes(needle),
    );
  }, [q]);

  return (
    <View className="flex-1 bg-background">
      <Box className="px-4.5 pb-1.5 pt-13">
        <Text className={`${WEB_FONT_ROUND[800]} text-foreground text-[27px]`}>Discover</Text>
        <Input className="mt-2.5 h-10 min-h-0 rounded-full border-transparent bg-muted/40 px-0 dark:bg-input/30">
          <InputSlot className="pl-3.5">
            <InputIcon as={Search} className="text-muted-foreground" />
          </InputSlot>
          <InputField
            value={q}
            onChangeText={setQ}
            placeholder="Search places, people, tags"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search places, people, tags"
            className="text-[14px]"
          />
        </Input>
        {!q.trim() ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="mt-3 gap-2">
            {LENSES.map((l) => (
              <Pressable
                key={l}
                onPress={() => setLens(l)}
                accessibilityRole="button"
                accessibilityLabel={l}
                className={`h-8.5 items-center justify-center rounded-full px-4 ${
                  lens === l ? "bg-theme" : "bg-muted/40 dark:bg-input/30"
                }`}
              >
                <Text
                  className={`${lens === l ? `${WEB_FONT_ROUND[700]} text-white` : `${WEB_FONT_ROUND[500]} text-muted-foreground`} text-[13.5px]`}
                >
                  {l}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}
      </Box>

      {results ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 14, paddingTop: 10 }}>
          <Box className="flex-row flex-wrap gap-2.5">
            {results.map((cat) => (
              <Pressable
                key={cat.title}
                onPress={() => setOpenCat(cat)}
                accessibilityRole="button"
                accessibilityLabel={cat.displayTitle}
                style={{ flexBasis: "47.5%", flexGrow: 1, backgroundColor: cat.background, minHeight: 104 }}
                className="justify-between rounded-2xl p-3.5"
              >
                <VStack>
                  <Text numberOfLines={1} style={{ color: cat.text }} className={`${WEB_FONT_ROUND[700]} text-[15.5px]`}>
                    {cat.displayTitle}
                  </Text>
                  <Text style={{ color: cat.text }} className="text-[11.5px] opacity-75">
                    {cat.subCount} topics · {cat.entCount} places
                  </Text>
                </VStack>
              </Pressable>
            ))}
          </Box>
        </ScrollView>
      ) : (
        <>
          {lens === "Category" ? <CategoryLens onCat={setOpenCat} onEntity={openEntity} /> : null}
          {lens === "Location" ? <LocationLens onPlace={setSubject} /> : null}
          {lens === "Tag" ? <TagLens onTag={openTag} /> : null}
          {lens === "Trending" ? <TrendingLens onEntity={openEntity} /> : null}
        </>
      )}

      <CategoryDetailModal category={openCat} onClose={() => setOpenCat(null)} onEntity={openEntity} />
      <PlaceHubModal subject={subject} onClose={() => setSubject(null)} />
    </View>
  );
};

export default DiscoverScreen;
