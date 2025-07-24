import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as FileSystem from 'expo-file-system';
import { CATEGORIES, REGIONS } from '@/constants/categories';
import { CollectionItem, CollectionState } from '@/types/collection';
import { zip, unzip } from 'react-native-zip-archive';
import { Alert } from 'react-native';

// Пути к папкам
const IMAGE_DIR = FileSystem.documentDirectory + 'collection_images/';
const EXPORT_DIR = FileSystem.documentDirectory + 'exported_backups/';
const TEMP_DIR = FileSystem.cacheDirectory + 'temp_collection_data/';

const ensureDirExists = async (dir: string) => {
  try {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  } catch (e) {
    console.error('Error ensuring directory exists:', dir, e);
  }
};

const getFileNameFromUri = (uri: string) => uri.split('/').pop() || '';

const cleanupUnusedImages = async (items: CollectionItem[]) => {
  try {
    await ensureDirExists(IMAGE_DIR);
    const existingFiles = await FileSystem.readDirectoryAsync(IMAGE_DIR);
    const usedFiles = new Set(
      items.flatMap(item => item.images?.map(img => getFileNameFromUri(img)) || [])
    );

    for (const fileName of existingFiles) {
      if (!usedFiles.has(fileName)) {
        try {
          await FileSystem.deleteAsync(IMAGE_DIR + fileName);
        } catch (e) {
          // Игнорируем ошибки удаления конкретного файла
          console.warn('Failed to delete unused image:', fileName, e);
        }
      }
    }
  } catch (e) {
    console.error('Error during cleanupUnusedImages:', e);
  }
};

