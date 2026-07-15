import type { LucideIcon } from "lucide-react-native";
import { Globe, Lock, Share2, Users } from "lucide-react-native";

import type { MetadataTintName } from "@/constants/post-metadata-tints";

/** Post-type tabs shown on the media step of the create flow. Maps to
 * PostCreateDto.postType ("PHOTO" | "VIDEO" | "TEXT" subset). */
export type CreatePostMode = "photo" | "video" | "text";

export interface PostCategoryOption {
  id: string;
  labelKey: string;
  /** Tailwind-named color (never raw hex) used for the chip dot/ring and
   * matches the hue already used for this category's ring in FEED_CATEGORIES. */
  colorClassName: string;
  dotColorClassName: string;
  subcategoryLabelKeys: string[];
}

export const POST_CATEGORIES: PostCategoryOption[] = [
  {
    id: "nature",
    labelKey: "feed.categories.nature",
    colorClassName: "border-emerald-500",
    dotColorClassName: "bg-emerald-500",
    subcategoryLabelKeys: [
      "create_post.subcategory.wildlife",
      "create_post.subcategory.mountains",
      "create_post.subcategory.forests",
    ],
  },
  {
    id: "photography",
    labelKey: "feed.categories.photography",
    colorClassName: "border-blue-500",
    dotColorClassName: "bg-blue-500",
    subcategoryLabelKeys: [
      "create_post.subcategory.landscape",
      "create_post.subcategory.portrait",
      "create_post.subcategory.street",
    ],
  },
  {
    id: "design",
    labelKey: "feed.categories.design",
    colorClassName: "border-violet-500",
    dotColorClassName: "bg-violet-500",
    subcategoryLabelKeys: [
      "create_post.subcategory.interior",
      "create_post.subcategory.product",
      "create_post.subcategory.typography",
    ],
  },
  {
    id: "travel",
    labelKey: "feed.categories.travel",
    colorClassName: "border-orange-500",
    dotColorClassName: "bg-orange-500",
    subcategoryLabelKeys: [
      "create_post.subcategory.trekking",
      "create_post.subcategory.road_trip",
      "create_post.subcategory.backpacking",
    ],
  },
  {
    id: "food",
    labelKey: "feed.categories.food",
    colorClassName: "border-red-500",
    dotColorClassName: "bg-red-500",
    subcategoryLabelKeys: [
      "create_post.subcategory.street_food",
      "create_post.subcategory.recipes",
      "create_post.subcategory.cafes",
    ],
  },
  {
    id: "fashion",
    labelKey: "feed.categories.fashion",
    colorClassName: "border-pink-500",
    dotColorClassName: "bg-pink-500",
    subcategoryLabelKeys: [
      "create_post.subcategory.streetwear",
      "create_post.subcategory.traditional",
      "create_post.subcategory.accessories",
    ],
  },
];

export interface PostThemeSwatch {
  name: MetadataTintName;
  labelKey: string;
  dotColorClassName: string;
}

/** Client-side mood tint applied to the post's metadata cards — reuses the
 * same 9 hues as POST_METADATA_TINTS so a post's theme always matches how
 * its awards/performance cards will later render. Not part of PostCreateDto. */
export const POST_THEME_SWATCHES: PostThemeSwatch[] = [
  { name: "blue", labelKey: "create_post.theme_names.blue", dotColorClassName: "bg-blue-500" },
  { name: "violet", labelKey: "create_post.theme_names.violet", dotColorClassName: "bg-violet-400" },
  { name: "rose", labelKey: "create_post.theme_names.rose", dotColorClassName: "bg-rose-400" },
  { name: "red", labelKey: "create_post.theme_names.red", dotColorClassName: "bg-red-500" },
  { name: "orange", labelKey: "create_post.theme_names.orange", dotColorClassName: "bg-orange-400" },
  { name: "amber", labelKey: "create_post.theme_names.amber", dotColorClassName: "bg-amber-500" },
  { name: "sky", labelKey: "create_post.theme_names.sky", dotColorClassName: "bg-sky-400" },
  { name: "emerald", labelKey: "create_post.theme_names.emerald", dotColorClassName: "bg-emerald-400" },
  { name: "green", labelKey: "create_post.theme_names.green", dotColorClassName: "bg-green-500" },
];

export interface VisibilityOption {
  value: PostVisibility;
  labelKey: string;
  icon: LucideIcon;
}

export const VISIBILITY_OPTIONS: VisibilityOption[] = [
  { value: "ALL", labelKey: "create_post.visibility.public", icon: Globe },
  { value: "FOLLOWERS", labelKey: "create_post.visibility.followers", icon: Users },
  { value: "SHARED", labelKey: "create_post.visibility.shared", icon: Share2 },
  { value: "SELF", labelKey: "create_post.visibility.only_me", icon: Lock },
];

export const CAPTION_MAX_LENGTH = 2200;

export const LOCATION_SUGGESTIONS = ["Nainital", "Valley of Flowers", "Rishikesh"];

export const TRENDING_TAGS = ["Nainital", "StreetPhotography", "WildlifeIndia"];
