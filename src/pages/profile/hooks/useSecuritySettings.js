import { useState } from 'react';
// TODO: Adjust this import path to point to your actual API instance
import authApi from '../../../services/auth.service';
import { validateEmail } from '../../../utils/validators';

const useSecuritySettings = (userData, onUpdateSuccess) => {
  // Password State
  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passStatus, setPassStatus] = useState({
    loading: false,
    generalError: '',
    success: '',
    fieldErrors: {},
  });

  // Email State
  const [emailData, setEmailData] = useState({ newEmail: '', otp: '' });
  const [emailStep, setEmailStep] = useState(1); // 1: Request OTP, 2: Verify OTP
  const [emailStatus, setEmailStatus] = useState({
    loading: false,
    generalError: '',
    success: '',
    fieldErrors: {},
  });

  // Helper to parse the API error response format into field-specific errors
  const parseApiErrors = err => {
    const apiErrors = err.response?.data?.errors;
    if (Array.isArray(apiErrors)) {
      const formattedErrors = {};
      apiErrors.forEach(e => {
        formattedErrors[e.field] = e.message;
      });
      return formattedErrors;
    }
    return {};
  };

  // --- PASSWORD HANDLERS ---
  const handlePassChange = e => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
    setPassStatus(prev => ({
      ...prev,
      generalError: '',
      success: '',
      fieldErrors: { ...prev.fieldErrors, [e.target.name]: '' },
    }));
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();

    // Client-side validation to set field errors
    const errors = {};
    if (passData.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters.';
    }
    if (passData.newPassword !== passData.confirmNewPassword) {
      errors.confirmNewPassword = 'New passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      return setPassStatus({
        loading: false,
        generalError: '',
        success: '',
        fieldErrors: errors,
      });
    }

    try {
      setPassStatus({
        loading: true,
        generalError: '',
        success: '',
        fieldErrors: {},
      });

      const payload = {
        oldPassword: passData.oldPassword.trim(),
        newPassword: passData.newPassword.trim(),
        confirmNewPassword: passData.confirmNewPassword.trim(),
      };

      await authApi.updatePassword(payload);

      setPassStatus({
        loading: false,
        generalError: '',
        fieldErrors: {},
        success: 'Password updated successfully!',
      });
      setPassData({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); // reset form
    } catch (err) {
      const apiFieldErrors = parseApiErrors(err);
      setPassStatus({
        loading: false,
        fieldErrors: apiFieldErrors,
        generalError:
          Object.keys(apiFieldErrors).length === 0
            ? err.response?.data?.message || 'Failed to update password.'
            : '',
        success: '',
      });
    }
  };

  // --- EMAIL HANDLERS ---
  const handleEmailChange = e => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
    setEmailStatus(prev => ({
      ...prev,
      generalError: '',
      success: '',
      fieldErrors: { ...prev.fieldErrors, [e.target.name]: '' },
    }));
  };

  const handleSendOtp = async e => {
    e.preventDefault();
    const formattedEmail = emailData.newEmail.trim().toLowerCase();

    const emailError = validateEmail(formattedEmail);
    if (emailError) {
      return setEmailStatus({
        loading: false,
        generalError: '',
        success: '',
        fieldErrors: { newEmail: emailError },
      });
    }
    if (formattedEmail === userData.email) {
      return setEmailStatus({
        loading: false,
        generalError: '',
        success: '',
        fieldErrors: { newEmail: 'This is already your current email.' },
      });
    }

    try {
      setEmailStatus({
        loading: true,
        generalError: '',
        success: '',
        fieldErrors: {},
      });

      await authApi.emailChange({ newEmail: formattedEmail });

      setEmailStatus({
        loading: false,
        generalError: '',
        fieldErrors: {},
        success: 'OTP sent to your new email!',
      });
      setEmailStep(2);
    } catch (err) {
      const apiFieldErrors = parseApiErrors(err);
      setEmailStatus({
        loading: false,
        fieldErrors: apiFieldErrors,
        generalError:
          Object.keys(apiFieldErrors).length === 0
            ? err.response?.data?.message || 'Failed to send OTP.'
            : '',
        success: '',
      });
    }
  };

  const handleVerifyOtp = async e => {
    e.preventDefault();
    if (emailData.otp.length !== 6) {
      return setEmailStatus({
        loading: false,
        generalError: '',
        success: '',
        fieldErrors: { otp: 'Please enter a valid 6-digit OTP.' },
      });
    }

    try {
      setEmailStatus({
        loading: true,
        generalError: '',
        success: '',
        fieldErrors: {},
      });

      await authApi.emailChangeVerifyOtp({
        otp: emailData.otp,
        newEmail: emailData.newEmail.trim().toLowerCase(),
      });

      setEmailStatus({
        loading: false,
        generalError: '',
        fieldErrors: {},
        success: 'Email updated successfully!',
      });

      if (onUpdateSuccess) {
        onUpdateSuccess({ email: emailData.newEmail.trim().toLowerCase() });
      }

      setTimeout(() => {
        setEmailStep(1);
        setEmailData({ newEmail: '', otp: '' });
        setEmailStatus({
          loading: false,
          generalError: '',
          success: '',
          fieldErrors: {},
        });
      }, 2000);
    } catch (err) {
      const apiFieldErrors = parseApiErrors(err);
      setEmailStatus({
        loading: false,
        fieldErrors: apiFieldErrors,
        generalError:
          Object.keys(apiFieldErrors).length === 0
            ? err.response?.data?.message || 'Failed to verify OTP.'
            : '',
        success: '',
      });
    }
  };

  const resetSecurityState = () => {
    setPassData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    setPassStatus({
      loading: false,
      generalError: '',
      success: '',
      fieldErrors: {},
    });
    setEmailData({ newEmail: '', otp: '' });
    setEmailStep(1);
    setEmailStatus({
      loading: false,
      generalError: '',
      success: '',
      fieldErrors: {},
    });
  };

  return {
    passData,
    passStatus,
    handlePassChange,
    handlePasswordSubmit,
    emailData,
    emailStep,
    setEmailStep, // Fixed: Added export
    emailStatus,
    handleEmailChange,
    handleSendOtp,
    handleVerifyOtp,
    resetSecurityState,
  };
};

export default useSecuritySettings;
