// File: src/contexts/AuthContext.tsx (FINAL DEBUG VERSION)
// GNA-FIX-002: The Brain of the Application (ULTIMATE FINAL FIX)

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utility/SupabaseClient'; // Fixed path
import { Session, User } from '@supabase/supabase-js';
// Removed useNavigate from context

// 1. Define Types
interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
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
        console.error('GNA AuthContext ERROR fetching role:', error);
        return null;
      }
      
      const retrievedRole = data?.role || null;
      // **********************************************
      console.log('GNA DEBUG: Retrieved Role on Login:', retrievedRole); // CRITICAL LOG
      // **********************************************
      
      return retrievedRole;
      
    } catch (error) {
      console.error('GNA AuthContext Error (Catch):', error);
      return null;
    }
  };

  // 4. CRITICAL FIX: Ensure the session is set immediately on load
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

    // 4.2 Auth State Listener (Handles all sign-in/out events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthData(session);
      }
    );

    // 4.3 Initial Session Check: This must be done
    supabase.auth.getSession().then(({ data: { session } }) => {
       setAuthData(session);
       
       // Removed navigate logic. Redirection must happen in a component (e.g., AuthGuard).
    });

    // 4.4 Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []); 

  // 5. Authentication Functions
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error }; 
  };
  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    return { error };
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // 6. Context Value & Loading Gate
  const value = { session, user, role, loading, signIn, signUp, signOut };

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