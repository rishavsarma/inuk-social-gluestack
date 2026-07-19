import React, { useState } from "react";

import { ChevronLeft, Plus } from "lucide-react-native";
import { useColorScheme } from "react-native";

import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { resolveTaxonomyIcon } from "@/constants/mdi-icon-map";
import { THEME_SERIES } from "@/constants/discover-web-data";
import { WEB_FONT_BODY, WEB_FONT_ROUND, WEB_TEXT_SUB } from "@/constants/web-reference-theme";

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
  const isDark = useColorScheme() === "dark";

  if (!subject) return null;
  const s = subject;
  const icon = resolveTaxonomyIcon(s.icon, Plus);

  const stub = (message: string) => (
    <VStack
      style={{ backgroundColor: isDark ? "#14162B" : "#F7F7F9" }}
      className="items-center rounded-2xl py-11"
    >
      <Icon as={icon} size="xl" style={{ color: s.colour }} />
      <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} mt-3 px-7.5 text-center text-[13px]`}>
        {message}
      </Text>
    </VStack>
  );

  return (
    <Modal isOpen size="full" className="h-full" onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="h-full w-full rounded-none border-0 bg-background p-0">
        <Box style={{ backgroundColor: s.colour }} className="px-4.5 pb-4 pt-13">
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            className="mb-2.5"
          >
            <Icon as={ChevronLeft} size="lg" style={{ color: s.onColour }} />
          </Pressable>
          <Text style={{ color: s.onColour }} className={`${WEB_FONT_BODY[400]} text-xs opacity-[0.85]`}>
            {s.breadcrumb}
          </Text>
          <Text style={{ color: s.onColour }} className={`${WEB_FONT_ROUND[800]} mt-0.5 text-[26px]`}>
            {s.name}
          </Text>
          <Box className="mt-3">
            <Box className="mb-1.25 flex-row justify-between">
              <Text style={{ color: s.onColour }} className={`${WEB_FONT_BODY[400]} text-[11px] opacity-[0.85]`}>
                Coverage
              </Text>
              <Text style={{ color: s.onColour }} className={`${WEB_FONT_BODY[400]} text-[11px] opacity-[0.85]`}>
                — documented
              </Text>
            </Box>
            <Box className="h-1.25 rounded-full bg-white/25">
              <Box style={{ backgroundColor: s.onColour, width: "8%" }} className="h-1.25 rounded-full" />
            </Box>
          </Box>
        </Box>

        <Box
          style={{ borderColor: isDark ? "#2b3050" : "#E3E4EC" }}
          className="flex-row border-b py-3.5"
        >
          {(["Posts", "Contributors", "Themes"] as const).map((label) => (
            <VStack key={label} className="flex-1 items-center">
              <Text className={`${WEB_FONT_ROUND[800]} text-[18px] ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
                —
              </Text>
              <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-[11px]`}>{label}</Text>
            </VStack>
          ))}
        </Box>

        <Box style={{ borderColor: isDark ? "#2b3050" : "#E3E4EC" }} className="flex-row border-b px-2">
          {TABS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={{ borderColor: tab === t ? s.colour : "transparent" }}
              className="flex-1 items-center border-b-2 py-3"
            >
              <Text
                style={{ color: tab === t ? s.colour : undefined }}
                className={`${tab === t ? WEB_FONT_ROUND[700] : WEB_FONT_ROUND[500]} text-[13.5px] ${
                  tab === t ? "" : WEB_TEXT_SUB
                }`}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Pressable
            style={{ backgroundColor: s.colour }}
            className="mb-4.5 h-11 flex-row items-center justify-center gap-2 rounded-full"
          >
            <Icon as={Plus} size="sm" style={{ color: s.onColour }} />
            <Text style={{ color: s.onColour }} className={`${WEB_FONT_ROUND[700]} text-[14px]`}>
              Post about {s.name}
            </Text>
          </Pressable>

          {tab === "Posts" ? (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                style={{ marginBottom: 14 }}
              >
                {GENRES.map((g) => (
                  <Pressable
                    key={g}
                    onPress={() => setGenre(g)}
                    style={{ backgroundColor: genre === g ? s.colour : isDark ? "#20233B" : "#F0F0F3" }}
                    className="h-8 items-center justify-center rounded-2xl px-3.5"
                  >
                    <Text
                      style={{ color: genre === g ? s.onColour : undefined }}
                      className={`${WEB_FONT_BODY[600]} text-[13px] ${genre === g ? "" : WEB_TEXT_SUB}`}
                    >
                      {g}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              {stub(
                `No ${genre === "All" ? "" : genre.toLowerCase() + " "}posts yet — be the first to share ${s.name}.`,
              )}
            </>
          ) : null}
          {tab === "Creators" ? stub(`Top contributors for ${s.name} appear here as people post.`) : null}
          {tab === "Contests" ? (
            <VStack>
              {s.theme ? (
                <Box
                  style={{ borderColor: isDark ? "#2b3050" : "#E3E4EC" }}
                  className="mb-3 rounded-card border p-3.5"
                >
                  <Text style={{ color: s.colour }} className={`${WEB_FONT_BODY[700]} text-[11px] tracking-[0.5px]`}>
                    WEEKLY CONTEST
                  </Text>
                  <Text
                    className={`${WEB_FONT_ROUND[700]} mt-0.75 text-[15px] ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}
                  >
                    {THEME_SERIES[s.theme] || "Wildcard Sunday"}
                  </Text>
                  <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} mt-0.5 text-[12.5px]`}>
                    {s.name} features in the {s.theme} rotation. Enter to win Sparks.
                  </Text>
                </Box>
              ) : null}
              {stub("Contests, awards & the leaderboard for this open in Arena.")}
            </VStack>
          ) : null}
          {tab === "Map" ? stub(`Map & nearby places for ${s.name} — arrives with location data.`) : null}
        </ScrollView>
      </ModalContent>
    </Modal>
  );
}

export default PlaceHubModal;
