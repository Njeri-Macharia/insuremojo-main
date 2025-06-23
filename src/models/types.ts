// Types for our insurance system

export type InsuranceStatus = 'active' | 'expired' | 'pending' | 'cancelled' | 'claimed';

export type PaymentMethod = 'mpesa' | 'card' | 'bank' | 'airtel_money' | 'equity_bank' | 'kcb_bank';

export type PaymentStatus = 'paid' | 'pending' | 'failed';

export type InsuranceCategory = 'electronics' | 'household' | 'personal' | 'mobile' | 'computer' | 'camera' | 'appliance' | 'other';

export type ClaimStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'paid';

export type Gender = 'male' | 'female' | 'other';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  address?: string;
  profileImage?: string;
  createdAt: Date;
  county?: string;
  subcounty?: string;
  idNumber?: string;
  dateOfBirth?: Date;
  gender?: Gender;
};

export type InsurancePolicy = {
  id: string;
  userId: string;
  itemName: string;
  itemDescription: string;
  category: InsuranceCategory;
  purchaseDate: Date;
  purchasePrice: number;
  coverageAmount: number;
  premium: number;
  startDate: Date;
  endDate: Date;
  status: InsuranceStatus;
  itemImages: string[];
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
  vendor?: string;
  serialNumber?: string;
  modelNumber?: string;
  county?: string;
  subcounty?: string;
};

export type Payment = {
  id: string;
  policyId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: Date;
  receipt?: string;
  phoneNumber?: string;
  accountNumber?: string;
  currency?: string;
  paymentDate?: Date;
};

export type Claim = {
  id: string;
  policyId: string;
  userId: string;
  description: string;
  incidentDate: Date;
  claimAmount: number;
  status: ClaimStatus;
  evidence: string[];
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  incidentLocation?: string;
  county?: string;
  policeAbstract?: string;
  repairShop?: string;
  repairEstimate?: number;
  assignedTo?: string;
  paymentMethod?: PaymentMethod;
  paymentDetails?: {
    accountNumber?: string;
    bankName?: string;
    branchName?: string;
    phoneNumber?: string;
  };
};

export type ChatMessage = {
  id: string;
  userId: string;
  isBot: boolean;
  message: string;
  timestamp: Date;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'underwriter' | 'support' | 'manager';
  createdAt: Date;
};

export type NotificationType = 'policy_expiry' | 'payment_due' | 'claim_update' | 'general';

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export type DashboardStats = {
  activePolicies: number;
  pendingClaims: number;
  totalPremium: number;
  newCustomers: number;
  revenueThisMonth: number;
  claimsPaidThisMonth: number;
};

export type County = {
  id: string;
  name: string;
  code: string;
  subCounties: SubCounty[];
};

export type SubCounty = {
  id: string;
  name: string;
  code?: string;
};
