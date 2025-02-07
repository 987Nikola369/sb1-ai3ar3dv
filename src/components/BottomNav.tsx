import { Home, Newspaper, Users, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Newspaper, label: 'Academy', path: '/academy' },
    { icon: Users, label: 'Directory', path: '/directory' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#231F20]/95 backdrop-blur-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative py-2"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <item.icon
                    className={`h-6 w-6 ${
                      isActive ? 'text-[#E41E12]' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs mt-1 ${
                      isActive ? 'text-[#E41E12]' : 'text-gray-400'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNav"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#E41E12]"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}