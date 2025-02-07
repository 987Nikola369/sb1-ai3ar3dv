import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

export default function Camp() {
  const features = [
    {
      title: "Professional Training",
      description: "Learn from experienced coaches and improve your skills",
      image: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80"
    },
    {
      title: "Modern Facilities",
      description: "Train in state-of-the-art facilities with the latest equipment",
      image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80"
    },
    {
      title: "Personalized Approach",
      description: "Individual attention to help you reach your full potential",
      image: "https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section id="camp" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Football Camp</h2>
          <p className="text-xl text-gray-300">
            Rocket Football Academy with the aim of developing young talents
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-gray-800 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="p-6 relative">
                <motion.h3 
                  className="text-xl font-bold text-white mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-300"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {feature.description}
                </motion.p>
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-red-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}