// components/CategoryGrid.tsx
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import {
  StyleSheet, Text, TouchableOpacity,
  View, FlatList, Alert, Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Download, Upload } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import useCollectionStore from '@/store/collection-store';
import useAuthStore from '@/store/auth-store';
import Colors from '@/constants/colors';
import {
  GoogleSignin, statusCodes, User as GoogleUser
} from '@react-native-google-signin/google-signin';
import { GDrive } from '@robinbobin/react-native-google-drive-api-wrapper';
import { SyncContext } from '@/app/sync-context';

export default function CategoryGrid() {
  const router = useRouter();
  const {
    categories, setSelectedCategory,
    getItemCountByCategory, exportData, importData
  } = useCollectionStore();

  const { gdrive, accessToken, setAuth, clearAuth } = useAuthStore();
  const { syncDataToDrive, isSyncing } = useContext(SyncContext);

  const [userInfo, setUserInfo] = useState<GoogleUser | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncingLocal, setIsSyncingLocal] = useState(false);
  const backupNotFoundShownRef = useRef(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Настройка Google Sign-In и проверка сессии
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.appdata'],
      webClientId: 'ВАШ_WEB_CLIENT_ID.apps.googleusercontent.com',
      offlineAccess: true,
    });

    const checkUser = async () => {
      try {
        const user = await GoogleSignin.signInSilently();
        const tokens = await GoogleSignin.getTokens();
        setUserInfo(user);
        const driveApi = new GDrive();
        driveApi.accessToken = tokens.accessToken;
        setAuth(driveApi, tokens.accessToken);
        await loadBackupFromDrive('collection-backup.zip');
      } catch {
        clearAuth();
        setUserInfo(null);
      } finally {
        setSessionChecked(true);
      }
    };
    checkUser();
  }, []);

  // Загрузка бэкапа
  const loadBackupFromDrive = useCallback(async (fileName: string) => {
    if (!gdrive || !accessToken) {
      Alert.alert('Ошибка', 'Вы должны войти в Google, чтобы загрузить данные из Drive');
      return null;
    }
    setIsSyncingLocal(true);
    try {
      const res = await gdrive.files.list({
        spaces: 'appDataFolder',
        q: `name='${fileName}'`,
        fields: 'files(id, name)'
      });
      if (res.files.length === 0) {
        if (!backupNotFoundShownRef.current) {
          Alert.alert('Информация', 'Резервная копия не найдена на Google Drive');
          backupNotFoundShownRef.current = true;
        }
        return null;
      }
      const fileId = res.files[0].id;
      const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!downloadRes.ok) throw new Error('Ошибка загрузки файла');

      const buffer = await downloadRes.arrayBuffer();
      let binary = '';
      new Uint8Array(buffer).forEach(b => binary += String.fromCharCode(b));
      const base64data = btoa(binary);

      const success = await importData(base64data);
      Alert.alert(success ? 'Успех' : 'Ошибка', success ? 'Данные восстановлены' : 'Ошибка при восстановлении');
      return success;
    } catch (e: any) {
      Alert.alert('Ошибка загрузки', e.message);
      return null;
    } finally {
      setIsSyncingLocal(false);
    }
  }, [gdrive, accessToken, importData]);

  // Вход через Google
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      setUserInfo(user);
      const driveApi = new GDrive();
      driveApi.accessToken = tokens.accessToken;
      setAuth(driveApi, tokens.accessToken);
      Alert.alert('Успех', `Вы вошли как ${user.user?.name}`);
      await loadBackupFromDrive('collection-backup.zip');
    } catch (e: any) {
      if (e.code === statusCodes.SIGN_IN_CANCELLED) Alert.alert('Отмена', 'Вход отменён');
      else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
        Alert.alert('Ошибка', 'Google Play Services недоступны');
      else Alert.alert('Ошибка входа', e.message);
      clearAuth();
      setUserInfo(null);
    }
  };

  // Выход из аккаунта
  const signOut = async () => {
    await GoogleSignin.signOut();
    clearAuth();
    setUserInfo(null);
    Alert.alert('Выход', 'Вы вышли из аккаунта');
  };

  // Обработка экспорта
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const zipFileUri = await exportData();
      if (!zipFileUri) throw new Error('Не удалось создать файл экспорта.');

      if (Platform.OS === 'web') {
        const fileName = `collection-backup-${new Date().toISOString().split('T')[0]}.zip`;
        const blob = await fetch(`data:application/zip;base64,${zipFileUri}`).then(r => r.blob());
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Alert.alert('Успех', 'Данные экспортированы в ZIP-архив');
      } else {
        if (userInfo && gdrive) await syncDataToDrive();
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(zipFileUri, { UTI: 'public.zip-archive' });
        } else {
          Alert.alert('Успех', `Файл сохранён: ${zipFileUri.split('/').pop()}`);
        }
      }
    } catch (e: any) {
      Alert.alert('Ошибка', `Не удалось экспортировать данные: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Обработка импорта
  const handleImport = async () => {
    setIsImporting(true);
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.zip';
        await new Promise<void>(resolve => {
          input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = async (ev) => {
                const base64Content = (ev.target?.result as string).split(',')[1];
                const success = await importData(base64Content);
                Alert.alert(success ? 'Успех' : 'Ошибка', success ? 'Данные импортированы' : 'Ошибка импорта');
              };
              reader.readAsDataURL(file);
            }
            resolve();
          };
          input.click();
        });
      } else {
        if (userInfo && gdrive) {
          const success = await loadBackupFromDrive('collection-backup.zip');
          if (success || success === null) {
            setIsImporting(false);
            return;
          }
        }
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/zip', copyToCacheDirectory: true
        });
        if (!result.canceled && result.assets?.length) {
          const success = await importData(result.assets[0].uri);
          Alert.alert(success ? 'Успех' : 'Ошибка', success ? 'Данные импортированы' : 'Ошибка импорта');
        } else {
          Alert.alert('Импорт', 'Выбор файла отменён');
        }
      }
    } catch (e: any) {
      Alert.alert('Ошибка', `Не удалось импортировать: ${e.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity style={styles.categoryButton} onPress={() => { setSelectedCategory(item.id); router.push('/regions'); }}>
      <Text style={styles.categoryText}>{item.name}</Text>
      <Text style={styles.categoryCount}>({getItemCountByCategory(item.id)})</Text>
    </TouchableOpacity>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Text style={styles.footerTitle}>Управление данными</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.actionButton, styles.exportButton, isExporting && styles.disabledButton]} onPress={handleExport} disabled={isExporting}>
          <Download size={20} color="white" /><Text style={styles.actionButtonText}>{isExporting ? 'Экспорт...' : 'Экспорт'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.importButton, isImporting && styles.disabledButton]} onPress={handleImport} disabled={isImporting}>
          <Upload size={20} color="white" /><Text style={styles.actionButtonText}>{isImporting ? 'Импорт...' : 'Импорт'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        {!sessionChecked ? (
          <ActivityIndicator size="small" color={Colors.text} style={{ marginVertical: 10 }} />
        ) : !userInfo ? (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#4285F4' }]} onPress={signInWithGoogle}>
            <Text style={[styles.actionButtonText, { color: 'white', fontWeight: 'bold' }]}>Войти через Google</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={{ textAlign: 'center', color: Colors.text, marginTop: 10 }}>Привет, {userInfo.user.name}!</Text>
            <TouchableOpacity onPress={signOut} disabled={isSyncingLocal || isSyncing} style={[styles.actionButton, { backgroundColor: '#DB4437', marginTop: 10 }]}>
              <Text style={[styles.actionButtonText, { color: 'white', fontWeight: 'bold' }]}>Выйти</Text>
            </TouchableOpacity>
            {(isSyncingLocal || isSyncing) && (
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 }}>
                <ActivityIndicator size="small" color={Colors.textLight} /><Text style={{ marginLeft: 8, color: Colors.textLight }}>Синхронизация...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Выберите категорию коллекции</Text>
      <FlatList data={categories} renderItem={renderItem} keyExtractor={item => item.id} numColumns={3} contentContainerStyle={styles.gridContainer} ListFooterComponent={renderFooter} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 20, textAlign: 'center' },
  gridContainer: { paddingBottom: 20 },
  categoryButton: { flex: 1, aspectRatio: 1, margin: 6, backgroundColor: Colors.card, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.5, padding: 8, borderWidth: 1, borderColor: Colors.border },
  categoryText: { fontSize: 14, fontWeight: '500', color: Colors.text, textAlign: 'center', marginBottom: 4 },
  categoryCount: { fontSize: 12, color: Colors.textLight, textAlign: 'center' },
  footerContainer: { marginTop: 30, padding: 20, backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  footerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, textAlign: 'center', marginBottom: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, gap: 8 },
  exportButton: { backgroundColor: Colors.primary },
  importButton: { backgroundColor: Colors.secondary },
  disabledButton: { opacity: 0.6 },
  actionButtonText: { color: 'white', fontSize: 16, fontWeight: '500' },
});
