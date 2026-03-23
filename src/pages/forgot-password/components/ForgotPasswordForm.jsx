import { BiSolidEnvelope, BiArrowBack } from "react-icons/bi";
import Button from "../../../components/Button";

const ForgotPasswordForm = ({
  email,
  error,
  onChange,
  onSubmit,
  onBackToLogin,
}) => {
  return (
    <form onSubmit={onSubmit} noValidate>
      <h1 className="text-[32px] mb-2 font-semibold text-text-primary">
        Forgot Password
      </h1>
      <p className="text-[14.5px] text-text-secondary mb-8">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <div className="relative my-6">
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Enter your email"
          className={`w-full px-5 py-3.25 pr-12.5 bg-bg-secondary rounded-lg outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-all ${
            error
              ? "border-2 border-red-500"
              : "border-2 border-transparent focus:border-brand-primary"
          }`}
        />
        <BiSolidEnvelope className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-secondary" />
        {error && (
          <p className="text-red-500 text-[12px] absolute -bottom-5 left-2 m-0 text-left w-full">
            {error}
          </p>
        )}
      </div>

      <Button type="submit" className="mt-2">
        Send Reset Link
      </Button>

      <div className="mt-6 text-text-primary">
        <button
          type="button"
          onClick={onBackToLogin}
          className="flex items-center justify-center gap-2 w-full bg-transparent border-none cursor-pointer text-[14.5px] text-text-secondary hover:text-brand-primary transition-colors font-medium"
        >
          <BiArrowBack className="text-[18px]" />
          Back to Login
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
