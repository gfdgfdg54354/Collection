import React from 'react';
import { StyleSheet, View } from 'react-native';
import ItemList from '@/components/ItemList';
import Colors from '@/constants/colors';

export default function ItemsScreen() {
  return (
    <View style={styles.container}>
      <ItemList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});