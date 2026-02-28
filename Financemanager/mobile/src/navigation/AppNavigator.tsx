import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import AdvisorScreen from '../screens/AdvisorScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ImportScreen from '../screens/ImportScreen';
import ConnectAccountScreen from '../screens/ConnectAccountScreen';

export type RootStackParamList = {
    MainTabs: undefined;
    Import: undefined;
    ConnectAccount: undefined;
};

export type TabParamList = {
    Dashboard: undefined;
    Transactions: undefined;
    Analytics: undefined;
    Advisor: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const tabIcons: Record<string, { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }> = {
    Dashboard: { focused: 'grid', default: 'grid-outline' },
    Transactions: { focused: 'swap-horizontal', default: 'swap-horizontal-outline' },
    Analytics: { focused: 'pie-chart', default: 'pie-chart-outline' },
    Advisor: { focused: 'chatbubble-ellipses', default: 'chatbubble-ellipses-outline' },
    Settings: { focused: 'settings', default: 'settings-outline' },
};

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0d0d14',
                    borderTopColor: colors.surfaceBorder,
                    borderTopWidth: 1,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
                tabBarIcon: ({ focused, color, size }) => {
                    const icons = tabIcons[route.name];
                    const iconName = focused ? icons.focused : icons.default;
                    return <Ionicons name={iconName} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Transactions" component={TransactionsScreen} />
            <Tab.Screen name="Analytics" component={AnalyticsScreen} />
            <Tab.Screen
                name="Advisor"
                component={AdvisorScreen}
                options={{
                    tabBarBadge: '✦',
                    tabBarBadgeStyle: {
                        backgroundColor: colors.primary,
                        fontSize: 8,
                        minWidth: 16,
                        height: 16,
                        lineHeight: 14,
                    },
                }}
            />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen
                name="Import"
                component={ImportScreen}
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="ConnectAccount"
                component={ConnectAccountScreen}
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
        </Stack.Navigator>
    );
}
