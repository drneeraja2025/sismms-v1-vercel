// File: src/contexts/AuthContext.tsx
// GNA-FIX-002: The Brain of the Application (Final Audited Version)

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/utility/SupabaseClient'; // Using alias for consistency
import { Session, User } from '@supabase/supabase-js';

// 1. Define Types
interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>; // Updated return type
}

// 2. Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 3. Role Fetching Logic (Mandatory GNA Security Check)
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
      return data?.role || null;
    } catch (error) {
      console.error('GNA AuthContext Error (Catch):', error);
      return null;
    }
  };

  // 4. Auth State Listener (CRITICAL: Handles state for all other components)
  useEffect(() => {
    // 4.1 Function to update state and fetch role
    const setAuthData = async (session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session && session.user) {
        const userRole = await getRole(session.user);
        setRole(userRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    };

    // 4.2 Initial Session Check (Standard Supabase Pattern)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthData(session);
    });

    // 4.3 Listen for auth state changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthData(session);
      }
    );

    // 4.4 Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  // 5. Authentication Functions (MSP Fix: Removed internal setLoading/Simplified return)
  const signIn = async (email: string, password: string) => {
    // Removed internal setLoading to prevent race condition
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error }; // Returns only the error object for Auth.tsx to handle
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Removed internal setLoading to prevent race condition
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    return { error }; // Returns only the error object for Auth.tsx to handle
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    // The auth listener will automatically handle the state change and redirect
    return { error };
  };

  // 6. Context Value & Loading Gate
  const value = { session, user, role, loading, signIn, signUp, signOut };

  // Render children only when loading is false to prevent flicker (GNA Protocol)
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 7. Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};