
import React, { createContext, useState, useContext, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: Date;
  isRead: boolean;
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        const withDates = parsed.map((notif: any) => ({
          ...notif,
          createdAt: new Date(notif.createdAt)
        }));
        setNotifications(withDates);
      } catch (error) {
        console.error('Failed to parse notifications', error);
      }
    } else {
      // Add some default notifications for demo
      setNotifications([
        {
          id: '1',
          title: 'Welcome to InsureMojo',
          message: 'Thank you for joining our platform. Explore our services!',
          type: 'info',
          createdAt: new Date(),
          isRead: false
        },
        {
          id: '2',
          title: 'Policy Renewal',
          message: 'Your home insurance policy is due for renewal in 30 days.',
          type: 'warning',
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          isRead: false
        },
        {
          id: '3',
          title: 'Payment Received',
          message: 'We have received your payment of $120 for policy #123456.',
          type: 'success',
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          isRead: true
        }
      ]);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, 
      markAsRead, 
      markAllAsRead, 
      clearNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
