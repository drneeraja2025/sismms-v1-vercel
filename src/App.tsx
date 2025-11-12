import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/Auth";
import IndexPage from "./pages/Index";
import Navigation from "./components/Navigation";
import { Toaster } from "@/components/ui/toaster"; // This is the correct component

// Initialize the Query Client
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a loading spinner here
    return <div>Loading...</div>;
  }

  if (!user) {
    // User is not authenticated, show the AuthPage
    // We render AuthPage here to handle the redirect logic within it
    return <AuthPage />;
  }

  // User is authenticated, render the requested child component
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <IndexPage />
                  </ProtectedRoute>
                }
              />
              {/* Add other protected routes here */}
            </Routes>
          </main>
          <Toaster /> {/* This is the correct, intended component */}
          {/* The <Sonner /> component has been removed as it was a bug */}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;