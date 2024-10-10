import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Button = ({ children, className, ...props }) => (
  <motion.button
    className={`px-6 py-2 rounded-full font-semibold ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    {...props}
  >
    {children}
  </motion.button>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <span className="text-2xl mr-2">📱</span>
          <button src='/'><span className="text-2xl font-bold text-blue-600">BuyBack</span></button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to={'/user'}>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
                Get Started
            </Button>
          </Link>
        </motion.div>
      </header>

      <main className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
        <motion.div 
          className="md:w-1/2 mb-8 md:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Sell Your Devices <br />
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            BuyBack is your trusted platform for selling pre-owned devices. 
            Get the best value for your old gadgets.
          </p>
          <Link to={'/user'}>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-3 transition-colors duration-300">
                Start Selling <ArrowRight className="ml-2 inline" />
            </Button>
          </Link>
        </motion.div>

        <motion.div 
          className="md:w-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative w-full h-[400px]">
            <img
              src="https://i2.wp.com/thetechrevolutionist.com/wp-content/uploads/2019/08/IMG_20190803_153212.jpg?fit=1920%2C1491&ssl=1"
              alt="Devices Collage"
              className="w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}