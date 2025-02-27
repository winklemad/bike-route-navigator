
import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import MapRouteEditor from '../components/MapRouteEditor';

interface RoutePoint {
  lat: number;
  lng: number;
}

const Create = () => {
  const [tripName, setTripName] = useState('');
  const [description, setDescription] = useState('');
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!tripName) {
      toast.error("Please enter a trip name");
      return;
    }
    
    if (route.length === 0) {
      toast.error("Please create a route first");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data to be saved
      const tripData = {
        id: Date.now(),
        name: tripName,
        description,
        route,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Trip created:', tripData);
      
      // Show success message
      toast.success("Trip created successfully!");
      
      // Reset form
      setTripName('');
      setDescription('');
      setRoute([]);
      
      setIsSubmitting(false);
    }, 1000);
  };

  // Handle route change from MapRouteEditor
  const handleRouteChange = (newRoute: RoutePoint[]) => {
    setRoute(newRoute);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mt-8"
      >
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
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    Stats will update as you plan your route
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-md p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Estimated Distance</p>
                    <p className="text-lg font-semibold">
                      {route.length > 0 ? '10.2 km' : '0 km'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estimated Duration</p>
                    <p className="text-lg font-semibold">
                      {route.length > 0 ? '45 min' : '0 min'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Elevation Gain</p>
                    <p className="text-lg font-semibold">
                      {route.length > 0 ? '120 m' : '0 m'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Difficulty</p>
                    <p className="text-lg font-semibold">
                      {route.length > 0 ? 'Moderate' : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Your Route
              </label>
              <MapRouteEditor onRouteChange={handleRouteChange} />
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || !tripName || route.length === 0}
                className="w-full md:w-auto rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create Trip'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Create;
