import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useCachedResources } from './hooks/useCachedResources';
import { RootNavigator } from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}