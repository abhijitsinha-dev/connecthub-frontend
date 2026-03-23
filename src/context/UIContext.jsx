import React, { createContext, useContext, useEffect, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isLoginSignupActive, setIsLoginSignupActive] = useState(() => {
    return sessionStorage.getItem("loginSignupActive") === "true";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = sessionStorage.getItem("sidebarCollapsed");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    sessionStorage.setItem("loginSignupActive", isLoginSignupActive);
  }, [isLoginSignupActive]);

  useEffect(() => {
    sessionStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  return (
    <UIContext.Provider
      value={{
        isLoginSignupActive,
        setIsLoginSignupActive,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
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
