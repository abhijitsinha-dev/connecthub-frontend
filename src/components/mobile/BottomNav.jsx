import { NavLink } from 'react-router-dom';
import {
  BiHomeAlt,
  BiSearch,
  BiPlusCircle,
  BiMessageRoundedDots,
  BiUser,
} from 'react-icons/bi';
import { useUIContext } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';

const BottomNav = () => {
  const { isSearchOpen, setIsSearchOpen } = useUIContext();
  const { user } = useAuth();
  const { unreadCount } = useSocket();

  const navLinkClasses = ({ isActive }) =>
    `flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${
      isActive && !isSearchOpen
        ? 'text-brand-primary'
        : 'text-text-secondary hover:text-text-primary'
    }`;

  const searchNavLinkClasses = () =>
    `flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${
      isSearchOpen
        ? 'text-brand-primary'
        : 'text-text-secondary hover:text-text-primary'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-bg-primary shadow-[0_-4px_24px_rgba(0,0,0,0.08)] flex items-center justify-around z-50 md:hidden pb-safe">
      <NavLink
        to="/home"
        className={navLinkClasses}
        onClick={() => setIsSearchOpen(false)}
      >
        <BiHomeAlt className="text-[24px] mb-1" />
      </NavLink>

      <NavLink
        to="/search"
        className={searchNavLinkClasses}
        onClick={e => {
          e.preventDefault();
          setIsSearchOpen(true);
        }}
      >
        <BiSearch className="text-[24px] mb-1" />
      </NavLink>

      <NavLink
        to="/create"
        className={navLinkClasses}
        onClick={() => setIsSearchOpen(false)}
      >
        <BiPlusCircle className="text-[24px] mb-1" />
      </NavLink>

      <NavLink
        to="/messenger"
        className={navLinkClasses}
        onClick={() => setIsSearchOpen(false)}
      >
        <div className="relative">
          <BiMessageRoundedDots className="text-[24px] mb-1" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold grid place-items-center border-2 border-bg-primary">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </NavLink>

      <NavLink
        to={`/profile/${user?.username || ''}`}
        className={navLinkClasses}
        onClick={() => setIsSearchOpen(false)}
      >
        <BiUser className="text-[24px] mb-1" />
      </NavLink>
    </nav>
  );
};

export default BottomNav;
