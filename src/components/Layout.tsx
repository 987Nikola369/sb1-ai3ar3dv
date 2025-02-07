import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#231F20] flex flex-col">
      <TopNavbar />
      <main className="flex-1 container mx-auto px-4 py-8 mb-16">
        <Outlet />
      </main>
      <BottomNavbar />
    </div>
  );
}