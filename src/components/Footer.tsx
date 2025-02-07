import { Facebook, Instagram, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center space-x-2 mb-8 md:mb-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold">
              Rocket Football Academy
            </span>
          </motion.div>

          <motion.div 
            className="flex space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {[
              { icon: Facebook, href: "#" },
              { icon: Instagram, href: "#" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                className="text-gray-400 hover:text-red-500 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <social.icon className="h-6 w-6" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p>© {new Date().getFullYear()} Rocket Football Academy. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}