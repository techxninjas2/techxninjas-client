import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User, AuthContextType as AppAuthContextType } from '../types';

export const AuthContext = createContext<AppAuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(session);
        setUser(session?.user ?? null);
      } catch (e: any) {
        console.error("Error getting session:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setLoading(true);
          setSession(session);
          setUser(session?.user ?? null);
          
          // Clear any cached profile data on logout
          if (event === 'SIGNED_OUT') {
            localStorage.removeItem('userProfile');
          }
        } catch(e:any) {
           console.error("Error in onAuthStateChange:", e);
           setError(e);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string, captchaToken?: string):Promise<void> => {
    setLoading(true);
    clearError();
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: { captchaToken }
      });
      if (loginError) throw loginError;
      // Session update will be handled by onAuthStateChange
    } catch (e: any) {
      console.error("Login error:", e);
      setError(e);
      throw e; // Re-throw to be caught by UI
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, captchaToken?: string): Promise<void> => {
    setLoading(true);
    clearError();
    try {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name, 
            avatar_url: avatarUrl 
          },
          captchaToken,
          // emailRedirectTo: window.location.origin // Useful for email confirmation
        } 
      });
      if (signUpError) throw signUpError;
      if (data.user && data.user.identities && data.user.identities.length === 0) {
         alert('Registration successful! Please check your email to confirm your account.');
      } else if (data.user) {
         alert('Registration successful! You might need to confirm your email.');
      }
    } catch (e: any) {
      console.error("Sign up error:", e);
      setError(e);
      throw e; 
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    clearError();
    try {
      // Clear local storage first
      localStorage.removeItem('userProfile');
      
      // Check if we have a valid session before attempting logout
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        const { error: logoutError } = await supabase.auth.signOut();
        if (logoutError) {
          console.error("Logout error:", logoutError);
          // Don't throw error if it's just a session issue, still clear local state
          if (!logoutError.message.includes('session') && !logoutError.message.includes('Auth session missing')) {
            throw logoutError;
          }
        }
      }
      
      // Force clear local state regardless of API response
      setSession(null);
      setUser(null);
      
    } catch (e: any) {
      console.error("Logout error:", e);
      // Even if logout fails on server, clear local state
      setSession(null);
      setUser(null);
      localStorage.removeItem('userProfile');
      
      // Only show error if it's not a session-related issue
      if (!e.message.includes('session') && !e.message.includes('Auth session missing')) {
        setError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordForEmail = async (email: string, captchaToken?: string): Promise<void> => {
    setLoading(true);
    clearError();
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        captchaToken,
        // redirectTo: `${window.location.origin}/reset-password-confirm`, 
      });
      if (resetError) throw resetError;
      alert('Password reset email sent! Please check your inbox.');
    } catch (e: any) {
      console.error("Password reset error:", e);
      setError(e);
      throw e; 
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (captchaToken?: string): Promise<void> => {
    setLoading(true);
    clearError();
    try {
      // The captchaToken parameter is for UI gating (e.g., ensuring user completed Turnstile)
      // before initiating OAuth. It is not passed to Supabase's signInWithOAuth options.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          // captchaToken is not a valid Supabase OAuth option.
        },
      });
      if (error) throw error;
    } catch (e: any) {
      console.error("Sign in with Google error:", e);
      setError(e);
      throw e; 
    } finally {
      // This will run if an error occurs before redirect, or if signInWithOAuth
      // itself doesn't cause an immediate redirect for some reason.
      setLoading(false);
    }
  };
  
  const sendMagicLink = async (email: string, captchaToken?: string): Promise<void> => {
    setLoading(true);
    clearError();
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, 
          emailRedirectTo: window.location.origin,
          captchaToken,
        },
      });
      if (otpError) {
        throw otpError;
      }
    } catch (e: any) {
      console.error("Send Magic Link error:", e);
      setError(e); 
      throw e; 
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    login,
    signUp,
    logout,
    resetPasswordForEmail,
    signInWithGoogle,
    sendMagicLink,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AppAuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};