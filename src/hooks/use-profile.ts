import { profileService } from "@/services/profile.service";
import { useQuery } from "@tanstack/react-query";

export const useGetProfile = (profileId: string) => {
  return useQuery({
    queryKey: ["profile", profileId],
    queryFn: async () => {
      const [profile, stats] = await Promise.all([
        profileService.getProfile(profileId),
        profileService.getProfileStats(profileId),
      ]);
      return { profile, stats };
    },
    enabled: !!profileId,
  });
};
