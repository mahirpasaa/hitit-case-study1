import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, IconName } from '../components/Icon';
import { colors } from '../theme/colors';
import { HomeScreen } from '../screens/patient/HomeScreen';
import { ExercisesScreen } from '../screens/patient/ExercisesScreen';
import { ExerciseDetailScreen } from '../screens/patient/ExerciseDetailScreen';
import { AppointmentScreen } from '../screens/patient/AppointmentScreen';
import { NotificationsScreen } from '../screens/patient/NotificationsScreen';
import { useAppState } from '../context/AppState';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
    </HomeStack.Navigator>
  );
}

const ExStack = createNativeStackNavigator();
function ExercisesStackNavigator() {
  return (
    <ExStack.Navigator screenOptions={{ headerShown: false }}>
      <ExStack.Screen name="ExercisesMain" component={ExercisesScreen} />
      <ExStack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
    </ExStack.Navigator>
  );
}

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return <Icon name={name} size={19} color={focused ? colors.ice300 : colors.paperDim} />;
}

function NotifBadge() {
  const { notifications, currentPatient } = useAppState();
  const count = notifications.filter((n) => n.patientId === currentPatient?.id).length;
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
}

export function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.navy950, borderTopColor: colors.line, height: 82, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '600' },
        tabBarActiveTintColor: colors.ice300,
        tabBarInactiveTintColor: colors.paperDim,
      }}
    >
      <Tab.Screen
        name="Ana Sayfa"
        component={HomeStackNavigator}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }}
      />
      <Tab.Screen
        name="Egzersiz"
        component={ExercisesStackNavigator}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="stretch" focused={focused} /> }}
      />
      <Tab.Screen
        name="Randevu"
        component={AppointmentScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} /> }}
      />
      <Tab.Screen
        name="Bildirimler"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon name="bell" focused={focused} />
              <NotifBadge />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute', top: -3, right: -7, minWidth: 14, height: 14, borderRadius: 999,
    backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { fontSize: 8.5, fontWeight: '700', color: colors.white },
});
