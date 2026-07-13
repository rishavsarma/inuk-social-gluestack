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
