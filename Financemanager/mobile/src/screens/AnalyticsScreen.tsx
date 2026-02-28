import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

const monthlyData = [
    { value: 4200, label: 'Oct', frontColor: colors.primary },
    { value: 3800, label: 'Nov', frontColor: colors.primary },
    { value: 5400, label: 'Dec', frontColor: '#ef4444' },
    { value: 4600, label: 'Jan', frontColor: colors.primary },
    { value: 3200, label: 'Feb', frontColor: colors.success },
];

const categoryData = [
    { value: 1200, text: 'Food', color: '#6366f1', textColor: colors.textSecondary, textSize: 10 },
    { value: 2000, text: 'Rent', color: '#818cf8', textColor: colors.textSecondary, textSize: 10 },
    { value: 400, text: 'Transport', color: '#a5b4fc', textColor: colors.textSecondary, textSize: 10 },
    { value: 600, text: 'Fun', color: '#c7d2fe', textColor: colors.textSecondary, textSize: 10 },
];

const topMerchants = [
    { name: 'Amazon', amount: 1240.50, count: 8 },
    { name: 'Starbucks', amount: 156.20, count: 12 },
    { name: 'Whole Foods', amount: 840.00, count: 4 },
    { name: 'Uber', amount: 245.75, count: 15 },
    { name: 'Apple', amount: 999.00, count: 1 },
];

export default function AnalyticsScreen() {
    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Analytics</Text>
                <Text style={styles.subtitle}>Detailed breakdown of your financial habits.</Text>

                {/* Cash Flow History */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBadge, { backgroundColor: colors.primaryDim }]}>
                            <Ionicons name="trending-up" size={16} color={colors.primaryLight} />
                        </View>
                        <Text style={styles.cardTitle}>Cash Flow History</Text>
                    </View>
                    <BarChart
                        data={monthlyData}
                        width={280}
                        height={200}
                        barWidth={36}
                        spacing={20}
                        barBorderRadius={6}
                        noOfSections={4}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 11, fontWeight: '600' }}
                        yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
                        hideRules
                        backgroundColor="transparent"
                        isAnimated
                    />
                </View>

                {/* Category Breakdown */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBadge, { backgroundColor: colors.accentDim }]}>
                            <Ionicons name="pie-chart" size={16} color={colors.accent} />
                        </View>
                        <Text style={styles.cardTitle}>Categories</Text>
                    </View>
                    <View style={styles.pieWrap}>
                        <PieChart
                            data={categoryData}
                            donut
                            innerRadius={55}
                            radius={80}
                            innerCircleColor={colors.background}
                            centerLabelComponent={() => (
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>$4,200</Text>
                                    <Text style={{ fontSize: 10, color: colors.textSecondary }}>Total</Text>
                                </View>
                            )}
                        />
                    </View>
                    <View style={styles.legend}>
                        {categoryData.map((item, i) => (
                            <View key={i} style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                <Text style={styles.legendText}>{item.text} · ${item.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Top Merchants */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBadge, { backgroundColor: colors.successDim }]}>
                            <Ionicons name="business" size={16} color={colors.success} />
                        </View>
                        <Text style={styles.cardTitle}>Top Merchants</Text>
                    </View>
                    {topMerchants.map((m, i) => (
                        <View key={i} style={styles.merchantRow}>
                            <View style={styles.merchantAvatar}>
                                <Text style={styles.merchantInitial}>{m.name[0]}</Text>
                            </View>
                            <View style={styles.merchantInfo}>
                                <Text style={styles.merchantName}>{m.name}</Text>
                                <Text style={styles.merchantCount}>{m.count} transactions</Text>
                            </View>
                            <Text style={styles.merchantAmount}>${m.amount.toLocaleString()}</Text>
                        </View>
                    ))}
                </View>

                {/* Health Score */}
                <View style={styles.healthCard}>
                    <View style={styles.healthBadge}>
                        <Text style={styles.healthBadgeText}>PHASE 2 ANALYTICS</Text>
                    </View>
                    <Text style={styles.healthTitle}>Health Score: 84/100</Text>
                    <Text style={styles.healthSubtitle}>
                        You're in the top 15% of savers this month! Your spending on non-essentials is down 12%.
                    </Text>
                </View>

                <View style={{ height: spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, gap: spacing.md },
    title: { fontSize: fontSize.xxl, fontWeight: fontWeight.black, color: colors.text, letterSpacing: -0.5 },
    subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm },
    card: {
        backgroundColor: colors.surface, borderRadius: borderRadius.xl,
        borderWidth: 1, borderColor: colors.surfaceBorder, paddingVertical: spacing.lg,
    },
    cardHeader: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
        paddingHorizontal: spacing.lg, marginBottom: spacing.md,
    },
    cardTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text },
    iconBadge: { width: 32, height: 32, borderRadius: borderRadius.sm, justifyContent: 'center', alignItems: 'center' },
    pieWrap: { alignItems: 'center', paddingVertical: spacing.sm },
    legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, marginTop: spacing.sm },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: fontSize.sm, color: colors.textSecondary },
    merchantRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2,
    },
    merchantAvatar: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: colors.primaryDim, justifyContent: 'center', alignItems: 'center',
        marginRight: spacing.md,
    },
    merchantInitial: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.primaryLight },
    merchantInfo: { flex: 1 },
    merchantName: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.text },
    merchantCount: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 1 },
    merchantAmount: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
    healthCard: {
        borderRadius: borderRadius.xl, padding: spacing.xl,
        backgroundColor: colors.cardGradientStart,
        borderWidth: 1, borderColor: colors.surfaceBorder,
        alignItems: 'center',
    },
    healthBadge: {
        paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
        borderRadius: borderRadius.full, backgroundColor: colors.primaryDim,
        marginBottom: spacing.md,
    },
    healthBadgeText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.primaryLight, letterSpacing: 1 },
    healthTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.black, color: colors.text, textAlign: 'center' },
    healthSubtitle: { fontSize: fontSize.md, color: colors.primaryLight, textAlign: 'center', marginTop: spacing.sm, opacity: 0.7, lineHeight: 22 },
});
