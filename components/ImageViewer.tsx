import React, { useState } from 'react';
import { Modal, StyleSheet, View, Image, TouchableOpacity, Dimensions, ScrollView, Text } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

type ImageViewerProps = {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
};

export default function ImageViewer({
  visible,
  images,
  initialIndex = 0,
  onClose,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, visible]);

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

  if (!visible || images.length === 0) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="white" />
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.imageContainer}
          maximumZoomScale={5}
          minimumZoomScale={1}
          bouncesZoom={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          centerContent={true}
        >
          <Image
            source={{ uri: images[currentIndex] }}
            style={[styles.image, { width: screenWidth, height: screenHeight * 0.8 }]}
            resizeMode="contain"
          />
        </ScrollView>

        {images.length > 1 && (
          <>
            <View style={styles.navigationContainer}>
              {currentIndex > 0 && (
                <TouchableOpacity style={[styles.navButton, styles.leftNavButton]} onPress={goToPrevious}>
                  <ChevronLeft size={30} color="white" />
                </TouchableOpacity>
              )}

              {currentIndex < images.length - 1 && (
                <TouchableOpacity style={[styles.navButton, styles.rightNavButton]} onPress={goToNext}>
                  <ChevronRight size={30} color="white" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.paginationContainer}>
              <Text style={styles.paginationText}>
                {currentIndex + 1} из {images.length}
              </Text>
              <View style={styles.dotsContainer}>
                {images.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentIndex && styles.activePaginationDot,
                    ]}
                    onPress={() => setCurrentIndex(index)}
                  />
                ))}
              </View>
            </View>
          </>
        )}

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Используйте жесты для увеличения и перемещения изображения
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  image: {
    resizeMode: 'contain',
  },
  navigationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    pointerEvents: 'box-none',
  },
  navButton: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  leftNavButton: {
    alignSelf: 'center',
  },
  rightNavButton: {
    alignSelf: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  paginationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
});