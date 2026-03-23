const Button = ({ children, type = "button", className = "", ...props }) => {
  return (
    <button
      type={type}
      className={`w-full h-12 bg-brand-primary rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.1)] border-none cursor-pointer text-[16px] text-white font-semibold hover:opacity-90 transition-opacity ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
