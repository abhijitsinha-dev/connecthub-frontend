import {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import router from '../router/Router';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Useful for showing spinners during auth calls
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // A helper function to update the user state after login/signup
  const handleAuthSuccess = useCallback((userData, token) => {
    setUser(userData);
    if (token) {
      setToken(token);
      localStorage.setItem('token', token);
    }
  }, []);

  // A helper function for logging out
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.navigate('/');
  }, []);

  // The value object contains everything you want to make globally available
  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      setIsLoading,
      handleAuthSuccess,
      logout,
    }),
    [user, token, isLoading, handleAuthSuccess, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
