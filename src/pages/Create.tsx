
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import MapRouteEditor from '../components/MapRouteEditor';
import { Bike, RotateCcw } from 'lucide-react';

interface RoutePoint {
  lat: number;
  lng: number;
}

interface TripFormData {
  name: string;
  description: string;
  route: RoutePoint[];
}

const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripFormData>({
    name: '',
    description: '',
    route: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);

  // Fetch recent trips to display in the sidebar
  useEffect(() => {
    const fetchRecentTrips = async () => {
      try {
        const response = await fetch('/api/trips/recent');
        if (response.ok) {
          const data = await response.json();
          setRecentTrips(data.trips.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching recent trips:', error);
      }
    };

    fetchRecentTrips();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle route change from MapRouteEditor
  const handleRouteChange = (newRoute: RoutePoint[]) => {
    setFormData(prev => ({
      ...prev,
      route: newRoute
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Please enter a trip name");
      return;
    }
    
    if (formData.route.length === 0) {
      toast.error("Please create a route first");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the trip data
      const tripData = {
        ...formData,
        createdAt: new Date().toISOString(),
      };
      
      // Send data to API endpoint
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Show success message
        toast.success("Trip created successfully!");
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          route: [],
        });
        
        // Redirect to trips page after a short delay
        setTimeout(() => {
          navigate('/trips');
        }, 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to create trip");
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error("An error occurred while creating your trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset the form? All your data will be lost.')) {
      setFormData({
        name: '',
        description: '',
        route: [],
      });
      toast.info("Form has been reset");
    }
  };

  // Calculate trip stats based on route length
  const calculateTripStats = () => {
    if (formData.route.length === 0) {
      return {
        distance: '0 km',
        duration: '0 min',
        elevation: '0 m',
        difficulty: '-'
      };
    }
    
    // In a real app, we'd calculate these based on actual route data
    // For now, we'll generate reasonable mock values proportional to route length
    const pointCount = formData.route.length;
    const mockDistance = (pointCount * 0.5).toFixed(1);
    const mockDuration = Math.ceil(pointCount * 2.5);
    const mockElevation = Math.floor(pointCount * 10);
    
    let difficulty = 'Easy';
    if (mockDistance > 10) difficulty = 'Hard';
    else if (mockDistance > 5) difficulty = 'Moderate';
    
    return {
      distance: `${mockDistance} km`,
      duration: mockDuration <= 60 ? `${mockDuration} min` : `${(mockDuration / 60).toFixed(1)} hrs`,
      elevation: `${mockElevation} m`,
      difficulty
    };
  };
  
  const tripStats = calculateTripStats();

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mt-8"
      >
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-semibold">Create New Trip</h1>
                <p className="text-sm text-gray-500 mt-1">Plan your bike trip by setting a route and adding details.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Trip Name
                      </label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Weekend Ride"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                        placeholder="Describe your trip..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Trip Stats
                      </label>
                      <span className="text-xs text-gray-500">
                        Updated automatically based on your route
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-md p-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Estimated Distance</p>
                        <p className="text-lg font-semibold">
                          {tripStats.distance}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Estimated Duration</p>
                        <p className="text-lg font-semibold">
                          {tripStats.duration}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Elevation Gain</p>
                        <p className="text-lg font-semibold">
                          {tripStats.elevation}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Difficulty</p>
                        <p className="text-lg font-semibold">
                          {tripStats.difficulty}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`mt-4 p-4 rounded-md ${
                      tripStats.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
                      tripStats.difficulty === 'Moderate' ? 'bg-yellow-50 text-yellow-700' :
                      tripStats.difficulty === 'Hard' ? 'bg-red-50 text-red-700' : 'hidden'
                    }`}>
                      <p className="text-sm">
                        <strong>{tripStats.difficulty}</strong> - {
                          tripStats.difficulty === 'Easy' ? 'Suitable for beginners with minimal elevation' :
                          tripStats.difficulty === 'Moderate' ? 'Some challenging sections but generally approachable' :
                          'Only recommended for experienced cyclists'
                        }
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Your Route
                  </label>
                  <MapRouteEditor onRouteChange={handleRouteChange} />
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-4 justify-between">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <RotateCcw size={16} />
                    Reset Form
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || formData.route.length === 0}
                    className="w-full md:w-auto rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Trip'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Recent trips sidebar */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Recent Trips</h2>
              </div>
              
              <div className="p-4">
                {recentTrips.length > 0 ? (
                  <div className="space-y-4">
                    {recentTrips.map((trip) => (
                      <div key={trip.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                          <Bike size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{trip.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {trip.distance} • {trip.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    <Bike className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p>No recent trips yet</p>
                    <p className="text-xs mt-1">Your trips will appear here</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Need help planning your route? Try searching for bike-friendly paths or popular cycling routes in your area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Create;
