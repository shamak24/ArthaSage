import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

type ConnectionStatus = 'idle' | 'loading' | 'success' | 'error';
type AccountType = 'bank' | 'demat';

export default function ConnectAccountScreen() {
    const navigation = useNavigation();

    const [bankStatus, setBankStatus] = useState<ConnectionStatus>('idle');
    const [dematStatus, setDematStatus] = useState<ConnectionStatus>('idle');

    const handleConnect = (type: AccountType) => {
        const setStatus = type === 'bank' ? setBankStatus : setDematStatus;

        setStatus('loading');

        // Mock connection process
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    const renderCard = (
        title: string,
        subtitle: string,
        icon: keyof typeof Ionicons.glyphMap,
        type: AccountType,
        status: ConnectionStatus
    ) => {
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} size={28} color={colors.primaryLight} />
                    </View>
                    <View style={styles.cardTextContent}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardSubtitle}>{subtitle}</Text>
                    </View>
                </View>

                {status === 'idle' && (
                    <TouchableOpacity
                        style={styles.connectButton}
                        onPress={() => handleConnect(type)}
                    >
                        <Text style={styles.connectButtonText}>Connect securely</Text>
                    </TouchableOpacity>
                )}

                {status === 'loading' && (
                    <View style={styles.statusContainer}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={styles.statusTextLoading}>Connecting securely...</Text>
                    </View>
                )}

                {status === 'success' && (
                    <View style={styles.statusContainer}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text style={styles.statusTextSuccess}>Connected successfully</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Connect Accounts</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Content Area */}
            <View style={styles.content}>
                <Text style={styles.pageDescription}>
                    Securely connect your financial accounts. We use read-only access to analyze your spending and provide insights.
                </Text>

                {/* Bank Card */}
                {renderCard(
                    'Bank Account',
                    'Checking & Savings',
                    'business',
                    'bank',
                    bankStatus
                )}

                {/* Demat Card */}
                {renderCard(
                    'Demat Account',
                    'Stocks, Mutual Funds, ETFs',
                    'trending-up',
                    'demat',
                    dematStatus
                )}

                <View style={styles.infoBanner}>
                    <Ionicons name="shield-checkmark" size={16} color={colors.textSecondary} style={{ marginTop: 2 }} />
                    <Text style={styles.infoText}>
                        Your data is encrypted and secure. We never sell your data or perform trades on your behalf.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
        borderBottomWidth: 1, borderBottomColor: colors.surfaceBorder,
    },
    backBtn: { padding: spacing.xs },
    headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    content: { flex: 1, padding: spacing.lg, gap: spacing.md },
    pageDescription: { fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 22 },

    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        padding: spacing.lg,
        gap: spacing.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primaryDim,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTextContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    connectButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    connectButtonText: {
        color: '#fff',
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.surfaceHover, // or surface logic
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        marginTop: spacing.xs,
    },
    statusTextLoading: {
        color: colors.textSecondary,
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
    },
    statusTextSuccess: {
        color: colors.success,
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        gap: spacing.sm,
        marginTop: spacing.xl,
    },
    infoText: {
        flex: 1,
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        lineHeight: 18,
    }
});
