import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Search from '../../pages/search/Search';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import { useAuth } from '../../context/AuthContext';
import PageLoader from '../PageLoader';

const Layout = () => {
  useAuthCheck();

  const { isLoading } = useAuth();

  // Optional: Show a spinner while the API call is happening so the user
  // doesn't see a flash of the protected page before getting booted.
  if (isLoading) {
    return <PageLoader isLoading={true} />;
  }
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
