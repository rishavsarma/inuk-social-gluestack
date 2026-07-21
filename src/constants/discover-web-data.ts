/** Byte-exact port of inuk.social-web's Discover data constants (screens.js ~L2085-2117). */
import { THEME_ACCENT_COLOR } from "@/constants";
import taxonomyJson from "@/constants/discover-taxonomy.json";

export const TAX = taxonomyJson as TaxonomyData;

export const CAT_BY_TITLE: Record<string, TaxonomyCategory> = Object.fromEntries(
  TAX.categories.map((x) => [x.title, x]),
);

function slugifyTaxonomyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The `/theme/[themeId]` route id for a taxonomy category — a slug of its title. */
export function taxonomyThemeId(category: TaxonomyCategory): string {
  return slugifyTaxonomyTitle(category.title);
}

/** Maps a `/theme/[themeId]` route param back to its taxonomy category title, so the
 * theme detail page can look the full category up via `CAT_BY_TITLE`. */
export const THEME_ID_TO_TAXONOMY_TITLE: Record<string, string> = Object.fromEntries(
  TAX.categories.map((x) => [slugifyTaxonomyTitle(x.title), x.title]),
);

/** location-lens accent — the app's real brand accent, so Discover's Location
 * lens matches the rest of the app instead of its own bespoke teal. */
export const LOC = THEME_ACCENT_COLOR;

interface PopularEntitySeed {
  name: string;
  cat: string;
  sub: string;
}

const POPULAR_SEED: PopularEntitySeed[] = [
  { name: "Kedarnath Temple", cat: "Temples & Deities", sub: "Char Dham" },
  { name: "Nanda Devi", cat: "Nature & Landscapes", sub: "Peaks & Mountains" },
  { name: "Valley of Flowers", cat: "Nature & Landscapes", sub: "Valleys" },
  { name: "Badrinath Temple", cat: "Temples & Deities", sub: "Char Dham" },
  { name: "Har Ki Dun", cat: "Trekking & Adventure", sub: "Treks" },
  { name: "Auli", cat: "Travel & Places", sub: "Hill Stations" },
  { name: "Jageshwar", cat: "Temples & Deities", sub: "Ancient & Heritage Temple Complexes" },
  { name: "Roopkund", cat: "Rivers & Waterbodies", sub: "Lakes & Tals" },
];

export interface PopularEntity extends PopularEntitySeed {
  catObj: TaxonomyCategory;
}

export const POPULAR: PopularEntity[] = POPULAR_SEED.map((p) => ({
  ...p,
  catObj: CAT_BY_TITLE[p.cat],
})).filter((p): p is PopularEntity => Boolean(p.catObj));

export interface WebRegion {
  name: string;
  gl: string;
  posts: number;
  districts: string[];
}

export const REGIONS: WebRegion[] = [
  {
    name: "Kumaon",
    gl: "कु",
    posts: 1240,
    districts: ["Almora", "Nainital", "Pithoragarh", "Bageshwar", "Champawat", "Udham Singh Nagar"],
  },
  {
    name: "Garhwal",
    gl: "ग",
    posts: 980,
    districts: ["Dehradun", "Haridwar", "Tehri Garhwal", "Pauri Garhwal", "Uttarkashi", "Chamoli", "Rudraprayag"],
  },
];

export interface WebPlace {
  name: string;
  kind: string;
  region: string;
  posts: number;
}

export const PLACES: WebPlace[] = [
  { name: "Kunja", kind: "Village", region: "Almora · Kumaon", posts: 128 },
  { name: "Munsiyari", kind: "Town", region: "Pithoragarh · Kumaon", posts: 402 },
  { name: "Auli", kind: "Meadow", region: "Chamoli · Garhwal", posts: 310 },
  { name: "Chopta", kind: "Village", region: "Rudraprayag · Garhwal", posts: 265 },
];

export interface WebTrendingTag {
  tag: string;
  posts: number;
}

export const TRENDING_TAGS: WebTrendingTag[] = [
  { tag: "Harela2026", posts: 2340 },
  { tag: "Munsiyari", posts: 1180 },
  { tag: "AipanArt", posts: 870 },
  { tag: "PahadiThali", posts: 640 },
  { tag: "Kedarnath", posts: 590 },
  { tag: "ValleyOfFlowers", posts: 520 },
];

export const THEME_SERIES: Record<string, string> = {
  "Land & Nature": "Mountain Monday",
  "Culture & Heritage": "Heritage Tuesday / Flavours Wednesday",
  "Faith & Divinity": "Devbhoomi Thursday",
  "Life & Livelihood": "Faces Friday",
  "Journeys & Adventure": "Summit Saturday",
  Wellbeing: "Wildcard Sunday",
};
