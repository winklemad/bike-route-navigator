
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Plan Your Perfect Bike Adventure
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Create custom bike routes, discover new paths, and track your cycling journeys with our intuitive trip planner.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6">
            <Link
              to="/create"
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all duration-200 flex items-center gap-2"
            >
              Create Trip
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/trips"
              className="rounded-full px-6 py-3 text-sm font-semibold text-gray-900 border border-gray-200 hover:border-gray-300 transition-all duration-200"
            >
              View Trips
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
