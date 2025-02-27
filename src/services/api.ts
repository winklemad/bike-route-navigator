
// Mock in-memory data store
let trips: any[] = [
  {
    id: 1,
    name: 'City Park Loop',
    description: 'A scenic ride through downtown parks',
    distance: '5.2 km',
    duration: '30 min',
    difficulty: 'Easy',
    createdAt: '2023-06-15T14:30:00Z',
    route: [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7748, lng: -122.4180 },
      // More route points would be here in a real application
    ],
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
    route: [
      { lat: 37.8, lng: -122.3 },
      { lat: 37.82, lng: -122.32 },
      // More route points would be here in a real application
    ],
    previewImageUrl: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s+3b82f6(-122.3,37.8)/[-122.3,37.8,11]/300x200@2x?access_token=pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbDRxdnZ4aTgwYXBuM2pvMmdnd2o1cGU0In0.KvIV7XtKzlXjdvdj6P-5bg'
  },
  {
    id: 3,
    name: 'Coastal Ride',
    description: 'Beautiful ocean views along the coastline',
    distance: '8.5 km',
    duration: '45 min',
    difficulty: 'Moderate',
    createdAt: '2023-06-10T16:45:00Z',
    route: [
      { lat: 37.7, lng: -122.5 },
      { lat: 37.72, lng: -122.52 },
      // More route points would be here in a real application
    ],
    previewImageUrl: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s+3b82f6(-122.5,37.7)/[-122.5,37.7,12]/300x200@2x?access_token=pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbDRxdnZ4aTgwYXBuM2pvMmdnd2o1cGU0In0.KvIV7XtKzlXjdvdj6P-5bg'
  }
];

// Function to simulate API fetch delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const apiService = {
  // Get all trips
  getAllTrips: async () => {
    await delay(500); // Simulate network delay
    return {
      status: 200,
      json: async () => ({ trips })
    };
  },
  
  // Get recent trips (last 3)
  getRecentTrips: async () => {
    await delay(300);
    const recentTrips = [...trips].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 3);
    
    return {
      status: 200,
      ok: true,
      json: async () => ({ trips: recentTrips })
    };
  },
  
  // Get a single trip by ID
  getTripById: async (id: number) => {
    await delay(300);
    const trip = trips.find(t => t.id === id);
    
    if (!trip) {
      return {
        status: 404,
        ok: false,
        json: async () => ({ message: 'Trip not found' })
      };
    }
    
    return {
      status: 200,
      ok: true,
      json: async () => ({ trip })
    };
  },
  
  // Create a new trip
  createTrip: async (tripData: any) => {
    await delay(800); // Longer delay to simulate processing
    
    // Generate a new ID (in a real app, this would be done by the database)
    const newId = Math.max(0, ...trips.map(t => t.id)) + 1;
    
    // Calculate trip stats based on route
    const routeLength = tripData.route.length;
    const distance = (routeLength * 0.5).toFixed(1) + ' km';
    const durationMinutes = Math.ceil(routeLength * 2.5);
    const duration = durationMinutes <= 60 
      ? `${durationMinutes} min` 
      : `${(durationMinutes / 60).toFixed(1)} hrs`;
    
    let difficulty = 'Easy';
    if (routeLength * 0.5 > 10) difficulty = 'Hard';
    else if (routeLength * 0.5 > 5) difficulty = 'Moderate';
    
    // Create a new trip object
    const newTrip = {
      id: newId,
      name: tripData.name,
      description: tripData.description,
      route: tripData.route,
      distance,
      duration,
      difficulty,
      createdAt: new Date().toISOString(),
      // Generate a preview image URL (in a real app, this would use the actual route)
      previewImageUrl: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+3b82f6(-122.4194,37.7749)/[-122.4194,37.7749,13]/300x200@2x?access_token=pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbDRxdnZ4aTgwYXBuM2pvMmdnd2o1cGU0In0.KvIV7XtKzlXjdvdj6P-5bg`
    };
    
    // Add to our in-memory store
    trips.push(newTrip);
    
    return {
      status: 201,
      ok: true,
      json: async () => ({ trip: newTrip, message: 'Trip created successfully' })
    };
  },
};

// Setup mocked fetch API for our endpoints
const originalFetch = window.fetch;

// Override the global fetch to intercept our API routes
window.fetch = async (url: RequestInfo | URL, options?: RequestInit) => {
  const urlString = url.toString();
  
  // Handle API routes
  if (urlString.includes('/api/trips')) {
    if (urlString === '/api/trips' && options?.method === 'POST') {
      // Create a new trip
      const tripData = JSON.parse(options.body as string);
      return apiService.createTrip(tripData) as Promise<Response>;
    }
    
    if (urlString === '/api/trips' && (!options || options.method === 'GET')) {
      // Get all trips
      return apiService.getAllTrips() as Promise<Response>;
    }
    
    if (urlString === '/api/trips/recent') {
      // Get recent trips
      return apiService.getRecentTrips() as Promise<Response>;
    }
    
    // Get trip by ID
    const tripIdMatch = urlString.match(/\/api\/trips\/(\d+)/);
    if (tripIdMatch) {
      const tripId = parseInt(tripIdMatch[1], 10);
      return apiService.getTripById(tripId) as Promise<Response>;
    }
  }
  
  // For any other requests, use the original fetch
  return originalFetch(url, options);
};
