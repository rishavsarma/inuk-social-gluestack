// Mock data for the geography drill-down feature (Region > District > Block >
// Settlement > Locality > POI). Backed by a real hierarchy shape for when the
// `/bhugol` API grows browse endpoints beyond search — see location.service.ts.
// Ids of top-level regions intentionally match MOCK_DISCOVER_REGIONS so the
// existing Discover "Location" tab can link straight into this flow.

export const MOCK_GEO_REGIONS: GeoRegion[] = [
  {
    id: "region-kumaon",
    name: "Kumaon",
    parentLabel: "Uttarakhand",
    coveragePercent: 58,
    postsCount: 1240,
  },
  {
    id: "region-garhwal",
    name: "Garhwal",
    parentLabel: "Uttarakhand",
    coveragePercent: 41,
    postsCount: 980,
  },
];

export const MOCK_GEO_DISTRICTS: GeoDistrict[] = [
  {
    id: "district-almora",
    regionId: "region-kumaon",
    regionName: "Kumaon",
    name: "Almora",
    postsCount: 1240,
    coveragePercent: 78,
  },
  {
    id: "district-nainital",
    regionId: "region-kumaon",
    regionName: "Kumaon",
    name: "Nainital",
    postsCount: 980,
    coveragePercent: 71,
  },
  {
    id: "district-pithoragarh",
    regionId: "region-kumaon",
    regionName: "Kumaon",
    name: "Pithoragarh",
    postsCount: 640,
    coveragePercent: 49,
  },
  {
    id: "district-bageshwar",
    regionId: "region-kumaon",
    regionName: "Kumaon",
    name: "Bageshwar",
    postsCount: 410,
    coveragePercent: 44,
  },
  {
    id: "district-champawat",
    regionId: "region-kumaon",
    regionName: "Kumaon",
    name: "Champawat",
    postsCount: 140,
    coveragePercent: 22,
  },
  {
    id: "district-udham-singh-nagar",
    regionId: "region-kumaon",
    regionName: "Kumaon",
    name: "Udham Singh Nagar",
    postsCount: 90,
    coveragePercent: 15,
  },
  {
    id: "district-tehri",
    regionId: "region-garhwal",
    regionName: "Garhwal",
    name: "Tehri Garhwal",
    postsCount: 320,
    coveragePercent: 38,
  },
  {
    id: "district-pauri",
    regionId: "region-garhwal",
    regionName: "Garhwal",
    name: "Pauri Garhwal",
    postsCount: 280,
    coveragePercent: 35,
  },
  {
    id: "district-dehradun",
    regionId: "region-garhwal",
    regionName: "Garhwal",
    name: "Dehradun",
    postsCount: 260,
    coveragePercent: 52,
  },
  {
    id: "district-chamoli",
    regionId: "region-garhwal",
    regionName: "Garhwal",
    name: "Chamoli",
    postsCount: 70,
    coveragePercent: 19,
  },
  {
    id: "district-uttarkashi",
    regionId: "region-garhwal",
    regionName: "Garhwal",
    name: "Uttarkashi",
    postsCount: 30,
    coveragePercent: 12,
  },
  {
    id: "district-rudraprayag",
    regionId: "region-garhwal",
    regionName: "Garhwal",
    name: "Rudraprayag",
    postsCount: 15,
    coveragePercent: 8,
  },
  {
    id: "district-haridwar",
    regionId: "region-garhwal",
    regionName: "Garhwal",
    name: "Haridwar",
    postsCount: 5,
    coveragePercent: 4,
  },
];

// Real administrative blocks of Almora district — only Hawalbagh has
// documented settlements so far, the rest surface the empty state.
export const MOCK_GEO_BLOCKS: GeoBlock[] = [
  "Hawalbagh",
  "Dhauladevi",
  "Bhikiyasain",
  "Lamgara",
  "Tarikhet",
  "Someshwar",
  "Syalde",
  "Chaukhutiya",
  "Dwarahat",
  "Bhainsiyachhana",
  "Salt",
].map((name) => ({
  id: `block-${name.toLowerCase()}`,
  districtId: "district-almora",
  districtName: "Almora",
  regionName: "Kumaon",
  name,
}));

export const MOCK_GEO_SETTLEMENTS: GeoSettlement[] = [
  {
    id: "settlement-kasar-devi",
    blockId: "block-hawalbagh",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Kasar Devi",
    kind: "Town",
    coveragePercent: 74,
    postsCount: 210,
    contributorsCount: 52,
  },
  {
    id: "settlement-kunja",
    blockId: "block-hawalbagh",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Kunja",
    kind: "Village",
    coveragePercent: 62,
    postsCount: 128,
    contributorsCount: 34,
  },
  {
    id: "settlement-paparsali",
    blockId: "block-hawalbagh",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Paparsali",
    kind: "Village",
    coveragePercent: 31,
    postsCount: 64,
    contributorsCount: 18,
  },
  {
    id: "settlement-matela",
    blockId: "block-hawalbagh",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Matela",
    kind: "Village",
    coveragePercent: 20,
    postsCount: 40,
    contributorsCount: 11,
  },
];

