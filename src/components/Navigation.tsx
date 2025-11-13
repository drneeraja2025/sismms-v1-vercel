// File: src/components/Navigation.tsx
// GNA-FIX-005: The Functional Navigation Bar (Final Fix)

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
// CRITICAL FIX: The logo assets must be imported via their source for Vite to process them.
import MMSlogo from '@/assets/MMSlogo.jpg'; // Imports the MMS logo
// import NASLogo from '/NASlogo.png'; // Removed non-standard public import style

const Navigation = () => {
  const { user, signOut, role } = useAuth(); // CRITICAL: Use the new Auth Context
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // GNA Protocol: The context handles the sign out logic
    const { error } = await signOut(); 
    if (!error) {
        // If sign out succeeds (no error), redirect
        navigate('/auth');
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Primary Brand & Nav */}
          <div className="flex items-center gap-4">
            {/* MMS Logo - Now correctly rendered via Vite import */}
            <img
              src={MMSlogo} // CORRECTED: Using the imported variable
              alt="मिल्वॉकी मराठी शाळा"
              className="h-14 w-14 object-contain rounded-lg bg-white p-1"
              // Add a simple error fallback, though the Vite import should prevent 404s
              onError={(e) => (e.currentTarget.style.display='none')} 
            />
            <div>
              <h1 className="text-xl font-bold">मिल्वॉकी मराठी शाळा</h1>
              <p className="text-xs text-primary-foreground/80">SISMMS - Student Information System</p>
            </div>
          </div>
          
          {/* Right Side: Logout Button */}
          <div className="flex items-center gap-4">
            {user ? (
              // Authenticated Links
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-primary-foreground/90 sm:inline capitalize">{role}</span>
                <Button variant="outline" onClick={handleSignOut} className="border-primary-foreground/20 text-[#dfc9a9] bg-[#151c3e]">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              // Unauthenticated Link (Login button on the Nav bar)
              <Button variant="outline" onClick={() => navigate('/auth')} className="border-primary-foreground/20 text-[#dfc9a9] bg-[#151c3e]">
                Login
              </Button>
            )}
            
            {/* NAS Logo - FINAL FIX: The NAS Logo from the public folder */}
            <img
              src="/NASlogo.png" // CORRECTED: Direct reference to asset in /public folder
              alt="Powered by NAS"
              title="Powered by Nearaj's AI Services"
              className="h-8 w-auto opacity-70"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;