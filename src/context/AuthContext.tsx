// AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, useContext, ReactNode, useState} from 'react';

interface AuthContextProps {
  children: ReactNode;
}

interface AuthContextValue {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<AuthContextProps> = ({children}) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  const authenticate = (token: string | null) => {
    if (token) {
      AsyncStorage.setItem('accessToken', token);
      setAuthToken(token);
    }
  };

  const contextValue: AuthContextValue = {
    authToken,
    setAuthToken: authenticate,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
