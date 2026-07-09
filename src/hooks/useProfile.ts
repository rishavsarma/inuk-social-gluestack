import { profileService } from "@/services/profile.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useUpdateProfile(profileId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      profileService.updateProfile(profileId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", profileId] });
    },
  });
}
