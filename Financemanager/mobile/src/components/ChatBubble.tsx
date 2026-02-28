import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

interface Props {
    role: 'ai' | 'user';
    text: string;
}

export default function ChatBubble({ role, text }: Props) {
    const isAI = role === 'ai';

    return (
        <View style={[styles.container, isAI ? styles.aiAlign : styles.userAlign]}>
            {isAI && (
                <View style={styles.aiAvatar}>
                    <Ionicons name="sparkles" size={14} color={colors.primaryLight} />
                </View>
            )}
            <View style={[styles.bubble, isAI ? styles.aiBubble : styles.userBubble]}>
                <Text style={[styles.text, isAI ? styles.aiText : styles.userText]}>{text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        paddingHorizontal: spacing.md,
    },
    aiAlign: {
        justifyContent: 'flex-start',
    },
    userAlign: {
        justifyContent: 'flex-end',
    },
    aiAvatar: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primaryDim,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
        marginTop: 4,
    },
    bubble: {
        maxWidth: '78%',
        padding: spacing.md,
        borderRadius: borderRadius.xl,
    },
    aiBubble: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        borderTopLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: colors.primary,
        borderTopRightRadius: 4,
    },
    text: {
        fontSize: fontSize.md,
        lineHeight: 22,
    },
    aiText: {
        color: colors.text,
    },
    userText: {
        color: '#fff',
    },
});
