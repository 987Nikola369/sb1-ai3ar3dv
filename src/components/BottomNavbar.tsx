import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Newspaper, MessageSquare } from 'lucide-react';

export default function BottomNavbar() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#231F20]/80 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          <Link
            to="/"
            className={`flex flex-col items-center space-y-1 ${
              isActive('/') ? 'text-[#E41E12]' : 'text-white hover:text-[#E41E12]'
            } transition-colors`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </Link>
          
          <Link
            to="/academy"
            className={`flex flex-col items-center space-y-1 ${
              isActive('/academy') ? 'text-[#E41E12]' : 'text-white hover:text-[#E41E12]'
            } transition-colors`}
          >
            <Newspaper className="h-6 w-6" />
            <span className="text-xs">Academy</span>
          </Link>
          
          <Link
            to="/users"
            className={`flex flex-col items-center space-y-1 ${
              isActive('/users') ? 'text-[#E41E12]' : 'text-white hover:text-[#E41E12]'
            } transition-colors`}
          >
            <Users className="h-6 w-6" />
            <span className="text-xs">Directory</span>
          </Link>
          
          <Link
            to="/messages"
            className={`flex flex-col items-center space-y-1 ${
              isActive('/messages') ? 'text-[#E41E12]' : 'text-white hover:text-[#E41E12]'
            } transition-colors`}
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs">Messages</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}