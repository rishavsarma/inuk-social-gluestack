import React from "react";

import { ChevronRight, Map, MapPin } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import EntityGridCard from "@/components/custom/discover/EntityGridCard";
import SectionTitle from "@/components/custom/discover/SectionTitle";

import { LOC, PLACES, REGIONS } from "@/constants/discover-web-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND } from "@/constants/web-reference-theme";

interface LocationLensProps {
  onPlace: (subject: DiscoverSubject) => void;
}

function LocationLens({ onPlace }: LocationLensProps) {
  return (
    <VStack>
      <Box className="mx-4 mt-2 h-30 items-center justify-center rounded-2xl bg-muted">
        <Icon as={Map} size="lg" style={{ color: LOC }} />
        <Text className={`${WEB_FONT_BODY[400]} text-muted-foreground mt-2 text-xs`}>
          Map · Kumaon & Garhwal
        </Text>
      </Box>

      <SectionTitle>Regions</SectionTitle>
      <VStack className="gap-3 px-4">
        {REGIONS.map((r) => (
          <Pressable
            key={r.name}
            className="flex-row items-center gap-3 rounded-card border border-border p-3"
          >
            <Box style={{ backgroundColor: LOC }} className="h-10 w-10 items-center justify-center rounded-full">
              <Text className={`${WEB_FONT_ROUND[800]} text-base text-white`}>{r.gl}</Text>
            </Box>
            <VStack className="flex-1">
              <Text className={`${WEB_FONT_ROUND[700]} text-foreground text-base`}>
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
      <Box className="flex-row flex-wrap gap-3 px-4">
        {PLACES.map((p) => (
          <EntityGridCard
            key={p.name}
            icon={MapPin}
            iconClassName="text-white"
            iconBgColor={LOC}
            name={p.name}
            nameClassName={`${WEB_FONT_ROUND[700]} text-foreground text-base`}
            subtitle={`${p.kind} · ${p.posts} posts`}
            subtitleClassName={`${WEB_FONT_BODY[400]} text-muted-foreground mt-px text-xs`}
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
          />
        ))}
      </Box>
    </VStack>
  );
}

export default React.memo(LocationLens);
