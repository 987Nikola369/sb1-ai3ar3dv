import { Link } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

export default function TopNavbar() {
  const { user, signOut } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-[#231F20]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Rocket Football Academy" className="h-8" />
          </Link>

          {user && (
            <div className="flex items-center space-x-6">
              <NotificationBell />
              
              <div className="relative">
                <button 
                  className="flex items-center space-x-2"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src={user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <ChevronDown className="h-4 w-4 text-white" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#2A2627] ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          signOut();
                          setShowDropdown(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#E41E12] w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}