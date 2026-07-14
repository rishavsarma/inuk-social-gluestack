import axios from 'axios';

// --------------------------
// CONFIG
// --------------------------
const INITIATE_URL = 'https://w896ywfi6l.execute-api.ap-south-1.amazonaws.com/initiate-multipart';
const COMPLETE_URL = 'https://w896ywfi6l.execute-api.ap-south-1.amazonaws.com/complete-multipart';

const MAX_WORKERS = 4;
const MAX_RETRIES = 3;

// --------------------------
// TYPES
// --------------------------

interface InitiateResponse {
  uploadId: string;
  key: string;
  partSize: number;
  parts: PartInfo[];
  mediaId?: string;
}

interface PartInfo {
  partNumber: number;
  url: string;
}

interface PartResult {
  ETag: string;
  PartNumber: number;
}

// --------------------------
// UTILITY FUNCTIONS
// --------------------------
function extractMediaIdFromKey(key: string): string | null {
  // tenant/{tenantId}/user/{userId}/{mediaId}/original/{filename}
  const parts = key.split('/');
  try {
    const idx = parts.indexOf('user');
    const mediaId = parts[idx + 2];
    return mediaId;
  } catch {
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Local file:// URIs are read directly, not through the shared Axios
// instance — there's no server round trip here, just decoding the file
// already on-device, so the interceptor stack (auth header, 401 handling)
// doesn't apply.
async function fetchFileAsArrayBuffer(uri: string): Promise<ArrayBuffer> {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }
  // Reading as ArrayBuffer (rather than Blob) avoids React Native's Blob
  // polyfill, which throws "Creating blobs from 'ArrayBuffer' and
  // 'ArrayBufferView' are not supported" when slicing a blob backed by
  // a local file on-device.
  return await response.arrayBuffer();
}

// --------------------------
// Upload part with retry logic
// --------------------------
async function uploadPart(
  part: PartInfo,
  fileBuffer: ArrayBuffer,
  partSize: number,
  fileSize: number,
  contentType: string
): Promise<PartResult> {
  const partNumber = part.partNumber;
  const url = part.url;
  const start = (partNumber - 1) * partSize;
  const end = Math.min(start + partSize, fileSize);

  // Extract the chunk as a plain ArrayBuffer slice (not a Blob slice)
  const chunk = fileBuffer.slice(start, end);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Presigned S3 URLs are uploaded to directly with fetch — they don't
      // go through our API and don't need the shared Axios instance's auth
      // header or 401 handling.
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: chunk,
      });

      if (response.ok) {
        const etag = response.headers.get('etag') || response.headers.get('ETag');
        if (!etag) {
          throw new Error('ETag missing in response headers');
        }
        if (__DEV__) {
          console.log(`Part ${partNumber} uploaded, ETag=${etag}`);
        }
        return { ETag: etag, PartNumber: partNumber };
      } else if (__DEV__) {
        console.log(`Part ${partNumber} failed (status ${response.status})`);
      }
    } catch (error: any) {
      if (__DEV__) {
        console.log(
          `Error uploading part ${partNumber}, attempt ${attempt}:`,
          error?.message || String(error)
        );
      }
    }

    await sleep(Math.pow(2, attempt) * 1000); // exponential backoff
  }

  throw new Error(`Part ${partNumber} failed after ${MAX_RETRIES} retries`);
}

// --------------------------
// Main multipart upload function
// --------------------------
export async function uploadFileMultipart(options: UploadOptions): Promise<string> {
  const {
    title,
    fileUri,
    fileName,
    contentType,
    mediaType = 'AVATAR',
    visibility = 'SELF',
    token,
    postId,
    onProgress,
  } = options;

  if (!token) {
    throw new Error('Authentication token not found');
  }

  try {
    // Get file as an ArrayBuffer
    const fileBuffer = await fetchFileAsArrayBuffer(fileUri);
    const fileSize = fileBuffer.byteLength;

    // Extract file extension from fileName
    const fileExtension = fileName.split('.').pop() || '';

    // --------------------------
    // STEP 1: Initiate upload
    // --------------------------
    const initPayload = {
      filename: fileName,
      contentType,
      fileSize,
      visibility,
      fileExtension,
      formDataJson: null,
      mediaType,
      postId: postId,
      title: title,
      mediaId: options.mediaId,
    };

    onProgress?.(0);

    const initResponse = await axios.post<InitiateResponse>(INITIATE_URL, initPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (initResponse.status !== 200) {
      throw new Error(`Initiate failed: ${initResponse.status}`);
    }

    const data = initResponse.data;
    const { uploadId, key, partSize, parts: partsInfo } = data;

    // Try to get mediaId from response first; if missing, extract from key
    const mediaId = data.mediaId || extractMediaIdFromKey(key);
    if (!mediaId) {
      throw new Error('Could not determine mediaId');
    }

    // --------------------------
    // STEP 2: Upload parts
    // --------------------------
    const allEtags: PartResult[] = [];
    let completedParts = 0;

    // Process parts in batches to control concurrency
    for (let i = 0; i < partsInfo.length; i += MAX_WORKERS) {
      const batch = partsInfo.slice(i, i + MAX_WORKERS);
      const batchPromises = batch.map((part) =>
        uploadPart(part, fileBuffer, partSize, fileSize, contentType)
      );

      const results = await Promise.all(batchPromises);
      allEtags.push(...results);

      completedParts += results.length;
      const progress = Math.round((completedParts / partsInfo.length) * 95); // Reserve 5% for completion
      onProgress?.(progress);
    }

    // Sort by part number
    const etags = allEtags.sort((a, b) => a.PartNumber - b.PartNumber);

    // --------------------------
    // STEP 3: Complete upload
    // --------------------------
    onProgress?.(98);

    const completePayload = {
      mediaId,
      postId,
      title,
      key,
      uploadId,
      parts: etags,
    };

    const completeResponse = await axios.post(COMPLETE_URL, completePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (completeResponse.status !== 200) {
      throw new Error(`Complete failed: ${completeResponse.status}`);
    }

    onProgress?.(100);

    return mediaId;
  } catch (error: any) {
    if (__DEV__) {
      console.error('Upload failed:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
    throw error;
  }
}

// --------------------------
// Helper function to get content type from file extension
// --------------------------
export function getContentTypeFromExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    heic: 'image/heic',
    // Videos
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    webm: 'video/webm',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}
