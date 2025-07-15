import { CollectionCategory, Region } from '@/types/collection';

export const CATEGORIES: CollectionCategory[] = [
  { id: 'coins', name: 'Монеты' },
  { id: 'banknotes', name: 'Банкноты' },
  { id: 'stamps', name: 'Марки' },
  { id: 'badges', name: 'Значки' },
  { id: 'medals', name: 'Медали' },
  { id: 'books', name: 'Книги' },
  { id: 'awards', name: 'Награды' },
  { id: 'envelopes', name: 'Конверты' },
  { id: 'postcards', name: 'Открытки' },
  { id: 'lighters', name: 'Зажигалки' },
  { id: 'forms', name: 'Формы' },
  { id: 'sugarPackets', name: 'Сахар в пакетиках' },
  { id: 'teaBags', name: 'Чайные пакетики' },
  { id: 'vintage', name: 'Винтаж' },
  { id: 'figures', name: 'Фигурки' },
  { id: 'cars', name: 'Машинки' },
  { id: 'chevrons', name: 'Шевроны' },
  { id: 'candyWrappers', name: 'Обертки конфет' },
  { id: 'wwiiItems', name: 'Предметы ВОВ' },
  { id: 'misc', name: 'Разное' },
];

export const REGIONS: Region[] = [
  { id: 'russia', name: 'Россия' },
  { id: 'cis', name: 'СНГ' },
  { id: 'foreign', name: 'Зарубежные' },
  { id: 'kbr', name: 'КБР' },
];