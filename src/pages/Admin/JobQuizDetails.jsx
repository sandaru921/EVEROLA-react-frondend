import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Component for updating job and quiz details for admins
function AdminJobQuizDetails() {
  // Extract job ID from URL parameters
  const { id } = useParams();

  // State for job data
  const [job, setJob] = useState(null);

  // State for error messages
  const [error, setError] = useState(null);

  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keyResponsibilities, setKeyResponsibilities] = useState('');
  const [educationalBackground, setEducationalBackground] = useState('');
  const [technicalSkills, setTechnicalSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [softSkills, setSoftSkills] = useState('');
  const [testDuration, setTestDuration] = useState(45);
  const [difficultyLevel, setDifficultyLevel] = useState('Moderate');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  // Fetch job details on component mount
  useEffect(() => {
    const fetchJob = async () => {
      // Validate job ID
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        setError('Invalid job ID. Please provide a valid job ID in the URL.');
        return;
      }

      try {
        // Send GET request to fetch job and quiz details
        const response = await axios.get(`https://localhost:5031/api/job-quiz-details/${id}`);
        const data = response.data;
        // Update job and form states
        setJob(data);
        setTitle(data.title);
        setDescription(data.description);
        setKeyResponsibilities(data.keyResponsibilities || '');
        setEducationalBackground(data.educationalBackground || '');
        setTechnicalSkills(data.technicalSkills || '');
        setExperience(data.experience || '');
        setSoftSkills(data.softSkills || '');
        setTestDuration(data.testDuration);
        setDifficultyLevel(data.difficultyLevel || 'Moderate');
        setNumberOfQuestions(data.numberOfQuestions);
      } catch (error) {
        // Log and display error
        console.error('Error fetching job:', error);
        setError('Failed to fetch job details. Please try again later.');
      }
    };
    fetchJob();
  }, [id]);

  // Handle form submission to update job and quiz details
  const handleUpdate = async (e) => {
    e.preventDefault();
    // Validate job ID
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      setError('Invalid job ID. Cannot update job.');
      return;
    }

    // Prepare updated job object
    const updatedJob = {
      id: parseInt(id),
      title,
      type: job.type,
      location: job.location,
      imageUrl: job.imageUrl,
      description,
      keyResponsibilities,
      educationalBackground,
      technicalSkills,
      experience,
      softSkills,
      createdBy: job.createdBy,
      createdAt: job.createdAt,
      testDuration: parseInt(testDuration),
      difficultyLevel,
      numberOfQuestions: parseInt(numberOfQuestions),
    };

    try {
      // Send PUT request to update job and quiz details
      await axios.put(`https://localhost:5031/api/job-quiz-details/${id}`, updatedJob);
      alert('Job and quiz details updated successfully!');
    } catch (error) {
      // Log and display update error
      console.error('Error updating job:', error);
      alert('Failed to update job: ' + error.message);
    }
  };

  // Render error message if present
  if (error) return <div className="p-5 text-red-600 font-semibold">{error}</div>;

  // Render loading state if job data is not yet fetched
  if (!job) return <div className="p-5 text-gray-600">Loading...</div>;

  // Render form for updating job and quiz details
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Job and Quiz Details (Admin)</h2>
      <form onSubmit={handleUpdate} className="space-y-6">
   
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Responsibilities:</label>
          <textarea
            value={keyResponsibilities}
            onChange={(e) => setKeyResponsibilities(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Educational Background:</label>
          <textarea
            value={educationalBackground}
            onChange={(e) => setEducationalBackground(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Technical Skills:</label>
          <textarea
            value={technicalSkills}
            onChange={(e) => setTechnicalSkills(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience:</label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Soft Skills:</label>
          <textarea
            value={softSkills}
            onChange={(e) => setSoftSkills(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      
        <h3 className="text-lg font-semibold text-gray-800 mt-4">Quiz Details</h3>
      
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Test Duration (minutes):</label>
          <input
            type="number"
            value={testDuration}
            onChange={(e) => setTestDuration(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level:</label>
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        // Number of questions input
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions:</label>
          <input
            type="number"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        // Submit button
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          Update Details
        </button>
      </form>
    </div>
  );
}

export default AdminJobQuizDetails;