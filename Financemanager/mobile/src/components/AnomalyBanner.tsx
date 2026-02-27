import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

interface Props {
    description: string;
    amount: number;
    onDismiss?: () => void;
}

export default function AnomalyBanner({ description, amount, onDismiss }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrap}>
                <Ionicons name="alert-circle" size={22} color={colors.danger} />
            </View>
            <View style={styles.info}>
                <Text style={styles.title}>Anomaly Detected</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {description} — ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
            </View>
            {onDismiss && (
                <TouchableOpacity onPress={onDismiss} style={styles.dismiss}>
                    <Ionicons name="close" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.dangerDim,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.25)',
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(239,68,68,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.danger,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: fontSize.sm,
        color: colors.text,
        marginTop: 2,
        opacity: 0.9,
    },
    dismiss: {
        padding: spacing.xs,
        marginLeft: spacing.sm,
    },
});
