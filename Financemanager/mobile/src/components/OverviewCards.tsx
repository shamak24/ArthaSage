import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

interface Props {
    totalSpend: number;
    budget: number;
    anomalyCount: number;
}

export default function OverviewCards({ totalSpend, budget, anomalyCount }: Props) {
    const budgetPercent = Math.min(100, Math.round((totalSpend / budget) * 100));
    const remaining = Math.max(0, budget - totalSpend);

    const cards = [
        {
            label: 'Total Spent',
            value: `$${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: 'wallet-outline' as keyof typeof Ionicons.glyphMap,
            color: colors.primary,
            bgColor: colors.primaryDim,
        },
        {
            label: 'Budget Left',
            value: `$${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: 'shield-checkmark-outline' as keyof typeof Ionicons.glyphMap,
            color: colors.success,
            bgColor: colors.successDim,
            sub: `${budgetPercent}% used`,
        },
        {
            label: 'Anomalies',
            value: `${anomalyCount}`,
            icon: 'alert-circle-outline' as keyof typeof Ionicons.glyphMap,
            color: anomalyCount > 0 ? colors.danger : colors.success,
            bgColor: anomalyCount > 0 ? colors.dangerDim : colors.successDim,
            sub: anomalyCount > 0 ? 'Needs review' : 'All clear',
        },
    ];

    return (
        <View style={styles.row}>
            {cards.map((card) => (
                <View key={card.label} style={styles.card}>
                    <View style={[styles.iconWrap, { backgroundColor: card.bgColor }]}>
                        <Ionicons name={card.icon} size={20} color={card.color} />
                    </View>
                    <Text style={styles.label}>{card.label}</Text>
                    <Text style={styles.value}>{card.value}</Text>
                    {card.sub && <Text style={styles.sub}>{card.sub}</Text>}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    card: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        padding: spacing.md,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    label: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    value: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.black,
        color: colors.text,
        marginTop: 2,
    },
    sub: {
        fontSize: fontSize.xs,
        color: colors.textTertiary,
        marginTop: 2,
    },
});
