import React from "react";

import { ChevronRight, Map, MapPin } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { LOC, PLACES, REGIONS } from "@/constants/discover-web-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND } from "@/constants/web-reference-theme";

interface LocationLensProps {
  onPlace: (subject: DiscoverSubject) => void;
}

function LocationLens({ onPlace }: LocationLensProps) {
  return (
    <VStack>
      <Box className="mx-3.5 mt-2 h-30 items-center justify-center rounded-2xl bg-muted">
        <Icon as={Map} size="lg" style={{ color: LOC }} />
        <Text className={`${WEB_FONT_BODY[400]} text-muted-foreground mt-1.5 text-[12.5px]`}>
          Map · Kumaon & Garhwal
        </Text>
      </Box>

      <SectionTitle>Regions</SectionTitle>
      <VStack className="gap-2.5 px-3.5">
        {REGIONS.map((r) => (
          <Pressable
            key={r.name}
            className="flex-row items-center gap-3 rounded-card border border-border p-3"
          >
            <Box style={{ backgroundColor: LOC }} className="h-10 w-10 items-center justify-center rounded-full">
              <Text className={`${WEB_FONT_ROUND[800]} text-[16px] text-white`}>{r.gl}</Text>
            </Box>
            <VStack className="flex-1">
              <Text className={`${WEB_FONT_ROUND[700]} text-foreground text-[15px]`}>
                {r.name}
              </Text>
              <Text className={`${WEB_FONT_BODY[400]} text-muted-foreground text-xs`}>
                {r.posts.toLocaleString()} posts · {r.districts.length} districts
              </Text>
            </VStack>
            <Icon as={ChevronRight} size="sm" className="text-muted-foreground" />
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
            style={{ flexBasis: "47.5%", flexGrow: 1, minHeight: 96 }}
            className="justify-between rounded-2xl bg-muted p-3"
          >
            <Box style={{ backgroundColor: LOC }} className="h-8.5 w-8.5 items-center justify-center rounded-[17px]">
              <Icon as={MapPin} size="sm" className="text-white" />
            </Box>
            <VStack>
              <Text className={`${WEB_FONT_ROUND[700]} text-foreground text-[15px]`}>
                {p.name}
              </Text>
              <Text className={`${WEB_FONT_BODY[400]} text-muted-foreground mt-px text-[11.5px]`}>
                {p.kind} · {p.posts} posts
              </Text>
            </VStack>
          </Pressable>
        ))}
      </Box>
    </VStack>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text className={`${WEB_FONT_ROUND[700]} text-muted-foreground mb-2.5 mt-4.5 px-4.5 text-[14px]`}>
      {children}
    </Text>
  );
}

export default React.memo(LocationLens);
