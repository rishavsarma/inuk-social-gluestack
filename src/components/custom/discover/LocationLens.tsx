import React from "react";

import { ChevronRight, Map, MapPin } from "lucide-react-native";
import { useColorScheme } from "react-native";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "@/components/ui/scroll-view";

import { LOC, PLACES, REGIONS } from "@/constants/discover-web-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND, WEB_TEXT_SUB } from "@/constants/web-reference-theme";

interface LocationLensProps {
  onPlace: (subject: DiscoverSubject) => void;
}

function LocationLens({ onPlace }: LocationLensProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <Box
        style={{ backgroundColor: isDark ? "#112233" : "#DCEDE9" }}
        className="mx-3.5 mt-2 h-30 items-center justify-center rounded-2xl"
      >
        <Icon as={Map} size="lg" style={{ color: LOC }} />
        <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} mt-1.5 text-[12.5px]`}>
          Map · Kumaon & Garhwal
        </Text>
      </Box>

      <SectionTitle>Regions</SectionTitle>
      <VStack className="gap-2.5 px-3.5">
        {REGIONS.map((r) => (
          <Pressable
            key={r.name}
            className="flex-row items-center gap-3 rounded-card border p-3"
            style={{ borderColor: isDark ? "#2b3050" : "#E3E4EC" }}
          >
            <Box style={{ backgroundColor: LOC }} className="h-10 w-10 items-center justify-center rounded-full">
              <Text className={`${WEB_FONT_ROUND[800]} text-[16px] text-white`}>{r.gl}</Text>
            </Box>
            <VStack className="flex-1">
              <Text className={`${WEB_FONT_ROUND[700]} text-[15px] ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
                {r.name}
              </Text>
              <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-xs`}>
                {r.posts.toLocaleString()} posts · {r.districts.length} districts
              </Text>
            </VStack>
            <Icon as={ChevronRight} size="sm" className={WEB_TEXT_SUB} />
          </Pressable>
        ))}
      </VStack>

      <SectionTitle>Popular places</SectionTitle>
      <Box className="flex-row flex-wrap gap-2.5 px-3.5">
        {PLACES.map((p) => (
          <Pressable
            key={p.name}
            onPress={() =>
              onPlace({
                name: p.name,
                breadcrumb: `${p.kind} · ${p.region}`,
                colour: LOC,
                onColour: "#FFFFFF",
                icon: "mdi:map-marker",
                theme: null,
              })
            }
            style={{ flexBasis: "47.5%", flexGrow: 1, backgroundColor: isDark ? "#12312C" : "#E4F0EE", minHeight: 96 }}
            className="justify-between rounded-2xl p-3"
          >
            <Box style={{ backgroundColor: LOC }} className="h-8.5 w-8.5 items-center justify-center rounded-[17px]">
              <Icon as={MapPin} size="sm" className="text-white" />
            </Box>
            <VStack>
              <Text className={`${WEB_FONT_ROUND[700]} text-[15px] ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
                {p.name}
              </Text>
              <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} mt-px text-[11.5px]`}>
                {p.kind} · {p.posts} posts
              </Text>
            </VStack>
          </Pressable>
        ))}
      </Box>
    </ScrollView>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text className={`${WEB_FONT_ROUND[700]} ${WEB_TEXT_SUB} mb-2.5 mt-4.5 px-4.5 text-[14px]`}>
      {children}
    </Text>
  );
}

export default React.memo(LocationLens);
