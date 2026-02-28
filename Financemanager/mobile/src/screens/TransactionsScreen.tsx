import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, FlatList,
    ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { Transaction } from '../types';
import { getTransactions } from '../services/api';
import TransactionItem from '../components/TransactionItem';

export default function TransactionsScreen() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filtered, setFiltered] = useState<Transaction[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState('All');
    const [loading, setLoading] = useState(true);
    const [showCatPicker, setShowCatPicker] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const txs = await getTransactions();
                setTransactions(txs);
                setFiltered(txs);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        let result = transactions.filter(tx =>
            tx.description?.toLowerCase().includes(search.toLowerCase()) ||
            tx.category?.toLowerCase().includes(search.toLowerCase())
        );
        if (selectedCat !== 'All') {
            result = result.filter(tx => tx.category === selectedCat);
        }
        setFiltered(result);
    }, [search, selectedCat, transactions]);

    const categories = ['All', ...Array.from(new Set(transactions.map(tx => tx.category || 'Uncategorized')))];

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
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Transactions</Text>
                <Text style={styles.subtitle}>Manage and track your full transaction history.</Text>
            </View>

            {/* Search & Filter */}
            <View style={styles.filterRow}>
                <View style={styles.searchWrap}>
                    <Ionicons name="search" size={16} color={colors.textTertiary} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search transactions..."
                        placeholderTextColor={colors.textTertiary}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <TouchableOpacity
                    style={styles.filterBtn}
                    onPress={() => setShowCatPicker(!showCatPicker)}
                >
                    <Ionicons name="filter" size={16} color={colors.primaryLight} />
                    <Text style={styles.filterBtnText}>{selectedCat}</Text>
                </TouchableOpacity>
            </View>

            {/* Category picker dropdown */}
            {showCatPicker && (
                <View style={styles.catPicker}>
                    {categories.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.catItem, selectedCat === cat && styles.catItemActive]}
                            onPress={() => { setSelectedCat(cat); setShowCatPicker(false); }}
                        >
                            <Text style={[styles.catItemText, selectedCat === cat && styles.catItemTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Transaction List */}
            <View style={styles.listCard}>
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionItem transaction={item} />}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Ionicons name="funnel-outline" size={32} color={colors.textTertiary} />
                            <Text style={styles.emptyText}>No transactions found.</Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
    title: { fontSize: fontSize.xxl, fontWeight: fontWeight.black, color: colors.text, letterSpacing: -0.5 },
    subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 },
    filterRow: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
        paddingHorizontal: spacing.lg, marginBottom: spacing.md,
    },
    searchWrap: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.surface, borderRadius: borderRadius.md,
        borderWidth: 1, borderColor: colors.surfaceBorder,
        paddingHorizontal: spacing.md,
    },
    searchIcon: { marginRight: spacing.sm },
    searchInput: { flex: 1, color: colors.text, fontSize: fontSize.md, paddingVertical: spacing.sm + 2 },
    filterBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: colors.surface, borderRadius: borderRadius.md,
        borderWidth: 1, borderColor: colors.surfaceBorder,
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
    },
    filterBtnText: { color: colors.primaryLight, fontSize: fontSize.sm, fontWeight: fontWeight.medium },
    catPicker: {
        marginHorizontal: spacing.lg, backgroundColor: colors.surface,
        borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.surfaceBorder,
        marginBottom: spacing.sm, padding: spacing.xs,
    },
    catItem: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.sm },
    catItemActive: { backgroundColor: colors.primaryDim },
    catItemText: { color: colors.textSecondary, fontSize: fontSize.sm },
    catItemTextActive: { color: colors.primary, fontWeight: fontWeight.bold },
    listCard: {
        flex: 1, marginHorizontal: spacing.lg, backgroundColor: colors.surface,
        borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.surfaceBorder,
        overflow: 'hidden',
    },
    empty: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
    emptyText: { color: colors.textTertiary, fontSize: fontSize.sm },
});
