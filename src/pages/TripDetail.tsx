
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { ArrowLeft, MapPin, Clock, UserPlus, Users, Calendar, Route } from 'lucide-react';

interface User {
  id: string;
  name: string;
}

interface RoutePoint {
  lat: number;
  lng: number;
}

interface Trip {
  id: number;
  name: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: string;
  createdAt: string;
  previewImageUrl: string;
  route: RoutePoint[];
  joinedUsers: User[];
}

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningTrip, setJoiningTrip] = useState(false);
  const [leavingTrip, setLeavingTrip] = useState(false);

  // Fetch trip details
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/trips/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setTrip(data.trip);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch trip details');
        }
      } catch (err) {
        setError('An error occurred while fetching trip details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTripDetails();
  }, [id]);

  // Check if current user has joined this trip
  const hasJoinedTrip = () => {
    if (!trip) return false;
    return trip.joinedUsers.some(user => user.id === 'user2'); // Using our mock user ID
  };
  
  // Join trip handler
  const handleJoinTrip = async () => {
    if (!trip) return;
    
    setJoiningTrip(true);
    
    try {
      const response = await fetch('/api/trips/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tripId: trip.id })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTrip(data.trip);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error joining trip:', error);
      toast.error('Failed to join trip. Please try again.');
    } finally {
      setJoiningTrip(false);
    }
  };
  
  // Leave trip handler
  const handleLeaveTrip = async () => {
    if (!trip) return;
    
    setLeavingTrip(true);
    
    try {
      const response = await fetch('/api/trips/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tripId: trip.id })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTrip(data.trip);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error leaving trip:', error);
      toast.error('Failed to leave trip. Please try again.');
    } finally {
      setLeavingTrip(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-3/4 bg-gray-200 rounded-md"></div>
            <div className="h-64 w-full bg-gray-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded-md"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !trip) {
    return (
      <div className="min-h-screen pt-20 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center text-red-700">
            <p>{error || 'Trip not found'}</p>
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => navigate('/trips')}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft size={16} />
                Back to Trips
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center mb-6">
          <Link
            to="/trips"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            <span>Back to trips</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Trip header */}
          <div className="h-48 md:h-64 overflow-hidden relative">
            <img 
              src={trip.previewImageUrl} 
              alt={trip.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium mb-2 inline-block
                ${trip.difficulty === 'Easy' ? 'bg-green-600 text-white' : ''}
                ${trip.difficulty === 'Moderate' ? 'bg-yellow-600 text-white' : ''}
                ${trip.difficulty === 'Hard' ? 'bg-red-600 text-white' : ''}
              `}>
                {trip.difficulty}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold">{trip.name}</h1>
            </div>
          </div>
          
          {/* Trip details */}
          <div className="p-6">
            <div className="flex flex-wrap gap-6 items-center mb-6">
              <div className="flex items-center gap-1 text-gray-700">
                <Route size={18} />
                <span>{trip.distance}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Clock size={18} />
                <span>{trip.duration}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Calendar size={18} />
                <span>{new Date(trip.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Users size={18} />
                <span>{trip.joinedUsers.length} {trip.joinedUsers.length === 1 ? 'rider' : 'riders'}</span>
              </div>
            </div>
            
            <div className="my-6">
              <h2 className="text-lg font-semibold mb-2">About this trip</h2>
              <p className="text-gray-700">{trip.description || "No description provided."}</p>
            </div>
            
            {/* Map placeholder */}
            <div className="bg-gray-100 rounded-lg h-64 mb-6 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin size={24} className="mx-auto mb-2" />
                <p>Route map would be displayed here</p>
              </div>
            </div>
            
            {/* Joined users */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Riders</h2>
              {trip.joinedUsers.length > 0 ? (
                <div className="space-y-3">
                  {trip.joinedUsers.map(user => (
                    <div key={user.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        {user.name.charAt(0)}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No one has joined this trip yet. Be the first!</p>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 justify-end mt-8">
              {hasJoinedTrip() ? (
                <button
                  onClick={handleLeaveTrip}
                  disabled={leavingTrip}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {leavingTrip ? 'Leaving...' : 'Leave Trip'}
                </button>
              ) : (
                <button
                  onClick={handleJoinTrip}
                  disabled={joiningTrip}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {joiningTrip ? 'Joining...' : (
                    <>
                      <UserPlus size={18} />
                      Join Trip
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TripDetail;
