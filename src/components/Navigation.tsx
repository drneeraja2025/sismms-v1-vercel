// File: src/components/Navigation.tsx
// GNA-FIX-005: The Functional Navigation Bar (Final Asset Fix)

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
// CRITICAL FIX: Removed local asset import, relying on /public folder directly.
// We assume MMSlogo.jpg and NASLogo.png have been moved/copied to the public folder.

const Navigation = () => {
  const { user, signOut, role } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut(); 
    if (!error) {
        navigate('/auth');
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground border-b shadow-md sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Primary Brand & Nav */}
          <div className="flex items-center gap-4">
            {/* MMS Logo - CORRECTED PATH to /public */}
            <img
              src="/MMSlogo.jpg" // GNA FIX: Direct reference from public folder (assuming file is moved there)
              alt="मिल्वॉकी मराठी शाळा"
              className="h-14 w-14 object-contain rounded-lg bg-white p-1"
            />
            <div>
              <h1 className="text-xl font-bold">मिल्वॉकी मराठी शाळा</h1>
              <p className="text-xs text-primary-foreground/80">SISMMS - Student Information System</p>
            </div>
          </div>
          
          {/* Right Side: Logout Button */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-primary-foreground/90 sm:inline capitalize">{role}</span>
                <Button variant="outline" onClick={handleSignOut} className="border-primary-foreground/20 text-[#dfc9a9] bg-[#151c3e]">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => navigate('/auth')} className="border-primary-foreground/20 text-[#dfc9a9] bg-[#151c3e]">
                Login
              </Button>
            )}
            
            {/* NAS Logo - Direct reference from public folder */}
            <img
              src="/NASlogo.png" 
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