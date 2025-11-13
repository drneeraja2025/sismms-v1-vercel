import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utility/SupabaseClient';
import MMSLogo from '../assets/MMSlogo.jpg'; // Logo Path Fix

// Assuming you have a standard button component
import { Button } from './ui/button'; 

// Component for the navigation bar
const Navigation: React.FC = () => {
    // Get user and role from the AuthContext
    const { user, signOut, role } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        // GNA Protocol: Call signOut function from AuthContext
        const { error } = await signOut(); 
        if (error) {
            console.error('Error signing out:', error.message);
        } else {
            navigate('/auth');
        }
    };

    return (
        <header className="bg-primary text-primary-foreground shadow-md">
            <div className="container mx-auto p-4 flex justify-between items-center">
                {/* Logo and Title Section */}
                <div className="flex items-center space-x-3">
                    {/* Logo use with corrected path */}
                    <img src={MMSLogo} alt="MMS Logo" className="h-10 w-auto rounded-full" />
                    <div>
                        <Link to="/" className="text-xl font-bold text-white">
                            मिलवॉकी मराठी शाळा {/* FINAL FIX: Corrected Marathi for "Milwaukee" */}
                        </Link>
                        <p className="text-xs text-gray-300">SISMMS - Student Information System</p>
                    </div>
                </div>

                {/* Navigation Links and Auth Status */}
                <nav className="flex items-center space-x-4">
                    {user && (
                        <>
                            {/* Link to Students page */}
                            <Link to="/students" className="text-sm font-medium hover:text-secondary transition-colors">
                                Students
                            </Link>
                            
                            {/* Display Role and Logout */}
                            <span className="text-sm font-semibold text-accent-foreground py-1 px-2 rounded-full bg-gray-100">
                                {role || 'Guest'}
                            </span>
                            <Button 
                                onClick={handleSignOut} 
                                variant="destructive" 
                                size="sm" 
                                className="flex items-center space-x-1"
                            >
                                <span>Logout</span>
                            </Button>
                        </>
                    )}
                    {/* NAS Placeholder REMOVED from navigation (Moved to Footer) */}
                </nav>
            </div>
        </header>
    );
};

export default Navigation;