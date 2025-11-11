// GNA Code Governance Protocol: App Root (Stable)
// This file implements the AuthProvider wrapper and ProtectedRoute logic.
// It MUST be listed in .aiexclude
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// The following imports are placeholders for common UI libraries (assuming a React template)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// GNA-FIX: Importing the context (File 3)
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
// GNA-FIX: Importing the page placeholders
import Navigation from './components/Navigation'; // File 6
import Auth from './pages/Auth'; // File 5
import Index from './pages/Index'; // File 7

const queryClient = new QueryClient();

// GNA MANDATE: Add ProtectedRoute component to prevent data-fetching crashes (The "Blank Screen" Fix)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  if (loading) {
    // Show a loading spinner or blank page while session is checked
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  if (!session) {
    // If no session, redirect to the auth page
    return <Navigate to="/auth" replace />;
  }
  // If session exists, render the protected component
  return <>{children}</>;
};

// GNA MANDATE: Create a layout for all protected pages
const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation /> {/* This is File 6 */}
      <main className="flex-grow p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Future routes (Students, Protocells) will be added here */}
          <Route path="*" element={<div>404 Not Found</div>} /> {/* Simple placeholder for 404 */}
        </Routes>
      </main>
    </div>
  );
};

// The main App component that sets up routing
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider> {/* AuthContext (File 3) is wrapped around everything */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route for Login/Sign-up */}
            <Route path="/auth" element={<Auth />} /> {/* This is File 5 */}
            {/* All other routes ("/*") are protected */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
export default App;