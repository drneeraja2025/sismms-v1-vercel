// File: src/pages/Auth.tsx
// GNA-FIX-004: The Login/Signup UI (Final Password Reset Fix)

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/utility/SupabaseClient'; // Required for direct reset call
// Imports for placeholder UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/toaster'; 

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState(''); // State for reset
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'reset' | 'signup'>('login'); // Controls form display
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 

  // CRITICAL FIX: Check URL for recovery token on load
  useEffect(() => {
    const fragment = location.hash;
    if (fragment.includes('type=recovery')) {
      setView('reset');
      toast({
        title: "Password Reset Required",
        description: "Please enter and confirm your new password below.",
        variant: "default",
      });
    } else if (view !== 'reset') {
        setView('login');
    }
  }, [location.hash, view]);


  // Logic for final password update (when reset form is displayed)
  const handleFinalPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // CRITICAL: This updates the user's password using the token currently in the URL
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Your password has been reset. Please log in now.", variant: "default" });
      setView('login'); // Send user back to login form
    }
    setLoading(false);
  };

  // Logic to initiate Password Reset Email
  const handlePasswordReset = async () => {
    if (!email) {
      toast({ title: "Reset Failed", description: "Please enter your email address to receive the reset link.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth' 
    });

    if (error) {
      toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password Reset Sent", description: "Please check your email for the password reset link.", variant: "default" });
    }
    setLoading(false);
  };


  // Logic for standard Sign-in/Sign-up Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        // --- SIGN UP ---
        if (!fullName) { toast({ title: "Sign Up Error", description: "Full name is required.", variant: "destructive" }); setLoading(false); return; }
        const { error } = await signUp(email, password, fullName);
        if (error) { toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" }); } 
        else { toast({ title: "Success!", description: "Account created. Please check your email to verify.", }); setIsSignUp(false); } 
      } else {
        // --- SIGN IN ---
        const { error } = await signIn(email, password);
        if (error) { 
          toast({ title: "Login Failed", description: error.message, variant: "destructive" }); 
        } else { 
          toast({ title: "Welcome back!", description: "Successfully logged in." }); 
          // CRITICAL FIX: Force the redirect immediately after successful login
          navigate('/', { replace: true }); 
        }
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An unknown error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  
  // --- FINAL RENDER ---

  const renderAuthForm = () => {
    // Renders the Password Reset Form when the token is present in the URL
    if (view === 'reset') {
      return (
        <form onSubmit={handleFinalPasswordUpdate} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Set New Password</h2>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>Update Password</Button>
        </form>
      );
    }
    
    // Default Login/Signup Form
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="teacher@school.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isSignUp ? 'Creating Account...' : 'Logging In...') : (isSignUp ? 'Sign Up' : 'Login')}
            </Button>
        </form>
    );
  };


  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {view === 'reset' ? 'Password Recovery' : (isSignUp ? 'Create Your Account' : 'Welcome to SISMMS')}
          </CardTitle>
          <CardDescription className="text-center">
            {view === 'reset' ? 'Finalize your account recovery.' : (isSignUp ? 'Enter your details to register.' : 'Log in to access your dashboard.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderAuthForm()}
        </CardContent>
        <CardFooter className="flex flex-col justify-center gap-2">
          {/* Forgot Password Link - Visible only when in login mode */}
          {view === 'login' && !isSignUp && (
              <Button variant="link" onClick={handlePasswordReset} disabled={loading} className="text-sm text-gray-500 hover:text-gray-700">
                Forgot your password?
              </Button>
          )}

          {/* Switch Views Link - Visible when not in reset mode */}
          {view !== 'reset' && (
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
              className="w-full"
            >
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
export default AuthPage;