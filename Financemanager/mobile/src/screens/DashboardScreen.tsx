import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, FlatList, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { Transaction } from '../types';
import { getTransactions, seedDemo } from '../services/api';
import OverviewCards from '../components/OverviewCards';
import AnomalyBanner from '../components/AnomalyBanner';
import TransactionItem from '../components/TransactionItem';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
    const navigation = useNavigation<NavProp>();
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const txs = await getTransactions();
            setData(txs);
        } catch (e) {
            console.error('Failed to fetch transactions', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const onRefresh = () => { setRefreshing(true); fetchData(); };

    // Metrics
    const totalSpend = data.reduce((acc, tx) => acc + tx.amount, 0);
    const anomalies = data.filter(tx => tx.is_anomaly);

    // Category data for PieChart
    const categoryMap = data.reduce((acc, tx) => {
        const cat = tx.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + tx.amount;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryMap).map(([name, value], i) => ({
        value,
        text: name.length > 8 ? name.substring(0, 8) + '..' : name,
        color: colors.chart[i % colors.chart.length],
        textColor: colors.textSecondary,
        textSize: 10,
    }));

    // Trend data for BarChart
    const trendMap = data.reduce((acc, tx) => {
        const d = tx.date?.substring(5) || 'N/A'; // MM-DD
        acc[d] = (acc[d] || 0) + tx.amount;
        return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(trendMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, value]) => ({
            value,
            label: label.length > 5 ? label.substring(0, 5) : label,
            frontColor: colors.primary,
            topLabelComponent: () => null,
        }));

    if (loading) {
        return (
            <SafeAreaView style={styles.screen}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Overview</Text>
                        <Text style={styles.subtitle}>Welcome back, here's your financial health today.</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('ConnectAccount')}>
                            <Ionicons name="link-outline" size={16} color={colors.primary} />
                            <Text style={styles.headerBtnText}>Connect</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Import')}>
                            <Ionicons name="cloud-upload-outline" size={16} color={colors.primary} />
                            <Text style={styles.headerBtnText}>Import</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.headerBtn}
                            onPress={async () => {
                                setLoading(true);
                                try { await seedDemo(); } catch { }
                                fetchData();
                            }}
                        >
                            <Ionicons name="server-outline" size={16} color={colors.primary} />
                            <Text style={styles.headerBtnText}>Demo</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Anomaly Banner */}
                {anomalies.length > 0 && (
                    <AnomalyBanner
                        description={anomalies[0].description}
                        amount={anomalies[0].amount}
                    />
                )}

                {/* Overview Cards */}
                <OverviewCards totalSpend={totalSpend} budget={5000} anomalyCount={anomalies.length} />

                {/* Spending Trend Chart */}
                {barData.length > 0 && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconBadge, { backgroundColor: colors.primaryDim }]}>
                                <Ionicons name="trending-up" size={16} color={colors.primaryLight} />
                            </View>
                            <Text style={styles.cardTitle}>Spending Trend</Text>
                        </View>
                        <BarChart
                            data={barData}
                            width={280}
                            height={180}
                            barWidth={24}
                            spacing={16}
                            barBorderRadius={6}
                            noOfSections={4}
                            yAxisThickness={0}
                            xAxisThickness={0}
                            xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
                            yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
                            hideRules
                            backgroundColor="transparent"
                            isAnimated
                        />
                    </View>
                )}

                {/* Category Breakdown */}
                {pieData.length > 0 && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconBadge, { backgroundColor: colors.accentDim }]}>
                                <Ionicons name="pie-chart" size={16} color={colors.accent} />
                            </View>
                            <Text style={styles.cardTitle}>Categories</Text>
                        </View>
                        <View style={styles.pieWrap}>
                            <PieChart
                                data={pieData}
                                donut
                                innerRadius={50}
                                radius={70}
                                innerCircleColor={colors.background}
                                centerLabelComponent={() => (
                                    <View style={styles.pieCenter}>
                                        <Text style={styles.pieCenterValue}>${Math.round(totalSpend)}</Text>
                                        <Text style={styles.pieCenterLabel}>Total</Text>
                                    </View>
                                )}
                            />
                        </View>
                        {/* Legend */}
                        <View style={styles.legend}>
                            {pieData.map((item, i) => (
                                <View key={i} style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                    <Text style={styles.legendText}>{item.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Recent Transactions */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Recent Transactions</Text>
                    </View>
                    {data.slice(0, 5).map((tx) => (
                        <TransactionItem key={tx.id} transaction={tx} />
                    ))}
                    {data.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="receipt-outline" size={32} color={colors.textTertiary} />
                            <Text style={styles.emptyText}>No transactions yet. Import a CSV or load demo data.</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scroll: { flex: 1 },
    content: { padding: spacing.lg, gap: spacing.md },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
    title: { fontSize: fontSize.xxl, fontWeight: fontWeight.black, color: colors.text, letterSpacing: -0.5 },
    subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 },
    headerActions: { flexDirection: 'row', gap: spacing.sm },
    headerBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
        borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.surfaceBorder,
        backgroundColor: colors.surface,
    },
    headerBtnText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold },
    card: {
        backgroundColor: colors.surface, borderRadius: borderRadius.xl,
        borderWidth: 1, borderColor: colors.surfaceBorder, paddingVertical: spacing.lg,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
        paddingHorizontal: spacing.lg, marginBottom: spacing.md,
    },
    cardTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text },
    iconBadge: { width: 32, height: 32, borderRadius: borderRadius.sm, justifyContent: 'center', alignItems: 'center' },
    pieWrap: { alignItems: 'center', paddingVertical: spacing.sm },
    pieCenter: { alignItems: 'center' },
    pieCenterValue: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
    pieCenterLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
    legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, marginTop: spacing.sm },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: fontSize.xs, color: colors.textSecondary },
    emptyState: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
    emptyText: { fontSize: fontSize.sm, color: colors.textTertiary, textAlign: 'center' },
});
