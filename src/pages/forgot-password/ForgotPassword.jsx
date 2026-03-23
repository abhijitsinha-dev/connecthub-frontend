import { useState } from "react";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import OtpForm from "../../components/OtpForm";
import ForgotPasswordResetForm from "./components/ForgotPasswordResetForm";
import ForgotPasswordSuccess from "./components/ForgotPasswordSuccess";
import ThemeToggleButton from "../../components/ThemeToggleButton";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/");
  };

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validator.isEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    // TODO: Add your actual API call here to send OTP
    console.log("OTP sent to:", email);
    setStep(2);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-bg-secondary font-sans transition-colors duration-300">
      <ThemeToggleButton />
      <div className="relative w-112.5 bg-bg-primary text-text-primary m-5 p-10 rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] text-center max-[500px]:p-5 max-[500px]:w-full transition-all duration-300">
        {step === 1 && (
          <ForgotPasswordForm
            email={email}
            error={error}
            onChange={handleEmailChange}
            onSubmit={handleEmailSubmit}
            onBackToLogin={handleBackToLogin}
          />
        )}
        {step === 2 && (
          <OtpForm
            email={email}
            onSuccess={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && <ForgotPasswordResetForm onSuccess={() => setStep(4)} />}
        {step === 4 && (
          <ForgotPasswordSuccess onBackToLogin={handleBackToLogin} />
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
