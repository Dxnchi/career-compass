import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Image as ImageIcon, PenLine } from 'lucide-react-native';
import { scanReportCard, describeScanError } from '../lib/ocr';
import { manualEntryTemplate } from '../lib/grades';

export default function ScanScreen({ onCancel, onClose, onScanComplete }) {
  const handleExit = onCancel || onClose || (() => {});
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [torch, setTorch] = useState(false);
  const [busy, setBusy] = useState(false);
  const [previewUri, setPreviewUri] = useState(null);
  const [error, setError] = useState(null);

  const finish = (grades, meta) => {
    if (typeof onScanComplete === 'function') onScanComplete(grades, meta);
  };

  const processImage = async (uri, width) => {
    setError(null);
    setPreviewUri(uri);
    setBusy(true);
    try {
      const { grades, rawText, imageUri } = await scanReportCard(uri, width);
      if (grades.length === 0) {
        setError(
          "We couldn't find any subjects in that photo. Make sure the whole report is in the frame, flat and well lit, and try again."
        );
        return;
      }
      finish(grades, { imageUri, rawText, source: 'ocr' });
    } catch (e) {
      setError(describeScanError(e));
    } finally {
      setBusy(false);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || !cameraReady || busy) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      await processImage(photo.uri, photo.width);
    } catch {
      setError('Could not take the photo. Please try again.');
    }
  };

  const pickFromGallery = async () => {
    if (busy) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      await processImage(asset.uri, asset.width);
    } catch {
      setError('Could not open your photo library. Please try again.');
    }
  };

  const enterManually = () => finish(manualEntryTemplate(), { imageUri: null, rawText: '', source: 'manual' });

  const retry = () => {
    setError(null);
    setPreviewUri(null);
  };

  const renderViewfinder = () => {
    if (previewUri) {
      return (
        <>
          <Image source={{ uri: previewUri }} style={styles.preview} resizeMode="cover" />
          {busy && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.processingText}>Reading your subjects...</Text>
            </View>
          )}
        </>
      );
    }
    if (!permission) {
      return <ActivityIndicator size="large" color="#3b82f6" />;
    }
    if (!permission.granted) {
      return (
        <View style={styles.permissionWrap}>
          <Camera color="#60a5fa" size={36} />
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionText}>
            Career Compass uses your camera to photograph your report card. You can also upload a photo instead.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => (permission.canAskAgain ? requestPermission() : Linking.openSettings())}
          >
            <Text style={styles.primaryBtnText}>{permission.canAskAgain ? 'Allow camera' : 'Open settings'}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        enableTorch={torch}
        autofocus="on"
        onCameraReady={() => setCameraReady(true)}
        onMountError={() => setError('The camera could not start. Try uploading a photo instead.')}
      />
    );
  };

  const canCapture = permission?.granted && cameraReady && !busy && !previewUri;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleExit} disabled={busy}>
          <X color="#f4f4f5" size={20} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Scan Report Card</Text>
        <TouchableOpacity style={styles.offlinePill} onPress={() => setTorch((t) => !t)} disabled={!permission?.granted}>
          <Text style={styles.offlineText}>{torch ? 'Light on' : 'Light off'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.viewfinderContainer}>
        <View style={styles.targetFrame}>
          {renderViewfinder()}
          <View pointerEvents="none" style={[styles.corner, styles.tl]} />
          <View pointerEvents="none" style={[styles.corner, styles.tr]} />
          <View pointerEvents="none" style={[styles.corner, styles.bl]} />
          <View pointerEvents="none" style={[styles.corner, styles.br]} />
        </View>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={retry}>
              <Text style={styles.errorLink}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.hint}>Lay the report flat, fit all subjects inside the frame, and avoid glare.</Text>
        )}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.captureBtn, !canCapture && styles.captureBtnDisabled]}
          onPress={takePhoto}
          disabled={!canCapture}
        >
          <Camera color="#ffffff" size={32} />
        </TouchableOpacity>
        <View style={styles.row}>
          <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery} disabled={busy}>
            <ImageIcon color="#60a5fa" size={16} />
            <Text style={styles.galleryText}>Upload from gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryBtn} onPress={enterManually} disabled={busy}>
            <PenLine color="#60a5fa" size={16} />
            <Text style={styles.galleryText}>Enter manually</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', justifyContent: 'space-between', padding: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: { backgroundColor: '#18181b', padding: 8, borderRadius: 20 },
  topTitle: { color: '#f4f4f5', fontSize: 16, fontWeight: 'bold' },
  offlinePill: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  offlineText: { color: '#60a5fa', fontSize: 11, fontWeight: '600' },
  viewfinderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 },
  targetFrame: { width: 300, height: 400, borderWidth: 1, borderColor: '#27272a', borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' },
  camera: { ...StyleSheet.absoluteFillObject },
  preview: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', gap: 12 },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: '#3b82f6' },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  processingText: { color: '#93c5fd', fontWeight: '600', fontSize: 13 },
  hint: { color: '#71717a', fontSize: 12, textAlign: 'center', paddingHorizontal: 24 },
  errorBox: { backgroundColor: '#2a1215', borderColor: '#7f1d1d', borderWidth: 1, borderRadius: 12, padding: 12, width: 300, gap: 6 },
  errorText: { color: '#fca5a5', fontSize: 12, lineHeight: 17 },
  errorLink: { color: '#60a5fa', fontSize: 12, fontWeight: '700' },
  permissionWrap: { alignItems: 'center', padding: 20, gap: 10 },
  permissionTitle: { color: '#f4f4f5', fontSize: 15, fontWeight: 'bold' },
  permissionText: { color: '#a1a1aa', fontSize: 12, textAlign: 'center', lineHeight: 17 },
  primaryBtn: { backgroundColor: '#2563eb', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, marginTop: 4 },
  primaryBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  bottomBar: { alignItems: 'center', paddingBottom: 20, gap: 12 },
  row: { flexDirection: 'row', gap: 10 },
  captureBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  captureBtnDisabled: { backgroundColor: '#1e3a8a' },
  galleryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#18181b', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  galleryText: { color: '#d4d4d8', fontSize: 12, fontWeight: '600' },
});
