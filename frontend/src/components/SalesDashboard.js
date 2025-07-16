import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [activeTab, setActiveTab] = useState('sales');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Add timestamp to prevent caching issues
        const timestamp = new Date().getTime();
        const salesResponse = await axios.get(`http://localhost:5000/api/sales?t=${timestamp}`);
        const summaryResponse = await axios.get(`http://localhost:5000/api/summary?t=${timestamp}`);
        
        // Log the responses for debugging
        console.log('Sales response:', salesResponse.data);
        console.log('Summary response:', summaryResponse.data);
        
        if (salesResponse.data && Array.isArray(salesResponse.data)) {
          setSalesData(salesResponse.data);
        } else {
          console.error('Invalid sales data format', salesResponse.data);
          setError('Invalid data format received from server');
        }
        
        if (summaryResponse.data && Array.isArray(summaryResponse.data)) {
          setSummaryData(summaryResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Failed to fetch data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timestamp to prevent caching issues
      const timestamp = new Date().getTime();
      const salesResponse = await axios.get(`http://localhost:5000/api/sales?t=${timestamp}`);
      const summaryResponse = await axios.get(`http://localhost:5000/api/summary?t=${timestamp}`);
      
      if (salesResponse.data && Array.isArray(salesResponse.data)) {
        setSalesData(salesResponse.data);
      }
      
      if (summaryResponse.data && Array.isArray(summaryResponse.data)) {
        setSummaryData(summaryResponse.data);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Refresh error:', err);
      setError(`Failed to refresh data: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-container"><p>Loading data...</p></div>;
  if (error) return (
    <div className="dashboard-container">
      <p>Error: {error}</p>
      <button onClick={refreshData}>Try Again</button>
    </div>
  );

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Retail Sales Data</h2>
      
      <div className="tab-container">
        <button 
          className={`tab ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          Sales
        </button>
        <button 
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
      </div>
      
      <button onClick={refreshData}>Refresh Data</button>
      
      {activeTab === 'sales' ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.sale_id}>
                <td>{sale.sale_id}</td>
                <td>{sale.product_id}</td>
                <td>{sale.quantity}</td>
                <td>${sale.sale_amount.toFixed(2)}</td>
                <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                <td>{sale.source || 'online'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Total Quantity</th>
              <th>Total Amount</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((item) => (
              <tr key={item.product_id}>
                <td>{item.product_id}</td>
                <td>{item.total_quantity}</td>
                <td>${item.total_sale_amount.toFixed(2)}</td>
                <td>{new Date(item.last_updated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesDashboard; 