
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Trips = () => {
  const mockTrips = [
    {
      id: 1,
      name: 'City Park Loop',
      description: 'A scenic ride through downtown parks',
      distance: '5.2 km',
      duration: '30 min',
      difficulty: 'Easy',
      createdAt: '2023-06-15T14:30:00Z',
      previewImageUrl: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+3b82f6(-122.4194,37.7749)/[-122.4194,37.7749,13]/300x200@2x?access_token=pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbDRxdnZ4aTgwYXBuM2pvMmdnd2o1cGU0In0.KvIV7XtKzlXjdvdj6P-5bg'
    },
    {
      id: 2,
      name: 'Mountain Trail',
      description: 'Challenging mountain bike trail with great views',
      distance: '12.8 km',
      duration: '1.5 hrs',
      difficulty: 'Hard',
      createdAt: '2023-06-12T09:15:00Z',
      previewImageUrl: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s+3b82f6(-122.3,37.8)/[-122.3,37.8,11]/300x200@2x?access_token=pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbDRxdnZ4aTgwYXBuM2pvMmdnd2o1cGU0In0.KvIV7XtKzlXjdvdj6P-5bg'
    },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mt-8"
      >
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Your Trips</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage your bike trips</p>
          </div>
          <Link
            to="/create"
            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all duration-200 flex items-center gap-2"
          >
            Create New Trip
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTrips.map((trip) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={trip.previewImageUrl} 
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${trip.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : ''}
                    ${trip.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${trip.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {trip.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{trip.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{trip.description}</p>
                  </div>
                  <MapPin className="text-gray-400" size={20} />
                </div>
                
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{trip.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span className="font-medium">{trip.duration}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Created {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View Details
                  </button>
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
