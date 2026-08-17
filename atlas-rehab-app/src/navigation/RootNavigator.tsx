import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useAppState } from '../context/AppState';
import { AuthScreen } from '../screens/AuthScreen';
import { PendingApprovalScreen } from '../screens/patient/PendingApprovalScreen';
import { PatientTabs } from './PatientTabs';
import { AdminTabs } from './AdminTabs';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.navy950,
    card: colors.navy950,
    border: colors.line,
    text: colors.white,
    primary: colors.ice400,
  },
};

export function RootNavigator() {
  const { session, currentPatient } = useAppState();

  let content: React.ReactNode;
  if (!session) {
    content = <AuthScreen />;
  } else if (session.role === 'admin') {
    content = <AdminTabs />;
  } else if (currentPatient?.status === 'pending') {
    content = <PendingApprovalScreen />;
  } else if (currentPatient) {
    content = <PatientTabs />;
  } else {
    content = <AuthScreen />;
  }

  return <NavigationContainer theme={navTheme}>{content}</NavigationContainer>;
}
