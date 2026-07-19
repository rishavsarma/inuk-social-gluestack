import React, { useState } from "react";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useColorScheme } from "react-native";

import { Modal, ModalBackdrop, ModalContent } from "@/components/ui/modal";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { resolveTaxonomyIcon } from "@/constants/mdi-icon-map";
import { WEB_FONT_BODY, WEB_FONT_ROUND, WEB_TEXT_SUB } from "@/constants/web-reference-theme";

interface CategoryDetailModalProps {
  category: TaxonomyCategory | null;
  onClose: () => void;
  onEntity: (name: string, cat: TaxonomyCategory, sub: string) => void;
}

function CategoryDetailModal({ category, onClose, onEntity }: CategoryDetailModalProps) {
  const [openSub, setOpenSub] = useState<string | null>(null);
  const isDark = useColorScheme() === "dark";

  if (!category) return null;
  const cat = category;

  return (
    <Modal isOpen size="full" className="h-full" onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="h-full w-full rounded-none border-0 bg-background p-0">
        <Box style={{ backgroundColor: cat.colour }} className="px-4.5 pb-4.5 pt-13">
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            className="mb-2.5"
          >
            <Icon as={ChevronLeft} size="lg" style={{ color: cat.onColour }} />
          </Pressable>
          <Box className="flex-row items-center gap-3">
            <Box className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Icon as={resolveTaxonomyIcon(cat.icon, ChevronRight)} size="lg" style={{ color: cat.onColour }} />
            </Box>
            <VStack className="flex-1">
              <Text style={{ color: cat.onColour }} className={`${WEB_FONT_ROUND[800]} text-[22px]`}>
                {cat.displayTitle}
              </Text>
              <Text
                numberOfLines={2}
                style={{ color: cat.onColour }}
                className={`${WEB_FONT_BODY[400]} text-[12.5px] opacity-[0.85]`}
              >
                {cat.summary}
              </Text>
            </VStack>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {cat.subs.map((s) => {
            const open = openSub === s.title;
            return (
              <Box
                key={s.title}
                style={{ borderColor: isDark ? "#2b3050" : "#E3E4EC" }}
                className="mb-2.5 overflow-hidden rounded-card border"
              >
                <Pressable
                  onPress={() => setOpenSub(open ? null : s.title)}
                  accessibilityRole="button"
                  accessibilityLabel={s.title}
                  accessibilityState={{ expanded: open }}
                  className="flex-row items-center gap-2.5 p-3"
                >
                  <Box
                    style={{ backgroundColor: s.colour }}
                    className="h-8 w-8 items-center justify-center rounded-full"
                  >
                    <Icon as={resolveTaxonomyIcon(s.icon, resolveTaxonomyIcon(cat.icon, ChevronRight))} size="sm" style={{ color: s.onColour }} />
                  </Box>
                  <Text
                    className={`${WEB_FONT_ROUND[700]} flex-1 text-[14.5px] ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}
                  >
                    {s.title}
                  </Text>
                  <Text className={`${WEB_FONT_BODY[400]} ${WEB_TEXT_SUB} text-xs`}>{s.entities.length}</Text>
                  <Icon as={open ? ChevronDown : ChevronRight} size="sm" className={WEB_TEXT_SUB} />
                </Pressable>
                {open && s.entities.length ? (
                  <Box className="flex-row flex-wrap gap-1.75 px-3 pb-3">
                    {s.entities.map((e) => (
                      <Pressable
                        key={e}
                        onPress={() => onEntity(e, cat, s.title)}
                        accessibilityRole="button"
                        accessibilityLabel={e}
                        style={{ backgroundColor: isDark ? "#20233B" : "#F0F0F3" }}
                        className="flex-row items-center gap-1.25 rounded-card py-1.5 pl-2.75 pr-2.25"
                      >
                        <Text className={`${WEB_FONT_BODY[400]} text-[12.5px] ${isDark ? "text-[#E9EBF4]" : "text-[#1B1F3B]"}`}>
                          {e}
                        </Text>
                        <Icon as={ChevronRight} size="xs" className={WEB_TEXT_SUB} />
                      </Pressable>
                    ))}
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </ScrollView>
      </ModalContent>
    </Modal>
  );
}

export default CategoryDetailModal;
