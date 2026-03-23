import { BiMoon, BiSun } from "react-icons/bi";
import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-bg-primary text-text-primary shadow-md hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
    >
      {theme === "light" ? <BiMoon size={24} /> : <BiSun size={24} />}
    </button>
  );
};

export default ThemeToggleButton;
