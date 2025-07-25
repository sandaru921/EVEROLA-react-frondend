import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const JobQuizDetails = () => {
  const { id } = useParams(); // Job ID
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated] = useState(false); // Adjust based on your auth logic
  const [isAdmin] = useState(false); // Adjust based on your auth logic

  useEffect(() => {
    const fetchJobAndQuiz = async () => {
      try {
        // Fetch job details
        const jobRes = await axios.get(`https://localhost:5031/api/Jobs/${id}`);
        setJob(jobRes.data);

        // Fetch quiz details for the job
        const quizRes = await axios.get(`https://localhost:5031/api/Jobs/${id}/Quiz`);
        setQuiz(quizRes.data);
      } catch (err) {
        console.error('Error fetching data:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError('Failed to load job or quiz details. Please try again later.');
      }
    };
    fetchJobAndQuiz();
  }, [id]);

  // Render text field
  const renderText = (label, text) => (
    <div className="flex gap-2 text-sm">
      <span className="font-semibold text-[#005b7c] min-w-[140px]">{label}:</span>
      <span className="text-gray-700 flex-1">{text || <em className="text-gray-400">N/A</em>}</span>
    </div>
  );

  // Render multiline list
  const renderList = (label, items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return renderText(label, <em className="text-gray-400">N/A</em>);
    }
    return (
      <div className="text-sm">
        <div className="flex gap-2 mb-1">
          <span className="font-semibold text-[#005b7c] min-w-[140px]">{label}:</span>
          <ul className="list-disc pl-5 text-gray-700 flex-1 space-y-1">
            {items.map((item, i) => (
              <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#E6EFF2] flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
      <main className="pt-24 px-4 sm:px-6 lg:px-12 flex-1">
        <div className="max-w-7xl mx-auto mb-8">
          {error ? (
            <p className="text-red-600 text-center font-semibold mb-4">{error}</p>
          ) : !job || !quiz ? (
            <p className="text-center text-[#005b7c] text-base">Loading...</p>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-10 grid gap-10 md:grid-cols-2 text-sm">
              {/* Left side: Image, Job Info, Description & Key Responsibilities */}
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-[#005b7c]">{job.Title || 'Untitled Job'}</h1>
                <img
                  src={job.ImageUrl || '/img/placeholder.jpg'}
                  alt={job.Title || 'Job Image'}
                  className="w-full h-64 object-cover rounded-lg shadow"
                  onError={e => {
                    e.target.src = '/img/placeholder.jpg';
                  }}
                />
                <div className="space-y-2">
                  {renderText('Job Type', job.JobType)}
                  {renderText('Work Mode', job.WorkMode)}
                  {renderText('Expires', job.ExpiringDate ? new Date(job.ExpiringDate).toLocaleDateString() : 'N/A')}
                </div>
                {renderList('Description', job.Description ? [job.Description] : [])}
                {renderList('Key Responsibilities', job.KeyResponsibilities)}
              </div>

              {/* Right side: Other job details + quiz details */}
              <div className="space-y-6">
                {renderList('Educational Background', job.EducationalBackground)}
                {renderList('Technical Skills', job.TechnicalSkills)}
                {renderList('Experience', job.Experience)}
                {renderList('Soft Skills', job.SoftSkills)}
                <div className="space-y-2">
                  <div className="font-semibold text-[#005b7c] text-base">Quiz Details</div>
                  {renderText('Quiz Name', quiz.QuizName)}
                  {renderText('Quiz Duration', quiz.QuizDuration ? `${quiz.QuizDuration} minutes` : 'N/A')}
                  {renderText('Quiz Level', quiz.QuizLevel)}
                </div>
              </div>
            </div>
          )}
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={() => navigate('/user/jobview')}
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 text-sm"
            >
              Back to Jobs
            </button>
            <button
              onClick={() => navigate(`/attemptquiz/${quiz?.Id || ''}`)}
              disabled={!quiz?.Id}
              className={`px-5 py-2 rounded text-sm text-white ${
                quiz?.Id
                  ? 'bg-[#008eab] hover:bg-[#005b7c]'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Attempt Quiz
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .animate-spin {
    animation: spin 0.8s linear infinite;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default JobQuizDetails;