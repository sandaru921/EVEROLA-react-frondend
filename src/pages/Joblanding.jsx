import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const Joblanding = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);

  const API_URL = "https://localhost:5031/api/jobs"; // Adjust based on your backend port

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setJobs(response.data);
          setIsAuthenticated(true);
          // Decode token to get role (simplified, use a library like jwt-decode in production)
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setIsAdmin(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin");
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        });
    }
  }, []);

  const handleDeleteJob = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const backgroundImage = isAdmin
    ? "url('/img/adminbackground.jpg')"
    : "url('/img/clientbackground.jpg')";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-repeat"
      style={{ backgroundImage }}
    >
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />

      <main className="pt-36 px-4">
        <div className="flex items-center bg-[#01BCC6] p-3 rounded-full shadow-md max-w-3xl mx-auto mb-6">
          <input
            type="text"
            placeholder="Search Jobs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder-white text-lg px-2"
          />
          <FaSearch className="text-white ml-4 cursor-pointer" />
        </div>

        {isAdmin && isAuthenticated && (
          <button
            className="bg-[#005B7C] text-white px-6 py-2 rounded-full hover:bg-[#004d66] mb-6 mx-auto block"
            onClick={() => navigate("/admin/postjob")}
          >
            Post Job ➤
          </button>
        )}

        <div className="text-center mb-6">
          <div className="inline-block bg-[#008EAB] text-white text-xl px-6 py-2 border-2 border-white rounded-md">
            {searchTerm.trim() === "" ? (
              <p>All</p>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <div key={job.id}>{job.title}</div>)
            ) : (
              <p>No jobs found.</p>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto flex flex-wrap gap-6 justify-center">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-4 rounded-lg shadow-md w-72 text-center hover:-translate-y-1 transition-transform"
              >
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <div className="flex justify-center gap-2 my-2">
                  <span className="bg-gray-300 text-black px-2 py-1 rounded-md text-xs">{job.type}</span>
                  <span className="bg-gray-300 text-black px-2 py-1 rounded-md text-xs">{job.location}</span>
                </div>
                <img src={job.imageUrl} alt={job.title} className="w-full h-auto rounded-md" />
                <p className="text-sm my-2">{job.description}</p>

                {isAdmin && isAuthenticated ? (
                  <div className="flex justify-between gap-2">
                    <button
                      className="bg-[#008CBA] text-white px-3 py-1 rounded-full hover:bg-[#007399] text-sm"
                      onClick={() => navigate(`/admin/edit-job/${job.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 text-sm"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button className="bg-[#005B7C] text-white px-4 py-2 rounded-full hover:bg-[#004d66]">
                    Apply Now
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-red-600 text-lg font-bold text-center w-full">No jobs found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Joblanding;