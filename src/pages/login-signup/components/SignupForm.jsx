import { useState, useEffect } from 'react';
import {
  BiSolidUser,
  BiSolidLockAlt,
  BiSolidEnvelope,
  BiShow,
  BiHide,
} from 'react-icons/bi';
import Button from '../../../components/Button';
import OtpForm from '../../../components/OtpForm';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup.js';
import ErrorModal from '../../../components/ErrorModal.jsx';

const SignupForm = ({ isActive }) => {
  const {
    isLoading,
    signupData,
    signupErrors,
    apiError,
    isErrorModalOpen,
    setIsErrorModalOpen,
    handleSignupChange,
    handleSignupSubmit,
    handleVerifyOtp,
  } = useSignup(() => setStep(2));
  const [step, setStep] = useState(1);

  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSignupPasswordFocused, setIsSignupPasswordFocused] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);
  const [isSignupConfirmPasswordFocused, setIsSignupConfirmPasswordFocused] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isActive) {
      // setSignupErrors({});
      setStep(1);
    }
  }, [isActive]);

  const hasSignupErrors = Object.keys(signupErrors).length > 0;
  const fieldSpacingClass = hasSignupErrors
    ? 'relative my-4 max-[650px]:my-4 max-[400px]:my-3'
    : 'relative my-7 max-[650px]:my-5 max-[400px]:my-4';

  return (
    <div className="absolute right-0 w-1/2 h-full bg-bg-primary flex items-center text-center p-10 z-1 transition-all duration-300 ease-in-out invisible group-[.active]:visible group-[.active]:right-1/2 delay-0 group-[.active]:delay-300 max-[650px]:bottom-0 max-[650px]:w-full max-[650px]:h-[70%] group-[.active]:max-[650px]:right-0 group-[.active]:max-[650px]:bottom-[30%] max-[400px]:p-5">
      {step === 1 ? (
        <form onSubmit={handleSignupSubmit} noValidate className="w-full">
          <h1 className="text-[36px] -my-2.5 font-semibold text-text-primary max-[650px]:text-[30px] max-[650px]:mb-1 max-[400px]:text-[26px]">
            Sign Up
          </h1>

          <div className={fieldSpacingClass}>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={signupData.username}
                onChange={handleSignupChange}
                placeholder="Username"
                className={`w-full px-5 py-3.25 pr-12.5 bg-bg-secondary rounded-lg border-none outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-colors ${
                  signupErrors.username ? 'border-2 border-red-500' : ''
                }`}
              />
              <BiSolidUser className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-primary" />
            </div>
            {signupErrors.username && (
              <p className="text-red-500 text-[12px] mt-1 px-2 m-0 text-left leading-4 wrap-break-word">
                {signupErrors.username}
              </p>
            )}
          </div>

          <div className={fieldSpacingClass}>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="Email"
                className={`w-full px-5 py-3.25 pr-12.5 bg-bg-secondary rounded-lg border-none outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-colors ${
                  signupErrors.email ? 'border-2 border-red-500' : ''
                }`}
              />
              <BiSolidEnvelope className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-primary" />
            </div>
            {signupErrors.email && (
              <p className="text-red-500 text-[12px] mt-1 px-2 m-0 text-left leading-4 wrap-break-word">
                {signupErrors.email}
              </p>
            )}
          </div>

          <div className={fieldSpacingClass}>
            <div className="relative">
              <input
                type={showSignupPassword ? 'text' : 'password'}
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                onFocus={() => setIsSignupPasswordFocused(true)}
                onBlur={() => {
                  setIsSignupPasswordFocused(false);
                  setShowSignupPassword(false);
                }}
                onCopy={e => e.preventDefault()}
                onPaste={e => e.preventDefault()}
                placeholder="Password"
                className={`w-full px-5 py-3.25 pr-20 bg-bg-secondary rounded-lg border-none outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-colors ${
                  signupErrors.password ? 'border-2 border-red-500' : ''
                }`}
              />
              {isSignupPasswordFocused && (
                <div
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-[20px] text-text-primary cursor-pointer z-10"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <BiShow /> : <BiHide />}
                </div>
              )}
              <BiSolidLockAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-primary" />
            </div>
            {signupErrors.password && (
              <p className="text-red-500 text-[12px] mt-1 px-2 m-0 text-left leading-4 wrap-break-word">
                {signupErrors.password}
              </p>
            )}
          </div>

          <div className={fieldSpacingClass}>
            <div className="relative">
              <input
                type={showSignupConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                onFocus={() => setIsSignupConfirmPasswordFocused(true)}
                onBlur={() => {
                  setIsSignupConfirmPasswordFocused(false);
                  setShowSignupConfirmPassword(false);
                }}
                onCopy={e => e.preventDefault()}
                onPaste={e => e.preventDefault()}
                placeholder="Confirm Password"
                className={`w-full px-5 py-3.25 pr-20 bg-bg-secondary rounded-lg border-none outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-colors ${
                  signupErrors.confirmPassword ? 'border-2 border-red-500' : ''
                }`}
              />
              {isSignupConfirmPasswordFocused && (
                <div
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-[20px] text-text-primary cursor-pointer z-10"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() =>
                    setShowSignupConfirmPassword(!showSignupConfirmPassword)
                  }
                >
                  {showSignupConfirmPassword ? <BiShow /> : <BiHide />}
                </div>
              )}
              <BiSolidLockAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-primary" />
            </div>
            {signupErrors.confirmPassword && (
              <p className="text-red-500 text-[12px] mt-1 px-2 m-0 text-left leading-4 wrap-break-word">
                {signupErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>
      ) : (
        <div className="w-full">
          <OtpForm
            email={signupData.email}
            onSubmitOtp={async otp => {
              await handleVerifyOtp(otp);
              navigate('/home');
            }}
            onBack={() => setStep(1)}
          />
        </div>
      )}
      <ErrorModal
        isOpen={isErrorModalOpen}
        message={apiError}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
};

export default SignupForm;
