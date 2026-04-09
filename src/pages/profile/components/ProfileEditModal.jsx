import { createPortal } from 'react-dom';
import useProfileEditForm from '../hooks/useProfileEditForm';
import useScrollLock from '../../../hooks/useScrollLock';

const ProfileEditModal = ({ isOpen, userData, onClose, onUpdateSuccess }) => {
  useScrollLock(isOpen);

  const {
    formData,
    isLoading,
    generalError,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useProfileEditForm({ isOpen, userData, onClose, onUpdateSuccess });

  if (!isOpen) return null;

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

        {generalError && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
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
              onChange={handleChange}
              maxLength={200}
              rows={3}
              className={getInputClass('bio', 'resize-none')}
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
