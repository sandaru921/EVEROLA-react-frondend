import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar'; // Assuming you have a Navbar component

// Component for displaying job and quiz details to users
const JobQuizDetails = () => {
  // Extract job ID from URL parameters
  const { id } = useParams();

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State for job data
  const [job, setJob] = useState(null);

  // State for error messages
  const [error, setError] = useState(null);

  // Authentication state (placeholder, adjust based on auth logic)
  const [isAuthenticated] = useState(false);

  // Admin state (false for user-facing page)
  const [isAdmin] = useState(false);

  // Dummy quiz data for display
  const dummyQuiz = {
    purpose: "To evaluate candidates' technical and problem-solving skills\n- Assess coding abilities\n- Test theoretical knowledge",
    testDuration: "60 minutes",
    difficultyLevel: "Intermediate",
    questions: JSON.stringify({ "mcqs": 10, "coding": 3, "trueFalse": 5 })
  };

  // Fetch job details on component mount
  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Send GET request to fetch job by ID
        const jobResponse = await axios.get(`https://localhost:5031/api/jobs/${id}`);
        setJob(jobResponse.data);
        setError(null);
      } catch (err) {
        // Log and display error
        console.error('Error fetching job:', err);
        setError('Failed to load job details. Please try again later.');
      }
    };
    fetchJob();
  }, [id]);

  // Function to render text with paragraphs and bullet points
  const renderTextWithFormatting = (text) => {
    if (!text) return <p className="text-gray-500 italic">Not specified</p>;

    // Split text into lines
    const lines = text.split('\n');
    let inList = false;
    const elements = [];
    let listItems = [];

    // Process each line
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('-')) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(
          <li key={index} className="ml-4 text-gray-700">
            {trimmedLine.slice(1).trim()}
          </li>
        );
      } else {
        if (inList) {
          elements.push(<ul key={`ul-${index}`} className="list-disc pl-5">{listItems}</ul>);
          inList = false;
        }
        if (trimmedLine) {
          elements.push(<p key={index} className="text-gray-700">{trimmedLine}</p>);
        }
      }
    });

    // Close any open list
    if (inList) {
      elements.push(<ul key="final-ul" className="list-disc pl-5">{listItems}</ul>);
    }

    return elements.length > 0 ? elements : <p className="text-gray-500 italic">Not specified</p>;
  };

  // Function to render quiz questions with formatting
  const renderQuestions = (questionsJson) => {
    if (!questionsJson) return <p className="text-gray-500 italic">Not specified</p>;

    try {
      // Parse JSON string of questions
      const questions = JSON.parse(questionsJson);
      const items = [];
      for (const [type, count] of Object.entries(questions)) {
        items.push(
          <li key={type} className="ml-4 text-gray-700">
            {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
          </li>
        );
      }
      return <ul className="list-disc pl-5">{items}</ul>;
    } catch (e) {
      // Handle JSON parsing error
      console.error('Error parsing questions JSON:', e);
      return <p className="text-gray-500 italic">Invalid question data</p>;
    }
  };

  // Render component
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01bcc6] via-[#008eab] to-[#005b7c]">
      // Render navigation bar
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
      <main className="pt-28 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {error ? (
            // Display error message
            <p className="text-red-600 text-center font-semibold mb-6 bg-red-100/80 p-3 rounded-lg">{error}</p>
          ) : !job ? (
            // Display loading state
            <div className="text-center text-[#005b7c] text-lg font-semibold">
              <span className="w-6 h-6 border-2 border-[#01bcc6] border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
              Loading job details...
            </div>
          ) : (
            // Render job and quiz details
            <div className="bg-white/90 rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-[#d5d1ca]/20 animate-fadeIn">
           
              <h1 className="text-4xl font-bold text-[#005b7c] mb-6 bg-gradient-to-r from-[#005b7c]/80 to-[#008eab]/80 bg-clip-text text-transparent">
                {job.Title || 'Untitled Job'}
              </h1>

             
              <div className="mb-6">
                <img
                  src={job.ImageUrl || '/img/placeholder.jpg'}
                  alt={job.Title || 'Job Image'}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.target.src = '/img/placeholder.jpg';
                    console.log('Image load failed for:', job.ImageUrl);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#d5d1ca]/50 p-3 rounded-lg text-center">
                  <p className="text-[#005b7c] font-medium">Job Type</p>
                  <p className="text-gray-700">{job.JobType || 'N/A'}</p>
                </div>
                <div className="bg-[#d5d1ca]/50 p-3 rounded-lg text-center">
                  <p className="text-[#005b7c] font-medium">Work Mode</p>
                  <p className="text-gray-700">{job.WorkMode || 'N/A'}</p>
                </div>
                <div className="bg-[#d5d1ca]/50 p-3 rounded-lg text-center">
                  <p className="text-[#005b7c] font-medium">Expires On</p>
                  <p className="text-gray-700">
                    {job.ExpiringDate ? new Date(job.ExpiringDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

             
              <div className="space-y-6">
              
                <div>
                  <h2 className="text-2xl font-semibold text-[#005b7c] mb-2">Description</h2>
                  {renderTextWithFormatting(job.Description)}
                </div>

               
                <div>
                  <h2 className="text-2xl font-semibold text-[#005b7c] mb-2">Key Responsibilities</h2>
                  {renderTextWithFormatting(job.KeyResponsibilities)}
                </div>

               
                <div>
                  <h2 className="text-2xl font-semibold text-[#005b7c] mb-2">Educational Background</h2>
                  {renderTextWithFormatting(job.EducationalBackground)}
                </div>

              
                <div>
                  <h2 className="text-2xl font-semibold text-[#005b7c] mb-2">Technical Skills</h2>
                  {renderTextWithFormatting(job.TechnicalSkills)}
                </div>

               
                <div>
                  <h2 className="text-2xl font-semibold text-[#005b7c] mb-2">Experience</h2>
                  {renderTextWithFormatting(job.Experience)}
                </div>

              
                <div>
                  <h2 className="text-2xl font-semibold text-[#005b7c] mb-2">Soft Skills</h2>
                  {renderTextWithFormatting(job.SoftSkills)}
                </div>

               
                <div>
                  <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#01bcc6] to-[#008eab] text-white px-4 py-2 rounded-lg shadow-md">
                    Quiz Details
                  </h2>
                  <div className="space-y-4">
                  
                    <div>
                      <p className="text-[#005b7c] font-medium">Purpose</p>
                      {renderTextWithFormatting(dummyQuiz.purpose)}
                    </div>
                 
                    <div>
                      <p className="text-[#005b7c] font-medium">Test Duration</p>
                      <p className="text-gray-700">{dummyQuiz.testDuration}</p>
                    </div>
                  
                    <div>
                      <p className="text-[#005b7c] font-medium">Difficulty Level</p>
                      <p className="text-gray-700">{dummyQuiz.difficultyLevel}</p>
                    </div>
                 
                    <div>
                      <p className="text-[#005b7c] font-medium">Questions</p>
                      {renderQuestions(dummyQuiz.questions)}
                    </div>
                  </div>
                </div>
              </div>

           
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => navigate('/user/jobview')}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-all duration-300"
                >
                  Back to Jobs
                </button>
                <button
                  onClick={() => navigate(`/apply/${id}`)}
                  className="bg-gradient-to-r from-[#008eab] to-[#01bcc6] text-white px-6 py-3 rounded-lg hover:from-[#005b7c] hover:to-[#008eab] focus:outline-none focus:ring-4 focus:ring-[#01bcc6]/50 transition-all duration-300"
                >
                  Attempt Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// CSS animations for fade-in and spin effects
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
`;

// Inject styles into document head
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default JobQuizDetails;