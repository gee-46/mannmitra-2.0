import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
