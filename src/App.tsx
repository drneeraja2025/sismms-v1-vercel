// File: src/App.tsx
// GNA-FIX-003: The Router and Context Wrapper (The Chassis)

import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Navigation from './components/Navigation';
import AuthPage from './pages/Auth';
import IndexPage from './pages/Index';

// Initialize the Query Client
const queryClient = new QueryClient();

// 1. Component to protect routes (GNA Security Mandate)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Show a global loading state while authentication is being checked
    return <div className="min-h-screen flex items-center justify-center">Loading application...</div>;
  }

  // If no user is present, redirect to the Auth page
  if (!user) {
    // GNA Fix: Use Navigate component for clean, mandated redirection
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// 2. Layout for pages requiring navigation/footer
const MainLayout: React.FC = () => (
  <>
    <Navigation />
    <main className="container mx-auto p-4">
      <Outlet />
    </main>
  </>
);

// 3. Main Application Component
const App: React.FC = () => {
  return (
    // The QueryClientProvider must be the outermost wrapper
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* GNA Fix: AuthProvider MUST be inside BrowserRouter to access useNavigate */}
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes (Main Application) */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<IndexPage />} />
              {/* Add more protected routes here later, e.g., /students */}
            </Route>
            
            {/* Fallback for 404s (Redirects back to root) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* Toaster is placed OUTSIDE the router but INSIDE AuthProvider to be globally accessible */}
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;