import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { X, CheckSquare, Square, ExternalLink, ShieldCheck } from 'lucide-react-native';

export default function ApplicationModal({ visible, program, onClose }) {
  const [checklist, setChecklist] = useState({
    idCopy: true,
    reportCard: true,
    nbt: false,
    nsfas: false,
  });
  const [ready, setReady] = useState(false);

  if (!program) return null;

  const toggleItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Application Checklist</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color="#a1a1aa" size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.programName}>{program.title}</Text>
          <Text style={styles.uniName}>{program.universityName}</Text>

          <View style={styles.list}>
            {[
              { id: 'idCopy', label: 'Certified Copy of ID / Smart Card' },
              { id: 'reportCard', label: 'Verified Grade 11 / Term Report' },
              { id: 'nbt', label: 'National Benchmark Test (NBT) Reg' },
              { id: 'nsfas', label: 'NSFAS Financial Aid Application' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checkRow}
                onPress={() => toggleItem(item.id)}
              >
                {checklist[item.id] ? (
                  <CheckSquare color="#3b82f6" size={20} />
                ) : (
                  <Square color="#71717a" size={20} />
                )}
                <Text style={styles.checkText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {ready ? (
            <View style={styles.successBox}>
              <ShieldCheck color="#34d399" size={20} />
              <Text style={styles.successText}>Application dossier packaged.</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => setReady(true)}
            >
              <Text style={styles.submitBtnText}>Verify & Package Profile</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.closeAction} onPress={onClose}>
            <Text style={styles.closeActionText}>Close Window</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#f4f4f5',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#18181b',
    borderRadius: 16,
  },
  programName: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  uniName: {
    color: '#a1a1aa',
    fontSize: 13,
    marginBottom: 16,
  },
  list: {
    marginVertical: 10,
    gap: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#141416',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  checkText: {
    color: '#f4f4f5',
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  successBox: {
    backgroundColor: '#064e3b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
  },
  successText: {
    color: '#34d399',
    fontWeight: '600',
    fontSize: 13,
  },
  closeAction: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 6,
  },
  closeActionText: {
    color: '#a1a1aa',
    fontSize: 13,
  },
});