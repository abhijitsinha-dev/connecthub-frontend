import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ThemeToggleButton from "../../components/ThemeToggleButton";
import { useUIContext } from "../../context/UIContext";

const LoginSignup = () => {
  // State to manage which form is active
  const { isLoginSignupActive: isActive, setIsLoginSignupActive: setIsActive } =
    useUIContext();

  return (
    <div className="relative flex justify-center items-center min-h-dvh bg-bg-secondary font-sans transition-colors duration-300">
      <ThemeToggleButton />

      <div
        className={`relative w-212.5 h-137.5 bg-bg-primary m-5 rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden group max-[650px]:h-[calc(100dvh-40px)] transition-colors duration-300 ${
          isActive ? "active" : ""
        }`}
      >
        {/* --- Login Form --- */}
        <LoginForm isActive={isActive} />

        {/* --- Signup Form --- */}
        <SignupForm isActive={isActive} />

        {/* --- Toggle Box / Overlay Panels --- */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-2">
          <div className="absolute -left-[250%] w-[300%] h-full bg-brand-primary rounded-[150px] transition-all duration-700 ease-in-out group-[.active]:left-1/2 max-[650px]:left-0 max-[650px]:-top-[270%] max-[650px]:w-full max-[650px]:h-[300%] max-[650px]:rounded-[20vw] group-[.active]:max-[650px]:left-0 group-[.active]:max-[650px]:top-[70%]"></div>

          <div className="absolute w-1/2 h-full text-white flex flex-col justify-center items-center transition-all duration-300 ease-in-out px-10 pointer-events-auto left-0 delay-300 group-[.active]:-left-1/2 group-[.active]:delay-150 max-[650px]:w-full max-[650px]:h-[30%] max-[650px]:top-0 group-[.active]:max-[650px]:left-0 group-[.active]:max-[650px]:-top-[30%] max-[400px]:px-5">
            <h1 className="text-[36px] -my-2.5 font-semibold max-[400px]:text-[30px]">
              Hello, Welcome!
            </h1>
            <p className="text-[14.5px] my-3.75 mb-5">Don't have an account?</p>
            <button
              onClick={() => setIsActive(true)}
              className="w-40 h-11.5 bg-transparent border-2 border-white rounded-lg cursor-pointer text-[16px] text-white font-semibold hover:bg-white hover:text-brand-primary transition-colors"
            >
              Sign Up
            </button>
          </div>

          <div className="absolute w-1/2 h-full text-white flex flex-col justify-center items-center transition-all duration-300 ease-in-out px-10 pointer-events-auto -right-1/2 delay-150 group-[.active]:right-0 group-[.active]:delay-300 max-[650px]:w-full max-[650px]:h-[30%] max-[650px]:right-0 max-[650px]:-bottom-[30%] group-[.active]:max-[650px]:bottom-0 max-[400px]:px-5">
            <h1 className="text-[36px] -my-2.5 font-semibold max-[400px]:text-[30px]">
              Welcome Back!
            </h1>
            <p className="text-[14.5px] my-3.75 mb-5">
              Already have an account?
            </p>
            <button
              onClick={() => setIsActive(false)}
              className="w-40 h-11.5 bg-transparent border-2 border-white rounded-lg cursor-pointer text-[16px] text-white font-semibold hover:bg-white hover:text-brand-primary transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
