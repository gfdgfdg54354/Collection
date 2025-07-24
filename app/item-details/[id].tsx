import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react-native';
import useCollectionStore from '@/store/collection-store';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import ImageViewer from '@/components/ImageViewer';
import { POSTCARD_SUBCATEGORIES, STAMP_CANCELLATION_SUBCATEGORIES } from '@/constants/categories';
import Colors from '@/constants/colors';

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getItemById, deleteItem, categories, regions } = useCollectionStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const item = getItemById(id);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Предмет не найден</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categoryName = categories.find(c => c.id === item.categoryId)?.name || '';
  const regionName = regions.find(r => r.id === item.regionId)?.name || '';

  let subcategoryName = '';
  if (item.subcategoryId) {
    if (item.categoryId === 'postcards') {
      subcategoryName = POSTCARD_SUBCATEGORIES.find(s => s.id === item.subcategoryId)?.name || '';
    } else if (item.categoryId === 'stampCancellations') {
      subcategoryName = STAMP_CANCELLATION_SUBCATEGORIES.find(s => s.id === item.subcategoryId)?.name || '';
    }
  }

  const handleEdit = () => {
    router.push(`/edit-item/${id}`);
  };

  const handleDelete = () => {
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    deleteItem(id);
    setDeleteDialogVisible(false);
    router.back();
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNextImage = () => {
    if (item.images && currentImageIndex < item.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const openImageViewer = () => {
    setImageViewerVisible(true);
  };

  const renderCategorySpecificDetails = () => {
    const itemAny = item as any;

    switch (item.categoryId) {
      case 'coins':
        return (
          <>
            <DetailRow label="Вес" value={itemAny.weight} />
            <DetailRow label="Гурт" value={itemAny.edge} />
            <DetailRow label="Монетный двор" value={itemAny.mint} />
            <DetailRow label="Тираж" value={itemAny.mintage} />
            <DetailRow label="Металл" value={itemAny.metal} />
            <DetailRow label="Диаметр" value={itemAny.diameter} />
            <DetailRow label="Толщина" value={itemAny.thickness} />
            <DetailRow label="Номер по Краузе" value={itemAny.krauseNumber} />
          </>
        );
      case 'banknotes':
        return (
          <>
            <DetailRow label="Номинал" value={itemAny.denomination} />
            <DetailRow label="Страна" value={itemAny.country} />
            <DetailRow label="Размер банкноты" value={itemAny.size} />
            <DetailRow label="Введение в обращение" value={itemAny.circulationDate} />
            <DetailRow label="Номер по Краузе" value={itemAny.krauseNumber} />
            <DetailRow label="Номер по ВИК" value={itemAny.vikNumber} />
            <DetailRow label="Модификация" value={itemAny.modification} />
            <DetailRow
              label="Материал"
              value={itemAny.material === 'paper' ? 'Бумага' : itemAny.material === 'plastic' ? 'Пластик' : ''}
            />
          </>
        );
      case 'badges':
        return (
          <>
            <DetailRow label="Клеймо" value={itemAny.stamp} />
            <DetailRow label="Металл" value={itemAny.metal} />
            <DetailRow label="Эмаль" value={itemAny.enamel} />
            <DetailRow label="Крепление" value={itemAny.mount || itemAny.fastener} />
          </>
        );
      case 'stamps':
        return (
          <>
            <DetailRow label="Номер по каталогу" value={itemAny.catalogNumber} />
            <DetailRow label="Способ печати" value={itemAny.printMethod || itemAny.printType} />
            <DetailRow label="Перфорация" value={itemAny.perforation} />
            <DetailRow label="Формат" value={itemAny.format} />
            <DetailRow label="Тираж" value={itemAny.mintage} />
            <DetailRow label="Бумага" value={itemAny.paper || itemAny.paperType} />
          </>
        );
      case 'watches':
        return (
          <>
            <DetailRow label="Фирма" value={itemAny.brand} />
            <DetailRow label="Пол" value={itemAny.gender === 'male' ? 'Мужские' : itemAny.gender === 'female' ? 'Женские' : ''} />
            <DetailRow label="Тип" value={itemAny.type === 'quartz' ? 'Кварцевые' : itemAny.type === 'mechanical' ? 'Механические' : itemAny.type === 'hybrid' ? 'Гибридные' : ''} />
            <DetailRow label="Металл" value={itemAny.metal} />
            <DetailRow label="Диаметр" value={itemAny.diameter} />
            <DetailRow label="Дополнительно" value={itemAny.additional} />
          </>
        );
      case 'cameras':
        return (
          <>
            <DetailRow label="Фирма" value={itemAny.brand} />
            <DetailRow label="Серия" value={itemAny.series} />
            <DetailRow label="Тип" value={itemAny.type} />
            <DetailRow label="Мыльница" value={itemAny.soapbox || itemAny.compact} />
            <DetailRow label="Формат пленки" value={itemAny.filmFormat} />
            <DetailRow label="Объектив" value={itemAny.lens} />
            <DetailRow label="Формат сенсора" value={itemAny.sensorFormat} />
            <DetailRow label="Дополнительно" value={itemAny.additional} />
          </>
        );
      case 'postcards':
        return (
          <>
            <DetailRow label="Номер по каталогу АО Марка" value={itemAny.catalogNumber} />
          </>
        );
      case 'porcelain':
        return (
          <>
            <DetailRow label="Клеймо" value={itemAny.stamp} />
          </>
        );
      case 'toys':
      case 'kinderToys':
        return (
          <>
            <DetailRow label="Завод/Фирма" value={itemAny.factory} />
          </>
        );
      case 'mobilePhones':
        return (
          <>
            <DetailRow label="Фирма" value={itemAny.brand} />
            <DetailRow label="Модель" value={itemAny.model} />
          </>
        );
      case 'cigarettePacks':
        return (
          <>
            <DetailRow label="Фирма" value={itemAny.brand} />
            <DetailRow label="Город" value={itemAny.city} />
            <DetailRow label="Тип" value={itemAny.packType} />
            <DetailRow label="Тип сигарет" value={itemAny.cigaretteType} />
          </>
        );
      case 'samovars':
        return (
          <>
            <DetailRow label="Производитель" value={itemAny.manufacturer} />
            <DetailRow label="Металл" value={itemAny.metal} />
            <DetailRow label="Тип" value={itemAny.type} />
            <DetailRow label="Форма" value={itemAny.shape} />
          </>
        );
      case 'loans':
        return (
          <>
            <DetailRow label="Тема" value={itemAny.theme} />
            <DetailRow label="Подпись" value={itemAny.signature} />
            <DetailRow label="Вид" value={itemAny.type} />
          </>
        );
      case 'lotteryTickets':
        return (
          <>
            <DetailRow label="Фирма" value={itemAny.company} />
            <DetailRow label="Тема" value={itemAny.theme} />
            <DetailRow label="Редкость" value={itemAny.rarity} />
          </>
        );
      case 'busts':
        return (
          <>
            <DetailRow label="Тема" value={itemAny.theme} />
            <DetailRow label="Жанр" value={itemAny.genre} />
            <DetailRow label="Размер" value={itemAny.size} />
            <DetailRow label="ФИО Скульптора" value={itemAny.sculptor} />
            <DetailRow label="Материал" value={itemAny.material} />
          </>
        );
      case 'bonds':
        return (
          <>
            <DetailRow label="Вид" value={itemAny.type} />
            <DetailRow label="Подпись" value={itemAny.signature} />
          </>
        );
      case 'stocks':
        return (
          <>
            <DetailRow label="Тема" value={itemAny.theme} />
            <DetailRow label="Подписи" value={itemAny.signatures} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>
          {categoryName} - {regionName}
          {subcategoryName ? ` - ${subcategoryName}` : ''}
        </Text>

        <View style={styles.imageContainer}>
          {item.images && item.images.length > 0 ? (
            <TouchableOpacity onPress={openImageViewer}>
              <View style={styles.imageWithControls}>
                {item.images.length > 1 && currentImageIndex > 0 && (
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={goToPreviousImage}
                  >
                    <ChevronLeft size={24} color={Colors.text} />
                  </TouchableOpacity>
                )}

                <Image
                  source={{ uri: item.images[currentImageIndex] }}
                  style={styles.image}
                  resizeMode="contain"
                />

                {item.images.length > 1 && currentImageIndex < item.images.length - 1 && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.rightNav]}
                    onPress={goToNextImage}
                  >
                    <ChevronRight size={24} color={Colors.text} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.tapToZoomText}>Нажмите для увеличения</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.noImagePlaceholder}>
              <Text style={styles.noImageText}>Нет изображений</Text>
            </View>
          )}

          {item.images && item.images.length > 1 && (
            <View style={styles.thumbnailsContainer}>
              {item.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnail,
                    currentImageIndex === index && styles.selectedThumbnail
                  ]}
                  onPress={() => setCurrentImageIndex(index)}
                >
                  <Image source={{ uri: image }} style={styles.thumbnailImage} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <DetailRow label="Год выпуска" value={item.year} />
          {renderCategorySpecificDetails()}
          {item.slab && <DetailRow label="СЛАБ" value={item.slab} />}
          <DetailRow label="Цена" value={item.price ? `${item.price} ₽` : ''} />
          <DetailRow label="Описание" value={item.description} />
          <DetailRow label="Заметка" value={item.note} />
          <DetailRow label="Количество" value={item.quantity} />
          <DetailRow label="Состояние" value={item.condition} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
            <Edit size={20} color="white" />
            <Text style={styles.buttonText}>Изменить</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Trash2 size={20} color="white" />
            <Text style={styles.buttonText}>Удалить</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Назад</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmationDialog
        visible={deleteDialogVisible}
        title="Удаление предмета"
        message="Вы уверены, что хотите удалить этот предмет из коллекции? Это действие нельзя отменить."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogVisible(false)}
        confirmText="Удалить"
        isDestructive
      />

      <ImageViewer
        visible={imageViewerVisible}
        images={item.images || []}
        initialIndex={currentImageIndex}
        onClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageWithControls: {
    position: 'relative',
    height: 300,
    backgroundColor: Colors.card,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 8,
    transform: [{ translateY: -20 }],
  },
  rightNav: {
    left: undefined,
    right: 10,
  },
  tapToZoomText: {
    textAlign: 'center',
    color: Colors.textLight,
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  noImagePlaceholder: {
    height: 300,
    backgroundColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: Colors.textLight,
    fontSize: 16,
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    gap: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  selectedThumbnail: {
    borderColor: Colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginRight: 8,
    minWidth: 120,
    flexShrink: 0,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.textLight,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  backButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  backButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
});