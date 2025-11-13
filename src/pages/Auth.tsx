// File: src/pages/Auth.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// GNA-FIX: Importing the context 
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/utility/SupabaseClient'; // Required for direct reset call
// Imports for placeholder UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/toaster'; // Consolidated Toast Utility

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // New GNA Fix: Password Reset Logic (for post-sign-up password setting)
  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "Reset Failed",
        description: "Please enter your email address to receive the reset link.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth' // Redirects back to login page
    });

    if (error) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Reset Sent",
        description: "Please check your email for the password reset link.",
        variant: "default",
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        // --- SIGN UP ---
        if (!fullName) {
          toast({ title: "Sign Up Error", description: "Full name is required.", variant: "destructive" });
          setLoading(false); return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
        } else {
          // Success: User must confirm email before login
          toast({ title: "Success!", description: "Account created. Please check your email to verify.", });
          setIsSignUp(false); // Switch to login view
        }
      } else {
        // --- SIGN IN ---
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Welcome back!", description: "Successfully logged in." });
          // Redirection is handled by the AuthContext listener
        }
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An unknown error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? 'Create Your Account' : 'Welcome to SISMMS'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp ? 'Enter your details to register.' : 'Log in to access your dashboard.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter className="flex flex-col justify-center gap-2">
          {/* FINAL FIX: Forgot Password Button */}
          {!isSignUp && (
              <Button variant="link" onClick={handlePasswordReset} disabled={loading} className="text-sm text-gray-500 hover:text-gray-700">
                Forgot your password?
              </Button>
          )}

          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
            className="w-full"
          >
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default AuthPage;