import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import authApi from '../../../services/auth.service';
import { useAuth } from '../../../context/AuthContext';

export const useLogin = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const { handleAuthSuccess } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginChange = e => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (loginErrors[e.target.name]) {
      setLoginErrors({ ...loginErrors, [e.target.name]: '' });
    }
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    const errors = {};

    if (!loginData.email.trim()) errors.email = 'Email is required';
    if (!loginData.password) errors.password = 'Password is required';

    if (loginData.email && loginData.password) {
      const isEmailValid = validator.isEmail(loginData.email);
      const isPasswordStrong = validator.isStrongPassword(loginData.password);

      if (!isEmailValid || !isPasswordStrong) {
        errors.email = 'Incorrect email or password';
        errors.password = 'Incorrect email or password';
      }
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
    } else {
      setApiError('');
      setIsLoading(true);
      try {
        const response = await authApi.login({
          email: loginData.email,
          password: loginData.password,
        });

        const { user, token } = response.data;

        handleAuthSuccess(user, token);
        navigate('/home');
      } catch (err) {
        const responseData = err.response?.data;

        // Check if the API returned field-specific errors
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          // Map each API error to its corresponding field
          errors.email = 'Incorrect email or password';
          errors.password = 'Incorrect email or password';

          // Update the form's error state to display under the inputs
          setLoginErrors(errors);
        } else {
          // Fallback for general server errors (e.g., 500 Server Error)
          setApiError(responseData?.message || 'Login failed');
          setIsErrorModalOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    loginData,
    loginErrors,
    handleLoginChange,
    handleLoginSubmit,
    isLoading,
    apiError,
    isErrorModalOpen,
    setIsErrorModalOpen,
  };
};
