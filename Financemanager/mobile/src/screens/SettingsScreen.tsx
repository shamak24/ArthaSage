import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../theme';

const TABS = [
    { label: 'Profile', icon: 'person-outline' as const, active: true },
    { label: 'Budgeting', icon: 'wallet-outline' as const },
    { label: 'Notifications', icon: 'notifications-outline' as const },
    { label: 'AI & Security', icon: 'shield-checkmark-outline' as const },
];

const MODELS = ['Gemini 2.0 Flash (Fastest)', 'Gemini 1.5 Pro (Deepest)', 'Gemini 1.5 Flash (Legacy)'];

export default function SettingsScreen() {
    const [saved, setSaved] = useState(false);
    const [selectedModel, setSelectedModel] = useState(0);
    const [showModelPicker, setShowModelPicker] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Settings</Text>
                <Text style={styles.subtitle}>Manage your account, budget, and AI preferences.</Text>

                {/* Tab Navigation */}
                <View style={styles.tabRow}>
                    {TABS.map(tab => (
                        <TouchableOpacity
                            key={tab.label}
                            style={[styles.tab, tab.active && styles.tabActive]}
                        >
                            <Ionicons
                                name={tab.icon}
                                size={16}
                                color={tab.active ? '#fff' : colors.textSecondary}
                            />
                            <Text style={[styles.tabText, tab.active && styles.tabTextActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Profile Section */}
                <View style={styles.card}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>JD</Text>
                        </View>
                        <View>
                            <Text style={styles.cardTitle}>Personal Profile</Text>
                            <Text style={styles.cardSubtitle}>This info will be used for AI insights.</Text>
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>FULL NAME</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue="John Doe"
                                placeholderTextColor={colors.textTertiary}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <TextInput
                                style={styles.input}
                                defaultValue="john@example.com"
                                placeholderTextColor={colors.textTertiary}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>
                </View>

                {/* AI Config Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBadge, { backgroundColor: colors.primaryDim }]}>
                            <Ionicons name="key-outline" size={16} color={colors.primaryLight} />
                        </View>
                        <Text style={styles.cardTitle}>AI Engine Config</Text>
                    </View>

                    <View style={styles.formGroupFull}>
                        <Text style={styles.label}>GEMINI API KEY</Text>
                        <TextInput
                            style={[styles.input, { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }]}
                            secureTextEntry
                            defaultValue="AIzaSyBbRVmTFtx4..."
                            placeholderTextColor={colors.textTertiary}
                        />
                        <Text style={styles.hint}>Your key is stored locally and used for real-time RAG generation.</Text>
                    </View>

                    <View style={styles.formGroupFull}>
                        <Text style={styles.label}>MODEL SELECTION</Text>
                        <TouchableOpacity
                            style={styles.select}
                            onPress={() => setShowModelPicker(!showModelPicker)}
                        >
                            <Text style={styles.selectText}>{MODELS[selectedModel]}</Text>
                            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                        </TouchableOpacity>
                        {showModelPicker && (
                            <View style={styles.pickerDropdown}>
                                {MODELS.map((model, i) => (
                                    <TouchableOpacity
                                        key={model}
                                        style={[styles.pickerItem, selectedModel === i && styles.pickerItemActive]}
                                        onPress={() => { setSelectedModel(i); setShowModelPicker(false); }}
                                    >
                                        <Text style={[styles.pickerItemText, selectedModel === i && styles.pickerItemTextActive]}>
                                            {model}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Save Button */}
                <View style={styles.saveRow}>
                    {saved && (
                        <View style={styles.toast}>
                            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                            <Text style={styles.toastText}>Settings saved!</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Ionicons name="save-outline" size={18} color="#fff" />
                        <Text style={styles.saveBtnText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={18} color={colors.danger} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// Platform import needed for font family
import { Platform } from 'react-native';

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, gap: spacing.md },
    title: { fontSize: fontSize.xxxl, fontWeight: fontWeight.black, color: colors.text, letterSpacing: -0.5 },
    subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.sm },
    tabRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm },
    tab: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
        borderRadius: borderRadius.md,
    },
    tabActive: { backgroundColor: colors.primary },
    tabText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: fontWeight.medium },
    tabTextActive: { color: '#fff', fontWeight: fontWeight.bold },
    card: {
        backgroundColor: colors.surface, borderRadius: borderRadius.xl,
        borderWidth: 1, borderColor: colors.surfaceBorder, padding: spacing.lg,
    },
    profileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
    avatar: {
        width: 56, height: 56, borderRadius: borderRadius.lg,
        backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: '#fff' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
    cardTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    cardSubtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
    iconBadge: { width: 32, height: 32, borderRadius: borderRadius.sm, justifyContent: 'center', alignItems: 'center' },
    formRow: { gap: spacing.md },
    formGroup: { gap: spacing.xs },
    formGroupFull: { gap: spacing.xs, marginBottom: spacing.md },
    label: {
        fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: colors.textSecondary,
        textTransform: 'uppercase', letterSpacing: 1.5,
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderColor: colors.surfaceBorder,
        borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4,
        color: colors.text, fontSize: fontSize.md,
    },
    hint: { fontSize: fontSize.xs, color: colors.textTertiary, fontStyle: 'italic', marginTop: 2 },
    select: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderColor: colors.surfaceBorder,
        borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4,
    },
    selectText: { color: colors.text, fontSize: fontSize.md },
    pickerDropdown: {
        backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.surfaceBorder,
        borderRadius: borderRadius.md, marginTop: spacing.xs, overflow: 'hidden',
    },
    pickerItem: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2 },
    pickerItemActive: { backgroundColor: colors.primaryDim },
    pickerItemText: { color: colors.textSecondary, fontSize: fontSize.sm },
    pickerItemTextActive: { color: colors.primary, fontWeight: fontWeight.bold },
    saveRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: spacing.md },
    toast: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    toastText: { fontSize: fontSize.sm, color: colors.success, fontWeight: fontWeight.medium },
    saveBtn: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
        backgroundColor: colors.primary, borderRadius: borderRadius.md,
        paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    },
    saveBtnText: { color: '#fff', fontSize: fontSize.md, fontWeight: fontWeight.bold },
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
        paddingVertical: spacing.md, paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
    },
    logoutText: { color: colors.danger, fontSize: fontSize.md, fontWeight: fontWeight.medium },
});
