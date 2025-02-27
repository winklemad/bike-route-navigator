
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const Trips = () => {
  const mockTrips = [
    {
      id: 1,
      name: 'City Park Loop',
      description: 'A scenic ride through downtown parks',
      distance: '5.2 km',
      duration: '30 min',
    },
    {
      id: 2,
      name: 'Mountain Trail',
      description: 'Challenging mountain bike trail with great views',
      distance: '12.8 km',
      duration: '1.5 hrs',
    },
  ];

  return (
    <div className="min-h-screen pt-20 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mt-8"
      >
        <h1 className="text-2xl font-semibold mb-6">Your Trips</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTrips.map((trip) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{trip.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{trip.description}</p>
                </div>
                <MapPin className="text-gray-400" size={20} />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{trip.distance}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{trip.duration}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Trips;
