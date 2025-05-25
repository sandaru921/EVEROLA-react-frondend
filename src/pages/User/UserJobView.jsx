import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";

const UserJobview = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [isAuthenticated] = useState(false);
  const [isAdmin] = useState(false); // Set to false for user view

  const API_URL = "https://localhost:5031/api/jobs";

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(API_URL, { timeout: 5000 });
      console.log("API Response:", response.data);
      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        setJobs([]);
        setError("Invalid job data received from the server.");
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching jobs:", {
        message: error.message,
        code: error.code,
        response: error.response ? error.response.data : "No response",
        status: error.response ? error.response.status : "No status",
      });
      setError(`Failed to load jobs. Error: ${error.message}. Check console.`);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job &&
    typeof job.Title === "string" &&
    job.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton loading effect
  const JobCardSkeleton = () => (
    <div className="bg-white/80 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-40 bg-[#d5d1ca]/50"></div>
      <div className="p-4">
        <div className="h-6 bg-[#d5d1ca]/50 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-[#d5d1ca]/50 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-[#d5d1ca]/50 rounded w-full mb-4"></div>
        <div className="flex justify-center">
          <div className="h-8 bg-[#d5d1ca]/50 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01bcc6] via-[#008eab] to-[#005b7c]">
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
      <main className="pt-28 px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Glassmorphism Search Bar - Rounded and Reduced Height */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative bg-white/30 backdrop-blur-md rounded-full p-0.5 shadow-lg border border-[#01bcc6]/20">
            <input
              type="text"
              placeholder="Search Jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 text-lg text-[#005b7c] bg-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 placeholder:text-[#efefee]/70"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#efefee] text-lg" />
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-center font-semibold mb-6 bg-red-100/80 p-3 rounded-lg">{error}</p>
        )}

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 && !error ? (
            Array(6)
              .fill()
              .map((_, index) => <JobCardSkeleton key={index} />)
          ) : filteredJobs.length > 0 ? (
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
                  <div className="flex justify-center mt-4">
                    <button
                      className="bg-gradient-to-r from-[#008eab] to-[#01bcc6] text-white px-6 py-2 rounded-full hover:from-[#005b7c] hover:to-[#008eab] focus:outline-none focus:ring-4 focus:ring-[#01bcc6]/50 transition-all duration-300"
                      onClick={() => navigate(`/apply/${job.Id}`)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#005b7c] text-center col-span-full text-lg font-semibold bg-[#d5d1ca]/50 p-4 rounded-lg">
              No jobs found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

// CSS Animations
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
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default UserJobview;