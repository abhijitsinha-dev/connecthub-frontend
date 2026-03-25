import React, { createContext, useContext, useEffect, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isLoginSignupActive, setIsLoginSignupActive] = useState(() => {
    return sessionStorage.getItem('loginSignupActive') === 'true';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.innerWidth < 1024;
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('loginSignupActive', isLoginSignupActive);
  }, [isLoginSignupActive]);

  useEffect(() => {
    sessionStorage.setItem('sidebarCollapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    let prevWidth = window.innerWidth;
    const handleResize = () => {
      const currWidth = window.innerWidth;
      if (prevWidth >= 1024 && currWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else if (prevWidth < 1024 && currWidth >= 1024) {
        setIsSidebarCollapsed(false);
      }
      prevWidth = currWidth;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <UIContext.Provider
      value={{
        isLoginSignupActive,
        setIsLoginSignupActive,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUIContext = () => {
  return useContext(UIContext);
};
