// File: src/App.tsx (FINAL ROUTER UPDATE)

import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import Navigation from './components/Navigation';
import Footer from './components/Footer'; 
import AuthPage from './pages/Auth';
import IndexPage from './pages/Index';
import StudentsPage from './pages/Students';
import StudentProfilePage from './pages/StudentProfilePage'; // <--- NEW IMPORT

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
    <main className="container mx-auto p-4 flex-grow">
      <Outlet />
    </main>
    <Footer /> 
  </>
);

// 3. Main Application Component
// NOTE: FooterPage helper component moved to App.tsx for simplicity.
const FooterPage: React.FC<{ title: string }> = ({ title }) => {
    return (
        <>
            <Navigation />
            <main className="container mx-auto p-8 min-h-[50vh]">
                <h1 className="text-3xl font-bold mb-6">{title}</h1>
                <p>This is the content area for the {title}. You can fetch the full text from markdown files (e.g., privacy.md) or static content here later.</p>
            </main>
            <Footer />
        </>
    );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* New Info Pages (Public Routes - using the FooterPage helper) */}
            <Route path="/disclaimer" element={<FooterPage title="Disclaimer" />} />
            <Route path="/terms" element={<FooterPage title="Terms of Service" />} />
            <Route path="/privacy" element={<FooterPage title="Privacy Policy" />} />
            <Route path="/copyright" element={<FooterPage title="Copyright" />} />
            <Route path="/contact" element={<FooterPage title="Support / Contact" />} />

            {/* Protected Routes (Main Application) */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<IndexPage />} />
              <Route path="/students" element={<StudentsPage />} />
                {/* NEW ROUTE: Target for the "View Profile" button */}
                <Route path="/students/:studentId" element={<StudentProfilePage />} />
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