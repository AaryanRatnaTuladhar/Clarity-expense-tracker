import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../services/api';
import { Transaction, Summary } from '../types';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import '../styles/Dashboard.css';

interface DashboardProps {
  onThemeToggle: () => void;
  isDark: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onThemeToggle, isDark }) => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const loadData = async () => {
    try {
      const filters = categoryFilter ? { category: categoryFilter } : {};
      const [transactionsData, summaryData] = await Promise.all([
        transactionAPI.getAll(filters),
        transactionAPI.getSummary(),
      ]);
      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
    loadData();
  };

  if (isLoading) {
    return <div className="loading">Loading</div>;
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <span className="brand-name">Clarity</span>
          <span className="brand-sub">Personal Finance</span>
        </div>
        <div className="header-right">
          <span className="header-user">{user?.name}</span>
          <button className="theme-toggle" onClick={onThemeToggle} title="Toggle theme">
            {isDark ? '○' : '●'}
          </button>
          <button className="btn-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-section">
        <span className="section-label">Overview</span>
        <div className="summary-cards">
          <div className="card income">
            <span className="card-badge">Income</span>
            <h3>Total inflow</h3>
            <p className="amount">{formatAmount(summary.totalIncome)}</p>
          </div>
          <div className="card expense">
            <span className="card-badge">Expense</span>
            <h3>Total outflow</h3>
            <p className="amount">{formatAmount(summary.totalExpense)}</p>
          </div>
          <div className="card balance">
            <span className="card-badge">{summary.balance >= 0 ? 'Surplus' : 'Deficit'}</span>
            <h3>Net balance</h3>
            <p className="amount">{formatAmount(summary.balance)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="actions">
        <div className="actions-left">
          <button onClick={() => setShowForm(true)} className="btn-primary">
            + New transaction
          </button>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All categories</option>
            <option value="Food & Dining">Food & Dining</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills & Utilities">Bills & Utilities</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
            <option value="Investments">Investments</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleFormClose}
        />
      )}

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Dashboard;