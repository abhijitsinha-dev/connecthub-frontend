import { useState, useEffect } from "react";
import {
  BiSolidUser,
  BiSolidLockAlt,
  BiSolidEnvelope,
  BiShow,
  BiHide,
} from "react-icons/bi";
import validator from "validator";
import Button from "../../../components/Button";
import OtpForm from "../../../components/OtpForm";
import { useNavigate } from "react-router-dom";

const SignupForm = ({ isActive }) => {
  const [step, setStep] = useState(1);
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSignupPasswordFocused, setIsSignupPasswordFocused] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] =
    useState(false);
  const [isSignupConfirmPasswordFocused, setIsSignupConfirmPasswordFocused] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isActive) {
      setSignupErrors({});
      setStep(1);
    }
  }, [isActive]);

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    if (signupErrors[e.target.name]) {
      setSignupErrors({ ...signupErrors, [e.target.name]: "" });
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    // Username Validation
    if (!signupData.username.trim()) errors.username = "Username is required";

    // Email Validation using validator
    if (!signupData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(signupData.email)) {
      errors.email = "Enter a valid email";
    }

    // Password Strength Validation using validator
    if (!signupData.password) {
      errors.password = "Password is required";
    } else if (!validator.isStrongPassword(signupData.password)) {
      errors.password = "Password is not strong";
    }

    // Confirm Password Validation
    if (!signupData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = "Passwords doesn't match";
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
    } else {
      console.log("Signup submitted:", signupData);
      // Add your signup API call here
      setStep(2);
    }
  };

  return (
    <div className="absolute right-0 w-1/2 h-full bg-bg-primary flex items-center text-center p-10 z-1 transition-all duration-300 ease-in-out invisible group-[.active]:visible group-[.active]:right-1/2 delay-0 group-[.active]:delay-300 max-[650px]:bottom-0 max-[650px]:w-full max-[650px]:h-[70%] group-[.active]:max-[650px]:right-0 group-[.active]:max-[650px]:bottom-[30%] max-[400px]:p-5">
      {step === 1 ? (
        <form onSubmit={handleSignupSubmit} noValidate className="w-full">
          <h1 className="text-[36px] -my-2.5 font-semibold text-text-primary max-[650px]:text-[30px] max-[650px]:mb-1 max-[400px]:text-[26px]">
            Sign Up
          </h1>

          <div className="relative my-7.5 max-[650px]:my-3 max-[400px]:my-2">
            <input
              type="text"
              name="username"
              value={signupData.username}
              onChange={handleSignupChange}
              placeholder="Username"
              className={`w-full px-5 py-3.25 pr-12.5 bg-bg-secondary rounded-lg border-none outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-colors ${
                signupErrors.username ? "border-2 border-red-500" : ""
              }`}
            />
            <BiSolidUser className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-primary" />
            {signupErrors.username && (
              <p className="text-red-500 text-[12px] absolute -bottom-5 left-2 m-0 text-left w-full">
                {signupErrors.username}
              </p>
            )}
          </div>

          <div className="relative my-7.5 max-[650px]:my-3 max-[400px]:my-2">
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              placeholder="Email"
              className={`w-full px-5 py-3.25 pr-12.5 bg-bg-secondary rounded-lg border-none outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-colors ${
                signupErrors.email ? "border-2 border-red-500" : ""
              }`}
            />
            <BiSolidEnvelope className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-primary" />
            {signupErrors.email && (
              <p className="text-red-500 text-[12px] absolute -bottom-5 left-2 m-0 text-left w-full">
                {signupErrors.email}
              </p>
            )}
          </div>

          <div className="relative my-7.5 max-[650px]:my-3 max-[400px]:my-2">
            <input
              type={showSignupPassword ? "text" : "password"}
              name="password"
              value={signupData.password}
              onChange={handleSignupChange}
              onFocus={() => setIsSignupPasswordFocused(true)}
              onBlur={() => {
                setIsSignupPasswordFocused(false);
                setShowSignupPassword(false);
              }}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              placeholder="Password"
              className={`w-full px-5 py-3.25 pr-20 bg-bg-secondary rounded-lg border-none outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-colors ${
                signupErrors.password ? "border-2 border-red-500" : ""
              }`}
            />
            {isSignupPasswordFocused && (
              <div
                className="absolute right-12 top-1/2 -translate-y-1/2 text-[20px] text-text-primary cursor-pointer z-10"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              >
                {showSignupPassword ? <BiShow /> : <BiHide />}
              </div>
            )}
            <BiSolidLockAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-primary" />
            {signupErrors.password && (
              <p className="text-red-500 text-[12px] absolute -bottom-5 left-2 m-0 text-left w-full">
                {signupErrors.password}
              </p>
            )}
          </div>

          <div className="relative my-7.5 max-[650px]:my-3 max-[400px]:my-2">
            <input
              type={showSignupConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={signupData.confirmPassword}
              onChange={handleSignupChange}
              onFocus={() => setIsSignupConfirmPasswordFocused(true)}
              onBlur={() => {
                setIsSignupConfirmPasswordFocused(false);
                setShowSignupConfirmPassword(false);
              }}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              placeholder="Confirm Password"
              className={`w-full px-5 py-3.25 pr-20 bg-bg-secondary rounded-lg border-none outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-colors ${
                signupErrors.confirmPassword ? "border-2 border-red-500" : ""
              }`}
            />
            {isSignupConfirmPasswordFocused && (
              <div
                className="absolute right-12 top-1/2 -translate-y-1/2 text-[20px] text-text-primary cursor-pointer z-10"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  setShowSignupConfirmPassword(!showSignupConfirmPassword)
                }
              >
                {showSignupConfirmPassword ? <BiShow /> : <BiHide />}
              </div>
            )}
            <BiSolidLockAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-primary" />
            {signupErrors.confirmPassword && (
              <p className="text-red-500 text-[12px] absolute -bottom-5 left-2 m-0 text-left w-full">
                {signupErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-2">
            Sign Up
          </Button>
        </form>
      ) : (
        <div className="w-full">
          <OtpForm
            email={signupData.email}
            onSuccess={() => {
              console.log("OTP verified for signup");
              // TODO: Proceed after signup OTP verification
              navigate("/home");
            }}
            onBack={() => setStep(1)}
          />
        </div>
      )}
    </div>
  );
};

export default SignupForm;
