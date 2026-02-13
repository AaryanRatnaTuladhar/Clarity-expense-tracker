/// <reference types="vite/client" />
import axios from 'axios';
import { AuthResponse, Transaction, TransactionFormData, Summary } from '../types';

const API_URL = import.meta.env.VITE_API_URL;


// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', { email, password, name });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
};

// Transaction API
export const transactionAPI = {
  getAll: async (filters?: { category?: string; startDate?: string; endDate?: string }): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>('/transactions', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: TransactionFormData): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  update: async (id: string, data: TransactionFormData): Promise<Transaction> => {
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  getSummary: async (): Promise<Summary> => {
    const response = await api.get<Summary>('/transactions/stats/summary');
    return response.data;
  },

  // NEW: AI suggest category
  suggestCategory: async (description: string, amount: number, type: 'income' | 'expense'): Promise<string> => {
    try {
      const response = await api.post<{ category: string }>('/transactions/suggest-category', {
        description,
        amount,
        type,
      });
      return response.data.category;
    } catch (error) {
      console.error('AI categorization failed, using fallback');
      return 'Other';
    }
  },
};

export default api;