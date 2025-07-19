import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const JobQuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated] = useState(false);
  const [isAdmin] = useState(false);

  const dummyQuiz = {
    purpose: `To evaluate candidates' technical and problem-solving skills\n- Assess coding abilities\n- Test theoretical knowledge`,
    testDuration: '60 minutes',
    difficultyLevel: 'Intermediate',
    questions: JSON.stringify({ mcqs: 10, coding: 3, trueFalse: 5 }),
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`https://localhost:5031/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load job details. Please try again later.');
      }
    };
    fetchJob();
  }, [id]);

  // For simple label:value text lines
  const renderText = (label, text) => (
    <div className="flex gap-2 text-sm">
      <span className="font-semibold text-[#005b7c] min-w-[140px]">{label}:</span>
      <span className="text-gray-700 flex-1">{text || <em className="text-gray-400">N/A</em>}</span>
    </div>
  );

  // For multiline list with label aligned with text, using bullets
  const renderList = (label, text) => {
    if (!text) {
      return renderText(label, <em className="text-gray-400">N/A</em>);
    }

    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);

    return (
      <div className="text-sm">
        <div className="flex gap-2 mb-1">
          <span className="font-semibold text-[#005b7c] min-w-[140px]">{label}:</span>
          <ul className="list-disc pl-5 text-gray-700 flex-1 space-y-1">
            {lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderQuestions = () => {
    if (!dummyQuiz.questions) return <em className="text-gray-400">N/A</em>;
    try {
      const q = JSON.parse(dummyQuiz.questions);
      return (
        <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
          {Object.entries(q).map(([type, count], i) => (
            <li key={i}>
              {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
            </li>
          ))}
        </ul>
      );
    } catch {
      return <em className="text-gray-400">Invalid</em>;
    }
  };

  return (
    <div className="min-h-screen bg-[#E6EFF2] flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
      <main className="pt-24 px-4 sm:px-6 lg:px-12 flex-1">
        <div className="max-w-7xl mx-auto mb-8">
          {error ? (
            <p className="text-red-600 text-center font-semibold mb-4">{error}</p>
          ) : !job ? (
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

                {renderList('Description', job.Description)}
                {renderList('Key Responsibilities', job.KeyResponsibilities)}
              </div>

              {/* Right side: Other job details + quiz */}
              <div className="space-y-6">
                {renderList('Educational Background', job.EducationalBackground)}
                {renderList('Technical Skills', job.TechnicalSkills)}
                {renderList('Experience', job.Experience)}
                {renderList('Soft Skills', job.SoftSkills)}

                <div className="space-y-2">
                  <div className="font-semibold text-[#005b7c]">Quiz Purpose:</div>
                  {dummyQuiz.purpose.split('\n').map((line, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="space-y-2">
                  {renderText('Quiz Duration', dummyQuiz.testDuration)}
                  {renderText('Quiz Level', dummyQuiz.difficultyLevel)}

                  <div>
                    <div className="font-semibold text-[#005b7c]">Quiz Questions:</div>
                    {renderQuestions()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={() => navigate('/user/jobview')}
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 text-sm"
            >
              Back to Jobs
            </button>
            <button
              onClick={() => navigate(`/attemptquiz/${id}`)}
              className="bg-[#008eab] text-white px-5 py-2 rounded hover:bg-[#005b7c] text-sm"
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
