import React, { useState } from 'react';

const Home = ({ transactions, deleteTransaction, setCurrentPage,editTransaction }) => {
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;


  const categories = [...new Set(transactions.map(t => t.category))];


  const filteredTransactions = transactions.filter(transaction => {
    const typeMatch = filter === 'all' || transaction.type === filter;
    const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;
    return typeMatch && categoryMatch;
  });

  return (
    <div className="home-container">
     
      <div className="summary-cards">
        <div className="card balance-card">
          <h3>Total Balance</h3>
          <p className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
        <div className="card income-card">
          <h3>Total Income</h3>
          <p className="amount positive">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card expense-card">
          <h3>Total Expenses</h3>
          <p className="amount negative">${totalExpense.toFixed(2)}</p>
        </div>
      </div>

    
      <div className="filters">
        <div className="filter-group">
          <label>Filter by Type:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Filter by Category:</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      
      <div className="transaction-history">
        <h2>Transaction History ({filteredTransactions.length})</h2>
        
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="transaction-list">
            {filteredTransactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-header">
                    <span className={`transaction-type ${transaction.type}`}>
                      {transaction.type}
                    </span>
                    <span className="transaction-category">
                      {transaction.category}
                    </span>
                  </div>
                  <p className="transaction-description">
                    {transaction.description}
                  </p>
                  <p className="transaction-date">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="transaction-amount-section">
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  
                  <button
                  className="edit-btn"
                  onClick={() => {
                    editTransaction(transaction);
                    setCurrentPage('edit');
                 }}
                  >
                  Edit
                  </button>
                  <button 
                    className="delete-btn "
                    onClick={() => deleteTransaction(transaction.id)}
                    title="Delete transaction"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;