import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const Layout = () => {
  return (
    <div className="relative min-h-dvh bg-bg-secondary transition-colors duration-300">
      <Sidebar />
      <main className="min-h-dvh text-text-primary transition-colors duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
