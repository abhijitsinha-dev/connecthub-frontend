import ForgotPasswordForm from './components/ForgotPasswordForm';
import OtpForm from '../../components/OtpForm';
import ForgotPasswordResetForm from './components/ForgotPasswordResetForm';
import ForgotPasswordSuccess from './components/ForgotPasswordSuccess';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import useForgotPasswordFlow from './hooks/useForgotPasswordFlow';

const ForgotPassword = () => {
  const {
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
  } = useForgotPasswordFlow();

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-bg-secondary font-sans transition-colors duration-300">
      <ThemeToggleButton />
      <div className="relative w-112.5 bg-bg-primary text-text-primary m-5 p-10 rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] text-center max-[500px]:p-5 max-[500px]:w-full transition-all duration-300">
        {step === 1 && (
          <ForgotPasswordForm
            email={email}
            error={emailError}
            isLoading={isLoading}
            onChange={handleEmailChange}
            onSubmit={handleEmailSubmit}
            onBackToLogin={handleBackToLogin}
          />
        )}

        {step === 2 && (
          <OtpForm
            email={email}
            onSubmitOtp={handleOtpSubmit}
            onBack={goBackToEmailStep}
          />
        )}

        {step === 3 && (
          <ForgotPasswordResetForm
            passwords={passwords}
            errors={passwordErrors}
            onChange={handlePasswordsChange}
            onSubmit={handlePasswordSubmit}
            isLoading={isLoading}
          />
        )}

        {step === 4 && (
          <ForgotPasswordSuccess onBackToLogin={handleBackToLogin} />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
