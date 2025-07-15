import React from 'react';
import { StyleSheet, View } from 'react-native';
import CategoryGrid from '@/components/CategoryGrid';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <CategoryGrid />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});