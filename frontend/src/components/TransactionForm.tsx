import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../services/api';
import { Transaction, TransactionFormData } from '../types';
import '../styles/TransactionForm.css';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onClose }) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string>('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date.split('T')[0],
      });
    }
  }, [transaction]);

  // AI auto-categorization when description changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.description && formData.description.length > 3 && !formData.category) {
        setIsAiLoading(true);
        try {
          const suggested = await transactionAPI.suggestCategory(
            formData.description,
            formData.amount,
            formData.type
          );
          setAiSuggestion(suggested);
          setFormData({ ...formData, category: suggested });
        } catch (error) {
          console.error('AI suggestion failed');
        } finally {
          setIsAiLoading(false);
        }
      }
    }, 800); // Wait 800ms after user stops typing

    return () => clearTimeout(timer);
  }, [formData.description, formData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (transaction) {
        await transactionAPI.update(transaction._id, formData);
      } else {
        await transactionAPI.create(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = {
    expense: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Other',
    ],
    income: ['Salary', 'Freelance', 'Investments', 'Other'],
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={formData.type === 'income' ? 'active' : ''}
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
              >
                Income
              </button>
              <button
                type="button"
                className={formData.type === 'expense' ? 'active' : ''}
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
              >
                Expense
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setAiSuggestion('');
              }}
              placeholder="e.g., Starbucks coffee, Uber ride"
            />
            {isAiLoading && (
              <small style={{ color: 'var(--primary)', marginTop: '4px', display: 'block' }}>
                🤖 AI is analyzing...
              </small>
            )}
            {aiSuggestion && (
              <small style={{ color: 'var(--success)', marginTop: '4px', display: 'block' }}>
                ✨ AI suggested: {aiSuggestion}
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
              {categories[formData.type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : transaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;