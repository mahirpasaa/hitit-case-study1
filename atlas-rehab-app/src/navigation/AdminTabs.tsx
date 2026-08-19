import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Icon, IconName } from '../components/Icon';
import { colors } from '../theme/colors';
import { PendingApprovalsScreen } from '../screens/admin/PendingApprovalsScreen';
import { AppointmentRequestsScreen } from '../screens/admin/AppointmentRequestsScreen';
import { SlotOfferScreen } from '../screens/admin/SlotOfferScreen';
import { PatientsScreen } from '../screens/admin/PatientsScreen';

const Tab = createBottomTabNavigator();
const ApptStack = createNativeStackNavigator();

function AppointmentsStackNavigator() {
  return (
    <ApptStack.Navigator screenOptions={{ headerShown: false }}>
      <ApptStack.Screen name="RequestsMain" component={AppointmentRequestsScreen} />
      <ApptStack.Screen name="SlotOffer" component={SlotOfferScreen} />
    </ApptStack.Navigator>
  );
}

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return <Icon name={name} size={19} color={focused ? colors.ice300 : colors.paperDim} />;
}

export function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.navy950 },
        headerShadowVisible: false,
        headerTintColor: colors.white,
        headerRight: () => (
          <Pressable onPress={() => navigation.getParent()?.navigate('Profile')} style={styles.logout}>
            <Icon name="user" size={15} color={colors.paperDim} />
          </Pressable>
        ),
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: { backgroundColor: colors.navy950, borderTopColor: colors.line, height: 82, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '600' },
        tabBarActiveTintColor: colors.ice300,
        tabBarInactiveTintColor: colors.paperDim,
      })}
    >
      <Tab.Screen
        name="Onaylar"
        component={PendingApprovalsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="userPlus" focused={focused} /> }}
      />
      <Tab.Screen
        name="Randevular"
        component={AppointmentsStackNavigator}
        options={{ headerShown: false, tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} /> }}
      />
      <Tab.Screen
        name="Hastalar"
        component={PatientsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="clipboard" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logout: { marginRight: 14, width: 30, height: 30, borderRadius: 9, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
});
