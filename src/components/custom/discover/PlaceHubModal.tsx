import React, { useState } from "react";

import { Plus } from "lucide-react-native";

import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { getHeaderBarHeight, UiHeader } from "@/components/custom/UiHeader";
import UnderlineTabBar from "@/components/custom/UnderlineTabBar";

import { useAppTopInset } from "@/hooks/useAppInsets";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";

import { SPACING_PX } from "@/constants";
import { resolveTaxonomyIcon } from "@/constants/mdi-icon-map";
import { THEME_SERIES } from "@/constants/discover-web-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND } from "@/constants/web-reference-theme";

const TABS = ["Posts", "Creators", "Contests", "Map"] as const;
const GENRES = ["All", "Photos", "Videos", "Stories"] as const;
type PlaceHubTab = (typeof TABS)[number];
type PlaceHubGenre = (typeof GENRES)[number];

interface PlaceHubModalProps {
  subject: DiscoverSubject | null;
  onClose: () => void;
}

function PlaceHubModal({ subject, onClose }: PlaceHubModalProps) {
  const [tab, setTab] = useState<PlaceHubTab>("Posts");
  const [genre, setGenre] = useState<PlaceHubGenre>("All");
  const isDark = useIsDarkMode();
  const topInset = useAppTopInset();

  if (!subject) return null;
  const s = subject;
  const icon = resolveTaxonomyIcon(s.icon, Plus);

  // Light tint/ink only exist for entity subjects (taxonomy categories) — falls back
  // to the solid brand colour hero for tags/location pins and for dark mode.
  const lightHero = !isDark && !!s.background && !!s.text;
  const heroBg = lightHero ? s.background! : s.colour;
  const heroText = lightHero ? s.text! : s.onColour;

  const stub = (message: string) => (
    <VStack className="items-center rounded-2xl bg-muted py-11">
      <Icon as={icon} size="xl" style={{ color: s.colour }} />
      <Text
        className={`${WEB_FONT_BODY[400]} text-muted-foreground mt-3 px-8 text-center text-sm`}
      >
        {message}
      </Text>
    </VStack>
  );

  return (
    <Modal isOpen size="full" className="h-full" onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="h-full w-full rounded-none border-0 bg-background p-0">
        <UiHeader
          title={s.name}
          showBackButton
          onBackPress={onClose}
          alwaysShowBar
          hideBorder
          topInset={topInset}
          backgroundColor={heroBg}
          titleStyle={{ color: heroText }}
          titleIcon={<Icon as={icon} size="sm" style={{ color: heroText }} />}
        />

        <Box
          className="flex-1"
          style={{ paddingTop: getHeaderBarHeight(topInset) }}
        >
          <Box className="flex-row gap-2 px-4 py-4">
            {(["Posts", "Contributors", "Themes"] as const).map((label) => (
              <Box
                key={label}
                className="flex-1 items-center rounded-xl border border-border py-3"
              >
                <Text
                  className={`${WEB_FONT_ROUND[800]} text-foreground text-lg`}
                >
                  —
                </Text>
                <Text
                  className={`${WEB_FONT_BODY[400]} text-muted-foreground text-xs`}
                >
                  {label}
                </Text>
              </Box>
            ))}
          </Box>

          <UnderlineTabBar
            tabs={TABS.map((tabKey) => ({ key: tabKey, label: tabKey }))}
            activeTab={tab}
            onTabChange={setTab}
            activeColor={s.colour}
            borderClassName="border-border"
            tabClassName="py-3"
            textClassName="text-sm"
            inactiveTextClassName="text-muted-foreground"
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: SPACING_PX[4], paddingBottom: SPACING_PX[12] }}
          >
            {tab !== "Posts" ? (
              <Pressable
                style={{ backgroundColor: s.colour }}
                className="mb-4 h-11 flex-row items-center justify-center gap-2 rounded-full"
              >
                <Icon as={Plus} size="sm" style={{ color: s.onColour }} />
                <Text
                  style={{ color: s.onColour }}
                  className={`${WEB_FONT_ROUND[700]} text-sm`}
                >
                  Post about {s.name}
                </Text>
              </Pressable>
            ) : null}

            {tab === "Posts" ? (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: SPACING_PX[2] }}
                  style={{ marginBottom: SPACING_PX[4] }}
                >
                  {GENRES.map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => setGenre(g)}
                      style={
                        genre === g ? { backgroundColor: s.colour } : undefined
                      }
                      className={`h-8 items-center justify-center rounded-2xl px-4 ${
                        genre === g ? "" : "bg-muted"
                      }`}
                    >
                      <Text
                        style={genre === g ? { color: s.onColour } : undefined}
                        className={`${WEB_FONT_BODY[600]} text-sm ${genre === g ? "" : "text-muted-foreground"}`}
                      >
                        {g}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <Box
                  style={
                    lightHero ? { backgroundColor: s.background } : undefined
                  }
                  className={`items-center rounded-2xl px-6 py-9 ${lightHero ? "" : "bg-muted"}`}
                >
                  <Box
                    style={{ backgroundColor: s.colour }}
                    className="mb-3 h-14 w-14 items-center justify-center rounded-full"
                  >
                    <Icon as={icon} size="lg" style={{ color: s.onColour }} />
                  </Box>
                  <Text
                    className={`${WEB_FONT_ROUND[700]} text-foreground text-center text-base`}
                  >
                    Be the first to document {s.name}
                  </Text>
                  <Text
                    className={`${WEB_FONT_BODY[400]} text-muted-foreground mt-1 px-2 text-center text-xs`}
                  >
                    {`No ${genre === "All" ? "" : genre.toLowerCase() + " "}posts yet — photos, treks and stories will show up here.`}
                  </Text>
                  <Pressable
                    style={{ backgroundColor: s.colour }}
                    className="mt-4 h-10 flex-row items-center justify-center gap-2 self-stretch rounded-full px-5"
                  >
                    <Icon as={Plus} size="sm" style={{ color: s.onColour }} />
                    <Text
                      style={{ color: s.onColour }}
                      className={`${WEB_FONT_ROUND[700]} text-sm`}
                    >
                      Post about {s.name}
                    </Text>
                  </Pressable>
                </Box>
              </>
            ) : null}
            {tab === "Creators"
              ? stub(
                  `Top contributors for ${s.name} appear here as people post.`,
                )
              : null}
            {tab === "Contests" ? (
              <VStack>
                {s.theme ? (
                  <Box className="mb-3 rounded-card border border-border p-4">
                    <Text
                      style={{ color: s.colour }}
                      className={`${WEB_FONT_BODY[700]} text-xs tracking-[0.5px]`}
                    >
                      WEEKLY CONTEST
                    </Text>
                    <Text
                      className={`${WEB_FONT_ROUND[700]} text-foreground mt-1 text-base`}
                    >
                      {THEME_SERIES[s.theme] || "Wildcard Sunday"}
                    </Text>
                    <Text
                      className={`${WEB_FONT_BODY[400]} text-muted-foreground mt-1 text-xs`}
                    >
                      {s.name} features in the {s.theme} rotation. Enter to win
                      Sparks.
                    </Text>
                  </Box>
                ) : null}
                {stub(
                  "Contests, awards & the leaderboard for this open in Arena.",
                )}
              </VStack>
            ) : null}
            {tab === "Map"
              ? stub(
                  `Map & nearby places for ${s.name} — arrives with location data.`,
                )
              : null}
          </ScrollView>
        </Box>
      </ModalContent>
    </Modal>
  );
}

export default PlaceHubModal;
