import { Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <AnimatedSection>
              <h2 className="text-4xl font-bold text-white mb-8">Contact Us</h2>
              <form className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  className="w-full bg-red-500 text-white py-3 px-6 rounded-md relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-white"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                    style={{ opacity: 0.2 }}
                  />
                  <span className="relative">Send Message</span>
                </motion.button>
              </form>
            </AnimatedSection>
          </div>

          <div className="space-y-8">
            <AnimatedSection className="bg-gray-800 p-8 rounded-lg">
              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Phone", value: "+385 XXX XXX XXXX" },
                  { icon: MapPin, label: "Address", value: "Split, Hrvatska" },
                  { icon: Mail, label: "Email", value: "info@rocketfootballacademy.com" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <item.icon className="h-6 w-6 text-red-500" />
                    <div>
                      <p className="font-medium text-white">{item.label}:</p>
                      <p className="text-gray-300">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
            
            <motion.div
              className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46428.61344018767!2d16.4021513!3d43.5147607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13355dfc6bbf3d49%3A0xa1798ff631b49f98!2sSplit%2C%20Croatia!5e0!3m2!1sen!2s!4v1635959562000!5m2!1sen!2s"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}