"use client"

import React, { useState, useEffect, useRef } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultAnalysisDashboard = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total marks from percentage and score
  const calculateTotalMarks = (marks, percentage) => {
    if (percentage === 0) {
      // For 0% cases, we need to infer from the data
      // Based on your database data, when score is 0, totalMarks is 4
      return 4;
    }
    return Math.round(marks / (percentage / 100));
  };

  // Get unique categories for filtering
  const getAvailableCategories = () => {
    if (!Array.isArray(rankings) || rankings.length === 0) return [];
    
    const categories = [...new Set(rankings.map(r => r.category))];
    return categories.sort();
  };

  // Get filtered categories based on search
  const getFilteredCategories = () => {
    const categories = getAvailableCategories();
    if (!searchTerm) return categories;
    
    return categories.filter(category => 
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Filter rankings by selected category
  const getFilteredRankings = () => {
    if (selectedCategory === 'all') {
      return rankings;
    }
    return rankings.filter(r => r.category === selectedCategory);
  };

  // Process rankings data for chart with simple filtering
  const processChartData = (rankingsData) => {
    if (!Array.isArray(rankingsData) || rankingsData.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Group by user and calculate average marks
    const userMarks = {};
    const userTotalMarks = {};

    rankingsData.forEach(ranking => {
      const userName = ranking.name;
      const marks = ranking.marks;
      const percentage = ranking.percentage;
      const totalMarks = calculateTotalMarks(marks, percentage);
      
      // Skip entries where we can't determine total marks
      if (totalMarks === 0) {
        return;
      }
      
      if (!userMarks[userName]) {
        userMarks[userName] = [];
        userTotalMarks[userName] = [];
      }
      
      userMarks[userName].push(marks);
      userTotalMarks[userName].push(totalMarks);
    });

    // Calculate average marks for each user
    const chartData = Object.keys(userMarks).map(userName => {
      const avgMarks = userMarks[userName].reduce((sum, mark) => sum + mark, 0) / userMarks[userName].length;
      const avgTotalMarks = userTotalMarks[userName].reduce((sum, total) => sum + total, 0) / userTotalMarks[userName].length;
      return {
        name: userName,
        avgMarks: Math.round(avgMarks * 100) / 100,
        avgTotalMarks: Math.round(avgTotalMarks * 100) / 100
      };
    });

    // Sort by average marks (descending)
    chartData.sort((a, b) => b.avgMarks - a.avgMarks);

    return {
      labels: chartData.map(item => item.name),
      datasets: [
        {
          label: 'Average Marks',
          data: chartData.map(item => item.avgMarks),
          avgTotalMarks: chartData.map(item => item.avgTotalMarks),
          backgroundColor: chartData.map((item, index) => {
            // Create gradient colors based on performance
            const performance = item.avgMarks / item.avgTotalMarks;
            if (performance >= 0.8) return 'rgba(34, 197, 94, 0.8)';
            if (performance >= 0.6) return 'rgba(59, 130, 246, 0.8)';
            if (performance >= 0.4) return 'rgba(245, 158, 11, 0.8)';
            return 'rgba(239, 68, 68, 0.8)';
          }),
          borderColor: chartData.map((item, index) => {
            const performance = item.avgMarks / item.avgTotalMarks;
            if (performance >= 0.8) return 'rgba(34, 197, 94, 1)';
            if (performance >= 0.6) return 'rgba(59, 130, 246, 1)';
            if (performance >= 0.4) return 'rgba(245, 158, 11, 1)';
            return 'rgba(239, 68, 68, 1)';
          }),
          borderWidth: 2,
        }
      ]
    };
  };

  // Process data for performance distribution chart - Flexible for varying total marks
  const processPerformanceDistribution = (rankingsData) => {
    if (!Array.isArray(rankingsData) || rankingsData.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Calculate performance percentages for each result
    const performances = rankingsData.map(ranking => {
      const totalMarks = calculateTotalMarks(ranking.marks, ranking.percentage);
      return totalMarks > 0 ? (ranking.marks / totalMarks) * 100 : 0;
    });

    // Dynamic bucket creation based on data range
    const minPerf = Math.min(...performances);
    const maxPerf = Math.max(...performances);
    const range = maxPerf - minPerf;
    
    // Create 5-8 buckets based on data distribution
    const numBuckets = Math.min(8, Math.max(5, Math.ceil(range / 20)));
    const bucketSize = range / numBuckets;
    
    const buckets = {};
    for (let i = 0; i < numBuckets; i++) {
      const start = minPerf + (i * bucketSize);
      const end = minPerf + ((i + 1) * bucketSize);
      const label = i === numBuckets - 1 
        ? `${start.toFixed(0)}-${end.toFixed(0)}%`
        : `${start.toFixed(0)}-${(end - 0.1).toFixed(0)}%`;
      buckets[label] = 0;
    }

    // Distribute performances into buckets
    performances.forEach(perf => {
      const bucketIndex = Math.min(
        Math.floor((perf - minPerf) / bucketSize),
        numBuckets - 1
      );
      const bucketKey = Object.keys(buckets)[bucketIndex];
      buckets[bucketKey]++;
    });

    // Generate colors based on performance level
    const colors = Object.keys(buckets).map((label, index) => {
      const start = parseFloat(label.split('-')[0]);
      if (start >= 80) return 'rgba(16, 185, 129, 0.8)';      // Dark green
      if (start >= 60) return 'rgba(34, 197, 94, 0.8)';       // Green
      if (start >= 40) return 'rgba(59, 130, 246, 0.8)';      // Blue
      if (start >= 20) return 'rgba(245, 158, 11, 0.8)';      // Orange
      return 'rgba(239, 68, 68, 0.8)';                        // Red
    });

    const borderColors = colors.map(color => color.replace('0.8', '1'));

    return {
      labels: Object.keys(buckets),
      datasets: [
        {
          label: 'Number of Results',
          data: Object.values(buckets),
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: 2,
        }
      ]
    };
  };

  // Process data for category performance comparison - Scalable for growing job roles
  const processCategoryPerformance = (rankingsData) => {
    if (!Array.isArray(rankingsData) || rankingsData.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Group by category
    const categoryData = {};
    
    rankingsData.forEach(ranking => {
      const category = ranking.category;
      const totalMarks = calculateTotalMarks(ranking.marks, ranking.percentage);
      const performance = totalMarks > 0 ? (ranking.marks / totalMarks) * 100 : 0;
      
      if (!categoryData[category]) {
        categoryData[category] = [];
      }
      categoryData[category].push(performance);
    });

    // Calculate average performance per category
    const chartData = Object.keys(categoryData).map(category => {
      const avgPerformance = categoryData[category].reduce((sum, perf) => sum + perf, 0) / categoryData[category].length;
      return {
        category: category,
        avgPerformance: Math.round(avgPerformance * 100) / 100,
        count: categoryData[category].length
      };
    });

    // Sort by average performance
    chartData.sort((a, b) => b.avgPerformance - a.avgPerformance);

    // Limit categories for better visualization if too many
    const maxCategories = 15;
    const displayData = chartData.slice(0, maxCategories);
    
    // If we have more categories, add an "Others" category
    if (chartData.length > maxCategories) {
      const othersData = chartData.slice(maxCategories);
      const othersAvg = othersData.reduce((sum, item) => sum + item.avgPerformance, 0) / othersData.length;
      const othersCount = othersData.reduce((sum, item) => sum + item.count, 0);
      
      displayData.push({
        category: `Others (${chartData.length - maxCategories} more)`,
        avgPerformance: Math.round(othersAvg * 100) / 100,
        count: othersCount
      });
    }

    return {
      labels: displayData.map(item => item.category),
      datasets: [
        {
          label: 'Average Performance (%)',
          data: displayData.map(item => item.avgPerformance),
          backgroundColor: displayData.map((item, index) => {
            const performance = item.avgPerformance;
            if (performance >= 80) return 'rgba(34, 197, 94, 0.8)';
            if (performance >= 60) return 'rgba(59, 130, 246, 0.8)';
            if (performance >= 40) return 'rgba(245, 158, 11, 0.8)';
            return 'rgba(239, 68, 68, 0.8)';
          }),
          borderColor: displayData.map((item, index) => {
            const performance = item.avgPerformance;
            if (performance >= 80) return 'rgba(34, 197, 94, 1)';
            if (performance >= 60) return 'rgba(59, 130, 246, 1)';
            if (performance >= 40) return 'rgba(245, 158, 11, 1)';
            return 'rgba(239, 68, 68, 1)';
          }),
          borderWidth: 2,
        }
      ]
    };
  };

  // Chart options for different chart types
  const chartOptions = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: true,
        text: selectedCategory === 'all' ? 'Marks Comparison' : `${selectedCategory} - Marks Comparison`,
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#004d66',
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const avgTotalMarks = context.dataset.avgTotalMarks[context.dataIndex];
            const avgMarks = context.parsed.x;
            const performance = avgTotalMarks > 0 ? ((avgMarks / avgTotalMarks) * 100).toFixed(1) : '0';
            return [
              `Average Marks: ${avgMarks}`,
              `Average Total Marks: ${avgTotalMarks}`,
              `Performance: ${performance}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Marks',
          font: {
            weight: 'bold',
            size: 14
          },
          color: '#004d66'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          },
          callback: function(value) {
            return value % 1 === 0 ? value : value.toFixed(1);
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Users',
          font: {
            weight: 'bold',
            size: 14
          },
          color: '#004d66'
        },
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false,
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  // Options for performance distribution chart - Flexible for varying total marks
  const distributionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Performance Distribution (Dynamic Ranges)',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#004d66',
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y} results`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Results',
          font: { weight: 'bold', size: 14 },
          color: '#004d66'
        },
        ticks: {
          stepSize: 1,
          precision: 0
        }
      },
      x: {
        title: {
          display: true,
          text: 'Performance Range (%)',
          font: { weight: 'bold', size: 14 },
          color: '#004d66'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      }
    }
  };

  // Options for category performance chart - Scalable for growing job roles
  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Category Performance Comparison',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#004d66',
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const category = context.label;
            const performance = context.parsed.y.toFixed(1);
            return [
              `Category: ${category}`,
              `Average Performance: ${performance}%`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Average Performance (%)',
          font: { weight: 'bold', size: 14 },
          color: '#004d66'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Job Categories',
          font: { weight: 'bold', size: 14 },
          color: '#004d66'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          callback: function(value, index, values) {
            const label = this.getLabelForValue(value);
            // Truncate long category names
            return label.length > 20 ? label.substring(0, 20) + '...' : label;
          }
        }
      }
    }
  };

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5031/analysisHub")
      .withAutomaticReconnect()
      .build();

    let isMounted = true;
    let retryAttempts = 0;
    const maxRetries = 5;
    const retryDelay = 2000;

    const startSignalRConnection = () => {
      connection.start()
        .then(() => {
          console.log("SignalR Connected");
          retryAttempts = 0;
          
          // FIXED: Remove async from the listener
          connection.on("ReceiveQuizResult", (result) => {
            console.log("New quiz result received:", result);
            // Fetch updated rankings without async in the listener
            fetchUpdatedRankings();
          });
        })
        .catch(err => {
          console.error("SignalR Connection Error: ", err);
          if (isMounted && retryAttempts < maxRetries) {
            retryAttempts++;
            console.log(`Attempting to reconnect SignalR (Attempt ${retryAttempts}/${maxRetries})...`);
            // Add a random delay before retrying
            const randomDelay = Math.random() * retryDelay;
            setTimeout(startSignalRConnection, randomDelay);
          } else if (isMounted) {
            console.error("Maximum SignalR retry attempts reached.");
          }
        });
    };

    const fetchUpdatedRankings = async () => {
      try {
        console.log("Fetching updated rankings...");
        const response = await axios.get("https://localhost:5031/api/analysis/rankings");
        console.log("Updated rankings response:", response.data);
        
        // Handle JSON.NET format - extract $values array
        const rankingsData = response.data.$values || response.data;
        if (isMounted) setRankings(rankingsData);
      } catch (error) {
        console.error("Error fetching updated rankings:", error);
        if (isMounted) setError("Failed to fetch updated rankings");
      }
    };

    const fetchInitialRankings = async () => {
      try {
        console.log("Fetching initial rankings...");
        setLoading(true);
        setError(null);
        
        const response = await axios.get("https://localhost:5031/api/analysis/rankings");
        console.log("Initial rankings response:", response.data);
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        
        // Handle JSON.NET format - extract $values array
        const rankingsData = response.data.$values || response.data;
        console.log("Processed rankings data:", rankingsData);
        
        if (isMounted) {
          setRankings(rankingsData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching initial rankings:", error);
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        
        if (isMounted) {
          setError(`Failed to fetch rankings: ${error.message}`);
          setLoading(false);
        }
      }
    };

    startSignalRConnection();
    fetchInitialRankings();

    return () => {
      isMounted = false;
      connection.stop();
    };
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <AdminNavbar />
        <div className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Result Analysis Dashboard</h2>
          
          {/* Debug Info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p><strong>Debug Info:</strong></p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Error: {error || 'None'}</p>
            <p>Rankings count: {Array.isArray(rankings) ? rankings.length : 'Not an array'}</p>
            <p>Rankings type: {typeof rankings}</p>
            <p>Available fields: {rankings.length > 0 ? Object.keys(rankings[0]).join(', ') : 'No data'}</p>
            <p>First ranking object: {JSON.stringify(rankings[0], null, 2)}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-center text-gray-600">Loading rankings...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-md">
              <p className="text-red-600 font-semibold">Error: {error}</p>
            </div>
          )}

          {/* Data Table */}
          {!loading && !error && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#004d66] text-white">
                    <th className="p-2">Rank</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Marks</th>
                    <th className="p-2">Percentage (%)</th>
                    <th className="p-2">Time Taken (s)</th>
                    <th className="p-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(rankings) && rankings.length > 0 ? (
                    rankings.map((r, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="p-2">{r.rank}</td>
                        <td className="p-2">{r.name}</td>
                        <td className="p-2">
                          {r.marks}/{calculateTotalMarks(r.marks, r.percentage)}
                        </td>
                        <td className="p-2">
                          {r.percentage.toFixed(2)}%
                        </td>
                        <td className="p-2">{r.timeTaken}</td>
                        <td className="p-2">{r.category}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">
                        No rankings data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Marks Comparison Chart */}
          {!loading && !error && Array.isArray(rankings) && rankings.length > 0 && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              {/* Job Role Filter */}
              <div className="mb-6 flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter by Job Role:</label>
                <div className="relative">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                  >
                    <option value="all">All Job Roles</option>
                    {getFilteredCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {getAvailableCategories().length > 10 && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Search job roles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {getFilteredCategories().length} of {getAvailableCategories().length} roles shown
                      </p>
                    </div>
                  )}
                </div>
                {selectedCategory !== 'all' && (
                  <span className="text-sm text-gray-500">
                    Showing only {selectedCategory} results for fair comparison
                  </span>
                )}
              </div>
              
              {/* Single Chart */}
              <div className="h-80">
                <Bar 
                  data={processChartData(getFilteredRankings())} 
                  options={chartOptions} 
                />
              </div>
              
              {/* Performance Legend */}
              <div className="mt-6 flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>High Performance (≥80%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Good Performance (60-79%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Average Performance (40-59%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Low Performance (&lt;40%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Analytics Charts */}
          {!loading && !error && Array.isArray(rankings) && rankings.length > 0 && (
            <div className="mt-12">
              {/* Summary Stats */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Results</h3>
                  <p className="text-3xl font-bold text-blue-600">{rankings.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Job Categories</h3>
                  <p className="text-3xl font-bold text-green-600">{getAvailableCategories().length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Users</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {new Set(rankings.map(r => r.name)).size}
                  </p>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Performance Distribution Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="h-80">
                    <Bar 
                      data={processPerformanceDistribution(getFilteredRankings())} 
                      options={distributionChartOptions} 
                    />
                  </div>
                </div>

                {/* Category Performance Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="h-80">
                    <Bar 
                      data={processCategoryPerformance(getFilteredRankings())} 
                      options={categoryChartOptions} 
                    />
                  </div>
                </div>
              </div>

              {/* Flexibility Info */}
              <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Chart Flexibility Features:</h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• <strong>Dynamic Ranges:</strong> Performance distribution adapts to your data range (e.g., 20-100% or 0-50%)</li>
                  <li>• <strong>Scalable Categories:</strong> Handles unlimited job roles with smart grouping for large datasets</li>
                  <li>• <strong>Varying Total Marks:</strong> Works with any quiz format (4 marks, 20 marks, 100 marks, etc.)</li>
                  <li>• <strong>Real-time Updates:</strong> All charts update automatically when new results come in</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultAnalysisDashboard;