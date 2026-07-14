import { useCallback } from "react";

import {
  getContentTypeFromExtension,
  uploadFileMultipart,
} from "@/services/upload.service";
import { useAuthStore } from "@/stores/auth.store";

type UploadMediaOptions = Omit<UploadOptions, "token" | "contentType"> & {
  contentType?: string;
};

export function useUpload() {
  const token = useAuthStore((state) => state.token);

  const uploadMedia = useCallback(
    (options: UploadMediaOptions) =>
      uploadFileMultipart({
        ...options,
        contentType:
          options.contentType ?? getContentTypeFromExtension(options.fileName),
        token: token || "",
      }),
    [token],
  );

  return { uploadMedia };
}
