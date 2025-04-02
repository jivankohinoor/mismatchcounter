import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ChartDashboard = () => {
  const { getChartData, counters } = useData();
  const [timeFrame, setTimeFrame] = useState('week');
  const [chartType, setChartType] = useState('line');

  // Get chart data for the selected time frame
  const { labels, data } = getChartData(timeFrame);

  // Prepare data for ChartJS
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Mismatches',
        data: data,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.5)',
      },
    ],
  };

  // Configure chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Mismatches Over ${timeFrame === 'week' ? 'Last 7 Days' : timeFrame === 'month' ? 'Last 30 Days' : 'All Time'}`,
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return `${context[0].label}`;
          },
          label: (context) => {
            const value = context.raw;
            return `${value} mismatch${value !== 1 ? 'es' : ''}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Prepare counter breakdown data
  const counterBreakdown = {
    labels: counters.map(counter => counter.name),
    datasets: [
      {
        label: 'Total Mismatches',
        data: counters.map(counter => {
          const incrementEvents = counter.events ? counter.events.filter(event => event.type === 'increment') : [];
          return incrementEvents.length;
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Get average mismatches per day
  const getAverageMismatches = () => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, value) => acc + value, 0);
    return (sum / data.length).toFixed(1);
  };

  // Get most common mismatch type
  const getMostCommonMismatch = () => {
    if (counters.length === 0) return 'None';
    
    const counterCounts = counters.map(counter => {
      const count = counter.events ? counter.events.filter(event => event.type === 'increment').length : 0;
      return { name: counter.name, count };
    });
    
    counterCounts.sort((a, b) => b.count - a.count);
    return counterCounts[0].count > 0 ? `${counterCounts[0].name} (${counterCounts[0].count})` : 'None';
  };

  return (
    <div className="chart-dashboard">
      <h3 className="text-xl font-bold mb-4">Data Analytics</h3>
      
      <div className="stats-summary grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm text-gray-500 uppercase">Average Daily</h4>
          <p className="text-3xl font-bold text-blue-600">{getAverageMismatches()}</p>
          <p className="text-xs text-gray-500">mismatches per day</p>
        </div>
        
        <div className="stat-card bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm text-gray-500 uppercase">Most Common</h4>
          <p className="text-xl font-bold text-blue-600">{getMostCommonMismatch()}</p>
          <p className="text-xs text-gray-500">mismatch type</p>
        </div>
        
        <div className="stat-card bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm text-gray-500 uppercase">Total Tracked</h4>
          <p className="text-3xl font-bold text-blue-600">
            {counters.reduce((acc, counter) => {
              const count = counter.events ? counter.events.filter(event => event.type === 'increment').length : 0;
              return acc + count;
            }, 0)}
          </p>
          <p className="text-xs text-gray-500">all-time mismatches</p>
        </div>
      </div>
      
      <div className="chart-controls flex justify-between mb-4">
        <div className="time-selector">
          <label className="mr-2 text-sm font-medium">Time Range:</label>
          <select 
            value={timeFrame} 
            onChange={(e) => setTimeFrame(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
        
        <div className="chart-type-selector">
          <label className="mr-2 text-sm font-medium">Chart Type:</label>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>
      
      <div className="chart-container bg-white p-4 rounded-lg shadow mb-6">
        {chartType === 'line' ? (
          <Line options={chartOptions} data={chartData} />
        ) : (
          <Bar options={chartOptions} data={chartData} />
        )}
      </div>
      
      <div className="counter-breakdown bg-white p-4 rounded-lg shadow">
        <h4 className="text-lg font-semibold mb-2">Mismatch by Category</h4>
        <Bar 
          data={counterBreakdown} 
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }} 
        />
      </div>
    </div>
  );
};

export default ChartDashboard;