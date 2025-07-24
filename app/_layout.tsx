import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/colors';
import { SyncProvider } from '@/app/sync-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import SafeLayout from '@/components/SafeLayout';

// Показываем сплэш-экран, пока не всё загружено
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

GoogleSignin.configure({
  webClientId: '788176423580-vfec6hfm1c3dt9sdlm4cgvgmskp7ai3g.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/drive.file'], // Добавьте нужные scopes
});

export default function Layout() {
  useEffect(() => {
    const init = async () => {
      try {
        // Можно добавить любые ассеты или конфигурации
      } finally {
        await SplashScreen.hideAsync();
      }
    };
    init();
  }, []);

  return (
    <SafeLayout>
      <SyncProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                contentStyle: { backgroundColor: Colors.background },
              }}
            >
              <Stack.Screen name="index" options={{ title: 'Моя коллекция' }} />
              <Stack.Screen name="regions" options={{ title: 'Выбор региона' }} />
              <Stack.Screen name="postcard-subcategories" options={{ title: 'Почтовые карточки' }} />
              <Stack.Screen name="items" options={{ title: 'Список' }} />
              <Stack.Screen name="add-item" options={{ title: 'Добавление предмета', presentation: 'modal' }} />
              <Stack.Screen name="item-details/[id]" options={{ title: 'Просмотр' }} />
              <Stack.Screen name="edit-item/[id]" options={{ title: 'Редактирование' }} />
              <Stack.Screen name="summary" options={{ title: 'Краткая информация' }} />
              <Stack.Screen name="search" options={{ title: 'Поиск по коллекции' }} />
            </Stack>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </SyncProvider>
    </SafeLayout>
  );
}
