import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegionList from '@/components/RegionList';
import Colors from '@/constants/colors';

export default function RegionsScreen() {
  return (
    <View style={styles.container}>
      <RegionList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});