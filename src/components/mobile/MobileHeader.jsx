import { useState } from 'react';
import { BiMenu } from 'react-icons/bi';
import MobileMenuPortal from './MobileMenuPortal';

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Header Bar - Visible only on mobile */}
      <header className="md:hidden fixed top-0 left-0 w-full h-16 bg-bg-primary shadow-sm flex items-center justify-between px-4 z-40">
        <h2 className="text-2xl font-bold text-text-primary">
          Connect<span className="text-brand-primary">Hub</span>
        </h2>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors"
          title="Open Menu"
        >
          <BiMenu className="text-[28px]" />
        </button>
      </header>

      {/* Renders the Sidebar via Portal */}
      <MobileMenuPortal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default MobileHeader;
