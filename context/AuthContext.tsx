import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  contactName: string;
  jobTitle: string;
  phone: string;
  email: string;
  companyName: string;
  rnc: string;
  businessType: string;
  city: string;
  address: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, profileData: UserProfile) => void;
  logout: () => void;
  userEmail: string | null;
  userProfile: UserProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Check local storage on mount to persist session across refreshes
  useEffect(() => {
    const storedAuth = localStorage.getItem('ipp-auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      setUserEmail(localStorage.getItem('ipp-user'));
      
      try {
        const storedProfile = localStorage.getItem('ipp-profile');
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        }
      } catch (e) {
        console.error("Error parsing stored user profile", e);
      }
    }
  }, []);

  const login = (email: string, profileData: UserProfile) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setUserProfile(profileData);
    
    localStorage.setItem('ipp-auth', 'true');
    localStorage.setItem('ipp-user', email);
    localStorage.setItem('ipp-profile', JSON.stringify(profileData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserProfile(null);
    
    localStorage.removeItem('ipp-auth');
    localStorage.removeItem('ipp-user');
    localStorage.removeItem('ipp-profile');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userEmail, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};