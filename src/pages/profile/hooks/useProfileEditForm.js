import { useState, useEffect } from 'react';
import userApi from '../../../services/user.service';
import {
  validateUsername,
  validateFullName,
  validatePhoneNumber,
} from '../../../utils/validators';

const useProfileEditForm = ({ isOpen, userData, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    bio: '',
    phoneNumber: '',
    gender: 'prefer not to say',
    dateOfBirth: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isOpen && userData) {
      const normalize = (val, placeholder) =>
        val === placeholder ? '' : val || '';

      let formattedDate = '';
      if (userData.dateOfBirth && userData.dateOfBirth !== 'Not provided') {
        const d = new Date(userData.dateOfBirth);
        if (!isNaN(d.getTime())) formattedDate = d.toISOString().split('T')[0];
      }

      let initialPhone = normalize(userData.phoneNumber, 'Not provided');
      if (!initialPhone) initialPhone = '+91';
      else if (!initialPhone.startsWith('+91'))
        initialPhone = `+91${initialPhone.replace(/^\+?\d{1,3}/, '')}`;

      const validGenders = ['male', 'female', 'other', 'prefer not to say'];
      const currentGender = validGenders.includes(userData.gender)
        ? userData.gender
        : 'prefer not to say';

      setFormData({
        username: userData.username || '',
        fullName: userData.fullName || '',
        bio: normalize(userData.bio, 'Not provided'),
        phoneNumber: initialPhone,
        gender: currentGender,
        dateOfBirth: formattedDate,
        address: normalize(userData.address, 'Not provided'),
      });

      setGeneralError('');
      setFieldErrors({});
    }
  }, [isOpen, userData]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'phoneNumber' && !value.startsWith('+91')) {
      setFormData(prev => ({ ...prev, [name]: '+91' }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name])
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    setGeneralError('');
  };

  const handleCancel = () => {
    setGeneralError('');
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});
    const errors = {};

    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;

    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) errors.fullName = fullNameError;

    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        bio: formData.bio.trim(),
        phoneNumber:
          formData.phoneNumber.trim() === '' || formData.phoneNumber.trim() === '+91' ? null : formData.phoneNumber.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || null,
        address: formData.address.trim(),
      };

      await userApi.updateLoggedInUser(payload);
      onUpdateSuccess(payload);
      handleCancel();
    } catch (err) {
      console.error('Error updating profile:', err);
      const responseData = err.response?.data;

      if (responseData?.errors && Array.isArray(responseData.errors)) {
        const backendErrors = {};
        responseData.errors.forEach(errorObj => {
          if (errorObj.field) backendErrors[errorObj.field] = errorObj.message;
        });
        setFieldErrors(backendErrors);
      } else {
        setGeneralError(
          responseData?.message ||
            responseData?.error ||
            'Failed to update profile. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    generalError,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleCancel,
  };
};

export default useProfileEditForm;
