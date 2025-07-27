import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardquiz = () => {
  // Sample simplified data
  const data = {
    userActivity: {
      jobViews: [8, 9, 7, 10, 8],
      applications: [3, 4, 2, 5, 3],
      dates: ['2025-07-12', '2025-07-13', '2025-07-14', '2025-07-15', '2025-07-16'],
    },
    quizParticipantsByGender: {
      male: 6,
      female: 3,
      other: 1,
    },
  };

  // Line chart data for Job Applications
  const applicationsData = {
    labels: data.userActivity.dates,
    datasets: [
      {
        label: 'Applications',
        data: data.userActivity.applications,
        borderColor: '#008eab',
        backgroundColor: 'rgba(0, 142, 171, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Pie chart data for Quiz Participants by Gender
  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        data: Object.values(data.quizParticipantsByGender),
        backgroundColor: ['#008eab', '#01bcc6', '#87877a'],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Important for custom height to work
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#005b7c' },
      },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#005b7c' } },
      x: { ticks: { color: '#005b7c' } },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFF2]">
      {/* Navbar */}
      <AdminNavbar />

      {/* Main content with Sidebar and Dashboard */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Dashboard content */}
        <main className="flex-1 ml-64 pt-20 px-6 py-8 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#005b7c]">Admin Dashboard</h2>

          {/* Side-by-side charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Job Applications Line Chart */}
            <div className="bg-white p-6 rounded-lg shadow border border-[#d5d1ca] flex flex-col items-center justify-center">
              <h3 className="font-semibold mb-6 text-[#005b7c] text-center w-full">Job Applications Over Time</h3>
              <div className="w-full" style={{ height: '350px' }}>
                <Line data={applicationsData} options={chartOptions} />
              </div>
            </div>

            {/* Quiz Participants Gender Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow border border-[#d5d1ca] flex flex-col items-center justify-center">
              <h3 className="font-semibold mb-6 text-[#005b7c] text-center w-full">Quiz Participants by Gender</h3>
              <div className="w-full max-w-md" style={{ height: '350px' }}>
                <Pie data={genderData} options={chartOptions} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardquiz;
