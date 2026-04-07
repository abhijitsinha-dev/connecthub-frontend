import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import validator from 'validator';
import userApi from '../../../services/user.service';

const ProfileEditModal = ({ isOpen, userData, onClose, onUpdateSuccess }) => {
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

  // Handle Scroll Locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Initialize Form Data
  useEffect(() => {
    if (isOpen && userData) {
      const normalize = (val, placeholder) =>
        val === placeholder ? '' : val || '';

      let formattedDate = '';
      if (userData.dateOfBirth && userData.dateOfBirth !== 'Not provided') {
        const d = new Date(userData.dateOfBirth);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().split('T')[0];
        }
      }

      let initialPhone = normalize(userData.phoneNumber, 'Not provided');
      if (!initialPhone) {
        initialPhone = '+91';
      } else if (!initialPhone.startsWith('+91')) {
        initialPhone = `+91${initialPhone.replace(/^\+?\d{1,3}/, '')}`;
      }

      const validGenders = ['male', 'female', 'other', 'prefer not to say'];
      const currentGender = validGenders.includes(userData.gender)
        ? userData.gender
        : 'prefer not to say';

      setFormData({
        username: userData.username || '',
        fullName: userData.fullName || '',
        bio: normalize(userData.bio, 'No bio available.'),
        phoneNumber: initialPhone,
        gender: currentGender,
        dateOfBirth: formattedDate,
        address: normalize(userData.address, 'Not provided'),
      });

      // Reset errors on open
      setGeneralError('');
      setFieldErrors({});
    }
  }, [isOpen, userData]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;

    // Prevent removing the +91 prefix for phone number
    if (name === 'phoneNumber' && !value.startsWith('+91')) {
      setFormData(prev => ({ ...prev, [name]: '+91' }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear the specific field error when the user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
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

    // Username validation
    const usernameTrimmed = formData.username.trim();
    if (
      !usernameTrimmed ||
      usernameTrimmed.length < 3 ||
      usernameTrimmed.length > 30
    ) {
      errors.username = 'Username must be between 3 and 30 characters.';
    } else if (!/^[a-z0-9_-]+$/.test(usernameTrimmed)) {
      errors.username =
        'username must contain only lowercase letters, numbers, underscores, and hyphens';
    }

    // Full Name validation
    const fullNameTrimmed = formData.fullName.trim();
    if (
      !fullNameTrimmed ||
      fullNameTrimmed.length < 3 ||
      fullNameTrimmed.length > 100
    ) {
      errors.fullName = 'Full name must be between 3 and 100 characters.';
    } else if (!/^[a-zA-Z\s]+$/.test(fullNameTrimmed)) {
      errors.fullName = 'Full name must contain only letters and spaces.';
    }

    // Phone number validation
    const phoneTrimmed = formData.phoneNumber.trim();
    if (phoneTrimmed && phoneTrimmed !== '+91') {
      if (!validator.isMobilePhone(phoneTrimmed)) {
        errors.phoneNumber = 'Please enter a valid phone number.';
      }
    }

    // Stop submission if frontend validation fails
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
          phoneTrimmed === '' || phoneTrimmed === '+91' ? null : phoneTrimmed,
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

      // Map backend Joi schema field errors to local state
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        const backendErrors = {};
        responseData.errors.forEach(errorObj => {
          if (errorObj.field) {
            backendErrors[errorObj.field] = errorObj.message;
          }
        });
        setFieldErrors(backendErrors);
      } else {
        // Fallback for general server/network errors
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

  // Helper function to apply red borders to fields with errors
  const getInputClass = (fieldName, baseClass = '') => {
    const errorClass = fieldErrors[fieldName]
      ? 'border-red-500 focus:border-red-500'
      : 'border-border-primary focus:border-brand-primary';
    return `w-full px-4 py-2 bg-bg-secondary border rounded-xl text-text-primary focus:outline-none transition-colors ${errorClass} ${baseClass}`;
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in backdrop-blur-sm">
      <div
        className="bg-bg-primary rounded-2xl shadow-xl border border-border-primary w-full max-w-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-text-primary mb-6">
          Edit Profile
        </h3>

        {/* General Error Banner (Fallback) */}
        {generalError && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={getInputClass('username')}
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={getInputClass('fullName')}
              />
              {fieldErrors.fullName && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={200}
              rows={3}
              className={getInputClass('bio', 'resize-none')}
              placeholder="Tell us about yourself..."
            />
            <div className="flex justify-between items-center mt-1">
              {fieldErrors.bio ? (
                <p className="text-red-500 text-xs ml-1">{fieldErrors.bio}</p>
              ) : (
                <span></span>
              )}
              <div className="text-right text-xs text-text-secondary">
                {formData.bio.length}/200
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={getInputClass('phoneNumber')}
                placeholder="+91..."
              />
              {fieldErrors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">
                  {fieldErrors.phoneNumber}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={getInputClass('gender', 'appearance-none')}
              >
                <option value="prefer not to say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {fieldErrors.gender && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">
                  {fieldErrors.gender}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                max={new Date().toISOString().split('T')[0]}
                onChange={handleChange}
                className={getInputClass('dateOfBirth')}
              />
              {fieldErrors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">
                  {fieldErrors.dateOfBirth}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                maxLength={200}
                className={getInputClass('address')}
                placeholder="City, Country"
              />
              {fieldErrors.address && (
                <p className="text-red-500 text-xs mt-1.5 ml-1">
                  {fieldErrors.address}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-border-primary">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-2 rounded-xl font-medium text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-xl font-medium bg-brand-primary text-white hover:bg-brand-secondary transition-colors shadow-md disabled:opacity-50 flex items-center justify-center min-w-25"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ProfileEditModal;
