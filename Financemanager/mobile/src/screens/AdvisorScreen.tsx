import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    FlatList, ActivityIndicator, KeyboardAvoidingView, Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { ChatMessage } from '../types';
import { chatWithAdvisor } from '../services/api';
import ChatBubble from '../components/ChatBubble';

const SUGGESTIONS = ['Where can I save?', 'Budget update', 'Top categories', 'Anomaly check'];

export default function AdvisorScreen() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        (async () => {
            try {
                const greeting = await chatWithAdvisor(
                    "Hi! Can you give me a deep analysis of my spending and suggest a 3-step savings plan?"
                );
                setMessages([{ role: 'ai', text: greeting }]);
            } catch {
                setMessages([{
                    role: 'ai',
                    text: "Hello! I'm your FinAI Financial Advisor. How can I help you today?",
                }]);
            } finally {
                setInitialLoading(false);
            }
        })();
    }, []);

    const sendMessage = async (textOverride?: string) => {
        const msg = textOverride || input.trim();
        if (!msg || loading) return;

        const userMsg: ChatMessage = { role: 'user', text: msg };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await chatWithAdvisor(msg);
            setMessages(prev => [...prev, { role: 'ai', text: response }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "Sorry, I couldn't process that. Is the backend running?",
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.botAvatar}>
                        <Ionicons name="sparkles" size={20} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>AI Advisor</Text>
                        <View style={styles.statusRow}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Interactive Context Active</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setMessages([])} style={styles.clearBtn}>
                    <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={styles.chatArea}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                {/* Messages */}
                {initialLoading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(_, i) => String(i)}
                        renderItem={({ item }) => <ChatBubble role={item.role} text={item.text} />}
                        contentContainerStyle={styles.messageList}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={
                            loading ? (
                                <View style={styles.typingWrap}>
                                    <View style={styles.typingBubble}>
                                        <View style={styles.typingDot} />
                                        <View style={[styles.typingDot, { opacity: 0.7 }]} />
                                        <View style={[styles.typingDot, { opacity: 0.4 }]} />
                                    </View>
                                </View>
                            ) : null
                        }
                    />
                )}

                {/* Suggestions */}
                {!loading && messages.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.suggestions}
                    >
                        {SUGGESTIONS.map(label => (
                            <TouchableOpacity
                                key={label}
                                style={styles.suggestionPill}
                                onPress={() => sendMessage(label)}
                            >
                                <Text style={styles.suggestionText}>{label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Input */}
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type your message..."
                        placeholderTextColor={colors.textTertiary}
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={() => sendMessage()}
                        returnKeyType="send"
                        editable={!loading}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
                        onPress={() => sendMessage()}
                        disabled={!input.trim() || loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="send" size={18} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
        borderBottomWidth: 1, borderBottomColor: colors.surfaceBorder,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    botAvatar: {
        width: 42, height: 42, borderRadius: borderRadius.md,
        backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
    statusText: { fontSize: fontSize.xs, color: colors.textSecondary },
    clearBtn: { padding: spacing.sm },
    chatArea: { flex: 1 },
    messageList: { paddingVertical: spacing.lg },
    typingWrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
    typingBubble: {
        flexDirection: 'row', gap: 4, backgroundColor: colors.surface,
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
        borderRadius: borderRadius.xl, borderTopLeftRadius: 4,
        borderWidth: 1, borderColor: colors.surfaceBorder,
        alignSelf: 'flex-start',
    },
    typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textSecondary },
    suggestions: {
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    suggestionPill: {
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
        borderRadius: borderRadius.full, backgroundColor: colors.surface,
        borderWidth: 1, borderColor: colors.surfaceBorder,
    },
    suggestionText: { fontSize: fontSize.sm, color: colors.primaryLight, fontWeight: fontWeight.medium },
    inputRow: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
        paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
        borderTopWidth: 1, borderTopColor: colors.surfaceBorder,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    textInput: {
        flex: 1, backgroundColor: colors.surface,
        borderWidth: 1, borderColor: colors.surfaceBorder,
        borderRadius: borderRadius.xl, paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 4, color: colors.text, fontSize: fontSize.md,
    },
    sendBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
    },
    sendBtnDisabled: { opacity: 0.4 },
});
