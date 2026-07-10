import { notificationService } from "@/services/notification.service";
import { useQuery } from "@tanstack/react-query";

export function useGetNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getNotifications(),
  });
}
