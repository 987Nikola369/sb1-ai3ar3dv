import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 bg-[#231F20]/95 backdrop-blur-sm z-50 border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold">Rocket Football Academy</span>
        </div>

        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-[#E41E12] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </motion.button>

          <div className="relative">
            <motion.button
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img
                src={profile?.avatar_url || 'https://via.placeholder.com/32'}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <ChevronDown className="h-4 w-4" />
            </motion.button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1"
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}