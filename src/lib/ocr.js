// Week 3: image prep + OCR. Camera/gallery image -> text -> subjects & marks.
// OCR runs in the cloud (OCR.space) so it works in Expo Go. To go on-device later, only
// recognizeText() needs replacing; the rest of the app never calls the OCR service directly.
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { parseReportCardText } from './grades';

const OCR_ENDPOINT = 'https://api.ocr.space/parse/image';
// Free key: https://ocr.space/ocrapi/freekey  -> put it in .env as EXPO_PUBLIC_OCR_SPACE_KEY
// 'helloworld' is OCR.space's shared demo key (heavily rate-limited, fine for a first test).
const OCR_API_KEY = process.env.EXPO_PUBLIC_OCR_SPACE_KEY || 'helloworld';
const MAX_WIDTH = 1600; // keeps the upload small (free tier has a ~1 MB file limit)

export class OcrError extends Error {
  constructor(kind, message) {
    super(message);
    this.name = 'OcrError';
    this.kind = kind; // 'network' | 'timeout' | 'service'
  }
}

// Shrink + compress the photo and return { uri, base64 }.
export async function prepareImage(uri, width) {
  const context = ImageManipulator.manipulate(uri);
  if (!width || width > MAX_WIDTH) context.resize({ width: MAX_WIDTH });
  const image = await context.renderAsync();
  return image.saveAsync({ format: SaveFormat.JPEG, compress: 0.7, base64: true });
}

export async function recognizeText(base64Jpeg, { timeoutMs = 30000 } = {}) {
  const form = new FormData();
  form.append('base64Image', `data:image/jpeg;base64,${base64Jpeg}`);
  form.append('language', 'eng');
  form.append('isTable', 'true'); // return line-by-line, which suits report-card tables
  form.append('OCREngine', '2');
  form.append('scale', 'true');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(OCR_ENDPOINT, {
      method: 'POST',
      headers: { apikey: OCR_API_KEY },
      body: form,
      signal: controller.signal,
    });
  } catch (e) {
    if (e?.name === 'AbortError') throw new OcrError('timeout', 'The scan took too long.');
    throw new OcrError('network', 'No internet connection.');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) throw new OcrError('service', `OCR service error (${response.status}).`);
  const json = await response.json();
  if (json.IsErroredOnProcessing) {
    const msg = Array.isArray(json.ErrorMessage) ? json.ErrorMessage.join(' ') : json.ErrorMessage;
    throw new OcrError('service', msg || 'The OCR service could not read this image.');
  }
  return (json.ParsedResults || []).map((r) => r.ParsedText || '').join('\n');
}

// Full pipeline used by ScanScreen.
export async function scanReportCard(uri, width) {
  const prepared = await prepareImage(uri, width);
  const rawText = await recognizeText(prepared.base64);
  return { grades: parseReportCardText(rawText), rawText, imageUri: prepared.uri };
}

export function describeScanError(e) {
  if (e instanceof OcrError) {
    if (e.kind === 'network') return 'No internet connection. Connect to the internet and try again, or enter your marks manually.';
    if (e.kind === 'timeout') return 'The scan took too long. Try again with a smaller or clearer photo, or enter your marks manually.';
    return `${e.message} You can try again or enter your marks manually.`;
  }
  return 'Something went wrong while processing the photo. Please try again.';
}
