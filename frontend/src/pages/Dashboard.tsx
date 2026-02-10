import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionAPI } from '../services/api';
import { Transaction, Summary } from '../types';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
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
    if (window.confirm('Are you sure you want to delete this transaction?')) {
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
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's your financial overview</p>
        </div>
        <button onClick={logout} className="btn-secondary">
          Logout
        </button>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card income">
          <h3>Total Income</h3>
          <p className="amount">${summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="card expense">
          <h3>Total Expenses</h3>
          <p className="amount">${summary.totalExpense.toFixed(2)}</p>
        </div>
        <div className="card balance">
          <h3>Balance</h3>
          <p className="amount">${summary.balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="actions">
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add Transaction
        </button>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
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

      {/* Transaction Form Modal */}
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