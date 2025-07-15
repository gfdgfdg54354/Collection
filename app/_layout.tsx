import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Моя коллекция",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="regions"
        options={{
          title: "Выбор региона",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="items"
        options={{
          title: "Предметы коллекции",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="add-item"
        options={{
          title: "Добавление предмета",
          headerShown: true,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="item-details/[id]"
        options={{
          title: "Детали предмета",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="edit-item/[id]"
        options={{
          title: "Редактирование",
          headerShown: true,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}