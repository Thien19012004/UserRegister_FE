import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/apiClient';
import { loginUser } from '../api/userApi';
import { tokenService } from './tokenService';

type AuthContextType = {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(tokenService.getToken());

  // Sync login/logout across tabs
  useEffect(() => {
    const handler = async (e: StorageEvent) => {
      if (e.key !== 'auth_event' || !e.newValue) return;

      if (e.newValue.startsWith('logout')) {
        tokenService.setToken(null);
        setAccessToken(null);
      }

      if (e.newValue.startsWith('login')) {
        try {
          const resp = await api.post('/auth/refresh');
          const newAccess = resp.data?.accessToken;
          if (newAccess) {
            tokenService.setToken(newAccess);
            setAccessToken(newAccess);
          }
        } catch {
          tokenService.setToken(null);
          setAccessToken(null);
        }
      }
    };

    window.addEventListener('storage', handler as any);
    return () => window.removeEventListener('storage', handler as any);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await loginUser({ email, password });
      const token = res?.accessToken;

      if (!token) {
        throw new Error('No access token returned from server');
      }

      tokenService.setToken(token);
      setAccessToken(token);

      // notify other tabs
      localStorage.setItem('auth_event', `login:${Date.now()}`);
    } catch (err) {
      // ❗ MUST rethrow for Login page to show error & stop loading
      throw err;
    }
  };

  const logout = async () => {
    tokenService.setToken(null);
    setAccessToken(null);

    // notify other tabs
    localStorage.setItem('auth_event', `logout:${Date.now()}`);

    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore – state already cleared */
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
