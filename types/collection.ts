export type CollectionCategory = {
  id: string;
  name: string;
  icon?: string;
};

export type Region = {
  id: string;
  name: string;
};

export type CollectionItemBase = {
  id: string;
  name: string;
  year: string;
  price: string;
  description: string;
  note: string;
  quantity: string;
  condition: string;
  images: string[];
  categoryId: string;
  regionId: string;
  createdAt: number;
  updatedAt: number;
};

export type CoinItem = CollectionItemBase & {
  weight: string;
  edge: string; // гурт
  mint: string; // монетный двор
  mintage: string; // тираж
  metal: string;
  diameter: string;
  thickness: string;
  krauseNumber: string;
};

export type BanknoteItem = CollectionItemBase & {
  denomination: string; // номинал
  country: string;
  size: string;
  circulationDate: string; // введение в обращение
  krauseNumber: string;
  vikNumber: string;
  modification: string;
  material: 'paper' | 'plastic'; // бумага или пластик
};

export type BadgeItem = CollectionItemBase & {
  stamp: string; // клеймо
  metal: string;
  enamel: string; // эмаль
  mount: string; // крепление
};

export type StampItem = CollectionItemBase & {
  catalogNumber: string;
  printMethod: string;
  perforation: string;
  format: string;
  mintage: string;
  paper: string;
};

export type CollectionItem =
  | CoinItem
  | BanknoteItem
  | BadgeItem
  | StampItem
  | CollectionItemBase;

export type CollectionState = {
  categories: CollectionCategory[];
  regions: Region[];
  items: CollectionItem[];
  selectedCategory: string | null;
  selectedRegion: string | null;
  searchQuery: string;

  // Actions
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedRegion: (regionId: string | null) => void;
  setSearchQuery: (query: string) => void;
  addItem: (item: Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<CollectionItem>) => void;
  deleteItem: (id: string) => void;
  getFilteredItems: () => CollectionItem[];
  getItemById: (id: string) => CollectionItem | undefined;
};