const useCollectionStore = create<CollectionState>()(
  persist(
    (set, get) => ({
      categories: CATEGORIES,
      regions: REGIONS,
      items: [],
      selectedCategory: null,
      selectedRegion: null,
      selectedSubcategory: null,
      searchQuery: '',

      setSelectedCategory: id => set({ selectedCategory: id }),
      setSelectedRegion: id => set({ selectedRegion: id }),
      setSelectedSubcategory: id => set({ selectedSubcategory: id }),
      setSearchQuery: q => set({ searchQuery: q }),

      addItem: async item => {
        await ensureDirExists(IMAGE_DIR);

        const newItem: CollectionItem = {
          ...item,
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        // Копируем и переименовываем изображения
        if (Array.isArray(item.images)) {
          const copiedImages: string[] = [];
          for (const uri of item.images) {
            if (uri && uri.startsWith('file://') && !uri.startsWith(IMAGE_DIR)) {
              const destUri = IMAGE_DIR + `${newItem.id}_${Date.now()}_${getFileNameFromUri(uri)}`;
              try {
                await FileSystem.copyAsync({ from: uri, to: destUri });
                copiedImages.push(destUri);
              } catch (e) {
                console.warn('Failed to copy image on addItem:', uri, e);
                copiedImages.push(uri);
              }
            } else if (uri) {
              copiedImages.push(uri);
            }
          }
          newItem.images = copiedImages;
        }

        set(state => ({ items: [...state.items, newItem] }));
      },

      updateItem: async (id, updates) => {
        await ensureDirExists(IMAGE_DIR);

        const state = get();
        const currentItem = state.items.find(i => i.id === id);
        if (!currentItem) return;

        const newImages: string[] = [];
        if (Array.isArray(updates.images)) {
          for (const uri of updates.images) {
            if (uri && uri.startsWith('file://') && !uri.startsWith(IMAGE_DIR)) {
              const destUri = IMAGE_DIR + `${id}_${Date.now()}_${getFileNameFromUri(uri)}`;
              try {
                await FileSystem.copyAsync({ from: uri, to: destUri });
                newImages.push(destUri);
              } catch (e) {
                console.warn('Failed to copy image on updateItem:', uri, e);
                newImages.push(uri);
              }
            } else if (uri) {
              newImages.push(uri);
            }
          }
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? {
                  ...item,
                  ...updates,
                  images: newImages.length ? newImages : item.images,
                  updatedAt: Date.now(),
                }
              : item
          ),
        }));

        cleanupUnusedImages(get().items);
      },

      deleteItem: async id => {
        try {
          const item = get().items.find(i => i.id === id);
          if (item && Array.isArray(item.images)) {
            for (const uri of item.images) {
              if (uri && uri.startsWith(IMAGE_DIR)) {
                try {
                  await FileSystem.deleteAsync(uri);
                } catch (e) {
                  console.warn('Failed to delete image on deleteItem:', uri, e);
                }
              }
            }
          }
          set(state => ({ items: state.items.filter(i => i.id !== id) }));
          cleanupUnusedImages(get().items);
        } catch (e) {
          console.error('Error in deleteItem:', e);
        }
      },

      getFilteredItems: () => {
        const { items, selectedCategory, selectedRegion, selectedSubcategory, searchQuery } = get();
        return items.filter(item => {
          const matchCat = selectedCategory ? item.categoryId === selectedCategory : true;
          const matchReg = selectedRegion ? item.regionId === selectedRegion : true;
          const matchSub = selectedSubcategory ? item.subcategoryId === selectedSubcategory : true;
          const matchSearch = searchQuery
            ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
          return matchCat && matchReg && matchSub && matchSearch;
        });
      },

      getItemById: id => get().items.find(item => item.id === id),

      getItemCountByCategory: categoryId =>
        get().items.filter(item => item.categoryId === categoryId).length,

      exportData: async (onProgress?: (percent: number) => void) => {
        try {
          await ensureDirExists(IMAGE_DIR);
          await ensureDirExists(EXPORT_DIR);
          await ensureDirExists(TEMP_DIR);

          const { items } = get();

          const tempImagesDir = TEMP_DIR + 'images/';
          await ensureDirExists(tempImagesDir);

          await Promise.all(
            items.flatMap(item =>
              (item.images || []).map(async imgUri => {
                if (imgUri && imgUri.startsWith(IMAGE_DIR)) {
                  const fileName = getFileNameFromUri(imgUri);
                  if (fileName) {
                    try {
                      await FileSystem.copyAsync({ from: imgUri, to: tempImagesDir + fileName });
                    } catch (e) {
                      console.warn('Failed to copy image on export:', imgUri, e);
                    }
                  }
                }
              })
            )
          );

          const exportItems = items.map(item => ({
            ...item,
            images: item.images?.map(uri => getFileNameFromUri(uri)) || [],
          }));

          await FileSystem.writeAsStringAsync(
            TEMP_DIR + 'collection_metadata.json',
            JSON.stringify(exportItems, null, 2)
          );

          const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
          const zipPath = EXPORT_DIR + `collection_backup_${timestamp}.zip`;

          const resultPath = await zip(TEMP_DIR, zipPath, (percent: number) => {
            if (onProgress) onProgress(percent);
          });

          await FileSystem.deleteAsync(TEMP_DIR, { idempotent: true });

          return resultPath.startsWith('file://') ? resultPath : 'file://' + resultPath;
        } catch (e) {
          console.error('Export failed:', e);
          Alert.alert('Ошибка', 'Не удалось экспортировать коллекцию.');
          throw e;
        }
      },

      importData: async (zipUri: string, onProgress?: (percent: number) => void) => {
        try {
          await ensureDirExists(IMAGE_DIR);
          await ensureDirExists(TEMP_DIR);

          await FileSystem.deleteAsync(TEMP_DIR, { idempotent: true });

          await unzip(zipUri, TEMP_DIR, (percent: number) => {
            if (onProgress) onProgress(percent);
          });

          const metaPath = TEMP_DIR + 'collection_metadata.json';
          const metaString = await FileSystem.readAsStringAsync(metaPath);
          const importedItems: CollectionItem[] = JSON.parse(metaString);

          const imagesDir = TEMP_DIR + 'images/';
          const imageFiles = await FileSystem.readDirectoryAsync(imagesDir);

          const copiedImages: Record<string, string> = {};
          await Promise.all(
            imageFiles.map(async fileName => {
              const src = imagesDir + fileName;
              const dest = IMAGE_DIR + fileName;
              try {
                await FileSystem.copyAsync({ from: src, to: dest });
                copiedImages[fileName] = dest;
              } catch (e) {
                console.warn('Failed to copy image on import:', fileName, e);
              }
            })
          );

          importedItems.forEach(item => {
            if (Array.isArray(item.images)) {
              item.images = item.images.map(name => copiedImages[name] || name);
            }
            item.id = item.id || Date.now().toString() + Math.random().toString(36).slice(2);
            item.createdAt = item.createdAt || Date.now();
            item.updatedAt = Date.now();
          });

          set({ items: importedItems });

          // Даем время, чтобы состояние успело сохраниться
          await new Promise(res => setTimeout(res, 100));

          await FileSystem.deleteAsync(TEMP_DIR, { idempotent: true });

          return true;
        } catch (e) {
          console.error('Import failed:', e);
          Alert.alert('Ошибка', 'Не удалось импортировать коллекцию.');
          throw e;
        }
      },
    }),
    {
      name: 'collection-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState, version) => {
        // Миграция при необходимости, например:
        if (version === 0) {
          return {
            ...persistedState,
            // добавь новые поля с дефолтами
          };
        }
        return persistedState;
      },
    }
  )
);

export default useCollectionStore;
