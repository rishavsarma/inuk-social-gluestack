import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useIsDarkMode } from "@/hooks/useIsDarkMode";

import { resolveTaxonomyIcon } from "@/constants/mdi-icon-map";
import { WEB_FONT_BODY, WEB_FONT_ROUND } from "@/constants/web-reference-theme";
import { HStack } from "@/components/ui/hstack";

interface CategoryBannerHeaderProps {
  category: TaxonomyCategory;
  onBack?: () => void;
  /** Set to false when the icon is already shown elsewhere (e.g. the screen's own
   * nav bar), so it isn't duplicated here. */
  showIcon?: boolean;
  /** Set to false when the title is already shown elsewhere (e.g. the screen's own
   * nav bar), so it isn't duplicated here. */
  showTitle?: boolean;
  /** Height of a persistent nav bar this banner sits directly under (e.g.
   * `getHeaderBarHeight`'s result). The banner's colour is extended upward by this
   * amount (negative margin + matching extra padding) so its background reaches
   * behind the bar — closing any gap between the two instead of merely abutting it. */
  overlapHeaderHeight?: number;
}

export function CategoryBannerHeader({
  category,
  onBack,
  showIcon = true,
  showTitle = true,
  overlapHeaderHeight = 0,
}: CategoryBannerHeaderProps) {
  const isDark = useIsDarkMode();
  const paddingTop = overlapHeaderHeight;

  const bannerBg = isDark ? category.colour : category.background;
  const bannerText = isDark ? category.onColour : category.text;

  return (
    <Box
      style={{
        backgroundColor: bannerBg,
        paddingTop,
        marginTop: -overlapHeaderHeight,
      }}
      className="px-4 pb-4"
    >
      <HStack space="sm" className="items-center">
        {showIcon ? (
          <Box
            style={{
              backgroundColor: isDark
                ? "rgba(255,255,255,0.2)"
                : category.colour,
            }}
            className="h-14 w-14 items-center justify-center rounded-full"
          >
            <Icon
              as={resolveTaxonomyIcon(category.icon, ChevronRight)}
              size="xl"
              style={{ color: category.onColour }}
            />
          </Box>
        ) : null}
        <VStack className="flex-1">
          {showTitle ? (
            <Text
              style={{ color: bannerText }}
              className={`font-baloo-bold text-3xl`}
            >
              {category.displayTitle}
            </Text>
          ) : null}
          <Text
            numberOfLines={2}
            style={{ color: bannerText }}
            className={`text-xs text-muted-foreground`}
          >
            {category.summary}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}
