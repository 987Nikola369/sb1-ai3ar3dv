import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

export default function Accommodation() {
  const hotels = [
    {
      name: "Hotel Plaza Duće ****",
      location: "Duće",
      price: "99€ per person",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
      amenities: [
        "5 nights full board",
        "Breakfast, lunch and dinner buffet",
        "Free shuttle bus from the hotel to the camp",
        "Player accreditation",
        "Camp shirt",
        "Free water throughout the camp"
      ]
    },
    {
      name: "Hotel Plaza Omiš ****",
      location: "Omiš centar",
      price: "99€ per person",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
      amenities: [
        "5 nights full board",
        "Breakfast, lunch and dinner buffet",
        "Free shuttle bus from the hotel to the camp",
        "Player accreditation",
        "Camp shirt",
        "Free water throughout the camp"
      ]
    }
  ];

  return (
    <section id="accommodation" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white">Accommodation</h2>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-8">
          {hotels.map((hotel, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 rounded-lg shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-64">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.8 }}
                />
                <motion.img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 text-white"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold">{hotel.name}</h3>
                  <p className="text-red-500 font-semibold mt-2">{hotel.price}</p>
                </motion.div>
              </div>
              <div className="p-6">
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {hotel.amenities.map((amenity, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center space-x-3"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-red-500" />
                      </div>
                      <span className="text-gray-300">{amenity}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}