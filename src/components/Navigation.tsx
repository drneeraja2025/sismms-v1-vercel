// GNA Code Governance Protocol: Navigation (Stable)
// This file implements the navigation bar, the functional Logout button, and branding.
// It MUST be listed in .aiexclude
import React from 'react';
import { NavLink, useNavigate } from "react-router-dom"; 
import { useAuth } from '../contexts/AuthContext'; 
// The following are placeholders for standard UI components
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
// GNA-FIX: Importing the logos from their local and public paths
import logo from '@/assets/MMSlogo.jpg'; 
import NASLogo from '/NASlogo.png'; 

const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate(); 
  
  // GNA FIX: Create handler to combine signOut and redirect (Solves SISMMS v1 Logout bug)
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate to auth page AFTER sign out is complete
      navigate('/auth');
    } catch (error) {
      console.error("GNA SignOut Error:", error);
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Primary Brand & Nav */}
          <div className="flex items-center gap-4">
            {/* MMS Logo */}
            <img
              src={logo}
              alt="मिल्वॉकी मराठी शाळा"
              className="h-14 w-14 object-contain rounded-lg bg-white p-1"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/56x56/ffffff/1e3a5f?text=MMS')}
            />
            <div>
              <h1 className="text-xl font-bold">मिल्वॉकी मराठी शाळा</h1>
              <p className="text-xs text-primary-foreground/80">SISMMS - Student Information System</p>
            </div>
            {/* Core Navigation Links */}
            <nav className="hidden items-center space-x-2 md:flex ml-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg hover:bg-accent transition-all ${isActive ? "bg-secondary text-secondary-foreground font-semibold" : ""}`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/students"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg hover:bg-accent transition-all ${isActive ? "bg-secondary text-secondary-foreground font-semibold" : ""}`
                }
              >
                Students
              </NavLink>
              <NavLink
                to="/protocells"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg hover:bg-accent transition-all ${isActive ? "bg-secondary text-secondary-foreground font-semibold" : ""}`
                }
              >
                Modules
              </NavLink>
            </nav>
          </div>
          {/* Right Side: User & NAS Brand */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-primary-foreground/90 sm:inline">
                  Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut} // GNA FIX: Use the handler
                  className="flex items-center gap-2 border-primary-foreground/20 text-[#dfc9a9] bg-[#151c3e]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 border-primary-foreground/20 text-[#dfc9a9] bg-[#151c3e]"
              >
                Login
              </Button>
            )}
            {/* NAS Logo placed for branding */}
            <img
              src={NASLogo}
              alt="Powered by NAS"
              title="Powered by Nearaj's AI Services"
              className="h-8 w-auto opacity-70"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x32/CCCCCC/FFFFFF?text=NAS')}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;