export const MOCK_GEO_LOCALITIES: GeoLocality[] = [
  {
    id: "locality-upper-kunja",
    settlementId: "settlement-kunja",
    settlementName: "Kunja",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Upper Kunja",
  },
  {
    id: "locality-mandir-tok",
    settlementId: "settlement-kunja",
    settlementName: "Kunja",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Mandir Tok",
  },
  {
    id: "locality-kasar-devi-ridge",
    settlementId: "settlement-kasar-devi",
    settlementName: "Kasar Devi",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Kasar Devi Ridge",
  },
];

export const MOCK_GEO_POIS: GeoPoi[] = [
  {
    id: "poi-kunja-devi-temple",
    localityId: "locality-upper-kunja",
    localityName: "Upper Kunja",
    settlementId: "settlement-kunja",
    settlementName: "Kunja",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Kunja Devi Temple",
    category: "Temple",
    touristWorthy: true,
    postsCount: 42,
    contributorsCount: 18,
    tint: "amber",
  },
  {
    id: "poi-old-naula",
    localityId: "locality-upper-kunja",
    localityName: "Upper Kunja",
    settlementId: "settlement-kunja",
    settlementName: "Kunja",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Old Naula",
    category: "Spring",
    touristWorthy: false,
    postsCount: 12,
    contributorsCount: 7,
    tint: "sky",
  },
  {
    id: "poi-deodar-ridge-view",
    localityId: "locality-upper-kunja",
    localityName: "Upper Kunja",
    settlementId: "settlement-kunja",
    settlementName: "Kunja",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Deodar Ridge View",
    category: "Viewpoint",
    touristWorthy: true,
    postsCount: 28,
    contributorsCount: 15,
    tint: "orange",
  },
  {
    id: "poi-kunja-homestay",
    localityId: "locality-upper-kunja",
    localityName: "Upper Kunja",
    settlementId: "settlement-kunja",
    settlementName: "Kunja",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Kunja Homestay",
    category: "Homestay",
    touristWorthy: false,
    postsCount: 9,
    contributorsCount: 6,
    tint: "green",
  },
  {
    id: "poi-mandir-tok-shrine",
    localityId: "locality-mandir-tok",
    localityName: "Mandir Tok",
    settlementId: "settlement-kunja",
    settlementName: "Kunja",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Village Shrine",
    category: "Temple",
    touristWorthy: false,
    postsCount: 6,
    contributorsCount: 4,
    tint: "amber",
  },
  {
    id: "poi-kasar-devi-temple",
    localityId: "locality-kasar-devi-ridge",
    localityName: "Kasar Devi Ridge",
    settlementId: "settlement-kasar-devi",
    settlementName: "Kasar Devi",
    blockName: "Hawalbagh",
    districtName: "Almora",
    regionName: "Kumaon",
    name: "Kasar Devi Temple",
    category: "Temple",
    touristWorthy: true,
    postsCount: 96,
    contributorsCount: 41,
    tint: "amber",
  },
];

export function getRegionById(id: string) {
  return MOCK_GEO_REGIONS.find((region) => region.id === id);
}

export function getDistrictById(id: string) {
  return MOCK_GEO_DISTRICTS.find((district) => district.id === id);
}

export function getBlockById(id: string) {
  return MOCK_GEO_BLOCKS.find((block) => block.id === id);
}

export function getSettlementById(id: string) {
  return MOCK_GEO_SETTLEMENTS.find((settlement) => settlement.id === id);
}

export function getLocalityById(id: string) {
  return MOCK_GEO_LOCALITIES.find((locality) => locality.id === id);
}

export function getPoiById(id: string) {
  return MOCK_GEO_POIS.find((poi) => poi.id === id);
}

export function getDistrictsForRegion(regionId: string) {
  return MOCK_GEO_DISTRICTS.filter((district) => district.regionId === regionId);
}

export function getBlocksForDistrict(districtId: string) {
  return MOCK_GEO_BLOCKS.filter((block) => block.districtId === districtId);
}

export function getSettlementsForBlock(blockId: string) {
  return MOCK_GEO_SETTLEMENTS.filter((settlement) => settlement.blockId === blockId);
}

export function getLocalitiesForSettlement(settlementId: string) {
  return MOCK_GEO_LOCALITIES.filter(
    (locality) => locality.settlementId === settlementId,
  );
}

export function getPoisForLocality(localityId: string) {
  return MOCK_GEO_POIS.filter((poi) => poi.localityId === localityId);
}

export function getPoisForSettlement(settlementId: string) {
  return MOCK_GEO_POIS.filter((poi) => poi.settlementId === settlementId);
}

export function getPoisCountForBlock(blockId: string) {
  const settlementIds = getSettlementsForBlock(blockId).map(
    (settlement) => settlement.id,
  );
  return MOCK_GEO_POIS.filter((poi) => settlementIds.includes(poi.settlementId))
    .length;
}

export function getPoisCountForDistrict(districtId: string) {
  const blockIds = getBlocksForDistrict(districtId).map((block) => block.id);
  const settlementIds = MOCK_GEO_SETTLEMENTS.filter((settlement) =>
    blockIds.includes(settlement.blockId),
  ).map((settlement) => settlement.id);
  return MOCK_GEO_POIS.filter((poi) => settlementIds.includes(poi.settlementId))
    .length;
}
