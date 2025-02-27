
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Filter, ChevronDown, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Trip {
  id: number;
  name: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: string;
  createdAt: string;
  previewImageUrl: string;
}

const Trips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  
  // Fetch trips on component mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/trips');
        if (response.ok) {
          const data = await response.json();
          setTrips(data.trips);
        } else {
          setError('Failed to fetch trips');
        }
      } catch (err) {
        setError('An error occurred while fetching trips');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrips();
  }, []);

  // Filter trips based on selected difficulty
  const filteredTrips = filterDifficulty 
    ? trips.filter(trip => trip.difficulty === filterDifficulty)
    : trips;

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
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                  <Filter size={16} />
                  {filterDifficulty ? `Difficulty: ${filterDifficulty}` : 'Filter by'}
                  <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFilterDifficulty(null)}>
                    All Difficulties
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDifficulty('Easy')}>
                    Easy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDifficulty('Moderate')}>
                    Moderate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDifficulty('Hard')}>
                    Hard
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link
              to="/create"
              className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all duration-200 flex items-center gap-2"
            >
              Create New Trip
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-1/3 bg-gray-200 mx-auto rounded-md"></div>
              <div className="h-4 w-1/2 bg-gray-200 mx-auto rounded-md"></div>
              <div className="h-32 w-full bg-gray-200 rounded-md"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center text-red-700">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200 text-sm"
            >
              Try Again
            </button>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Bike className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterDifficulty 
                ? `No ${filterDifficulty.toLowerCase()} trips found. Try a different filter.` 
                : 'Start by creating your first trip.'}
            </p>
            <div className="mt-6">
              <Link
                to="/create"
                className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Create New Trip
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrips.map((trip) => (
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
                    <Link 
                      to={`/trips/${trip.id}`} 
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {filteredTrips.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing {filteredTrips.length} of {trips.length} trips
            {filterDifficulty && (
              <button 
                onClick={() => setFilterDifficulty(null)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Trips;
