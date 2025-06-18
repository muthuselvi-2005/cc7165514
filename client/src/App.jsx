import React, { useState } from 'react';
import Home from './components/Home';
import AddTransaction from './components/AddTransaction';
import EditTransaction from './components/EditTransaction';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    setEditingTransaction(null);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-title">Finance Tracking System</h1>
          <div className="nav-links">
            <button
              className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              Home
            </button>
            <button
              className={`nav-btn ${currentPage === 'add' ? 'active' : ''}`}
              onClick={() => setCurrentPage('add')}
            >
              Add Transaction
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'home' && (
          <Home
            transactions={transactions}
            deleteTransaction={deleteTransaction}
            setCurrentPage={setCurrentPage}
            editTransaction={editTransaction}
          />
        )}
        {currentPage === 'add' && (
          <AddTransaction
            addTransaction={addTransaction}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === 'edit' && (
          <EditTransaction
            editingTransaction={editingTransaction}
            updateTransaction={updateTransaction}
            setCurrentPage={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}

export default App;
