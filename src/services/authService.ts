import apiClient from './apiClient';
import { User } from '../models/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // In a real app, this would call the backend
    // For demo purposes, we're using hardcoded credentials that match the seed data
    const mockUsers = [
      { _id: 'usr1', name: 'Admin User', email: 'admin@insuremojo.co.ke', phone: '+254712345678', role: 'admin', token: 'admin-token' },
      { _id: 'usr2', name: 'John Underwriter', email: 'underwriter@insuremojo.co.ke', phone: '+254734567890', role: 'underwriter', token: 'underwriter-token' },
      { _id: 'usr3', name: 'Support Agent', email: 'support@insuremojo.co.ke', phone: '+254723456789', role: 'support', token: 'support-token' },
      { _id: 'usr4', name: 'Wanjiku Kamau', email: 'wanjiku@example.com', phone: '+254745678901', role: 'user', token: 'user-token' },
    ];
    
    // Find matching user
    const user = mockUsers.find(u => u.email === credentials.email);
    
    // Check password - for demo, we're using simple hardcoded passwords matching server seed data
    const validPasswords = {
      'admin@insuremojo.co.ke': 'admin123',
      'underwriter@insuremojo.co.ke': 'underwriter123',
      'support@insuremojo.co.ke': 'support123',
      'wanjiku@example.com': 'user123'
    };
    
    const isValidPassword = validPasswords[credentials.email] === credentials.password;
    
    if (!user || !isValidPassword) {
      throw new Error('Invalid credentials');
    }
    
    localStorage.setItem('userToken', user.token);
    localStorage.setItem('userRole', user.role);
    
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: new Date(),
      profileImage: '',
    };
    
    // In a real app with backend connection, this would be:
    /*
    const response = await apiClient.post<AuthResponse>('/users/login', credentials);
    localStorage.setItem('userToken', response.data.token);
    localStorage.setItem('userRole', response.data.role);
    return {
      id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      phone: response.data.phone,
      role: response.data.role,
      createdAt: new Date(),
      profileImage: '',
    };
    */
  },

  register: async (userData: RegisterData): Promise<User> => {
    const response = await apiClient.post<AuthResponse>('/users/register', userData);
    localStorage.setItem('userToken', response.data.token);
    localStorage.setItem('userRole', response.data.role);
    return {
      id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      phone: response.data.phone,
      role: response.data.role,
      createdAt: new Date(),
      profileImage: '',
    };
  },

  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Check if token exists
      const token = localStorage.getItem('userToken');
      const role = localStorage.getItem('userRole');
      
      if (!token) return null;
      
      // Mock user data based on stored role
      let userData = {
        _id: 'usr1',
        name: 'User',
        email: 'user@example.com',
        phone: '+2547XXXXXXXX',
        role: role || 'user',
        createdAt: new Date().toISOString(),
        profileImage: '',
      };
      
      // Set appropriate user data based on role
      if (role === 'admin') {
        userData = {
          _id: 'usr1',
          name: 'Admin User',
          email: 'admin@insuremojo.co.ke',
          phone: '+254712345678',
          role: 'admin',
          createdAt: new Date().toISOString(),
          profileImage: '',
        };
      } else if (role === 'underwriter') {
        userData = {
          _id: 'usr2',
          name: 'John Underwriter',
          email: 'underwriter@insuremojo.co.ke',
          phone: '+254734567890',
          role: 'underwriter',
          createdAt: new Date().toISOString(),
          profileImage: '',
        };
      } else if (role === 'support') {
        userData = {
          _id: 'usr3',
          name: 'Support Agent',
          email: 'support@insuremojo.co.ke',
          phone: '+254723456789',
          role: 'support',
          createdAt: new Date().toISOString(),
          profileImage: '',
        };
      }
      
      return {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        createdAt: new Date(userData.createdAt),
        profileImage: userData.profileImage,
      };
      
      // In a real app, this would be:
      /*
      const response = await apiClient.get('/users/profile');
      return {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        role: response.data.role,
        createdAt: new Date(response.data.createdAt),
        profileImage: response.data.profileImage || '',
        address: response.data.address || '',
      };
      */
    } catch (error) {
      return null;
    }
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put('/users/profile', userData);
    return {
      id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      phone: response.data.phone,
      role: response.data.role,
      createdAt: new Date(),
      profileImage: response.data.profileImage || '',
      address: response.data.address || '',
    };
  },
};
