import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from '../../components/AdminNavbar'; // Import AdminNavbar
import AdminSidebar from '../../components/AdminSidebar';

// AdminJobview component for displaying and managing job listings
const AdminJobview = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State for search term input
  const [searchTerm, setSearchTerm] = useState("");

  // State for storing fetched jobs
  const [jobs, setJobs] = useState([]);

  // State for error messages
  const [error, setError] = useState(null);

  // State for authentication status (hardcoded for now)
  const [isAuthenticated] = useState(false);

  // State for admin status (hardcoded for now)
  const [isAdmin] = useState(true);

  // State to track job being deleted
  const [deletingJobId, setDeletingJobId] = useState(null);

  // API URL for job endpoints
  const API_URL = "https://localhost:5031/api/jobs";

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Function to fetch jobs from the API
  const fetchJobs = async () => {
    try {
      // Send GET request to API with 5-second timeout
      const response = await axios.get(API_URL, { timeout: 5000 });
      console.log("API Response:", response.data);

      // Check if response data is an array
      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        setJobs([]);
        setError("Invalid job data received from the server.");
      }
      setError(null);
    } catch (error) {
      // Log detailed error information
      console.error("Error fetching jobs:", {
        message: error.message,
        code: error.code,
        response: error.response ? error.response.data : "No response",
        status: error.response ? error.response.status : "No status",
      });
      // Set error message for user
      setError(`Failed to load jobs. Error: ${error.message}. Check console.`);
    }
  };

  // Function to handle job deletion
  const handleDeleteJob = async (id) => {
    // Confirm deletion with user
    if (window.confirm("Are you sure you want to delete this job?")) {
      setDeletingJobId(id);
      try {
        // Send DELETE request to API
        const response = await axios.delete(`${API_URL}/${id}`, { timeout: 5000 });
        if (response.status === 204) {
          // Refresh job list after deletion
          await fetchJobs();
        } else {
          throw new Error("Deletion failed with unexpected status.");
        }
        setError(null);
      } catch (error) {
        // Log and display deletion error
        console.error("Error deleting job:", error);
        setError(error.response?.data || "Failed to delete job. Please try again.");
      } finally {
        // Clear deleting state
        setDeletingJobId(null);
      }
    }
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) =>
    job &&
    typeof job.Title === "string" &&
    job.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Component for skeleton loading effect
  const JobCardSkeleton = () => (
    <div className="bg-white/80 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-40 bg-[#d5d1ca]/50"></div>
      <div className="p-4">
        <div className="h-6 bg-[#d5d1ca]/50 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-[#d5d1ca]/50 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-[#d5d1ca]/50 rounded w-full mb-4"></div>
        <div className="flex justify-between">
          <div className="h-8 bg-[#d5d1ca]/50 rounded w-1/3"></div>
          <div className="h-8 bg-[#d5d1ca]/50 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );

  // Render the component
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AdminNavbar />

      {/* Main content with Sidebar and Job View */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Job View content */}
        <main className="flex-1 ml-64 pt-20 px-4 sm:px-6 lg:px-8 py-12 relative bg-gradient-to-b from-[#d5d1ca] via-[#008eab] to-[#d5d1ca]">
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative bg-white/30 backdrop-blur-md rounded-full p-0.5 shadow-lg border border-[#d0d1cd]/20">
              <input
                type="text"
                placeholder="Search Jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 text-lg text-[#005b7c] bg-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-[
                #898c80ff] transition-all duration-300 placeholder:text-[#87877a]/70"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#008eab] text-lg" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-8 text-right">
            <button
              className="bg-gradient-to-r from-[#005b7c] to-[#008eab] text-white px-6 py-3 rounded-lg hover:from-[#008eab] hover:to-[#01bcc6] focus:outline-none focus:ring-4 focus:ring-[#01bcc6]/50 transition-all duration-300 flex items-center gap-2 group"
              onClick={() => navigate("/admin/JobUpload")}
            >
              <FaPlus className="text-white group-hover:text-[#d5d1ca] transition-colors duration-300" />
              Post New Job
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-center font-semibold mb-6 bg-red-100/80 p-3 rounded-lg">{error}</p>
          )}

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length === 0 && !error ? (
              // Show skeleton loaders while fetching
              Array(6)
                .fill()
                .map((_, index) => <JobCardSkeleton key={index} />)
            ) : filteredJobs.length > 0 ? (
              // Render job cards
              filteredJobs.map((job) => (
                <div
                  key={job.Id}
                  className="bg-white/90 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 transform-gpu bg-gradient-to-br from-[#efefee]/70 to-white/80 backdrop-blur-sm border border-[#d5d1ca]/20 animate-fadeIn"
                  style={{ animationDelay: `${filteredJobs.indexOf(job) * 0.1}s` }}
                >
                  <div className="p-5 min-h-[400px] flex flex-col justify-between relative">
                    <div>
                      <h3 className="text-xl font-bold text-[#005b7c] mb-3 bg-gradient-to-r from-[#005b7c]/80 to-[#008eab]/80 bg-clip-text text-transparent">
                        {job.Title || "Untitled"}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-[#d5d1ca]/50 text-[#005b7c] px-3 py-1 rounded-full text-sm font-medium">
                          {job.JobType || "N/A"}
                        </span>
                        <span className="bg-[#d5d1ca]/50 text-[#005b7c] px-3 py-1 rounded-full text-sm font-medium">
                          {job.WorkMode || "N/A"}
                        </span>
                        <span className="bg-[#d5d1ca]/50 text-[#005b7c] px-3 py-1 rounded-full text-sm font-medium">
                          Expires: {job.ExpiringDate ? new Date(job.ExpiringDate).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <div className="relative">
                        <img
                          src={job.ImageUrl || "/img/placeholder.jpg"}
                          alt={job.Title || "Job Image"}
                          className="w-full h-48 object-cover rounded-lg transition-opacity duration-300 hover:opacity-90"
                          onError={(e) => {
                            e.target.src = "/img/placeholder.jpg";
                            console.log("Image load failed for:", job.ImageUrl);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#005b7c]/50 to-transparent rounded-lg"></div>
                      </div>
                      <p className="text-gray-700 text-sm mt-3 line-clamp-3">{job.Description || "No description"}</p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        className="bg-gradient-to-r from-[#008eab] to-[#01bcc6] text-white px-4 py-2 rounded-full hover:from-[#005b7c] hover:to-[#008eab] focus:outline-none focus:ring-4 focus:ring-[#01bcc6]/50 transition-all duration-300 flex items-center gap-2 group"
                        onClick={() => navigate(`/Admin/edit-job/${job.Id}`)}
                      >
                        <span className="group-hover:text-[#d5d1ca] transition-colors duration-300">Edit</span>
                      </button>
                      <button
                        className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-full hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-4 focus:ring-red-600/50 transition-all duration-300 flex items-center gap-2"
                        onClick={() => handleDeleteJob(job.Id)}
                        disabled={deletingJobId === job.Id}
                      >
                        {deletingJobId === job.Id ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <FaTrash className="text-white" />
                        )}
                        {deletingJobId === job.Id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Message when no jobs match search
              <p className="text-[#005b7c] text-center col-span-full text-lg font-semibold bg-[#d5d1ca]/50 p-4 rounded-lg">
                No jobs found.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// CSS animations for fade-in, spin, and pulse effects
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .animate-spin {
    animation: spin 0.8s linear infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
`;

// Inject styles into document head
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default AdminJobview;