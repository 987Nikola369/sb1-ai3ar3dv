import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

export default function Application() {
  return (
    <section id="apply" className="py-20 bg-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">Application Form</h2>
          <p className="mt-4 text-xl text-gray-300">
            Join our next football camp session
          </p>
        </AnimatedSection>

        <motion.form 
          className="bg-gray-900 rounded-lg shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { id: 'firstName', label: 'First Name', type: 'text' },
              { id: 'lastName', label: 'Last Name', type: 'text' },
              { id: 'email', label: 'Email', type: 'email' },
              { id: 'phone', label: 'Phone', type: 'tel' }
            ].map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-300">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="experience" className="block text-sm font-medium text-gray-300">
              Football Experience (optional)
            </label>
            <textarea
              id="experience"
              rows={4}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
            />
          </motion.div>

          <motion.button
            type="submit"
            className="mt-8 w-full bg-red-500 text-white py-3 px-6 rounded-md relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              className="absolute inset-0 bg-white"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
              style={{ opacity: 0.2 }}
            />
            <span className="relative">Submit Application</span>
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}