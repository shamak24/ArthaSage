import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';
import { Transaction } from '../types';
import { uploadCSV } from '../services/api';
import TransactionItem from '../components/TransactionItem';

export default function ImportScreen() {
    const navigation = useNavigation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'text/csv',
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            setError(null);
            setSuccess(false);
            setUploading(true);

            try {
                const txs = await uploadCSV(asset.uri, asset.name);
                setTransactions(txs);
                setSuccess(true);
            } catch (err: any) {
                const detail = err?.response?.data?.detail || err?.message || 'Upload failed. Check CSV format.';
                setError(detail);
            } finally {
                setUploading(false);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <SafeAreaView style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Import Data</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Upload Area */}
            <View style={styles.content}>
                <TouchableOpacity style={styles.dropzone} onPress={pickFile} disabled={uploading}>
                    {uploading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <>
                            <View style={styles.dropzoneIcon}>
                                <Ionicons name="cloud-upload-outline" size={40} color={colors.primaryLight} />
                            </View>
                            <Text style={styles.dropzoneTitle}>Select CSV File</Text>
                            <Text style={styles.dropzoneSubtitle}>
                                Tap to browse your files{'\n'}Supports bank statement CSVs
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Error */}
                {error && (
                    <View style={styles.alert}>
                        <Ionicons name="alert-circle" size={20} color={colors.danger} />
                        <View style={styles.alertContent}>
                            <Text style={styles.alertTitle}>Upload Failed</Text>
                            <Text style={styles.alertMessage}>{error}</Text>
                        </View>
                    </View>
                )}

                {/* Success */}
                {success && (
                    <View style={styles.successAlert}>
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <View style={styles.alertContent}>
                            <Text style={styles.successTitle}>Upload Successful</Text>
                            <Text style={styles.successMessage}>{transactions.length} transactions imported.</Text>
                        </View>
                    </View>
                )}

                {/* Results */}
                {transactions.length > 0 && (
                    <View style={styles.resultsCard}>
                        <Text style={styles.resultHeader}>
                            Parsed Transactions ({transactions.length})
                        </Text>
                        <FlatList
                            data={transactions}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <TransactionItem transaction={item} />}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                )}

                {transactions.length === 0 && !uploading && (
                    <View style={styles.empty}>
                        <Ionicons name="document-text-outline" size={40} color={colors.textTertiary} />
                        <Text style={styles.emptyText}>No data loaded yet.</Text>
                    </View>
                )}
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
    dropzone: {
        backgroundColor: colors.surface, borderRadius: borderRadius.xl,
        borderWidth: 2, borderColor: colors.surfaceBorder, borderStyle: 'dashed',
        paddingVertical: spacing.xxl, alignItems: 'center', justifyContent: 'center',
    },
    dropzoneIcon: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: colors.primaryDim, justifyContent: 'center', alignItems: 'center',
        marginBottom: spacing.md,
    },
    dropzoneTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
    dropzoneSubtitle: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs, lineHeight: 20 },
    alert: {
        flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
        backgroundColor: colors.dangerDim, borderRadius: borderRadius.md,
        borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', padding: spacing.md,
    },
    alertContent: { flex: 1 },
    alertTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.danger },
    alertMessage: { fontSize: fontSize.xs, color: colors.text, opacity: 0.8, marginTop: 2 },
    successAlert: {
        flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
        backgroundColor: colors.successDim, borderRadius: borderRadius.md,
        borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)', padding: spacing.md,
    },
    successTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.success },
    successMessage: { fontSize: fontSize.xs, color: colors.text, opacity: 0.8, marginTop: 2 },
    resultsCard: {
        flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.xl,
        borderWidth: 1, borderColor: colors.surfaceBorder, overflow: 'hidden',
    },
    resultHeader: {
        fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.text,
        paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
        borderBottomWidth: 1, borderBottomColor: colors.surfaceBorder,
    },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    emptyText: { color: colors.textTertiary, fontSize: fontSize.md },
});
