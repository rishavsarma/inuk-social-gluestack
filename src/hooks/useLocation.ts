import { locationService } from "@/services/location.service";
import { useQuery } from "@tanstack/react-query";

export function useSearchLocations(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ["location-search", trimmed],
    queryFn: () => locationService.searchLocations(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 60_000,
  });
}

export function useLocationDetails(locationId?: string) {
  return useQuery({
    queryKey: ["location-detail", locationId],
    queryFn: () => locationService.getLocationById(locationId as string),
    enabled: !!locationId,
    staleTime: 5 * 60_000,
  });
}
