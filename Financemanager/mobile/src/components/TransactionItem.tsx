import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { Transaction } from '../types';

interface Props {
    transaction: Transaction;
}

export default function TransactionItem({ transaction }: Props) {
    const isAnomaly = transaction.is_anomaly;

    const getCategoryIcon = (category?: string): keyof typeof Ionicons.glyphMap => {
        switch (category?.toLowerCase()) {
            case 'food & dining': return 'restaurant-outline';
            case 'transportation': return 'car-outline';
            case 'utilities': return 'flash-outline';
            case 'shopping': return 'bag-outline';
            case 'entertainment': return 'game-controller-outline';
            case 'income': return 'trending-up-outline';
            case 'health': return 'heart-outline';
            case 'housing': return 'home-outline';
            default: return 'card-outline';
        }
    };

    return (
        <View style={[styles.container, isAnomaly && styles.anomaly]}>
            <View style={[styles.iconWrap, isAnomaly && styles.anomalyIcon]}>
                <Ionicons
                    name={isAnomaly ? 'warning-outline' : getCategoryIcon(transaction.category)}
                    size={18}
                    color={isAnomaly ? colors.danger : colors.primaryLight}
                />
            </View>
            <View style={styles.info}>
                <Text style={styles.description} numberOfLines={1}>
                    {transaction.description}
                </Text>
                <Text style={styles.meta}>
                    {transaction.category || 'Uncategorized'} · {transaction.date}
                </Text>
            </View>
            <View style={styles.amountWrap}>
                <Text style={[styles.amount, isAnomaly && styles.anomalyAmount]}>
                    ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
                {isAnomaly && (
                    <Text style={styles.anomalyLabel}>Anomaly</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    anomaly: {
        backgroundColor: colors.dangerDim,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primaryDim,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    anomalyIcon: {
        backgroundColor: colors.dangerDim,
    },
    info: {
        flex: 1,
        marginRight: spacing.sm,
    },
    description: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.text,
    },
    meta: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    amountWrap: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.text,
    },
    anomalyAmount: {
        color: colors.danger,
    },
    anomalyLabel: {
        fontSize: fontSize.xs,
        color: colors.danger,
        fontWeight: fontWeight.bold,
        marginTop: 2,
    },
});
