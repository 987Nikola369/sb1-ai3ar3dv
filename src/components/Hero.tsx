import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="min-h-screen bg-gray-900 pt-20 relative overflow-hidden">
      {/* Animated background elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0.3, scale: 1 }}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        >
          <Star className="text-red-500/20 h-8 w-8" />
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.h1 
              className="text-6xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Ivan Rakitić
              <motion.span 
                className="block text-red-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Football Camp
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Join our elite football academy where young talents are transformed into tomorrow's stars. Train with professional coaches in world-class facilities.
            </motion.p>

            <motion.div 
              className="flex space-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link to="/auth">
                <motion.button
                  className="group relative inline-flex items-center px-8 py-4 bg-red-500 text-white rounded-md overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                    style={{ opacity: 0.2 }}
                  />
                  <span className="relative">
                    Join Now
                    <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                  </span>
                </motion.button>
              </Link>

              <motion.a
                href="#camp"
                className="group inline-flex items-center px-8 py-4 border-2 border-red-500 text-red-500 rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-lg blur-xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <img
              src="/ivan-rakitic.png"
              alt="Ivan Rakitić"
              className="relative w-full h-auto"
            />
            <motion.div
              className="absolute -bottom-6 -right-6 bg-gray-800 p-6 rounded-lg shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <p className="text-gray-300 font-medium">Next Camp Starts</p>
              <p className="text-red-500 text-xl font-bold">June 15, 2024</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}