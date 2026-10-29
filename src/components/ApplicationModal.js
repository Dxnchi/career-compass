import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import { X, CheckSquare, Square, ExternalLink, ShieldCheck } from 'lucide-react-native';

// Portal mapping for major South African universities
const UNIVERSITY_PORTALS = {
  'UJ': 'https://www.uj.ac.za/admissions-aid/apply/',
  'Wits': 'https://www.wits.ac.za/undergraduate/apply-to-wits/',
  'UCT': 'https://applyonline.uct.ac.za/',
  'UP': 'https://www.up.ac.za/online-application',
  'Stellenbosch': 'https://www.sun.ac.za/english/matrics',
  'SUN': 'https://www.sun.ac.za/english/matrics',
  'NWU': 'https://studies.nwu.ac.za/undergraduate-studies/apply',
  'UKZN': 'https://applications.ukzn.ac.za/',
  'UWC': 'https://www.uwc.ac.za/apply-now',
};

export default function ApplicationModal({ visible, program, onClose }) {
  const [checklist, setChecklist] = useState({
    idCopy: true,
    reportCard: true,
    nbt: false,
    nsfas: false,
  });
  const [ready, setReady] = useState(false);

  // Reset completion state when opening for a new program
  useEffect(() => {
    if (visible) {
      setReady(false);
    }
  }, [visible, program?.id]);

  if (!program) return null;

  const toggleItem = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenPortal = async () => {
    const code = program.universityShort || '';
    const name = program.universityName || '';
    
    // Determine the best URL match
    const targetUrl = 
      program.applicationUrl || 
      UNIVERSITY_PORTALS[code] || 
      (name.toLowerCase().includes('johannesburg') ? UNIVERSITY_PORTALS['UJ'] : null) ||
      (name.toLowerCase().includes('cape town') ? UNIVERSITY_PORTALS['UCT'] : null) ||
      (name.toLowerCase().includes('witwatersrand') ? UNIVERSITY_PORTALS['Wits'] : null) ||
      (name.toLowerCase().includes('pretoria') ? UNIVERSITY_PORTALS['UP'] : null) ||
      'https://www.google.com/search?q=' + encodeURIComponent(`${name} online application portal`);

    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
      } else {
        Alert.alert('Unable to open browser', 'Please visit the university portal directly.');
      }
    } catch (err) {
      console.error('Error opening portal URL:', err);
    }
  };

  const programTitle = program.title || program.name || 'Degree Programme';
  const universityName = program.universityName || 'South African University';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Pre-Application Checklist</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color="#a1a1aa" size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.programName}>{programTitle}</Text>
          <Text style={styles.uniName}>{universityName}</Text>

          <View style={styles.list}>
            {[
              { id: 'idCopy', label: 'Certified Copy of ID / Smart Card' },
              { id: 'reportCard', label: 'Verified Grade 11 / Final NSC Statement' },
              { id: 'nbt', label: 'National Benchmark Test (NBT) Registration' },
              { id: 'nsfas', label: 'NSFAS Financial Aid Application Linked' },
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
            <View style={styles.readyContainer}>
              <View style={styles.successBox}>
                <ShieldCheck color="#34d399" size={20} />
                <Text style={styles.successText}>Dossier Ready for Submission</Text>
              </View>

              <TouchableOpacity style={styles.portalBtn} onPress={handleOpenPortal}>
                <Text style={styles.portalBtnText}>Open {program.universityShort || 'University'} Application Portal</Text>
                <ExternalLink color="#ffffff" size={16} />
              </TouchableOpacity>
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
  readyContainer: {
    marginTop: 14,
    gap: 10,
  },
  successBox: {
    backgroundColor: '#064e3b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  successText: {
    color: '#34d399',
    fontWeight: '600',
    fontSize: 13,
  },
  portalBtn: {
    backgroundColor: '#1d4ed8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  portalBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
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
