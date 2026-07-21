import { useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react-native";
import { ScrollView } from "react-native";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { resolveTaxonomyIcon } from "@/constants/mdi-icon-map";

interface CategorySubcategoryListProps {
  category: TaxonomyCategory;
  onEntity?: (name: string, cat: TaxonomyCategory, sub: string) => void;
  onSubcategoryToggle?: (subTitle: string | null) => void;
  /** "list" (default): full-width rows that expand in place — used by Discover's
   * category detail modal. "scroll": compact cards in a horizontal strip, with the
   * selected card's entities shown in a grid underneath — used by the theme page. */
  layout?: "list" | "scroll";
}

function EntityChipGrid({
  category,
  sub,
  onEntity,
  className,
}: {
  category: TaxonomyCategory;
  sub: TaxonomySubcategory;
  onEntity?: (name: string, cat: TaxonomyCategory, sub: string) => void;
  className: string;
}) {
  if (!sub.entities.length) return null;

  const icon = resolveTaxonomyIcon(
    sub.icon,
    resolveTaxonomyIcon(category.icon, ChevronRight),
  );

  const rows: string[][] = [[], []];
  sub.entities.forEach((e, i) => rows[i % 2].push(e));

  const cardClassName =
    "bg-card border border-border/10 shadow-none flex-row items-center gap-2 rounded-md px-2 py-3 w-40";

  const renderCard = (e: string) => {
    const cardContent = (
      <>
        <Box
          style={{ backgroundColor: category.colour }}
          className="h-6.5 w-6.5 items-center justify-center rounded-full"
        >
          <Icon as={icon} size="xs" style={{ color: category.onColour }} />
        </Box>
        <Text numberOfLines={1} className={`font-baloo-bold flex-1 text-sm `}>
          {e}
        </Text>
        {onEntity ? <Icon as={ChevronRight} size="xs" /> : null}
      </>
    );

    return onEntity ? (
      <Pressable
        key={e}
        onPress={() => onEntity(e, category, sub.title)}
        accessibilityRole="button"
        accessibilityLabel={e}
        className={cardClassName}
      >
        {cardContent}
      </Pressable>
    ) : (
      <Box key={e} className={cardClassName}>
        {cardContent}
      </Box>
    );
  };

  return (
    <Box className={className}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        <VStack space="sm">
          <Box className="flex-row gap-2.25">{rows[0].map(renderCard)}</Box>
          <Box className="flex-row gap-2.25">{rows[1].map(renderCard)}</Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}

export function CategorySubcategoryList({
  category,
  onEntity,
  onSubcategoryToggle,
  layout = "list",
}: CategorySubcategoryListProps) {
  const [openSub, setOpenSub] = useState<string | null>(null);

  const handleToggle = (title: string) => {
    const next = openSub === title ? null : title;
    setOpenSub(next);
    onSubcategoryToggle?.(next);
  };

  if (layout === "scroll") {
    const activeSub = category.subs.find((s) => s.title === openSub);

    return (
      <>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}
        >
          {category.subs.map((s) => {
            const open = openSub === s.title;
            return (
              <Pressable
                key={s.title}
                onPress={() => handleToggle(s.title)}
                accessibilityRole="button"
                accessibilityLabel={s.title}
                accessibilityState={{ selected: open }}
                style={open ? { backgroundColor: category.colour } : undefined}
                className={`${open ? "" : "bg-card"} flex-row items-center gap-2.5 rounded-lg py-2 pl-2 pr-3.5`}
              >
                <Box
                  style={{
                    backgroundColor: open
                      ? "rgba(255,255,255,0.25)"
                      : category.colour,
                  }}
                  className="h-8 w-8 items-center justify-center rounded-full"
                >
                  <Icon
                    as={resolveTaxonomyIcon(
                      s.icon,
                      resolveTaxonomyIcon(category.icon, ChevronRight),
                    )}
                    size="xs"
                    style={{ color: open ? "#FFFFFF" : category.onColour }}
                  />
                </Box>
                <VStack>
                  <Text
                    numberOfLines={1}
                    className={`font-baloo-bold text-[13px] ${
                      open ? "text-white" : "text-foreground"
                    }`}
                  >
                    {s.title}
                  </Text>
                  <Text
                    className={`font-inter text-[10.5px] ${
                      open ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {s.entities.length} places
                  </Text>
                </VStack>
                <Icon
                  as={open ? ChevronDown : ChevronRight}
                  size="xs"
                  className={open ? "text-white" : "text-muted-foreground"}
                />
              </Pressable>
            );
          })}
        </ScrollView>
        {activeSub ? (
          <EntityChipGrid
            category={category}
            sub={activeSub}
            onEntity={onEntity}
            className="px-4 pt-3"
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      {category.subs.map((s) => {
        const open = openSub === s.title;
        return (
          <Box key={s.title} className="mb-3">
            <Pressable
              onPress={() => handleToggle(s.title)}
              accessibilityRole="button"
              accessibilityLabel={s.title}
              accessibilityState={{ expanded: open }}
              className="bg-muted flex-row items-center gap-3 rounded-2xl p-3.5"
            >
              <Box
                style={{ backgroundColor: category.colour }}
                className="h-10 w-10 items-center justify-center rounded-full"
              >
                <Icon
                  as={resolveTaxonomyIcon(
                    s.icon,
                    resolveTaxonomyIcon(category.icon, ChevronRight),
                  )}
                  size="sm"
                  style={{ color: category.onColour }}
                />
              </Box>
              <Text className="font-baloo-bold text-foreground flex-1 text-[15px]">
                {s.title}
              </Text>
              <Text className="font-inter text-muted-foreground text-xs">
                {s.entities.length}
              </Text>
              <Icon
                as={open ? ChevronDown : ChevronRight}
                size="sm"
                className="text-muted-foreground"
              />
            </Pressable>
            {open ? (
              <EntityChipGrid
                category={category}
                sub={s}
                onEntity={onEntity}
                className="px-1 pt-2.5"
              />
            ) : null}
          </Box>
        );
      })}
    </>
  );
}
