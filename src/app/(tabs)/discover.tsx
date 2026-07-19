import { useCallback, useMemo, useState } from "react";

import { Search } from "lucide-react-native";
import { useColorScheme } from "react-native";

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

import { TAX, type WebTrendingTag } from "@/constants/discover-web-data";
import { WEB_FONT_ROUND, WEB_PALETTE, WEB_TEXT_INK, WEB_TEXT_SUB } from "@/constants/web-reference-theme";

const LENSES = ["Location", "Category", "Tag", "Trending"] as const;
type DiscoverLens = (typeof LENSES)[number];

const DiscoverScreen = () => {
  const isDark = useColorScheme() === "dark";
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
      icon: cat.icon,
      theme: cat.theme,
    });
  }, []);

  const openTag = useCallback((t: WebTrendingTag) => {
    setSubject({
      name: "#" + t.tag,
      breadcrumb: `Tag · ${t.posts.toLocaleString()} posts`,
      colour: WEB_PALETTE.red,
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

  const bg = isDark ? "#12142A" : "#FFFFFF";
  const inputBg = isDark ? "#20233B" : "#F0F0F3";

  return (
    <View className="flex-1" style={{ backgroundColor: bg }}>
      <Box className="px-4.5 pb-1.5 pt-13">
        <Text className={`${WEB_FONT_ROUND[800]} ${WEB_TEXT_INK} text-[27px]`}>Discover</Text>
        <Input
          style={{ backgroundColor: inputBg }}
          className="mt-2.5 h-10 min-h-0 rounded-full border-0 px-0"
        >
          <InputSlot className="pl-3.5">
            <InputIcon as={Search} className={WEB_TEXT_SUB} />
          </InputSlot>
          <InputField
            value={q}
            onChangeText={setQ}
            placeholder="Search places, people, tags"
            placeholderTextColor={isDark ? "#C4C8DB" : "rgba(27,31,59,0.6)"}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search places, people, tags"
            className={`${WEB_TEXT_INK} text-[14px]`}
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
                style={{ backgroundColor: lens === l ? WEB_PALETTE.red : inputBg }}
                className="h-8.5 items-center justify-center rounded-full px-4"
              >
                <Text
                  style={{ color: lens === l ? "#FFFFFF" : undefined }}
                  className={`${lens === l ? WEB_FONT_ROUND[700] : WEB_FONT_ROUND[500]} text-[13.5px] ${
                    lens === l ? "" : WEB_TEXT_SUB
                  }`}
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
