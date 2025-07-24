import React, { useState } from 'react';
import {
  StyleSheet, Text, View, FlatList, TextInput,
  TouchableOpacity, Image, Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Search, X, RefreshCw } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard'; // 📋 для копирования
import useCollectionStore from '@/store/collection-store';
import Colors from '@/constants/colors';
import { CollectionItem } from '@/types/collection';
import { generateCopyText } from '@/utils/copyUtils'; // 🧠 твоя копирующая функция

export default function ItemList() {
  const router = useRouter();
  const {
    getFilteredItems,
    setSearchQuery,
    searchQuery,
    selectedCategory,
    selectedRegion,
    categories,
    regions,
  } = useCollectionStore();

  const items = getFilteredItems();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categoryName = categories.find(c => c.id === selectedCategory)?.name || '';
  const regionName = regions.find(r => r.id === selectedRegion)?.name || '';

  const handleAddItem = () => {
    router.push('/add-item');
  };

  const handleItemPress = (itemId: string) => {
    router.push(`/item-details/${itemId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleImagePress = (images: string[], index: number) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  const renderItem = ({ item }: { item: CollectionItem }) => {
    const handleCopy = () => {
      const text = generateCopyText(item);
      Clipboard.setStringAsync(text);
    };

    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => handleItemPress(item.id)}
        activeOpacity={0.85}
      >
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => handleImagePress(item.images, 0)}
          activeOpacity={0.7}
        >
          {item.images?.length > 0 ? (
            <Image
              source={{ uri: item.images[0] }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImagePlaceholder}>
              <Text style={styles.noImageText}>Нет фото</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name || 'Без имени'}
          </Text>
          <Text style={styles.itemDetail}>Год: {item.year}</Text>
          <Text style={styles.itemDetail}>Кол-во: {item.quantity}</Text>
          <Text style={styles.itemDetail}>Цена: {item.price} ₽</Text>
        </View>

        <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
          <Text style={styles.copyButtonIcon}>📋</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery
          ? 'Ничего не найдено. Попробуйте изменить запрос.'
          : 'В этой коллекции пока нет предметов. Нажмите + чтобы добавить.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список добавленных предметов</Text>
      <Text style={styles.subtitle}>
        {categoryName}
        {regionName ? ` - ${regionName}` : ''}
      </Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по наименованию"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={handleClearSearch}>
              <X size={20} color={Colors.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.refreshButton, isRefreshing && styles.refreshingButton]}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            size={20}
            color={isRefreshing ? Colors.textLight : Colors.text}
            style={isRefreshing ? styles.refreshingIcon : undefined}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={ListEmptyComponent}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>

      <Modal
        visible={imageViewerVisible}
        transparent
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <View style={styles.imageModal}>
          <TouchableOpacity
            onPress={() => setImageViewerVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </TouchableOpacity>

          {currentImages.length > 0 && (
            <Image
              source={{ uri: currentImages[currentImageIndex] }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: { flexDirection: 'row', marginBottom: 16, gap: 12 },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.text,
  },
  refreshButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.card,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  refreshingButton: { opacity: 0.6 },
  refreshingIcon: { transform: [{ rotate: '180deg' }] },
  listContainer: { paddingBottom: 80 },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: { width: 100, height: 100 },
  itemImage: { width: '100%', height: '100%' },
  noImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: { color: Colors.textLight, fontSize: 14 },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 2,
  },
  copyButton: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#F3F3F3',
  },
  copyButtonIcon: {
    fontSize: 18,
    color: Colors.text,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  imageModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 32,
    right: 32,
    zIndex: 2,
    backgroundColor: '#00000066',
    borderRadius: 20,
    padding: 12,
  },
  closeButtonText: { color: '#fff', fontSize: 18 },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: 16,
  },
});
