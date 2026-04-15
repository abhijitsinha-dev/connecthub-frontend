import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Search from '../../pages/search/Search';
import BottomNav from '.././mobile/BottomNav';
import MobileHeader from '../mobile/MobileHeader';

const Layout = () => {
  return (
    <div className="relative min-h-dvh bg-bg-secondary transition-colors duration-300">
      <Sidebar />
      <MobileHeader />
      <Search />
      <main className="min-h-dvh text-text-primary transition-colors duration-300 py-16 md:py-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
