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

const BottomNav = () => {
  const { setIsSearchOpen } = useUIContext();
  const { user } = useAuth();

  const navLinkClasses = ({ isActive }) =>
    `flex flex-col items-center justify-center w-full h-full text-xs transition-colors ${
      isActive
        ? 'text-brand-primary'
        : 'text-text-secondary hover:text-text-primary'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-bg-primary shadow-[0_-4px_24px_rgba(0,0,0,0.08)] flex items-center justify-around z-50 md:hidden pb-safe">
      <NavLink to="/home" className={navLinkClasses}>
        <BiHomeAlt className="text-[24px] mb-1" />
      </NavLink>

      <NavLink
        to="/search"
        className={navLinkClasses}
        onClick={e => {
          e.preventDefault();
          setIsSearchOpen(true);
        }}
      >
        <BiSearch className="text-[24px] mb-1" />
      </NavLink>

      <NavLink to="/create" className={navLinkClasses}>
        <BiPlusCircle className="text-[24px] mb-1" />
      </NavLink>

      <NavLink to="/messenger" className={navLinkClasses}>
        <BiMessageRoundedDots className="text-[24px] mb-1" />
      </NavLink>

      <NavLink
        to={`/profile/${user?.username || ''}`}
        className={navLinkClasses}
      >
        <BiUser className="text-[24px] mb-1" />
      </NavLink>
    </nav>
  );
};

export default BottomNav;
