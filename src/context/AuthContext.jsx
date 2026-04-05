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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // A helper function to update the user state after login/signup
  const handleAuthSuccess = useCallback(userData => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  }, []);

  // A helper function for logging out
  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    router.navigate('/');
  }, []);

  // The value object contains everything you want to make globally available
  const value = useMemo(
    () => ({
      user,
      isLoggedIn,
      isLoading,
      setIsLoading,
      handleAuthSuccess,
      logout,
    }),
    [user, isLoggedIn, isLoading, handleAuthSuccess, logout]
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
