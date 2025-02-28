
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Create from "./pages/Create";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/create" element={<Create />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:id" element={<TripDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
