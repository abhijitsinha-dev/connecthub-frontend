import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust the import path as needed
import { authApi } from '../services/auth.service';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const { handleAuthSuccess, logout, setIsLoading, isLoggedIn } = useAuth();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return; // Prevent multiple checks on re-renders

    const verifySession = async () => {
      // 2. If not logged in, boot them to the login page
      if (!isLoggedIn) {
        navigate('/');
        return;
      }

      // 3. If they are marked as logged in, verify with the API
      try {
        setIsLoading(true);

        // TODO: Replace this fetch with your actual API call endpoint/axios instance
        const response = await authApi.me(); // This should return the current user's data if the session is valid
        console.log(response);

        handleAuthSuccess(response.data);
        navigate('/home');
      } catch (error) {
        console.error('Failed to verify user session:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();

    hasChecked.current = true;
  }, [navigate, handleAuthSuccess, logout, setIsLoading, isLoggedIn]);
};
