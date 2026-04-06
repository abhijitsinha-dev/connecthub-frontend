import { useState, useEffect } from 'react';
import { BiSolidLockAlt, BiShow, BiHide } from 'react-icons/bi';
import { useBlocker } from 'react-router-dom';
import Button from '../../../components/Button';

const ForgotPasswordResetForm = ({
  passwords,
  errors,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmLeave = window.confirm(
        'Are you sure you want to go back? You will be redirected to the login form.'
      );
      if (confirmLeave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  useEffect(() => {
    const handleBeforeUnload = e => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // UI Only States
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  return (
    <form onSubmit={onSubmit} noValidate className="animate-fade-in">
      <h1 className="text-[32px] mb-2 font-semibold text-text-primary">
        Reset Password
      </h1>
      <p className="text-[14.5px] text-text-secondary mb-8">
        Create a new strong password for your account.
      </p>

      {errors.server && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
          {errors.server}
        </div>
      )}

      <div className="relative my-6">
        <input
          type={showNewPassword ? 'text' : 'password'}
          name="newPassword"
          value={passwords.newPassword}
          onChange={onChange}
          onFocus={() => setIsNewPasswordFocused(true)}
          onBlur={() => {
            setIsNewPasswordFocused(false);
            setShowNewPassword(false);
          }}
          onCopy={e => e.preventDefault()}
          onPaste={e => e.preventDefault()}
          placeholder="New Password"
          className={`w-full px-5 py-3.25 pr-20 bg-bg-secondary rounded-lg outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-all ${
            errors.newPassword
              ? 'border-2 border-red-500'
              : 'border-2 border-transparent focus:border-brand-primary'
          }`}
        />
        {isNewPasswordFocused && (
          <div
            className="absolute right-12 top-1/2 -translate-y-1/2 text-[20px] text-text-secondary cursor-pointer z-10"
            onMouseDown={e => e.preventDefault()}
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <BiShow /> : <BiHide />}
          </div>
        )}
        <BiSolidLockAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-secondary" />
        {errors.newPassword && (
          <p className="text-red-500 text-[12px] absolute -bottom-5 left-2 m-0 text-left w-full">
            {errors.newPassword}
          </p>
        )}
      </div>

      <div className="relative my-6">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={onChange}
          onFocus={() => setIsConfirmPasswordFocused(true)}
          onBlur={() => {
            setIsConfirmPasswordFocused(false);
            setShowConfirmPassword(false);
          }}
          onCopy={e => e.preventDefault()}
          onPaste={e => e.preventDefault()}
          placeholder="Confirm Password"
          className={`w-full px-5 py-3.25 pr-20 bg-bg-secondary rounded-lg outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-all ${
            errors.confirmPassword
              ? 'border-2 border-red-500'
              : 'border-2 border-transparent focus:border-brand-primary'
          }`}
        />
        {isConfirmPasswordFocused && (
          <div
            className="absolute right-12 top-1/2 -translate-y-1/2 text-[20px] text-text-secondary cursor-pointer z-10"
            onMouseDown={e => e.preventDefault()}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <BiShow /> : <BiHide />}
          </div>
        )}
        <BiSolidLockAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-secondary" />
        {errors.confirmPassword && (
          <p className="text-red-500 text-[12px] absolute -bottom-5 left-2 m-0 text-left w-full">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <Button type="submit" className="mt-2" disabled={isLoading}>
        {isLoading ? 'Changing...' : 'Change Password'}
      </Button>
    </form>
  );
};

export default ForgotPasswordResetForm;
