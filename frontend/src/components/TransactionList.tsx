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

  const formatAmount = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
    return type === 'income' ? `+${formatted}` : `−${formatted}`;
  };

  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <div className="list-header">
          <h2>Transactions</h2>
          <span className="list-count">0 records</span>
        </div>
        <div className="empty-state">
          <span className="empty-state-icon">— No records —</span>
          <h3>No transactions yet</h3>
          <p>Add your first transaction to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="list-header">
        <h2>Transactions</h2>
        <span className="list-count">{transactions.length} records</span>
      </div>

      <div className="list-columns">
        <span className="col-label">Description</span>
        <span className="col-label">Date</span>
        <span className="col-label right">Amount</span>
        <span className="col-label right">Actions</span>
      </div>

      <div className="transactions">
        {transactions.map((transaction) => (
          <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
            <div className="transaction-info">
              <span className="category">{transaction.category}</span>
              {transaction.description && (
                <span className="description">{transaction.description}</span>
              )}
            </div>

            <span className="date">{formatDate(transaction.date)}</span>

            <span className={`amount ${transaction.type}`}>
              {formatAmount(transaction.amount, transaction.type)}
            </span>

            <div className="action-buttons">
              <button onClick={() => onEdit(transaction)} className="btn-edit">
                Edit
              </button>
              <button onClick={() => onDelete(transaction._id)} className="btn-delete">
                Del
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;