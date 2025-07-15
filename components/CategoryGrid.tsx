import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import useCollectionStore from '@/store/collection-store';
import Colors from '@/constants/colors';

export default function CategoryGrid() {
  const router = useRouter();
  const { categories, setSelectedCategory } = useCollectionStore();

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    router.push('/regions');
  };

  const renderItem = ({ item, index }: { item: { id: string; name: string }, index: number }) => (
    <TouchableOpacity
      style={styles.categoryButton}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите категорию коллекции</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  gridContainer: {
    paddingBottom: 20,
  },
  categoryButton: {
    flex: 1,
    aspectRatio: 1,
    margin: 6,
    backgroundColor: Colors.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
});