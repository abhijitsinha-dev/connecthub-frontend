import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Search from '../../pages/search/Search';

const Layout = () => {
  return (
    <div className="relative min-h-dvh bg-bg-secondary transition-colors duration-300">
      <Sidebar />
      <Search />
      <main className="min-h-dvh text-text-primary transition-colors duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
