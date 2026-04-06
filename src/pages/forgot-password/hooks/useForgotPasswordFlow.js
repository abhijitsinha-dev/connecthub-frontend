import { useState } from 'react';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import authApi from '../../../services/auth.service';

const useForgotPasswordFlow = () => {
  const navigate = useNavigate();

  // --- Flow State ---
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [resetToken, setResetToken] = useState(null);

  // NEW: Global loading state for all async actions
  const [isLoading, setIsLoading] = useState(false);

  // --- Form States ---
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // --- Error States ---
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});

  // --- Navigation Logic ---
  const handleBackToLogin = () => navigate('/');
  const goBackToEmailStep = () => setStep(1);

  // --- Step 1: Request OTP Logic ---
  const handleEmailChange = e => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleEmailSubmit = async e => {
    e.preventDefault();

    if (!email.trim()) return setEmailError('Email is required');
    if (!validator.isEmail(email))
      return setEmailError('Please enter a valid email address');

    setEmailError('');
    setIsLoading(true); // Start loading

    try {
      const response = await authApi.forgotPassword(email);
      if (response.status === 'success') {
        setUserId(response.data.id);
        setStep(2);
      }
    } catch (err) {
      setEmailError(
        err.response?.data?.message ||
          'Failed to send password reset email. Please try again.'
      );
    } finally {
      setIsLoading(false); // Stop loading regardless of success/fail
    }
  };

  // --- Step 2: Verify OTP Logic ---
  const handleOtpSubmit = async otp => {
    setIsLoading(true); // Start loading
    try {
      const response = await authApi.forgotPasswordVerifyOtp({
        id: userId,
        email: email,
        otp: otp,
      });

      if (response.status === 'success') {
        setResetToken(response.data.resetToken);
        setStep(3);
      }
    } catch (err) {
      console.error('OTP Verification failed:', err);
      throw err;
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // --- Step 3: Reset Password Logic ---
  const handlePasswordsChange = e => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (passwordErrors[e.target.name] || passwordErrors.server) {
      setPasswordErrors({ ...passwordErrors, [e.target.name]: '', server: '' });
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    const newErrors = {};

    if (!passwords.newPassword) newErrors.newPassword = 'Password is required';
    else if (!validator.isStrongPassword(passwords.newPassword))
      newErrors.newPassword = 'Password is not strong enough';

    if (!passwords.confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password';
    else if (passwords.newPassword !== passwords.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await authApi.resetPassword({
        resetToken: resetToken,
        newPassword: passwords.newPassword,
        confirmNewPassword: passwords.confirmPassword,
      });

      if (response.status === 'success') {
        setStep(4);
      }
    } catch (err) {
      setPasswordErrors({
        ...passwordErrors,
        server:
          err.response?.data?.message ||
          'Failed to reset password. Please try again.',
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return {
    step,
    email,
    emailError,
    passwords,
    passwordErrors,
    isLoading,
    handleEmailChange,
    handleEmailSubmit,
    handleOtpSubmit,
    handlePasswordsChange,
    handlePasswordSubmit,
    handleBackToLogin,
    goBackToEmailStep,
  };
};

export default useForgotPasswordFlow;
