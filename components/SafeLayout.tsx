// SafeLayout.tsx
import React, { ReactNode } from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

interface SafeLayoutProps {
  children: ReactNode;
  style?: object;
}

const SafeLayout: React.FC<SafeLayoutProps> = ({ children, style }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, style]} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.content}>
          {children}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Можно поменять цвет фона на нужный
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
});

export default SafeLayout;
