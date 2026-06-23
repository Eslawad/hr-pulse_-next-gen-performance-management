import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'employee' | 'manager' | 'admin';
  managerId?: string;
  department?: string;
  designation?: string;
}

interface AuthContextType {
  user: { email: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously logged in (mock session)
    const storedUser = localStorage.getItem('hr_pulse_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ email: parsed.email });
        setProfile(parsed);
      } catch (e) {
        localStorage.removeItem('hr_pulse_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Authentication failed');
      const userData = await response.json();
      setUser({ email: userData.email });
      setProfile(userData);
      localStorage.setItem('hr_pulse_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('hr_pulse_user');
  }, []);

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    signIn,
    signOut
  }), [user, profile, loading, signIn, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
