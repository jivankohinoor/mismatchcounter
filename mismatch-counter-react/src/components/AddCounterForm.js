import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

const AddCounterForm = () => {
  const { addCounter } = useData();
  const [counterName, setCounterName] = useState('');
  const [threshold, setThreshold] = useState('0');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (counterName.trim()) {
      // Add counter
      addCounter(counterName.trim(), parseInt(threshold, 10));
      
      // Clear form
      setCounterName('');
      setThreshold('0');
    } else {
      alert('Please enter a name for the counter!');
    }
  };
  
  return (
    <div className="add-counter">
      <h3>Add New Mismatch Counter</h3>
      <form className="counter-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          id="new-counter-name" 
          placeholder="Enter a new mismatch to track..." 
          aria-label="New counter name"
          value={counterName}
          onChange={(e) => setCounterName(e.target.value)}
        />
        
        <select 
          id="new-counter-threshold" 
          aria-label="Select threshold limit"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
        >
          <option value="0">No limit</option>
          <option value="3">Limit: 3</option>
          <option value="5">Limit: 5</option>
          <option value="10">Limit: 10</option>
        </select>
        
        <button 
          id="add-counter-btn" 
          aria-label="Add new counter"
          type="submit"
        >
          Add New Counter
        </button>
      </form>
    </div>
  );
};

export default AddCounterForm; 