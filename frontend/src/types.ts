// User type
export interface User {
  id: string;
  email: string;
  name: string;
}

// Auth response from API
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Transaction type
export interface Transaction {
  _id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Form data for creating/editing transactions
export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

// Summary statistics
export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}