import Button from "../../../components/Button";

const ForgotPasswordSuccess = ({ onBackToLogin }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <h1 className="text-[28px] mb-4 font-semibold text-text-primary">
        Password Changed!
      </h1>
      <p className="text-[15px] text-text-secondary mb-6 leading-relaxed">
        Your password has been successfully updated.
        <br />
        You can now log in with your new password.
      </p>
      <Button onClick={onBackToLogin}>Return to Login</Button>
    </div>
  );
};

export default ForgotPasswordSuccess;
