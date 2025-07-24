import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Keyboard,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import useCollectionStore from '@/store/collection-store';
import CategoryGrid from '@/components/CategoryGrid';
import Colors from '@/constants/colors';
import { CollectionItem } from '@/types/collection';
import { XCircle } from 'lucide-react-native';
import SafeLayout from '@/components/SafeLayout';

export default function HomeScreen() {
  const router = useRouter();
  const searchAllItems = useCollectionStore((state) => state.searchAllItems);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CollectionItem[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setResults(searchAllItems(query));
  }, [query]);

  const onItemPress = (id: string) => {
    Keyboard.dismiss();
    router.push(`/item-details/${id}`);
  };

  const clearQuery = () => setQuery('');

  return (
    <SafeLayout>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Поиск"
            placeholderTextColor={Colors.textLight}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            clearButtonMode="never"
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={clearQuery}
              style={styles.clearButton}
              accessibilityLabel="Очистить поиск"
            >
              <XCircle size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {query.trim() ? (
          results.length > 0 ? (
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchItem}
                  onPress={() => onItemPress(item.id)}
                >
                  <Text style={styles.searchItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />
          ) : (
            <View style={styles.notFoundContainer}>
              <Text style={styles.notFoundText}>Ничего не найдено</Text>
            </View>
          )
        ) : (
          <CategoryGrid />
        )}
      </View>
    </SafeLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 12,
  },
  searchInput: {
    height: 40,
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.text,
    paddingRight: 36,
  },
  clearButton: {
    position: 'absolute',
    right: 8,
    top: 10,
  },
  searchItem: {
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  searchItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textLight,
  },
});