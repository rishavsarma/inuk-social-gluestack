export function buildImageUrl(
  mediaId: string,
  size: 150 | 720 | 1080 = 720,
  format: "jpeg" | "jpg" = "jpeg",
): string {
  return `${process.env.EXPO_PUBLIC_IMAGE_BASE_URL}/${mediaId}/${format}/${size}`;
}
