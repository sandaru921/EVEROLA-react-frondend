import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Adjust path based on your structure

// Sample job data
const jobsData = [
  { id: 1, title: "Senior Software Engineer", type: "Full Time", location: "Onsite", image: "/img/junior.jpg" },
  { id: 2, title: "Junior Software Engineer", type: "Full Time", location: "Onsite", image: "/img/junior.jpg" },
  { id: 3, title: "Intern Software Engineer", type: "Full Time", location: "Onsite", image: "/img/intern.jpg" },
];

const JobLanding = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState(jobsData);

  // Simulated auth state (replace with your actual auth logic)
  const [isAuthenticated] = useState(true); // Set to true/false based on real auth
  const [isAdmin] = useState(false); // Toggle this to switch between admin/client view

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Conditionally set background image based on isAdmin
  const backgroundImage = isAdmin
    ? "url('/img/adminbackground.jpg')" // Admin background
    : "url('/img/clientbackground.jpg')"; // Client background

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-repeat"
      style={{ backgroundImage }}
    >
      {/* Navbar Component */}
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />

      {/* Main Content */}
      <main className="pt-36 px-4">
        {/* Search Bar */}
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

        {/* Admin Post Job Button */}
        {isAdmin && isAuthenticated && (
          <button
            className="bg-[#005B7C] text-white px-6 py-2 rounded-full hover:bg-[#004d66] mb-6 mx-auto block"
            onClick={() => navigate("/admin/post-job")}
          >
            Post Job ➤
          </button>
        )}

        {/* Job Label */}
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

        {/* Job List */}
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
                <img src={job.image} alt={job.title} className="w-full h-auto rounded-md" />
                <p className="text-sm my-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                
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

export default JobLanding;