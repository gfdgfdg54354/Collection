// app/regions.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import RegionList from '@/components/RegionList';
import Colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import useCollectionStore from '@/store/collection-store';

export default function RegionsScreen() {
  const router = useRouter();
  const { selectedCategory } = useCollectionStore();

  const handleShowSummary = () => {
    if (!selectedCategory) {
      console.warn('Категория не выбрана для отображения сводки.');
      return;
    }
    router.push(`/summary?categoryId=${selectedCategory}`);
  };

  return (
    <View style={styles.container}>
      <RegionList />
      <TouchableOpacity style={styles.infoButton} onPress={handleShowSummary}>
        <Text style={styles.infoButtonText}>Краткая информация о разделах</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  infoButton: {
    margin: 16,
    padding: 14,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
