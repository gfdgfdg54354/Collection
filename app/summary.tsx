// app/summary.tsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useCollectionStore from '@/store/collection-store';
import Colors from '@/constants/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SummaryScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  const { items } = useCollectionStore();

  // Фильтрация по выбранной категории
  const filteredItems = useMemo(() => {
    if (!categoryId) return [];
    return items.filter(item => item.categoryId === categoryId);
  }, [items, categoryId]);

  const regionTotals = useMemo(() => {
    const totals = { russia: 0, cis: 0, foreign: 0 };
    filteredItems.forEach(item => {
      const price = parseFloat((item.price || '').toString().replace(',', '.')) || 0;
      if (item.regionId === 'russia') totals.russia += price;
      else if (item.regionId === 'cis') totals.cis += price;
      else if (item.regionId === 'foreign') totals.foreign += price;
    });
    return totals;
  }, [filteredItems]);

  const total = regionTotals.russia + regionTotals.cis + regionTotals.foreign;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Краткая информация</Text>
      <Text style={styles.text}>Стоимость подраздела Россия: {regionTotals.russia.toFixed(2)} ₽</Text>
      <Text style={styles.text}>Стоимость подраздела СНГ: {regionTotals.cis.toFixed(2)} ₽</Text>
      <Text style={styles.text}>Стоимость подраздела Зарубежные: {regionTotals.foreign.toFixed(2)} ₽</Text>
      <Text style={[styles.text, styles.total]}>Общая стоимость всех подразделов: {total.toFixed(2)} ₽</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Закрыть</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  text: {
    fontSize: 18,
    color: Colors.textLight,
    marginVertical: 6,
    textAlign: 'center',
  },
  total: {
    marginTop: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  button: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
