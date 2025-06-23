
import apiClient from './apiClient';
import { Payment } from '../models/types';

export const paymentService = {
  // Get all payments (admin)
  getAllPayments: async (): Promise<Payment[]> => {
    try {
      const response = await apiClient.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  // Get payments for a specific user
  getUserPayments: async (): Promise<Payment[]> => {
    try {
      const response = await apiClient.get('/payments/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  },

  // Get payments for a specific policy
  getPolicyPayments: async (policyId: string): Promise<Payment[]> => {
    try {
      const response = await apiClient.get(`/payments/policy/${policyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching policy payments:', error);
      throw error;
    }
  },
  
  // Create a new payment
  createPayment: async (paymentData: Partial<Payment>): Promise<Payment> => {
    try {
      const response = await apiClient.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },
  
  // Process M-Pesa payment
  processMpesaPayment: async (paymentData: { policyId: string, phone: string, amount: number }): Promise<any> => {
    try {
      const response = await apiClient.post('/payments/mpesa', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing M-Pesa payment:', error);
      throw error;
    }
  }
};
