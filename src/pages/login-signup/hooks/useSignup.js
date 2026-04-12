import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import authApi from '../../../services/auth.service';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../../../utils/validators';

export const useSignup = onSuccessCallback => {
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signupErrors, setSignupErrors] = useState({});
  const { handleAuthSuccess } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleSignupChange = e => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    if (signupErrors[e.target.name]) {
      setSignupErrors({ ...signupErrors, [e.target.name]: '' });
    }
  };

  const handleSignupSubmit = async e => {
    e.preventDefault();
    const errors = {};

    const usernameError = validateUsername(signupData.username);
    if (usernameError) errors.username = usernameError;

    const emailError = validateEmail(signupData.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(signupData.password);
    if (passwordError) errors.password = passwordError;

    const confirmError = validateConfirmPassword(
      signupData.password,
      signupData.confirmPassword
    );
    if (confirmError) errors.confirmPassword = confirmError;

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
    } else {
      setApiError('');
      setIsLoading(true);
      try {
        const response = await authApi.signup({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword,
        });

        setUser(response?.data?.user || null);
        onSuccessCallback();
      } catch (err) {
        const responseData = err.response?.data;

        // Check if the API returned field-specific errors
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          const apiFieldErrors = {};

          // Map each API error to its corresponding field
          responseData.errors.forEach(apiError => {
            if (apiError.field) {
              apiFieldErrors[apiError.field] = apiError.message;
            }
          });

          // Update the form's error state to display under the inputs
          setSignupErrors(apiFieldErrors);
        } else {
          // Fallback for general server errors (e.g., 500 Server Error)
          setApiError(responseData?.message || 'Signup failed');
          setIsErrorModalOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = async otp => {
    setIsLoading(true);
    try {
      // Pull the userId directly from the context we populated during signup!
      const response = await authApi.signupVerifyEmail({
        id: user?.id,
        otp,
      });

      // Update the context to reflect that the user is now verified
      handleAuthSuccess(
        { ...user, emailVerified: true },
        response?.data?.token
      );
    } catch (err) {
      // Throw the error so the OtpForm can catch it and display it locally
      throw new Error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signupData,
    signupErrors,
    apiError,
    isErrorModalOpen,
    setIsErrorModalOpen,
    handleSignupChange,
    handleSignupSubmit,
    handleVerifyOtp,
  };
};
