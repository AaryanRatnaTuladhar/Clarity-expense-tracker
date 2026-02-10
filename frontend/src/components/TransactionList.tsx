import React from 'react';
import { Transaction } from '../types';
import '../styles/TransactionList.css';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, onEdit }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <h3>No transactions yet</h3>
        <p>Click "Add Transaction" to get started!</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h2>Recent Transactions</h2>
      <div className="transactions">
        {transactions.map((transaction) => (
          <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
            <div className="transaction-info">
              <div className="transaction-header">
                <span className="category">{transaction.category}</span>
                <span className="date">{formatDate(transaction.date)}</span>
              </div>
              {transaction.description && (
                <p className="description">{transaction.description}</p>
              )}
            </div>
            <div className="transaction-actions">
              <span className={`amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}$
                {transaction.amount.toFixed(2)}
              </span>
              <div className="action-buttons">
                <button onClick={() => onEdit(transaction)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => onDelete(transaction._id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;