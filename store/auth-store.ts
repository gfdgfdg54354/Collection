import create from 'zustand';
import { GDrive } from '@robinbobin/react-native-google-drive-api-wrapper';

interface AuthState {
  gdrive: GDrive | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (gdrive: GDrive | null, accessToken: string | null) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  gdrive: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (gdrive, accessToken) => {
    if (!gdrive || !accessToken) return;
    set({ gdrive, accessToken, isAuthenticated: true });
  },

  clearAuth: () => set({ gdrive: null, accessToken: null, isAuthenticated: false }),
}));

export default useAuthStore;
