import { useState, useEffect } from "react";
import {
  BiSolidEnvelope,
  BiSolidLockAlt,
  BiShow,
  BiHide,
} from "react-icons/bi";
import validator from "validator";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

const LoginForm = ({ isActive }) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoginPasswordFocused, setIsLoginPasswordFocused] = useState(false);

  useEffect(() => {
    if (isActive) {
      setLoginErrors({});
    }
  }, [isActive]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (loginErrors[e.target.name]) {
      setLoginErrors({ ...loginErrors, [e.target.name]: "" });
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    // 1. Check if fields are empty
    if (!loginData.email.trim()) errors.email = "Email is required";
    if (!loginData.password) errors.password = "Password is required";

    // 2. If not empty, validate format and strength
    if (loginData.email && loginData.password) {
      const isEmailValid = validator.isEmail(loginData.email);
      const isPasswordStrong = validator.isStrongPassword(loginData.password);

      if (!isEmailValid || !isPasswordStrong) {
        // Display generic error for security on login failure
        errors.email = "Email or password is incorrect";
        errors.password = "Email or password is incorrect";
      }
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
    } else {
      console.log("Login submitted:", loginData);
      // Add your login API call here
      navigate("/home");
    }
  };

  return (
    <div className="absolute right-0 w-1/2 h-full bg-bg-primary flex items-center text-center p-10 z-1 transition-all duration-300 ease-in-out delay-300 group-[.active]:right-1/2 max-[650px]:bottom-0 max-[650px]:w-full max-[650px]:h-[70%] group-[.active]:max-[650px]:right-0 group-[.active]:max-[650px]:bottom-[30%] max-[400px]:p-5">
      <form onSubmit={handleLoginSubmit} noValidate className="w-full">
        <h1 className="text-[36px] -my-2.5 font-semibold text-text-primary max-[650px]:text-[30px] max-[650px]:mb-2">
          Login
        </h1>

        <div className="relative my-7.5 max-[650px]:my-4 max-[400px]:my-3">
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            placeholder="Email"
            className={`w-full px-5 py-3.25 pr-12.5 bg-bg-secondary rounded-lg border-none outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-colors ${
              loginErrors.email ? "border-2 border-red-500" : ""
            }`}
          />
          <BiSolidEnvelope className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-primary" />
          {loginErrors.email && (
            <p className="text-red-500 text-[12px] absolute -bottom-5 left-2 m-0 text-left w-full">
              {loginErrors.email}
            </p>
          )}
        </div>

        <div className="relative my-7.5 max-[650px]:my-4 max-[400px]:my-3">
          <input
            type={showLoginPassword ? "text" : "password"}
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            onFocus={() => setIsLoginPasswordFocused(true)}
            onBlur={() => {
              setIsLoginPasswordFocused(false);
              setShowLoginPassword(false);
            }}
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            placeholder="Password"
            className={`w-full px-5 py-3.25 pr-20 bg-bg-secondary rounded-lg border-none outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-colors ${
              loginErrors.password ? "border-2 border-red-500" : ""
            }`}
          />
          {isLoginPasswordFocused && (
            <div
              className="absolute right-12 top-1/2 -translate-y-1/2 text-[20px] text-text-primary cursor-pointer z-10"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowLoginPassword(!showLoginPassword)}
            >
              {showLoginPassword ? <BiShow /> : <BiHide />}
            </div>
          )}
          <BiSolidLockAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-primary" />
          {loginErrors.password && (
            <p className="text-red-500 text-[12px] absolute -bottom-5 left-2 m-0 text-left w-full">
              {loginErrors.password}
            </p>
          )}
        </div>

        <div className="-mt-3.75 mb-6 text-text-primary max-[650px]:mb-4 max-[400px]:mb-3">
          <Link
            to="/forgot-password"
            className="text-[14.5px] text-text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default LoginForm;
