// File: src/App.tsx
// GNA-FIX-003: The Router and Context Wrapper (Phase 2 Update)

import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Navigation from './components/Navigation';
import AuthPage from './pages/Auth';
import IndexPage from './pages/Index';
import StudentsPage from './pages/Students'; // <--- NEW IMPORT

// Initialize the Query Client
const queryClient = new QueryClient();

// 1. Component to protect routes (GNA Security Mandate)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading application...</div>;
  }

  if (!user) {
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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Routes (Main Application) */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<IndexPage />} />
              <Route path="/students" element={<StudentsPage />} /> {/* <--- NEW ROUTE */}
            </Route>
            
            {/* Fallback for 404s */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;