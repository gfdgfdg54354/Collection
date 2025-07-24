import React, { createContext, useContext, useState } from 'react';
import { GDrive } from '@robinbobin/react-native-google-drive-api-wrapper';
import useAuthStore from '@/store/auth-store';
import useCollectionStore from '@/store/collection-store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

const SyncContext = createContext<{
  syncDataToDrive?: () => Promise<void>;
  signInWithGoogle?: () => Promise<void>;
}>({});

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { gdrive, accessToken, setAuth } = useAuthStore();
  const { exportData, importData } = useCollectionStore();

  // Инициализация Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '788176423580-vfec6hfm1c3dt9sdlm4cgvgmskp7ai3g.apps.googleusercontent.com', // Замените на ваш webClientId
      scopes: ['https://www.googleapis.com/auth/drive.file'], // Разрешения для работы с Google Drive
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const gdriveInstance = new GDrive();
      gdriveInstance.accessToken = userInfo.serverAuthCode; // Используйте serverAuthCode для сервера или токен
      setAuth(gdriveInstance, userInfo.serverAuthCode);
      Alert.alert('Успех', 'Вы успешно вошли в Google');
      return userInfo;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Ошибка', 'Не удалось войти в Google: ' + (error as Error).message);
      throw error;
    }
  };

  const syncDataToDrive = async () => {
    if (!gdrive || !accessToken) {
      Alert.alert('Ошибка', 'Необходимо авторизоваться в Google');
      throw new Error('Not authenticated');
    }

    try {
      // Экспорт данных в ZIP
      const zipUri = await exportData((percent) => {
        console.log('Экспорт прогресс:', percent);
      });

      // Загрузка файла на Google Drive
      const fileMetadata = {
        name: `collection_backup_${new Date().toISOString().split('T')[0]}.zip`,
        parents: ['appDataFolder'], // Используем appDataFolder для приватных данных
      };
      const file = await gdrive.files.create({
        resource: fileMetadata,
        media: {
          mimeType: 'application/zip',
          body: zipUri, // Предполагается, что zipUri - это URI файла
        },
      });

      Alert.alert('Успех', 'Данные успешно синхронизированы с Google Drive');
      console.log('Файл загружен, ID:', file.data.id);
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
      Alert.alert('Ошибка', 'Не удалось синхронизировать данные: ' + (error as Error).message);
      throw error;
    }
  };

  return (
    <SyncContext.Provider value={{ syncDataToDrive, signInWithGoogle }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncContext = () => useContext(SyncContext);