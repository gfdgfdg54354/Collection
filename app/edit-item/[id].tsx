import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useCollectionStore from '@/store/collection-store';
import ImagePicker from '@/components/ImagePicker';
import FormField from '@/components/FormField';
import RadioSelector from '@/components/RadioSelector';
import Colors from '@/constants/colors';

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getItemById, updateItem, categories } = useCollectionStore();

  const item = getItemById(id);

  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState('');
  const [condition, setCondition] = useState('');

  // Coin specific fields
  const [weight, setWeight] = useState('');
  const [edge, setEdge] = useState('');
  const [mint, setMint] = useState('');
  const [mintage, setMintage] = useState('');
  const [metal, setMetal] = useState('');
  const [diameter, setDiameter] = useState('');
  const [thickness, setThickness] = useState('');
  const [krauseNumber, setKrauseNumber] = useState('');

  // Banknote specific fields
  const [denomination, setDenomination] = useState('');
  const [country, setCountry] = useState('');
  const [size, setSize] = useState('');
  const [circulationDate, setCirculationDate] = useState('');
  const [vikNumber, setVikNumber] = useState('');
  const [modification, setModification] = useState('');
  const [material, setMaterial] = useState<'paper' | 'plastic'>('paper');

  // Badge specific fields
  const [stamp, setStamp] = useState('');
  const [enamel, setEnamel] = useState('');
  const [mount, setMount] = useState('');

  // Stamp specific fields
  const [catalogNumber, setCatalogNumber] = useState('');
  const [printMethod, setPrintMethod] = useState('');
  const [perforation, setPerforation] = useState('');
  const [format, setFormat] = useState('');
  const [paper, setPaper] = useState('');

  useEffect(() => {
    if (item) {
      setImages(item.images || []);
      setName(item.name || '');
      setYear(item.year || '');
      setPrice(item.price || '');
      setDescription(item.description || '');
      setNote(item.note || '');
      setQuantity(item.quantity || '');
      setCondition(item.condition || '');

      // Set category-specific fields
      const specificItem = item as any;

      if (item.categoryId === 'coins') {
        setWeight(specificItem.weight || '');
        setEdge(specificItem.edge || '');
        setMint(specificItem.mint || '');
        setMintage(specificItem.mintage || '');
        setMetal(specificItem.metal || '');
        setDiameter(specificItem.diameter || '');
        setThickness(specificItem.thickness || '');
        setKrauseNumber(specificItem.krauseNumber || '');
      } else if (item.categoryId === 'banknotes') {
        setDenomination(specificItem.denomination || '');
        setCountry(specificItem.country || '');
        setSize(specificItem.size || '');
        setCirculationDate(specificItem.circulationDate || '');
        setKrauseNumber(specificItem.krauseNumber || '');
        setVikNumber(specificItem.vikNumber || '');
        setModification(specificItem.modification || '');
        setMaterial(specificItem.material || 'paper');
      } else if (item.categoryId === 'badges') {
        setStamp(specificItem.stamp || '');
        setMetal(specificItem.metal || '');
        setEnamel(specificItem.enamel || '');
        setMount(specificItem.mount || '');
      } else if (item.categoryId === 'stamps') {
        setCatalogNumber(specificItem.catalogNumber || '');
        setPrintMethod(specificItem.printMethod || '');
        setPerforation(specificItem.perforation || '');
        setFormat(specificItem.format || '');
        setMintage(specificItem.mintage || '');
        setPaper(specificItem.paper || '');
      }
    }
  }, [item]);

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

  const handleUpdateItem = () => {
    if (!name) {
      alert('Пожалуйста, введите наименование');
      return;
    }

    const baseItem = {
      name,
      year,
      price,
      description,
      note,
      quantity,
      condition,
      images,
    };

    let itemToUpdate;

    switch (item.categoryId) {
      case 'coins':
        itemToUpdate = {
          ...baseItem,
          weight,
          edge,
          mint,
          mintage,
          metal,
          diameter,
          thickness,
          krauseNumber,
        };
        break;
      case 'banknotes':
        itemToUpdate = {
          ...baseItem,
          denomination,
          country,
          size,
          circulationDate,
          krauseNumber,
          vikNumber,
          modification,
          material,
        };
        break;
      case 'badges':
        itemToUpdate = {
          ...baseItem,
          stamp,
          metal,
          enamel,
          mount,
        };
        break;
      case 'stamps':
        itemToUpdate = {
          ...baseItem,
          catalogNumber,
          printMethod,
          perforation,
          format,
          mintage,
          paper,
        };
        break;
      default:
        itemToUpdate = baseItem;
    }

    updateItem(id, itemToUpdate);
    router.back();
  };

  const renderCoinFields = () => (
    <>
      <FormField
        label="Вес"
        value={weight}
        onChangeText={setWeight}
        placeholder="Введите вес"
      />
      <FormField
        label="Гурт"
        value={edge}
        onChangeText={setEdge}
        placeholder="Опишите гурт"
      />
      <FormField
        label="Монетный двор"
        value={mint}
        onChangeText={setMint}
        placeholder="Укажите монетный двор"
      />
      <FormField
        label="Тираж"
        value={mintage}
        onChangeText={setMintage}
        placeholder="Укажите тираж"
        keyboardType="numeric"
      />
      <FormField
        label="Металл"
        value={metal}
        onChangeText={setMetal}
        placeholder="Укажите металл"
      />
      <FormField
        label="Диаметр"
        value={diameter}
        onChangeText={setDiameter}
        placeholder="Укажите диаметр"
      />
      <FormField
        label="Толщина"
        value={thickness}
        onChangeText={setThickness}
        placeholder="Укажите толщину"
      />
      <FormField
        label="Номер по Краузе"
        value={krauseNumber}
        onChangeText={setKrauseNumber}
        placeholder="Укажите номер по каталогу"
      />
    </>
  );

  const renderBanknoteFields = () => (
    <>
      <FormField
        label="Номинал"
        value={denomination}
        onChangeText={setDenomination}
        placeholder="Укажите номинал"
      />
      <FormField
        label="Страна"
        value={country}
        onChangeText={setCountry}
        placeholder="Укажите страну"
      />
      <FormField
        label="Размер банкноты"
        value={size}
        onChangeText={setSize}
        placeholder="Укажите размер"
      />
      <FormField
        label="Введение в обращение"
        value={circulationDate}
        onChangeText={setCirculationDate}
        placeholder="Дата введения в обращение"
      />
      <FormField
        label="Номер по Краузе"
        value={krauseNumber}
        onChangeText={setKrauseNumber}
        placeholder="Укажите номер по каталогу"
      />
      <FormField
        label="Номер по ВИК"
        value={vikNumber}
        onChangeText={setVikNumber}
        placeholder="Укажите номер по ВИК"
      />
      <FormField
        label="Модификация"
        value={modification}
        onChangeText={setModification}
        placeholder="Укажите модификацию"
      />
      <RadioSelector
        label="Материал"
        options={[
          { value: 'paper', label: 'Бумага' },
          { value: 'plastic', label: 'Пластик' },
        ]}
        value={material}
        onValueChange={(value) => setMaterial(value as 'paper' | 'plastic')}
      />
    </>
  );

  const renderBadgeFields = () => (
    <>
      <FormField
        label="Клеймо"
        value={stamp}
        onChangeText={setStamp}
        placeholder="Укажите клеймо"
      />
      <FormField
        label="Металл"
        value={metal}
        onChangeText={setMetal}
        placeholder="Укажите металл"
      />
      <FormField
        label="Эмаль"
        value={enamel}
        onChangeText={setEnamel}
        placeholder="Опишите эмаль"
      />
      <FormField
        label="Крепление"
        value={mount}
        onChangeText={setMount}
        placeholder="Укажите тип крепления"
      />
    </>
  );

  const renderStampFields = () => (
    <>
      <FormField
        label="Номер по каталогу"
        value={catalogNumber}
        onChangeText={setCatalogNumber}
        placeholder="Укажите номер по каталогу"
      />
      <FormField
        label="Способ печати"
        value={printMethod}
        onChangeText={setPrintMethod}
        placeholder="Укажите способ печати"
      />
      <FormField
        label="Перфорация"
        value={perforation}
        onChangeText={setPerforation}
        placeholder="Укажите перфорацию"
      />
      <FormField
        label="Формат"
        value={format}
        onChangeText={setFormat}
        placeholder="Укажите формат"
      />
      <FormField
        label="Тираж"
        value={mintage}
        onChangeText={setMintage}
        placeholder="Укажите тираж"
        keyboardType="numeric"
      />
      <FormField
        label="Бумага"
        value={paper}
        onChangeText={setPaper}
        placeholder="Укажите тип бумаги"
      />
    </>
  );

  const renderCategorySpecificFields = () => {
    switch (item.categoryId) {
      case 'coins':
        return renderCoinFields();
      case 'banknotes':
        return renderBanknoteFields();
      case 'badges':
        return renderBadgeFields();
      case 'stamps':
        return renderStampFields();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Редактирование: {categoryName}</Text>

        <ImagePicker
          images={images}
          onImagesChange={setImages}
          maxImages={4}
        />

        <FormField
          label="Наименование"
          value={name}
          onChangeText={setName}
          placeholder="Введите наименование"
        />

        <FormField
          label="Год выпуска"
          value={year}
          onChangeText={setYear}
          placeholder="Введите год выпуска"
          keyboardType="numeric"
        />

        {renderCategorySpecificFields()}

        <FormField
          label="Цена"
          value={price}
          onChangeText={setPrice}
          placeholder="Введите цену"
          keyboardType="numeric"
        />

        <FormField
          label="Описание"
          value={description}
          onChangeText={setDescription}
          placeholder="Введите описание"
          multiline
        />

        <FormField
          label="Заметка"
          value={note}
          onChangeText={setNote}
          placeholder="Введите заметку"
          multiline
        />

        <FormField
          label="Количество"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Введите количество"
          keyboardType="numeric"
        />

        <FormField
          label="Состояние"
          value={condition}
          onChangeText={setCondition}
          placeholder="Укажите состояние"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleUpdateItem}
          >
            <Text style={styles.saveButtonText}>Подтвердить</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});