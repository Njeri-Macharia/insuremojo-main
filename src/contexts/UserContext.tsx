
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/services/authService';
import { User } from '@/models/types';

interface UserContextProps {
  user: User | null;
  isLoading: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  resetLoginAttempts: () => void;
  checkPermission: (requiredRole: string[]) => boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  // Load user from storage on component mount
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setRole(currentUser.role || null);
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const loginAttempts = Number(localStorage.getItem('loginAttempts') || '0');
    if (loginAttempts >= 7) {
      throw new Error('Account locked due to too many login attempts');
    }

    try {
      const user = await authService.login({ email, password });
      setUser(user);
      setRole(user.role || null);
      // Reset login attempts on successful login
      localStorage.removeItem('loginAttempts');
      return user;
    } catch (error) {
      // Increment login attempts
      const currentAttempts = Number(localStorage.getItem('loginAttempts') || '0');
      const newAttempts = currentAttempts + 1;
      localStorage.setItem('loginAttempts', newAttempts.toString());
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setRole(null);
  };

  const resetLoginAttempts = () => {
    localStorage.removeItem('loginAttempts');
  };

  const checkPermission = (requiredRoles: string[]) => {
    if (!role) return false;
    return requiredRoles.includes(role);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      role, 
      login, 
      logout, 
      resetLoginAttempts,
      checkPermission
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
