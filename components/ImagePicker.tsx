import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import * as ImagePickerExpo from 'expo-image-picker';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';

type ImagePickerProps = {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
};

export default function ImagePicker({
  images,
  onImagesChange,
  maxImages = 4
}: ImagePickerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const pickImage = async () => {
    if (images.length >= maxImages) {
      alert(`Максимальное количество изображений: ${maxImages}`);
      return;
    }

    const result = await ImagePickerExpo.launchImageLibraryAsync({
      mediaTypes: ImagePickerExpo.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImagesChange([...images, result.assets[0].uri]);
    }
  };

  const removeImage = () => {
    if (images.length === 0) return;

    const newImages = [...images];
    newImages.splice(currentIndex, 1);
    onImagesChange(newImages);

    if (currentIndex >= newImages.length && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagePreviewContainer}>
        {images.length > 0 ? (
          <View style={styles.imageWithControls}>
            {images.length > 1 && currentIndex > 0 && (
              <TouchableOpacity style={styles.navButton} onPress={goToPrevious}>
                <ChevronLeft size={24} color={Colors.text} />
              </TouchableOpacity>
            )}

            <Image source={{ uri: images[currentIndex] }} style={styles.imagePreview} resizeMode="contain" />

            {images.length > 1 && currentIndex < images.length - 1 && (
              <TouchableOpacity style={[styles.navButton, styles.rightNav]} onPress={goToNext}>
                <ChevronRight size={24} color={Colors.text} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Нет изображений</Text>
          </View>
        )}
      </View>

      <View style={styles.thumbnailsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailsScroll}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.thumbnail,
                currentIndex === index && styles.selectedThumbnail
              ]}
              onPress={() => setCurrentIndex(index)}
            >
              <Image source={{ uri: image }} style={styles.thumbnailImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Plus size={20} color={Colors.text} />
          <Text style={styles.buttonText}>Добавить изображение</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, images.length === 0 && styles.disabledButton]}
          onPress={removeImage}
          disabled={images.length === 0}
        >
          <Trash2 size={20} color={images.length === 0 ? Colors.textLight : Colors.text} />
          <Text style={[styles.buttonText, images.length === 0 && styles.disabledText]}>
            Удалить изображение
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  imagePreviewContainer: {
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  imageWithControls: {
    flex: 1,
    position: 'relative',
  },
  imagePreview: {
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
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.border,
  },
  placeholderText: {
    color: Colors.textLight,
    fontSize: 16,
  },
  thumbnailsContainer: {
    height: 60,
    marginBottom: 10,
  },
  thumbnailsScroll: {
    paddingVertical: 5,
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
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  disabledText: {
    color: Colors.textLight,
  },
});