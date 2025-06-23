
import { 
  InsurancePolicy, User, Payment, Claim, AdminUser, 
  Notification, ChatMessage, DashboardStats,
  InsuranceStatus, ClaimStatus
} from '../models/types';

import { 
  mockUsers, mockPolicies, mockPayments, mockClaims, 
  mockAdmins, mockNotifications, mockChatMessages, mockDashboardStats
} from '../data/mockData';

// In a real application, these would be API calls to the backend
export const apiService = {
  // User related APIs
  getUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 300);
    });
  },
  
  getUserById: async (userId: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers.find(user => user.id === userId)), 300);
    });
  },
  
  // Policy related APIs
  getPolicies: async (): Promise<InsurancePolicy[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPolicies), 300);
    });
  },
  
  getPolicyById: async (policyId: string): Promise<InsurancePolicy | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPolicies.find(policy => policy.id === policyId)), 300);
    });
  },
  
  getUserPolicies: async (userId: string): Promise<InsurancePolicy[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPolicies.filter(policy => policy.userId === userId)), 300);
    });
  },
  
  updatePolicyStatus: async (policyId: string, status: InsuranceStatus): Promise<InsurancePolicy | undefined> => {
    return new Promise((resolve) => {
      const policy = mockPolicies.find(p => p.id === policyId);
      if (policy) {
        policy.status = status;
        policy.updatedAt = new Date();
      }
      setTimeout(() => resolve(policy), 300);
    });
  },
  
  createPolicy: async (policy: Omit<InsurancePolicy, 'id' | 'createdAt' | 'updatedAt'>): Promise<InsurancePolicy> => {
    return new Promise((resolve) => {
      const newPolicy: InsurancePolicy = {
        ...policy,
        id: `policy${mockPolicies.length + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPolicies.push(newPolicy);
      setTimeout(() => resolve(newPolicy), 300);
    });
  },
  
  // Payment related APIs
  getPayments: async (): Promise<Payment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPayments), 300);
    });
  },
  
  getPolicyPayments: async (policyId: string): Promise<Payment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPayments.filter(payment => payment.policyId === policyId)), 300);
    });
  },
  
  getUserPayments: async (userId: string): Promise<Payment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPayments.filter(payment => payment.userId === userId)), 300);
    });
  },
  
  // Claim related APIs
  getClaims: async (): Promise<Claim[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockClaims), 300);
    });
  },
  
  getClaimById: async (claimId: string): Promise<Claim | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockClaims.find(claim => claim.id === claimId)), 300);
    });
  },
  
  getUserClaims: async (userId: string): Promise<Claim[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockClaims.filter(claim => claim.userId === userId)), 300);
    });
  },
  
  updateClaimStatus: async (claimId: string, status: ClaimStatus, reviewNotes?: string): Promise<Claim | undefined> => {
    return new Promise((resolve) => {
      const claim = mockClaims.find(c => c.id === claimId);
      if (claim) {
        claim.status = status;
        if (reviewNotes) claim.reviewNotes = reviewNotes;
        claim.updatedAt = new Date();
      }
      setTimeout(() => resolve(claim), 300);
    });
  },
  
  createClaim: async (claim: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>): Promise<Claim> => {
    return new Promise((resolve) => {
      const newClaim: Claim = {
        ...claim,
        id: `claim${mockClaims.length + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockClaims.push(newClaim);
      setTimeout(() => resolve(newClaim), 300);
    });
  },
  
  // Admin related APIs
  getAdmins: async (): Promise<AdminUser[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAdmins), 300);
    });
  },
  
  // Notification related APIs
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockNotifications.filter(notification => notification.userId === userId)), 300);
    });
  },
  
  markNotificationAsRead: async (notificationId: string): Promise<Notification | undefined> => {
    return new Promise((resolve) => {
      const notification = mockNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
      }
      setTimeout(() => resolve(notification), 300);
    });
  },
  
  // Chat related APIs
  getUserChat: async (userId: string): Promise<ChatMessage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockChatMessages.filter(message => message.userId === userId)), 300);
    });
  },
  
  sendChatMessage: async (message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> => {
    return new Promise((resolve) => {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg${mockChatMessages.length + 1}`,
      };
      mockChatMessages.push(newMessage);
      
      // Simulate bot response
      if (!message.isBot) {
        setTimeout(() => {
          const botResponse: ChatMessage = {
            id: `msg${mockChatMessages.length + 1}`,
            userId: message.userId,
            isBot: true,
            message: "Thank you for your message. Our AI assistant is processing your query and will respond shortly.",
            timestamp: new Date(),
          };
          mockChatMessages.push(botResponse);
        }, 1000);
      }
      
      setTimeout(() => resolve(newMessage), 300);
    });
  },
  
  // Dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDashboardStats), 300);
    });
  },
};
