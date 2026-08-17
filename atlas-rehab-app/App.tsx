import React, { useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Lora_600SemiBold } from '@expo-google-fonts/lora';
import { colors } from './src/theme/colors';
import { AppStateProvider } from './src/context/AppState';
import { RootNavigator } from './src/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({ Lora_600SemiBold });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.navy950 }} />;
  }

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <View style={{ flex: 1, backgroundColor: colors.navy950 }} onLayout={onLayout}>
          <RootNavigator />
        </View>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
