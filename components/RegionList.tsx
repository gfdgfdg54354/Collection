import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import useCollectionStore from '@/store/collection-store';
import Colors from '@/constants/colors';

export default function RegionList() {
  const router = useRouter();
  const { regions, setSelectedRegion, selectedCategory } = useCollectionStore();
  const { categories } = useCollectionStore();

  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name || '';

  const handleRegionPress = (regionId: string) => {
    setSelectedRegion(regionId);
    router.push('/items');
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      style={styles.regionButton}
      onPress={() => handleRegionPress(item.id)}
    >
      <Text style={styles.regionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ArrowLeft size={24} color={Colors.text} />
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{selectedCategoryName}</Text>
      <Text style={styles.subtitle}>Выберите регион</Text>
      <FlatList
        data={regions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
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
  header: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
  listContainer: {
    gap: 12,
  },
  regionButton: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  regionText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
});