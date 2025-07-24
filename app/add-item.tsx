import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import useCollectionStore from '@/store/collection-store';
import FormField from '@/components/FormField';
import DropdownSelector from '@/components/DropdownSelector';
import Colors from '@/constants/colors';
import { useSync } from '@/app/sync-context';

const CATEGORY_FIELDS = {
  coins: [
    { label: 'Наименование', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Вес', name: 'weight' },
    { label: 'Гурт', name: 'edge' },
    { label: 'Монетный двор', name: 'mint' },
    { label: 'Тираж', name: 'mintage' },
    { label: 'Металл', name: 'metal' },
    { label: 'Диаметр', name: 'diameter' },
    { label: 'Толщина', name: 'thickness' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Заметка', name: 'note', multiline: true },
    { label: 'Номер по Краузе', name: 'krauseNumber' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'СЛАБ', name: 'slab' },
  ],
  banknotes: [
    { label: 'Наименование', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Номинал', name: 'nominal' },
    { label: 'Страна', name: 'country' },
    { label: 'Размер банкноты', name: 'size' },
    { label: 'Введение в обращение', name: 'circulationStart' },
    { label: 'Номер по Краузе', name: 'krauseNumber' },
    { label: 'Номер по ВИК', name: 'vikNumber' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Заметка', name: 'note', multiline: true },
    { label: 'Модификация', name: 'modification' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Материал', name: 'material', type: 'dropdown', options: [
      { value: 'paper', label: 'Бумага' },
      { value: 'plastic', label: 'Пластик' }
    ] },
    { label: 'СЛАБ', name: 'slab' },
  ],
  badges: [
    { label: 'Наименование', name: 'name' },
    { label: 'Клеймо', name: 'stamp' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Металл', name: 'metal' },
    { label: 'Эмаль', name: 'enamel' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
    { label: 'Крепление', name: 'fastener' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Заметка', name: 'note', multiline: true },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Состояние', name: 'condition' },
  ],
  stamps: [
    { label: 'Наименование', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Номер по каталогу', name: 'catalogNumber' },
    { label: 'Способ печати', name: 'printType' },
    { label: 'Перфорация', name: 'perforation' },
    { label: 'Формат', name: 'format' },
    { label: 'Тираж', name: 'mintage' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
    { label: 'Бумага', name: 'paperType' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Заметка', name: 'note', multiline: true },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Состояние', name: 'condition' },
  ],
  watches: [
    { label: 'Название', name: 'name' },
    { label: 'Фирма', name: 'brand' },
    { label: 'Пол', name: 'gender', type: 'dropdown', options: [
      { value: 'male', label: 'Мужские' },
      { value: 'female', label: 'Женские' },
    ]},
    { label: 'Тип', name: 'type', type: 'dropdown', options: [
      { value: 'quartz', label: 'Кварцевые' },
      { value: 'mechanical', label: 'Механические' },
      { value: 'hybrid', label: 'Гибридные' },
    ]},
    { label: 'Металл', name: 'metal', type: 'dropdown', options: [
      { value: 'white-gold', label: 'Золото белое' },
      { value: 'yellow-gold', label: 'Золото жёлтое' },
      { value: 'rose-gold', label: 'Золото розовое' },
      { value: 'silver', label: 'Серебро' },
      { value: 'platinum', label: 'Платина' },
      { value: 'stainless-steel', label: 'Сталь нержавеющая' },
      { value: 'surgical-steel', label: 'Сталь хирургическая' },
      { value: 'titanium', label: 'Титан' },
      { value: 'aluminum', label: 'Алюминий' },
      { value: 'brass', label: 'Латунь' },
      { value: 'bronze', label: 'Бронза' },
      { value: 'palladium', label: 'Палладий' },
      { value: 'rhodium', label: 'Родий (покрытие)' },
    ]},
    { label: 'Диаметр', name: 'diameter' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  cameras: [
    { label: 'Название', name: 'name' },
    { label: 'Фирма', name: 'brand' },
    { label: 'Серия', name: 'series' },
    { label: 'Тип', name: 'type', type: 'dropdown', options: [
      { value: 'film', label: 'Пленочные' },
      { value: 'dslr', label: 'Зеркальные' },
      { value: 'mirrorless', label: 'Беззеркальные' }
    ] },
    { label: 'Мыльница', name: 'compact' },
    { label: 'Формат пленки', name: 'filmFormat' },
    { label: 'Объектив', name: 'lens' },
    { label: 'Формат сенсора', name: 'sensorFormat' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  christmasToys: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Материал', name: 'material' },
    { label: 'Тематика', name: 'theme' },
    { label: 'Тираж', name: 'mintage' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  toys: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Материал', name: 'material' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  minerals: [
    { label: 'Название', name: 'name' },
    { label: 'Размер', name: 'size' },
    { label: 'Редкость', name: 'rarity' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  vinylRecords: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Формат', name: 'format' },
    { label: 'Цвет', name: 'color' },
    { label: 'Форма', name: 'shape' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  plasticCards: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Материал', name: 'material' },
    { label: 'Тема', name: 'theme' },
    { label: 'Размер', name: 'size' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  paintings: [
    { label: 'Название', name: 'name' },
    { label: 'Год', name: 'year', keyboardType: 'numeric' },
    { label: 'Художник', name: 'artist' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  icons: [
    { label: 'Название', name: 'name' },
    { label: 'Год', name: 'year', keyboardType: 'numeric' },
    { label: 'Художник', name: 'artist' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  tickets: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Адрес', name: 'address' },
    { label: 'Место использования', name: 'placeOfUse' },
    {
      label: 'Тип билета', name: 'ticketType', type: 'dropdown', options: [
        { value: 'bus', label: 'Автобус' },
        { value: 'trolleybus', label: 'Троллейбус' },
        { value: 'cableway', label: 'Канатка' },
        { value: 'cinema', label: 'Кинотеатр' },
        { value: 'arcade', label: 'Игровые автоматы' },
        { value: 'concert', label: 'Концертные' },
        { value: 'tram', label: 'Трамвай' },
        { value: 'air', label: 'Авиационный' },
        { value: 'rail', label: 'Железнодорожный' }
      ]
    },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
    { label: 'СЛАБ', name: 'slab' },
  ],
  coupons: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Адрес', name: 'address' },
    { label: 'Место использования', name: 'placeOfUse' },
    {
      label: 'Тип купона', name: 'ticketType', type: 'dropdown', options: [
        { value: 'bus', label: 'Автобус' },
        { value: 'trolleybus', label: 'Троллейбус' },
        { value: 'cableway', label: 'Канатка' },
        { value: 'cinema', label: 'Кинотеатр' },
        { value: 'arcade', label: 'Игровые автоматы' },
        { value: 'concert', label: 'Концертные' },
        { value: 'tram', label: 'Трамвай' },
        { value: 'air', label: 'Авиационный' },
        { value: 'rail', label: 'Железнодорожный' }
      ]
    },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  medals: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  books: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Автор', name: 'author' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  lighters: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  sugarPackets: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  teaBags: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  vintage: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  stampCancellations: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  cars: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  candyWrappers: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Фирма/Завод', name: 'factory' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  wwiiItems: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  kinderToys: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Завод/Фирма', name: 'factory' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  vinyl: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Формат', name: 'format' },
    { label: 'Цвет', name: 'color' },
    { label: 'Форма', name: 'shape' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  christmasOrnaments: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Материал', name: 'material' },
    { label: 'Тематика', name: 'theme' },
    { label: 'Тираж', name: 'mintage' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  painting: [
    { label: 'Название', name: 'name' },
    { label: 'Год', name: 'year', keyboardType: 'numeric' },
    { label: 'Художник', name: 'artist' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  pictures: [
    { label: 'Название', name: 'name' },
    { label: 'Год', name: 'year', keyboardType: 'numeric' },
    { label: 'Художник', name: 'artist' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  receipts: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Адрес', name: 'address' },
    { label: 'Место использования', name: 'placeOfUse' },
    { label: 'Тип чека', name: 'ticketType', type: 'dropdown', options: [
      { value: 'bus', label: 'Автобус' },
      { value: 'trolleybus', label: 'Троллейбус' },
      { value: 'cableway', label: 'Канатка' },
      { value: 'cinema', label: 'Кинотеатр' },
      { value: 'arcade', label: 'Игровые автоматы' },
      { value: 'concert', label: 'Концертные' },
      { value: 'tram', label: 'Трамвай' },
      { value: 'air', label: 'Авиационный' },
      { value: 'rail', label: 'Железнодорожный' }
    ]},
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  envelopes: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  postcards: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Номер по каталогу АО "Марка"', name: 'catalogNumber' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  chevrons: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  militaryBadges: [
  { label: 'Название', name: 'name' },
  { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
  {
    label: 'Тип',
    name: 'type',
    type: 'dropdown',
    options: [
      { value: 'chevron', label: 'Шеврон' },
      { value: 'cockade', label: 'Кокарда' },
      { value: 'emblem', label: 'Эмблема' },
      { value: 'patch', label: 'Нашивка' },
      { value: 'badge', label: 'Значок' }
    ]
  },
  { label: 'Род войск', name: 'branch' },
  { label: 'Страна', name: 'country' },
  { label: 'Материал', name: 'material' },
  { label: 'Размер (мм)', name: 'size' },
  { label: 'Крепление', name: 'fastener' },
  { label: 'Состояние', name: 'condition' },
  { label: 'Описание', name: 'description', multiline: true },
  { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
  { label: 'Цена', name: 'price', keyboardType: 'numeric' }
],
  knives: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    {
      label: 'Тип ножа',
      name: 'type',
      type: 'dropdown',
      options: [
        { value: 'historical', label: 'Исторические' },
        { value: 'cultural', label: 'Культурные' },
        { value: 'functional', label: 'Функциональные' },
        { value: 'artistic', label: 'Художественные' },
        { value: 'individual', label: 'Индивидуальные' },
        { value: 'specific', label: 'Специфические' },
        { value: 'thematic', label: 'Тематические' },
        { value: 'folding', label: 'Складные' },
        { value: 'fixed', label: 'С фиксацией лезвия' },
        { value: 'throwing', label: 'Метательные' },
        { value: 'switchblade', label: 'Выкидные' }
      ]
    },
    { label: 'Страна', name: 'country' },
    { label: 'Металл', name: 'metal' },
    { label: 'Длина лезвия (мм)', name: 'bladeLength', keyboardType: 'numeric' },
    { label: 'Ширина лезвия (мм)', name: 'bladeWidth', keyboardType: 'numeric' },
    { label: 'Клеймо', name: 'stamp' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  wargame: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Клеймо', name: 'stamp' },
    { label: 'Масштаб', name: 'scale' },
    {
      label: 'Тип',
      name: 'type',
      type: 'dropdown',
      options: [
        { value: 'realistic', label: 'Реалистичные' },
        { value: 'thematic', label: 'Тематические' },
        { value: 'operational', label: 'Операционные' },
        { value: 'strategic', label: 'Стратегические' },
        { value: 'anime', label: 'Аниме' }
      ]
    },
    { label: 'Материал', name: 'material' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  tokens: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Монетный двор', name: 'mint' },
    { label: 'Страна', name: 'country' },
    { label: 'Металл', name: 'metal' },
    { label: 'Вес (г)', name: 'weight', keyboardType: 'numeric' },
    { label: 'Дополнительно', name: 'additional', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  porcelain: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Клеймо', name: 'stamp' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  mobilePhones: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Фирма', name: 'brand' },
    { label: 'Модель', name: 'model' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  cigarettePacks: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Фирма', name: 'brand' },
    { label: 'Город', name: 'city' },
    {
      label: 'Тип пачки',
      name: 'packType',
      type: 'dropdown',
      options: [
        { value: 'hard', label: 'Твердая' },
        { value: 'soft', label: 'Мягкая' },
        { value: 'kolba', label: 'Колба' }
      ]
    },
    { label: 'Тип сигарет', name: 'cigaretteType' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  samovars: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Производитель', name: 'manufacturer' },
    {
      label: 'Металл',
      name: 'metal',
      type: 'dropdown',
      options: [
        { value: 'copper', label: 'Медь' },
        { value: 'brass', label: 'Латунь' },
        { value: 'silver', label: 'Серебро' },
        { value: 'gold', label: 'Золото' },
        { value: 'enamel', label: 'Эмалированные' }
      ]
    },
    {
      label: 'Тип',
      name: 'type',
      type: 'dropdown',
      options: [
        { value: 'heating', label: 'Жаровые' },
        { value: 'electric', label: 'Электрические' },
        { value: 'combined', label: 'Комбинированные' },
        { value: 'wood', label: 'Дровянные' }
      ]
    },
    {
      label: 'Форма',
      name: 'shape',
      type: 'dropdown',
      options: [
        { value: 'jar', label: 'Банка' },
        { value: 'shot', label: 'Рюмка' },
        { value: 'acorn', label: 'Желудь' },
        { value: 'oval', label: 'Овал' },
        { value: 'ball', label: 'Шар' }
      ]
    },
    { label: 'Состояние', name: 'condition' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  loans: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Тема', name: 'theme' },
    { label: 'Подпись', name: 'signature' },
    { label: 'Вид', name: 'type' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  lotteryTickets: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Фирма', name: 'company' },
    { label: 'Тема', name: 'theme' },
    { label: 'Редкость', name: 'rarity' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  busts: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Тема', name: 'theme' },
    { label: 'Жанр', name: 'genre' },
    { label: 'Размер (см)', name: 'size', keyboardType: 'numeric' },
    { label: 'ФИО Скульптора', name: 'sculptor' },
    {
      label: 'Материал',
      name: 'material',
      type: 'dropdown',
      options: [
        { value: 'gypsum', label: 'Гипс' },
        { value: 'metal', label: 'Металл' },
        { value: 'marble', label: 'Мрамор' },
        { value: 'wax', label: 'Воск' },
        { value: 'granite', label: 'Гранит' },
        { value: 'bronze', label: 'Бронза' },
        { value: 'wood', label: 'Дерево' }
      ]
    },
    { label: 'Состояние', name: 'condition' },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  stocks: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    { label: 'Тема', name: 'theme' },
    { label: 'Подписи', name: 'signatures' },
    { label: 'Состояние', name: 'condition' },
    { label: 'СЛАБ', name: 'slab' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ],
  bonds: [
    { label: 'Название', name: 'name' },
    { label: 'Год выпуска', name: 'year', keyboardType: 'numeric' },
    {
      label: 'Вид',
      name: 'type',
      type: 'dropdown',
      options: [
        { value: 'government', label: 'Государственные' },
        { value: 'municipal', label: 'Муниципальные' },
        { value: 'corporate', label: 'Корпоративные' }
      ]
    },
    { label: 'Подпись', name: 'signature' },
    { label: 'Состояние', name: 'condition' },
    { label: 'Описание', name: 'description', multiline: true },
    { label: 'Количество', name: 'quantity', keyboardType: 'numeric' },
    { label: 'Цена', name: 'price', keyboardType: 'numeric' },
  ]
};

export default function AddItemScreen() {
  const router = useRouter();
  const {
    selectedCategory,
    selectedRegion,
    selectedSubcategory,
    addItem
  } = useCollectionStore();

  const { syncDataToDrive, signInWithGoogle, isSignedIn } = useContext(SyncContext);

  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [fields, setFields] = useState<Record<string, any>>({});

  const fieldsDef = CATEGORY_FIELDS[selectedCategory || ''] || [{ label: 'Наименование', name: 'name' }];

  const handleFieldChange = (name: string, value: string) =>
    setFields(prev => ({ ...prev, [name]: value }));

  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Требуется разрешение доступа к фото');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setImages([...images, result.assets[0].uri]);
      setCurrentImage(images.length);
    }
  };

  const handleRemoveImage = () => {
    if (images.length > 0) {
      const newImages = [...images];
      newImages.splice(currentImage, 1);
      setImages(newImages);
      setCurrentImage(i => (i > 0 ? i - 1 : 0));
    }
  };

  const handlePrevImage = () => {
    if (images.length > 1) setCurrentImage(i => (i - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    if (images.length > 1) setCurrentImage(i => (i + 1) % images.length);
  };

  const handleAddItem = async () => {
    if (!fields.name) {
      alert('Введите наименование');
      return;
    }

    addItem({
      ...fields,
      images,
      categoryId: selectedCategory,
      regionId: selectedRegion,
      subcategoryId: selectedSubcategory,
    });

    try {
      if (!isSignedIn) await signInWithGoogle?.();
      if (syncDataToDrive) {
        await syncDataToDrive();
      }
      Alert.alert('Успех', 'Предмет добавлен и синхронизирован');
    } catch (e) {
      console.warn('Ошибка синхронизации:', e);
      Alert.alert('Ошибка', 'Не удалось синхронизировать данные с Google Drive');
    }

    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imagesArea}>
          <TouchableOpacity onPress={handlePrevImage} disabled={images.length < 2}>
            <Text style={[styles.arrow, { opacity: images.length < 2 ? 0.3 : 1 }]}> &lt; </Text>
          </TouchableOpacity>

          {images.length > 0 ? (
            <Image
              source={{ uri: images[currentImage] }}
              style={styles.bigImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.emptyImage}>
              <Text style={{ color: '#bbb' }}>Нет фото</Text>
            </View>
          )}

          <TouchableOpacity onPress={handleNextImage} disabled={images.length < 2}>
            <Text style={[styles.arrow, { opacity: images.length < 2 ? 0.3 : 1 }]}> &gt; </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageButtonsRow}>
          <TouchableOpacity onPress={handleAddImage} style={styles.addImgBtn}>
            <Text>Добавить изображение</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRemoveImage}
            style={styles.delImgBtn}
            disabled={images.length === 0}
          >
            <Text style={{ opacity: images.length === 0 ? 0.7 : 1 }}>
              Удалить изображение
            </Text>
          </TouchableOpacity>
        </View>

        {fieldsDef.map((field) =>
          field.type === 'dropdown' ? (
            <DropdownSelector
              key={field.name}
              label={field.label}
              options={field.options}
              value={fields[field.name] || ''}
              onValueChange={(v) => handleFieldChange(field.name, v)}
            />
          ) : (
            <FormField
              key={field.name}
              label={field.label}
              value={fields[field.name] || ''}
              onChangeText={(v) => handleFieldChange(field.name, v)}
              placeholder={field.label}
              multiline={field.multiline}
              keyboardType={field.keyboardType}
            />
          )
        )}

        <TouchableOpacity style={styles.addBtn} onPress={handleAddItem}>
          <Text style={styles.addBtnText}>Добавить</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 16, paddingBottom: 40 },
  imagesArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  bigImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: Colors.card,
  },
  emptyImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    paddingHorizontal: 12,
  },
  imageButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 14,
  },
  addImgBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 10,
    marginRight: 7,
  },
  delImgBtn: {
    backgroundColor: Colors.error,
    borderRadius: 8,
    padding: 10,
    marginLeft: 7,
  },
  addBtn: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});