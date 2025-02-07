import { motion } from 'framer-motion';

export default function Messages() {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Messages
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-400 text-center py-12"
      >
        Messaging feature coming soon...
      </motion.div>
    </div>
  );
}