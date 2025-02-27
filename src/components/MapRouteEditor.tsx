
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, Autocomplete } from '@react-google-maps/api';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { MapPin } from 'lucide-react';

// TypeScript interfaces
interface MapRouteEditorProps {
  onRouteChange?: (route: google.maps.LatLngLiteral[]) => void;
}

interface RouteMarker {
  id: string;
  position: google.maps.LatLngLiteral;
}

// Container style for the map
const containerStyle = {
  width: '100%',
  height: '500px'
};

// Default center (San Francisco)
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194
};

// Libraries to load
const libraries: ["places"] = ["places"];

const MapRouteEditor: React.FC<MapRouteEditorProps> = ({ onRouteChange }) => {
  // Google Maps API loader
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'PROVIDE_API_KEY',
    libraries,
  });

  // State
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[]>([]);
  const [markers, setMarkers] = useState<RouteMarker[]>([]);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);
  
  // Refs for autocomplete components
  const startAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const endAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Map load callback
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setDirectionsService(new google.maps.DirectionsService());
  }, []);

  // Helper function to create random markers along the route
  const createWaypointMarkers = (path: google.maps.LatLngLiteral[]) => {
    if (path.length < 4) return [];

    const numMarkers = Math.min(path.length / 4, 5);
    const step = Math.floor(path.length / (numMarkers + 1));
    const newMarkers: RouteMarker[] = [];

    for (let i = 1; i <= numMarkers; i++) {
      const position = path[i * step];
      if (position) {
        newMarkers.push({
          id: `marker-${i}`,
          position
        });
      }
    }

    return newMarkers;
  };

  // Function to calculate route
  const calculateRoute = useCallback(() => {
    if (!directionsService || !startLocation || !endLocation) return;

    directionsService.route(
      {
        origin: startLocation,
        destination: endLocation,
        travelMode: google.maps.TravelMode.BICYCLING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const points: google.maps.LatLngLiteral[] = [];
          const route = result.routes[0];
          const path = route.overview_path;
          
          // Convert path to LatLngLiteral[]
          path.forEach(point => {
            points.push({ lat: point.lat(), lng: point.lng() });
          });
          
          setRoutePath(points);
          
          // Create markers along the route
          const newMarkers = createWaypointMarkers(points);
          setMarkers(newMarkers);
          
          // Fit map to route bounds
          if (map && route.bounds) {
            map.fitBounds(route.bounds);
            setMapBounds(route.bounds);
          }
          
          // Callback with new route
          if (onRouteChange) {
            onRouteChange(points);
          }
          
          toast.success("Route created successfully!");
        } else {
          toast.error("Could not calculate route. Please try different locations.");
        }
      }
    );
  }, [directionsService, startLocation, endLocation, map, onRouteChange]);

  // Handle marker drag
  const handleMarkerDrag = useCallback((marker: RouteMarker, index: number, newPosition: google.maps.LatLngLiteral) => {
    // Update marker position
    const updatedMarkers = markers.map((m) => 
      m.id === marker.id ? { ...m, position: newPosition } : m
    );
    setMarkers(updatedMarkers);
    
    // Recalculate route with waypoints
    if (directionsService && startLocation && endLocation) {
      const waypoints = updatedMarkers.map(marker => ({
        location: marker.position,
        stopover: false
      }));
      
      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.BICYCLING,
          optimizeWaypoints: false
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            const points: google.maps.LatLngLiteral[] = [];
            const route = result.routes[0];
            const path = route.overview_path;
            
            path.forEach(point => {
              points.push({ lat: point.lat(), lng: point.lng() });
            });
            
            setRoutePath(points);
            
            // Callback with new route
            if (onRouteChange) {
              onRouteChange(points);
            }
          } else {
            toast.error("Could not update route with new waypoint");
          }
        }
      );
    }
  }, [directionsService, startLocation, endLocation, markers, onRouteChange]);

  // Set up autocomplete refs when map is loaded
  useEffect(() => {
    if (isLoaded && !loadError) {
      // Set up autocomplete options when the component mounts
      const options = {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry', 'name']
      };
      
      if (startAutocompleteRef.current) {
        startAutocompleteRef.current.setOptions(options);
      }
      
      if (endAutocompleteRef.current) {
        endAutocompleteRef.current.setOptions(options);
      }
    }
  }, [isLoaded, loadError]);

  // Autocomplete place changed handlers
  const handleStartPlaceChanged = () => {
    if (startAutocompleteRef.current) {
      const place = startAutocompleteRef.current.getPlace();
      if (place.name) {
        setStartLocation(place.name);
      }
    }
  };

  const handleEndPlaceChanged = () => {
    if (endAutocompleteRef.current) {
      const place = endAutocompleteRef.current.getPlace();
      if (place.name) {
        setEndLocation(place.name);
      }
    }
  };

  // Loading and error states
  if (loadError) {
    return <div className="p-4 bg-red-50 text-red-500 rounded-md">Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div className="p-4 flex justify-center">Loading Maps...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="start-location" className="block text-sm font-medium text-gray-700 mb-1">
            Start Location
          </label>
          <Autocomplete
            onLoad={(autocomplete) => {
              startAutocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handleStartPlaceChanged}
          >
            <Input 
              id="start-location"
              type="text"
              placeholder="Enter start location"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="w-full"
            />
          </Autocomplete>
        </div>
        
        <div className="flex-1">
          <label htmlFor="end-location" className="block text-sm font-medium text-gray-700 mb-1">
            End Location
          </label>
          <Autocomplete
            onLoad={(autocomplete) => {
              endAutocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handleEndPlaceChanged}
          >
            <Input 
              id="end-location"
              type="text"
              placeholder="Enter end location"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              className="w-full"
            />
          </Autocomplete>
        </div>
        
        <div className="md:self-end">
          <button
            onClick={calculateRoute}
            disabled={!startLocation || !endLocation}
            className="w-full md:w-auto px-4 py-2 bg-gray-900 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            Calculate Route
          </button>
        </div>
      </div>
      
      <div className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={12}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {/* Start marker */}
          {routePath.length > 0 && (
            <Marker
              position={routePath[0]}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>'
                ),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40),
              }}
              label={{
                text: 'Start',
                className: 'bg-green-500 text-white text-xs px-2 py-1 rounded -mt-10',
              }}
            />
          )}
          
          {/* End marker */}
          {routePath.length > 0 && (
            <Marker
              position={routePath[routePath.length - 1]}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>'
                ),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40),
              }}
              label={{
                text: 'End',
                className: 'bg-red-500 text-white text-xs px-2 py-1 rounded -mt-10',
              }}
            />
          )}
          
          {/* Route path */}
          {routePath.length > 0 && (
            <Polyline
              path={routePath}
              options={{
                strokeColor: '#3b82f6',
                strokeOpacity: 0.8,
                strokeWeight: 5,
              }}
            />
          )}
          
          {/* Draggable markers along route */}
          {markers.map((marker, index) => (
            <Marker
              key={marker.id}
              position={marker.position}
              draggable={true}
              onDragEnd={(e) => {
                if (e.latLng) {
                  handleMarkerDrag(
                    marker,
                    index,
                    { lat: e.latLng.lat(), lng: e.latLng.lng() }
                  );
                }
              }}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/></svg>'
                ),
                scaledSize: new google.maps.Size(34, 34),
                anchor: new google.maps.Point(17, 34),
              }}
            />
          ))}
        </GoogleMap>
        
        {routePath.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="text-center p-6 rounded-lg">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No route created</h3>
              <p className="mt-1 text-sm text-gray-500">Enter start and end locations to generate a bike route.</p>
            </div>
          </div>
        )}
      </div>
      
      {routePath.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
          <p>
            <strong>Tip:</strong> Drag the blue markers to customize your route. The route will automatically update.
          </p>
        </div>
      )}
    </div>
  );
};

export default MapRouteEditor;
