import { Outlet } from 'react-router-dom';
import useAuthCheck from '../hooks/useAuthCheck';
import PageLoader from '../components/PageLoader';

const Root = () => {
  // Runs globally on initial load/refresh
  const { isLoading } = useAuthCheck();

  // Show a global spinner while checking auth status
  if (isLoading) {
    return <PageLoader isLoading={true} />;
  }

  // Once loading is done, render the child routes
  return <Outlet />;
};

export default Root;
