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
  images: string[]; // Это будет массив URI к локальным файлам (file://...)
  categoryId: string;
  regionId: string;
  subcategoryId?: string;
  createdAt: number;
  updatedAt: number;
  slab?: string;
};

export type CoinItem = CollectionItemBase & {
  weight?: string;
  edge?: string;
  mint?: string;
  mintage?: string;
  metal?: string;
  diameter?: string;
  thickness?: string;
  krauseNumber?: string;
};

export type BanknoteItem = CollectionItemBase & {
  denomination?: string;
  country?: string;
  size?: string;
  circulationDate?: string;
  krauseNumber?: string;
  vikNumber?: string;
  modification?: string;
  material?: 'paper' | 'plastic';
};

export type BadgeItem = CollectionItemBase & {
  stamp?: string;
  metal?: string;
  enamel?: string;
  mount?: string;
};

export type StampItem = CollectionItemBase & {
  catalogNumber?: string;
  printMethod?: string;
  perforation?: string;
  format?: string;
  mintage?: string;
  paper?: string;
};

export type WatchItem = CollectionItemBase & {
  brand?: string;
  gender?: 'male' | 'female';
  type?: 'mechanical' | 'hybrid' | 'kvarc';
  metal?: string;
  diameter?: string;
  additional?: string;
};

export type CameraItem = CollectionItemBase & {
  brand?: string;
  series?: string;
  type?: 'film' | 'dslr' | 'mirrorless';
  soapbox?: string;
  filmFormat?: string;
  lens?: string;
  sensorFormat?: string;
  additional?: string;
};

export type ChristmasOrnamentItem = CollectionItemBase & {
  material?: string;
  theme?: string;
  mintage?: string;
  additional?: string;
};

export type ToyItem = CollectionItemBase & {
  factory?: string;
  additional?: string;
};

export type MineralItem = CollectionItemBase & {
  size?: string;
  rarity?: string;
  additional?: string;
};

export type VinylItem = CollectionItemBase & {
  format?: string;
  color?: string;
  shape?: string;
  additional?: string;
};

export type PlasticCardItem = CollectionItemBase & {
  material?: string;
  theme?: string;
  size?: string;
  additional?: string;
};

export type ArtItem = CollectionItemBase & {
  artist?: string;
  additional?: string;
};

export type TicketItem = CollectionItemBase & {
  address?: string;
  usagePlace?: string;
  transportType?: 'bus' | 'trolleybus' | 'cable' | 'cinema' | 'arcade' | 'concert' | 'tram' | 'aviation' | 'railway';
  additional?: string;
};

export type TokenItem = CollectionItemBase & {
  mint?: string;
  country?: string;
  metal?: string;
  weight?: string;
  additional?: string;
};

export type KnifeItem = CollectionItemBase & {
  type?: 'historical' | 'cultural' | 'functional' | 'artistic' | 'individual' | 'specific' | 'thematic' | 'folding' | 'fixed' | 'throwing' | 'switchblade';
  country?: string;
  metal?: string;
  bladeLength?: string;
  bladeWidth?: string;
  stamp?: string;
  additional?: string;
};

export type WargameItem = CollectionItemBase & {
  stamp?: string;
  scale?: string;
  type?: 'realistic' | 'thematic' | 'operational' | 'strategic' | 'anime';
  material?: string;
  additional?: string;
};

export type TeaBagItem = CollectionItemBase & {
  // Only basic fields needed
};

export type PostcardItem = CollectionItemBase & {
  catalogNumber?: string;
};

export type PorcelainItem = CollectionItemBase & {
  stamp?: string;
};

export type MilitaryEmblemItem = CollectionItemBase & {
  // Uses basic fields
};

export type KinderToyItem = CollectionItemBase & {
  factory?: string;
};

export type MobilePhoneItem = CollectionItemBase & {
  brand?: string;
  model?: string;
};

export type CigarettePackItem = CollectionItemBase & {
  brand?: string;
  city?: string;
  packType?: 'hard' | 'soft' | 'flask';
  cigaretteType?: string;
};

export type SamovarItem = CollectionItemBase & {
  manufacturer?: string;
  metal?: 'copper' | 'brass' | 'silver' | 'gold' | 'enameled';
  type?: 'brazier' | 'electric' | 'combined' | 'wood';
  shape?: 'jar' | 'glass' | 'acorn' | 'oval' | 'ball';
};

export type LoanItem = CollectionItemBase & {
  theme?: string;
  signature?: string;
  type?: string;
};

export type LotteryTicketItem = CollectionItemBase & {
  company?: string;
  theme?: string;
  rarity?: string;
};

export type BustItem = CollectionItemBase & {
  theme?: string;
  genre?: string;
  size?: string;
  sculptor?: string;
  material?: 'plaster' | 'metal' | 'marble' | 'wax' | 'granite' | 'bronze' | 'wood';
};

export type BondItem = CollectionItemBase & {
  type?: 'government' | 'municipal' | 'corporate';
  signature?: string;
};

export type StockItem = CollectionItemBase & {
  theme?: string;
  signatures?: string;
};

export type StampCancellationItem = CollectionItemBase & {
  // Uses basic fields
};

export type CollectionItem =
  | CoinItem
  | BanknoteItem
  | BadgeItem
  | StampItem
  | WatchItem
  | CameraItem
  | ChristmasOrnamentItem
  | ToyItem
  | MineralItem
  | VinylItem
  | PlasticCardItem
  | ArtItem
  | TicketItem
  | TokenItem
  | KnifeItem
  | WargameItem
  | TeaBagItem
  | PostcardItem
  | PorcelainItem
  | MilitaryEmblemItem
  | KinderToyItem
  | MobilePhoneItem
  | CigarettePackItem
  | SamovarItem
  | LoanItem
  | LotteryTicketItem
  | BustItem
  | BondItem
  | StockItem
  | StampCancellationItem
  | CollectionItemBase;

export type CollectionState = {
  categories: CollectionCategory[];
  regions: Region[];
  items: CollectionItem[];
  selectedCategory: string | null;
  selectedRegion: string | null;
  selectedSubcategory: string | null;
  searchQuery: string;

  // Actions
  setSelectedCategory: (categoryId: string | null) => void;
  setSelectedRegion: (regionId: string | null) => void;
  setSelectedSubcategory: (subcategoryId: string | null) => void;
  setSearchQuery: (query: string) => void;

  // Измененные типы для addItem и updateItem, чтобы они принимали CollectionItem,
  // так как логика копирования изображения теперь внутри стора.
  // Omit 'id', 'createdAt', 'updatedAt' по-прежнему актуален для addItem,
  // так как эти поля генерируются стором.
  addItem: (item: Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt' | 'images'> & { images: string[] }) => Promise<void>;
  updateItem: (id: string, item: Partial<Omit<CollectionItem, 'images'> & { images?: string[] }>) => Promise<void>;


  deleteItem: (id: string) => Promise<void>; // deleteItem тоже теперь асинхронный
  getFilteredItems: () => CollectionItem[];
  getItemById: (id: string) => CollectionItem | undefined;

  // ОБНОВЛЕННЫЕ ТИПЫ ДЛЯ exportData и importData
  exportData: () => Promise<string>; // Возвращает Promise<string> (URI к ZIP-файлу)
  importData: (data: string) => Promise<boolean>; // Принимает string (URI ZIP-файла или base64 для Web), возвращает Promise<boolean>

  getItemCountByCategory: (categoryId: string) => number;
};
