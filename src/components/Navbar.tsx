import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Percent, User, LogOut, Newspaper } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-background-light/80 backdrop-blur-md border-b border-background-lighter sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Percent className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">Soccer Camp</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/feed"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white"
                >
                  <Newspaper className="h-5 w-5" />
                  <span>Feed</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}