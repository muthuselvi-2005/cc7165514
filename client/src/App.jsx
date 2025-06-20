import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import AddTransaction from './components/AddTransaction';
import EditTransaction from './components/EditTransaction';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  
  useEffect(() => {
    fetch('${import.meta.env.VITE_BACKEND_URL}/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error('Error fetching transactions:', err));
  }, []);


  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      date: new Date().toISOString().split('T')[0],
    };

    fetch('${import.meta.env.VITE_BACKEND_URL}/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaction),
    })
      .then(res => res.json())
      .then(data => {
        setTransactions([data, ...transactions]);
        setCurrentPage('home');
      })
      .catch(err => console.error('Error adding transaction:', err));
  };

  
  const deleteTransaction = (_id) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${_id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTransactions(transactions.filter(t => t._id !== _id));
      })
      .catch(err => console.error('Error deleting transaction:', err));
  };

 
  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setCurrentPage('edit');
  };

 
  const updateTransaction = (updatedTransaction) => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transactions/${updatedTransaction._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTransaction),
    })
      .then(res => res.json())
      .then(data => {
        setTransactions(transactions.map(t => (t._id === data._id ? data : t)));
        setEditingTransaction(null);
        setCurrentPage('home');
      })
      .catch(err => console.error('Error updating transaction:', err));
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
