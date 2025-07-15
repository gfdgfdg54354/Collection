import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CATEGORIES, REGIONS } from '@/constants/categories';
import { CollectionItem, CollectionState } from '@/types/collection';

const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      categories: CATEGORIES,
      regions: REGIONS,
      items: [],
      selectedCategory: null,
      selectedRegion: null,
      searchQuery: '',

      setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
      setSelectedRegion: (regionId) => set({ selectedRegion: regionId }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      addItem: (item) => {
        const newItem = {
          ...item,
          id: Date.now().toString(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          items: [...state.items, newItem as CollectionItem],
        }));
      },

      updateItem: (id, updatedItem) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, ...updatedItem, updatedAt: Date.now() }
              : item
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      getFilteredItems: () => {
        const { items, selectedCategory, selectedRegion, searchQuery } = get();

        return items.filter((item) => {
          const matchesCategory = selectedCategory ? item.categoryId === selectedCategory : true;
          const matchesRegion = selectedRegion ? item.regionId === selectedRegion : true;
          const matchesSearch = searchQuery
            ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

          return matchesCategory && matchesRegion && matchesSearch;
        });
      },

      getItemById: (id) => {
        return get().items.find((item) => item.id === id);
      },
    }),
    {
      name: 'collection-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCollectionStore;