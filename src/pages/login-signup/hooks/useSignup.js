import { useState } from 'react';
import validator from 'validator';
import { useAuth } from '../../../context/AuthContext';
import { authApi } from '../../../services/auth.service';

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
    const usernameRegex = /^[a-z0-9_-]+$/;

    // Username Validation
    if (!signupData.username.trim()) {
      errors.username = 'Username is required';
    } else if (!usernameRegex.test(signupData.username)) {
      errors.username =
        'username must contain only lowercase letters, numbers, underscores, and hyphens';
    }

    // Email Validation using validator
    if (!signupData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validator.isEmail(signupData.email)) {
      errors.email = 'Enter a valid email';
    }

    // Password Strength Validation using validator
    if (!signupData.password) {
      errors.password = 'Password is required';
    } else if (!validator.isStrongPassword(signupData.password)) {
      errors.password =
        'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols';
    }

    // Confirm Password Validation
    if (!signupData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = "Passwords doesn't match";
    }

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

        setUser(response?.data);
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
      await authApi.verifyEmail({
        id: user?.id,
        otp,
      });

      // Update the context to reflect that the user is now verified
      handleAuthSuccess({ ...user, emailVerified: true });
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
