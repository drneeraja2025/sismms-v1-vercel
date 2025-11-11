// GNA Code Governance Protocol: Auth Context (Stable)
// This file implements the stable auth flow and role management.
// It MUST be listed in .aiexclude
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utility/SupabaseClient'; 
import { Session, User } from '@supabase/supabase-js';

// Define the shape of our context
interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: string | null; // <-- CRITICAL: Provides user role to the entire app
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<any>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null); // <-- CRITICAL: Added role state
  const [loading, setLoading] = useState(true);
  
  // This function fetches the user's role from the secure 'user_roles' table
  const getRole = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .single();
      if (error) {
        console.error('GNA AuthContext Error: Error fetching user role', error.message);
        return null;
      }
      if (data) {
        return data.role;
      }
    } catch (error) {
      console.error('GNA AuthContext Error:', error);
      return null;
    }
    return null;
  };

  // Effect to run once on load and listen for auth changes
  useEffect(() => {
    setLoading(true);
    const setAuthData = async (session: Session | null) => {
      if (session && session.user) {
        setSession(session);
        setUser(session.user);
        // <-- CRITICAL: Fetch and set the user's role
        const userRole = await getRole(session.user);
        setRole(userRole);
      } else {
        setSession(null);
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    };

    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthData(session);
    });

    // Listen for auth state changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthData(session);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign-Up function
  // The 'handle_new_user' SQL trigger automatically creates the 'users' and 'user_roles' (guardian) entries.
  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName // This passes the full_name to the trigger
        }
      }
    });
    if (error) {
      console.error("GNA SignUp Error:", error.message);
    }
    setLoading(false);
    return { data, error };
  };

  // Sign-In function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("GNA SignIn Error:", error.message);
    }
    setLoading(false);
    return { data, error };
  };

  // Sign-Out function (Fix for SISMMS-v1's PF2-FAIL-001)
  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("GNA SignOut Error:", error.message);
    }
    setLoading(false);
    return { error };
  };

  // Value provided to all children
  const value = {
    session,
    user,
    role, // <-- CRITICAL: Provide role to the whole app
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    // We render children only when loading is false to prevent flicker
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};