import { useCallback } from "react";

import { Toast, ToastDescription, useToast } from "@/components/ui/toast";

export function useFeedbackToast() {
  const toast = useToast();

  return useCallback(
    (message: string, placement: "top" | "bottom" = "top") => {
      toast.show({
        placement,
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="muted" variant="solid">
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        ),
      });
    },
    [toast],
  );
}
