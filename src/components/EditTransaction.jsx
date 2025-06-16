import React, { useState, useEffect } from 'react';

const EditTransaction = ({ editingTransaction, updateTransaction, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    customCategory: ''
  });

  const [errors, setErrors] = useState({});
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Home & Garden',
    'Personal Care',
    'Insurance',
    'Other'
  ];

  const incomeCategories = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Rental',
    'Gift',
    'Bonus',
    'Other'
  ];

  // Populate form with existing transaction data
  useEffect(() => {
    if (editingTransaction) {
      const categories = editingTransaction.type === 'expense' ? expenseCategories : incomeCategories;
      const isCustomCategory = !categories.includes(editingTransaction.category);
      
      setFormData({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        category: isCustomCategory ? '' : editingTransaction.category,
        description: editingTransaction.description,
        customCategory: isCustomCategory ? editingTransaction.category : ''
      });
      
      setShowCustomCategory(isCustomCategory);
    }
  }, [editingTransaction]);

  const getCurrentCategories = () => {
    return formData.type === 'expense' ? expenseCategories : incomeCategories;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const newCategories = newType === 'expense' ? expenseCategories : incomeCategories;
    const currentCategory = formData.customCategory || formData.category;
    
    // Check if current category exists in new type's categories
    const categoryExists = newCategories.includes(currentCategory);
    
    setFormData(prev => ({
      ...prev,
      type: newType,
      category: categoryExists ? currentCategory : '',
      customCategory: categoryExists ? '' : (currentCategory && !categoryExists ? currentCategory : '')
    }));
    
    setShowCustomCategory(!categoryExists && currentCategory);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setShowCustomCategory(true);
      setFormData(prev => ({
        ...prev,
        category: '',
        customCategory: ''
      }));
    } else {
      setShowCustomCategory(false);
      setFormData(prev => ({
        ...prev,
        category: value,
        customCategory: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category && !formData.customCategory) {
      newErrors.category = 'Please select or enter a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (showCustomCategory && !formData.customCategory.trim()) {
      newErrors.customCategory = 'Please enter a custom category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updatedTransaction = {
      ...editingTransaction,
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.customCategory || formData.category,
      description: formData.description.trim()
    };

    updateTransaction(updatedTransaction);
    
    // Reset form
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      customCategory: ''
    });
    setShowCustomCategory(false);
    setErrors({});

    alert('Transaction updated successfully!');
    setCurrentPage('home');
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      customCategory: ''
    });
    setShowCustomCategory(false);
    setErrors({});
    setCurrentPage('home');
  };

  if (!editingTransaction) {
    return (
      <div className="add-transaction-container">
        <p>No transaction selected for editing.</p>
        <button 
          type="button" 
          className="cancel-btn"
          onClick={() => setCurrentPage('home')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="add-transaction-container">
      <h2>Edit Transaction</h2>
      
      <form onSubmit={handleSubmit} className="transaction-form">
        {/* Transaction Type */}
        <div className="form-group">
          <label className="form-label">Transaction Type</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleTypeChange}
              />
              <span className="radio-custom expense"></span>
              Expense
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleTypeChange}
              />
              <span className="radio-custom income"></span>
              Income
            </label>
          </div>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount" className="form-label">Amount</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`form-input amount-input ${errors.amount ? 'error' : ''}`}
            />
          </div>
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className={`form-input ${errors.category ? 'error' : ''}`}
          >
            <option value="">Select a category</option>
            {getCurrentCategories().map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
            <option value="custom">Custom Category</option>
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        {/* Custom Category */}
        {showCustomCategory && (
          <div className="form-group">
            <label htmlFor="customCategory" className="form-label">Custom Category *</label>
            <input
              type="text"
              id="customCategory"
              name="customCategory"
              value={formData.customCategory}
              onChange={handleInputChange}
              placeholder="Enter custom category"
              className={`form-input ${errors.customCategory ? 'error' : ''}`}
            />
            {errors.customCategory && <span className="error-message">{errors.customCategory}</span>}
          </div>
        )}

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter transaction description"
            rows="3"
            className={`form-input ${errors.description ? 'error' : ''}`}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Update Transaction
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Transaction Preview */}
      {(formData.amount || formData.category || formData.description) && (
        <div className="transaction-preview">
          <h3>Preview</h3>
          <div className="preview-card">
            <div className="preview-header">
              <span className={`preview-type ${formData.type}`}>
                {formData.type}
              </span>
              <span className="preview-category">
                {formData.customCategory || formData.category || 'No category'}
              </span>
            </div>
            <p className="preview-description">
              {formData.description || 'No description'}
            </p>
            <span className={`preview-amount ${formData.type}`}>
              {formData.type === 'income' ? '+' : '-'}${formData.amount || '0.00'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTransaction;