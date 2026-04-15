import { NavLink } from 'react-router-dom';
import {
  BiHomeAlt,
  BiSearch,
  BiPlusCircle,
  BiMessageRoundedDots,
  BiUser,
  BiLogOut,
  BiMenu,
  BiSun,
  BiMoon,
} from 'react-icons/bi';
import { useTheme } from '../../context/ThemeContext';
import { useUIContext } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {
    isSidebarCollapsed: isCollapsed,
    setIsSidebarCollapsed: setIsCollapsed,
    setIsSearchOpen,
  } = useUIContext();
  const { theme, toggleTheme } = useTheme();

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} w-full py-3 rounded-lg font-medium transition-all ${
      isActive
        ? 'bg-brand-primary/10 text-brand-primary font-semibold'
        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
    }`;

  return (
    <aside
      // Added "hidden md:flex" right here to hide it on mobile
      className={`hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'} fixed top-0 left-0 h-dvh bg-bg-primary shadow-[4px_0_24px_rgba(0,0,0,0.08)] flex-col justify-between transition-all duration-300 ease-in-out z-50`}
    >
      <div className="p-4 overflow-y-auto overflow-x-hidden no-scrollbar">
        {/* Header / Logo */}
        <div
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-8 px-2`}
        >
          {!isCollapsed && (
            <h2 className="text-2xl font-bold text-text-primary transition-opacity duration-300">
              Connect
              <span className="text-brand-primary">Hub</span>
            </h2>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors shrink-0"
            title="Toggle Sidebar"
          >
            <BiMenu className="text-[24px]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/home"
            className={navLinkClasses}
            title={isCollapsed ? 'Home' : ''}
          >
            <BiHomeAlt className="text-[24px] min-w-6" />
            {!isCollapsed && (
              <span className="ml-4 whitespace-nowrap">Home</span>
            )}
          </NavLink>

          <NavLink
            to="/search"
            className={navLinkClasses}
            title={isCollapsed ? 'Search' : ''}
            onClick={e => {
              e.preventDefault();
              setIsSearchOpen(true);
            }}
          >
            <BiSearch className="text-[24px] min-w-6" />
            {!isCollapsed && (
              <span className="ml-4 whitespace-nowrap">Search</span>
            )}
          </NavLink>

          <NavLink
            to="/create"
            className={navLinkClasses}
            title={isCollapsed ? 'Create' : ''}
          >
            <BiPlusCircle className="text-[24px] min-w-6" />
            {!isCollapsed && (
              <span className="ml-4 whitespace-nowrap">Create</span>
            )}
          </NavLink>

          <NavLink
            to="/messenger"
            className={navLinkClasses}
            title={isCollapsed ? 'Messenger' : ''}
          >
            <BiMessageRoundedDots className="text-[24px] min-w-6" />
            {!isCollapsed && (
              <span className="ml-4 whitespace-nowrap">Messenger</span>
            )}
          </NavLink>

          <NavLink
            to={`/profile/${user?.username}`}
            className={navLinkClasses}
            title={isCollapsed ? 'Profile' : ''}
          >
            <BiUser className="text-[24px] min-w-6" />
            {!isCollapsed && (
              <span className="ml-4 whitespace-nowrap">Profile</span>
            )}
          </NavLink>
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] shrink-0 space-y-2 relative z-10">
        <button
          onClick={toggleTheme}
          className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} w-full py-3 text-text-secondary hover:bg-bg-secondary hover:text-text-primary rounded-lg font-medium transition-all cursor-pointer`}
          title="Toggle Theme"
        >
          {theme === 'light' ? (
            <BiMoon className="text-[24px] min-w-6" />
          ) : (
            <BiSun className="text-[24px] min-w-6" />
          )}
          {!isCollapsed && (
            <span className="ml-4 whitespace-nowrap">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} w-full py-3 text-red-500 hover:bg-red-500/10 rounded-lg font-medium transition-all cursor-pointer`}
          title="Logout"
        >
          <BiLogOut className="text-[24px] min-w-6" />
          {!isCollapsed && (
            <span className="ml-4 whitespace-nowrap">
              {isLoading ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
