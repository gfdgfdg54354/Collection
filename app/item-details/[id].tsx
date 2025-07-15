import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react-native';
import useCollectionStore from '@/store/collection-store';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import ImageViewer from '@/components/ImageViewer';
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

  const renderCoinDetails = () => {
    const coinItem = item as any;
    return (
      <View>
        <DetailRow label="Вес" value={coinItem.weight} />
        <DetailRow label="Гурт" value={coinItem.edge} />
        <DetailRow label="Монетный двор" value={coinItem.mint} />
        <DetailRow label="Тираж" value={coinItem.mintage} />
        <DetailRow label="Металл" value={coinItem.metal} />
        <DetailRow label="Диаметр" value={coinItem.diameter} />
        <DetailRow label="Толщина" value={coinItem.thickness} />
        <DetailRow label="Номер по Краузе" value={coinItem.krauseNumber} />
      </View>
    );
  };

  const renderBanknoteDetails = () => {
    const banknoteItem = item as any;
    return (
      <View>
        <DetailRow label="Номинал" value={banknoteItem.denomination} />
        <DetailRow label="Страна" value={banknoteItem.country} />
        <DetailRow label="Размер банкноты" value={banknoteItem.size} />
        <DetailRow label="Введение в обращение" value={banknoteItem.circulationDate} />
        <DetailRow label="Номер по Краузе" value={banknoteItem.krauseNumber} />
        <DetailRow label="Номер по ВИК" value={banknoteItem.vikNumber} />
        <DetailRow label="Модификация" value={banknoteItem.modification} />
        <DetailRow
          label="Материал"
          value={banknoteItem.material === 'paper' ? 'Бумага' : 'Пластик'}
        />
      </View>
    );
  };

  const renderBadgeDetails = () => {
    const badgeItem = item as any;
    return (
      <View>
        <DetailRow label="Клеймо" value={badgeItem.stamp} />
        <DetailRow label="Металл" value={badgeItem.metal} />
        <DetailRow label="Эмаль" value={badgeItem.enamel} />
        <DetailRow label="Крепление" value={badgeItem.mount} />
      </View>
    );
  };

  const renderStampDetails = () => {
    const stampItem = item as any;
    return (
      <View>
        <DetailRow label="Номер по каталогу" value={stampItem.catalogNumber} />
        <DetailRow label="Способ печати" value={stampItem.printMethod} />
        <DetailRow label="Перфорация" value={stampItem.perforation} />
        <DetailRow label="Формат" value={stampItem.format} />
        <DetailRow label="Тираж" value={stampItem.mintage} />
        <DetailRow label="Бумага" value={stampItem.paper} />
      </View>
    );
  };

  const renderCategorySpecificDetails = () => {
    switch (item.categoryId) {
      case 'coins':
        return renderCoinDetails();
      case 'banknotes':
        return renderBanknoteDetails();
      case 'badges':
        return renderBadgeDetails();
      case 'stamps':
        return renderStampDetails();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{categoryName} - {regionName}</Text>

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

          <DetailRow label="Цена" value={item.price ? `${item.price} ₽` : ''} />

          {item.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.detailLabel}>Описание:</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          ) : null}

          {item.note ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.detailLabel}>Заметка:</Text>
              <Text style={styles.descriptionText}>{item.note}</Text>
            </View>
          ) : null}

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
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginRight: 8,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.textLight,
    flex: 2,
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 4,
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