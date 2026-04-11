import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useProfileEditForm from '../hooks/useProfileEditForm';
import useSecuritySettings from '../hooks/useSecuritySettings';
import useScrollLock from '../../../hooks/useScrollLock';
import { BiUser, BiShieldQuarter, BiX, BiShow, BiHide } from 'react-icons/bi';

const ProfileEditModal = ({ isOpen, userData, onClose, onUpdateSuccess }) => {
  useScrollLock(isOpen);
  const [activeTab, setActiveTab] = useState('profile');

  // Password visibility state
  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const toggleShowPass = field => {
    setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Existing Profile Form Hook
  const {
    formData,
    isLoading: isProfileLoading,
    generalError: profileError,
    fieldErrors,
    handleChange: handleProfileChange,
    handleSubmit: handleProfileSubmit,
    handleCancel: handleProfileCancel,
  } = useProfileEditForm({ isOpen, userData, onClose, onUpdateSuccess });

  // Security Settings Hook
  const {
    passData,
    passStatus,
    handlePassChange,
    handlePasswordSubmit,
    emailData,
    emailStep,
    setEmailStep,
    emailStatus,
    handleEmailChange,
    handleSendOtp,
    handleVerifyOtp,
    resetSecurityState,
  } = useSecuritySettings(userData, onUpdateSuccess);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('profile');
      resetSecurityState();
      setShowPass({ old: false, new: false, confirm: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const getInputClass = (
    fieldName,
    errorsObj = fieldErrors,
    baseClass = ''
  ) => {
    const errorClass = errorsObj[fieldName]
      ? 'border-red-500 focus:border-red-500'
      : 'border-border-primary focus:border-brand-primary';
    return `w-full px-4 py-2 bg-bg-secondary border rounded-xl text-text-primary focus:outline-none transition-colors ${errorClass} ${baseClass}`;
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-bg-primary rounded-2xl shadow-xl border border-border-primary w-full max-w-2xl flex flex-col relative max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header & Tabs */}
        <div className="px-6 pt-6 sm:px-8 sm:pt-8 shrink-0">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-text-primary">Settings</h3>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-full transition-all"
            >
              <BiX className="text-2xl" />
            </button>
          </div>

          <div className="flex gap-6 border-b border-border-primary">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 font-medium flex items-center gap-2 transition-colors relative ${
                activeTab === 'profile'
                  ? 'text-brand-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <BiUser className="text-lg" />
              Profile Info
              {activeTab === 'profile' && (
                <div className="absolute -bottom-px left-0 w-full h-0.5 bg-brand-primary rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 font-medium flex items-center gap-2 transition-colors relative ${
                activeTab === 'security'
                  ? 'text-brand-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <BiShieldQuarter className="text-lg" />
              Account Security
              {activeTab === 'security' && (
                <div className="absolute -bottom-px left-0 w-full h-0.5 bg-brand-primary rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          {/* ================= PROFILE TAB ================= */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              {profileError && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                  {profileError}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* ... (Existing Profile form contents remain untouched) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleProfileChange}
                      className={getInputClass('username')}
                    />
                    {fieldErrors.username && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">
                        {fieldErrors.username}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleProfileChange}
                      className={getInputClass('fullName')}
                    />
                    {fieldErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">
                        {fieldErrors.fullName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleProfileChange}
                    maxLength={200}
                    rows={3}
                    className={getInputClass('bio', fieldErrors, 'resize-none')}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-red-500 text-xs ml-1">
                      {fieldErrors.bio || ''}
                    </p>
                    <div className="text-right text-xs text-text-secondary">
                      {formData.bio.length}/200
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleProfileChange}
                      className={getInputClass('phoneNumber')}
                      placeholder="+91..."
                    />
                    {fieldErrors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">
                        {fieldErrors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleProfileChange}
                      className={getInputClass(
                        'gender',
                        fieldErrors,
                        'appearance-none'
                      )}
                    >
                      <option value="prefer not to say">
                        Prefer not to say
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={handleProfileChange}
                      className={getInputClass('dateOfBirth')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleProfileChange}
                      maxLength={200}
                      className={getInputClass('address')}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-border-primary">
                  <button
                    type="button"
                    onClick={handleProfileCancel}
                    disabled={isProfileLoading}
                    className="px-6 py-2 rounded-xl font-medium text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProfileLoading}
                    className="px-6 py-2 rounded-xl font-medium bg-brand-primary text-white hover:bg-brand-secondary transition-colors shadow-md disabled:opacity-50 flex items-center justify-center min-w-35"
                  >
                    {isProfileLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= SECURITY TAB ================= */}
          {activeTab === 'security' && (
            <div className="animate-fade-in space-y-8">
              {/* CHANGE PASSWORD SECTION */}
              <div className="bg-bg-secondary/50 p-5 rounded-2xl border border-border-primary">
                <h4 className="text-lg font-bold text-text-primary mb-4">
                  Change Password
                </h4>

                {passStatus.generalError && (
                  <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded-lg">
                    {passStatus.generalError}
                  </p>
                )}
                {passStatus.success && (
                  <p className="text-green-500 text-sm mb-4 bg-green-500/10 p-2 rounded-lg">
                    {passStatus.success}
                  </p>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Old Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass.old ? 'text' : 'password'}
                        name="oldPassword"
                        value={passData.oldPassword}
                        onChange={handlePassChange}
                        required
                        className={getInputClass(
                          'oldPassword',
                          passStatus.fieldErrors,
                          'pr-10 bg-bg-primary'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPass('old')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                      >
                        {showPass.old ? (
                          <BiShow size={20} />
                        ) : (
                          <BiHide size={20} />
                        )}
                      </button>
                    </div>
                    {passStatus.fieldErrors?.oldPassword && (
                      <p className="text-red-500 text-xs mt-1.5 ml-1">
                        {passStatus.fieldErrors.oldPassword}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPass.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passData.newPassword}
                          onChange={handlePassChange}
                          required
                          className={getInputClass(
                            'newPassword',
                            passStatus.fieldErrors,
                            'pr-10 bg-bg-primary'
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPass('new')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                        >
                          {showPass.new ? (
                            <BiShow size={20} />
                          ) : (
                            <BiHide size={20} />
                          )}
                        </button>
                      </div>
                      {passStatus.fieldErrors?.newPassword && (
                        <p className="text-red-500 text-xs mt-1.5 ml-1">
                          {passStatus.fieldErrors.newPassword}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPass.confirm ? 'text' : 'password'}
                          name="confirmNewPassword"
                          value={passData.confirmNewPassword}
                          onChange={handlePassChange}
                          required
                          className={getInputClass(
                            'confirmNewPassword',
                            passStatus.fieldErrors,
                            'pr-10 bg-bg-primary'
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowPass('confirm')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                        >
                          {showPass.confirm ? (
                            <BiShow size={20} />
                          ) : (
                            <BiHide size={20} />
                          )}
                        </button>
                      </div>
                      {passStatus.fieldErrors?.confirmNewPassword && (
                        <p className="text-red-500 text-xs mt-1.5 ml-1">
                          {passStatus.fieldErrors.confirmNewPassword}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={
                        passStatus.loading ||
                        !passData.oldPassword ||
                        !passData.newPassword ||
                        !passData.confirmNewPassword
                      }
                      className="px-6 py-2 rounded-xl font-medium bg-text-primary text-bg-primary hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-40"
                    >
                      {passStatus.loading ? (
                        <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* CHANGE EMAIL SECTION */}
              <div className="bg-bg-secondary/50 p-5 rounded-2xl border border-border-primary">
                <h4 className="text-lg font-bold text-text-primary mb-4">
                  Update Email Address
                </h4>

                {emailStatus.generalError && (
                  <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded-lg">
                    {emailStatus.generalError}
                  </p>
                )}
                {emailStatus.success && (
                  <p className="text-green-500 text-sm mb-4 bg-green-500/10 p-2 rounded-lg">
                    {emailStatus.success}
                  </p>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Current Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={userData.email}
                    className="w-full px-4 py-2 bg-bg-primary/50 border border-border-primary rounded-xl text-text-secondary cursor-not-allowed"
                  />
                </div>

                {emailStep === 1 ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        New Email Address
                      </label>
                      <input
                        type="email"
                        name="newEmail"
                        value={emailData.newEmail}
                        onChange={handleEmailChange}
                        required
                        placeholder="Enter new email..."
                        className={getInputClass(
                          'newEmail',
                          emailStatus.fieldErrors,
                          'bg-bg-primary'
                        )}
                      />
                      {emailStatus.fieldErrors?.newEmail && (
                        <p className="text-red-500 text-xs mt-1.5 ml-1">
                          {emailStatus.fieldErrors.newEmail}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={emailStatus.loading || !emailData.newEmail}
                        className="px-6 py-2 rounded-xl font-medium bg-brand-primary text-white hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center justify-center min-w-35"
                      >
                        {emailStatus.loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Send OTP'
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form
                    onSubmit={handleVerifyOtp}
                    className="space-y-4 animate-fade-in"
                  >
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">
                        Enter Verification Code
                      </label>
                      <p className="text-xs text-text-secondary mb-2">
                        We sent a code to{' '}
                        <span className="font-semibold text-text-primary">
                          {emailData.newEmail}
                        </span>
                      </p>
                      <input
                        type="text"
                        name="otp"
                        value={emailData.otp}
                        onChange={handleEmailChange}
                        required
                        placeholder="e.g. 123456"
                        maxLength={6}
                        className={getInputClass(
                          'otp',
                          emailStatus.fieldErrors,
                          'bg-bg-primary tracking-widest font-mono text-center'
                        )}
                      />
                      {emailStatus.fieldErrors?.otp && (
                        <p className="text-red-500 text-xs mt-1.5 ml-1">
                          {emailStatus.fieldErrors.otp}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setEmailStep(1)}
                        className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                      >
                        Change Email
                      </button>
                      <button
                        type="submit"
                        disabled={
                          emailStatus.loading || emailData.otp.length < 6
                        }
                        className="px-6 py-2 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-40"
                      >
                        {emailStatus.loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Verify & Update'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileEditModal;
