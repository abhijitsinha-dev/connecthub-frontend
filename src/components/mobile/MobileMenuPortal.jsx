import { useState } from 'react';
import { createPortal } from 'react-dom';
import { BiX, BiSun, BiMoon, BiLogOut } from 'react-icons/bi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const MobileMenuPortal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      logout();
    } catch (error) {
      console.error('Error during logout:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Ensure we don't crash during Server-Side Rendering (if applicable)
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`md:hidden fixed inset-0 z-100 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Right Slide-in Panel */}
      <div
        className={`absolute right-0 top-0 h-dvh w-64 bg-bg-primary shadow-[-4px_0_24px_rgba(0,0,0,0.08)] flex flex-col transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-bg-secondary">
          <h2 className="text-lg font-semibold text-text-primary">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors"
            title="Close Menu"
          >
            <BiX className="text-[24px]" />
          </button>
        </div>

        {/* Panel Actions (Theme & Logout) */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full py-3 px-4 text-text-secondary hover:bg-bg-secondary hover:text-text-primary rounded-lg font-medium transition-all"
          >
            {theme === 'light' ? (
              <BiMoon className="text-[24px] min-w-6" />
            ) : (
              <BiSun className="text-[24px] min-w-6" />
            )}
            <span className="ml-4">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-4 text-red-500 hover:bg-red-500/10 rounded-lg font-medium transition-all"
            disabled={isLoading}
          >
            <BiLogOut className="text-[24px] min-w-6" />
            <span className="ml-4">
              {isLoading ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body // Teleports the UI directly to the body tag
  );
};

export default MobileMenuPortal;
