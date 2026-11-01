// Local persistence for confirmed scans (AsyncStorage). Small CRUD so "scanned, corrected and saved" works end to end.
// If someone else owns the "Scan CRUD" task, they can replace this file; the app only calls saveScan() today.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'careercompass.scans.v1';

export async function getScans() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeScans(scans) {
  await AsyncStorage.setItem(KEY, JSON.stringify(scans));
}

export async function saveScan({ grades, imageUri = null, rawText = '', source = 'ocr' }) {
  const scans = await getScans();
  const scan = {
    id: `scan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    source, // 'ocr' | 'manual'
    imageUri,
    rawText,
    grades,
  };
  await writeScans([scan, ...scans]);
  return scan;
}

export async function updateScan(id, patch) {
  const scans = await getScans();
  const next = scans.map((s) => (s.id === id ? { ...s, ...patch } : s));
  await writeScans(next);
  return next.find((s) => s.id === id) || null;
}

export async function deleteScan(id) {
  const scans = await getScans();
  await writeScans(scans.filter((s) => s.id !== id));
}
