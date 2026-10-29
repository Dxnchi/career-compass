// src/components/FloatingAdvisorBot.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MessageSquare, X, Send, ShieldCheck } from 'lucide-react-native';
import { getAdvisorResponse } from '../lib/advisorGuardrails';

const QUICK_PROMPTS = [
  'How does APS work?',
  'How do I scan my PDF?',
  'How do I apply to a uni?',
  'Tell me a muffin recipe 🧁', // Great for testing the guardrail live in your presentation!
];

export default function FloatingAdvisorBot({ currentScreen = 'CareerCompass' }) {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hi! I am your CareerCompass Academic Advisor. Ask me about APS scores, SA university requirements, or how to use this app.',
    },
  ]);

  const handleSend = async (overrideText) => {
    const query = (overrideText !== undefined ? overrideText : input).trim();
    if (!query || loading) return;

    const userMsg = { id: `${Date.now()}-u`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (overrideText === undefined) setInput('');
    setLoading(true);

    const replyText = await getAdvisorResponse(query, currentScreen);
    const botMsg = { id: `${Date.now()}-b`, sender: 'bot', text: replyText };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <>
      {/* Global Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <MessageSquare color="#ffffff" size={24} />
      </TouchableOpacity>

      {/* Slide-Up Advisor Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.chatContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <ShieldCheck color="#34d399" size={20} />
                <View>
                  <Text style={styles.headerTitle}>Compass AI Advisor</Text>
                  <Text style={styles.headerSub}>Strict SA Academic & App Guardrails</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <X color="#a1a1aa" size={22} />
              </TouchableOpacity>
            </View>

            {/* Quick Prompt Chips */}
            <View style={styles.chipsRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.chip}
                    onPress={() => handleSend(prompt)}
                  >
                    <Text style={styles.chipText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Messages Area */}
            <ScrollView style={styles.messagesList} contentContainerStyle={{ paddingBottom: 12 }}>
              {messages.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.bubble,
                    m.sender === 'user' ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  <Text style={styles.bubbleText}>{m.text}</Text>
                </View>
              ))}
              {loading && (
                <View style={[styles.bubble, styles.botBubble, { width: 60, alignItems: 'center' }]}>
                  <ActivityIndicator color="#60a5fa" size="small" />
                </View>
              )}
            </ScrollView>

            {/* Input Bar */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Ask about APS, degrees, or app steps..."
                placeholderTextColor="#71717a"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => handleSend()}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
                <Send color="#ffffff" size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 85,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    height: '72%',
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold' },
  headerSub: { color: '#34d399', fontSize: 11 },
  chipsRow: { marginVertical: 10 },
  chip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipText: { color: '#93c5fd', fontSize: 12, fontWeight: '500' },
  messagesList: { flex: 1, marginVertical: 6 },
  bubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 14,
    marginVertical: 4,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#1e293b',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleText: { color: '#f8fafc', fontSize: 13, lineHeight: 19 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    color: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});