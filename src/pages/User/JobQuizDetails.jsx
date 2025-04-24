/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ClientJobQuizDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      // Validate the id
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        setError('Invalid job ID. Please provide a valid job ID in the URL.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5031/api/job-quiz-details/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to fetch job details. Please try again later.');
      }
    };
    fetchJob();
  }, [id]);

  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (!job) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Job Description: {job.title}</h1>
      <p>We are looking for a talented and motivated {job.title} to join our dynamic team...</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top', padding: '10px', width: '70%' }}>
              <h3>Key Responsibilities:</h3>
              <p>{job.keyResponsibilities || 'N/A'}</p>

              <h3>Minimum Qualifications:</h3>
              <h4>Educational Background:</h4>
              <p>{job.educationalBackground || 'N/A'}</p>

              <h4>Technical Skills:</h4>
              <p>{job.technicalSkills || 'N/A'}</p>

              <h4>Experience:</h4>
              <p>{job.experience || 'N/A'}</p>

              <h4>Soft Skills:</h4>
              <p>{job.softSkills || 'N/A'}</p>
            </td>

            <td style={{ verticalAlign: 'top', padding: '10px', width: '30%', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
              <h3>Quiz Details</h3>
              <p><strong>Purpose:</strong> The quiz is designed to assess technical knowledge, problem-solving abilities, and practical coding skills.</p>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td><strong>Test Duration:</strong></td>
                    <td>{job.testDuration} mins</td>
                  </tr>
                  <tr>
                    <td><strong>Difficulty Level:</strong></td>
                    <td>{job.difficultyLevel}</td>
                  </tr>
                  <tr>
                    <td><strong>Questions:</strong></td>
                    <td>{job.numberOfQuestions} Questions</td>
                  </tr>
                </tbody>
              </table>
              <button style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#00bcd4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Attempt Quiz
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ClientJobQuizDetails;*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ClientJobQuizDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        setError('Invalid job ID. Please provide a valid job ID in the URL.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5031/api/job-quiz-details/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to fetch job details. Please try again later.');
      }
    };
    fetchJob();
  }, [id]);

  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (!job) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Job Description: {job.title}</h1>
      <p>We are looking for a talented and motivated {job.title} to join our dynamic team...</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top', padding: '10px', width: '70%' }}>
              <h3>Key Responsibilities:</h3>
              <p>{job.keyResponsibilities || 'N/A'}</p>

              <h3>Minimum Qualifications:</h3>
              <h4>Educational Background:</h4>
              <p>{job.educationalBackground || 'N/A'}</p>

              <h4>Technical Skills:</h4>
              <p>{job.technicalSkills || 'N/A'}</p>

              <h4>Experience:</h4>
              <p>{job.experience || 'N/A'}</p>

              <h4>Soft Skills:</h4>
              <p>{job.softSkills || 'N/A'}</p>
            </td>

            <td style={{ verticalAlign: 'top', padding: '10px', width: '30%', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
              <h3>Quiz Details</h3>
              <p><strong>Purpose:</strong> The quiz is designed to assess technical knowledge, problem-solving abilities, and practical coding skills.</p>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td><strong>Test Duration:</strong></td>
                    <td>{job.testDuration} mins</td>
                  </tr>
                  <tr>
                    <td><strong>Difficulty Level:</strong></td>
                    <td>{job.difficultyLevel}</td>
                  </tr>
                  <tr>
                    <td><strong>Questions:</strong></td>
                    <td>{job.numberOfQuestions} Questions</td>
                  </tr>
                </tbody>
              </table>
              <button style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#00bcd4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Attempt Quiz
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ClientJobQuizDetails;