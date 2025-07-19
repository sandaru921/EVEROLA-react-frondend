import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTimes, FaUpload, FaChevronDown } from 'react-icons/fa';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';

// EditJob component for updating existing job listings
const EditJob = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Extract job ID from URL parameters
  const { id } = useParams();

  // State for job form data
  const [job, setJob] = useState({
    title: '',
    description: '',
    imageFile: null,
    jobType: '',
    expiringDate: '',
    createdBy: 'admin1',
    workMode: 'remote',
    existingImageUrl: '',
    keyResponsibilities: '',
    educationalBackground: '',
    technicalSkills: '',
    experience: '',
    softSkills: '',
    quizIds: [],
  });

  // State for loading status
  const [loading, setLoading] = useState(true);

  // State for form validation errors
  const [errors, setErrors] = useState({});

  // State for quizzes dropdown
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false);

  // Mock data for quizzes
  const mockQuizzes = [
    { id: 1, quizName: 'Advanced Frontend Development - Skills Assessment' },
    { id: 2, quizName: 'Advanced Frontend Developer – Skills Assessment' },
    { id: 3, quizName: 'Software Development – Technical Assessment 2' },
    { id: 4, quizName: 'Senior Software Engineer – Expert Technical Assessment' },
    { id: 5, quizName: 'Data Science Skills Assessment' },
  ];

  // Fetch job details on component mount
  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Send GET request to fetch job by ID
        const response = await axios.get(`https://localhost:5031/api/jobs/${id}`);
        const jobData = response.data;
        // Set job state with fetched data
        setJob({
          title: jobData.Title,
          description: jobData.Description,
          imageFile: null,
          jobType: jobData.JobType,
          expiringDate: new Date(jobData.ExpiringDate).toISOString().split('T')[0],
          createdBy: jobData.CreatedBy,
          workMode: jobData.WorkMode,
          existingImageUrl: jobData.ImageUrl,
          keyResponsibilities: jobData.KeyResponsibilities || '',
          educationalBackground: jobData.EducationalBackground || '',
          technicalSkills: jobData.TechnicalSkills || '',
          experience: jobData.Experience || '',
          softSkills: jobData.SoftSkills || '',
          quizIds: jobData.QuizIds ? jobData.QuizIds.split(',').map(id => id.trim()) : [],
        });
        setLoading(false);
      } catch (error) {
        // Log detailed error information
        console.error('Error fetching job:', {
          message: error.message,
          code: error.code,
          response: error.response ? { status: error.response.status, data: error.response.data } : 'No response',
        });
        // Display error and navigate back
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Unknown error';
        alert('Failed to load job details: ' + errorMessage);
        navigate('/admin/jobview');
      }
    };
    fetchJob();
  }, [id, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });

    // Real-time validation
    const newErrors = { ...errors };
    if (!value) {
      newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      delete newErrors[name];
    }
    if (name === 'expiringDate') {
      const today = new Date().toISOString().split('T')[0];
      if (value < today) {
        newErrors[name] = 'Expiring date must be in the future';
      }
    }
    setErrors(newErrors);
  };

  // Handle file input for new image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJob({ ...job, imageFile: file });
    }
  };

  // Remove selected new image
  const removeNewImage = () => {
    setJob({ ...job, imageFile: null });
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    if (!job.title) newErrors.title = 'Title is required';
    if (!job.description) newErrors.description = 'Description is required';
    if (!job.jobType) newErrors.jobType = 'Job type is required';
    if (!job.expiringDate) newErrors.expiringDate = 'Expiring date is required';
    if (!job.workMode) newErrors.workMode = 'Work mode is required';
    if (job.expiringDate) {
      const today = new Date().toISOString().split('T')[0];
      if (job.expiringDate < today) {
        newErrors.expiringDate = 'Expiring date must be in the future';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle quiz toggle
  const handleQuizToggle = (quizId) => {
    const currentQuizIds = [...job.quizIds];
    const quizIndex = currentQuizIds.indexOf(quizId.toString());
    if (quizIndex === -1) {
      currentQuizIds.push(quizId.toString());
    } else {
      currentQuizIds.splice(quizIndex, 1);
    }
    setJob({ ...job, quizIds: currentQuizIds });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    // Create FormData for API request
    const formData = new FormData();
    formData.append('Title', job.title);
    formData.append('Description', job.description);
    if (job.imageFile) {
      formData.append('ImageFile', job.imageFile);
    } else if (job.existingImageUrl) {
      // Retain existing image by appending a flag or URL if backend supports it
      formData.append('KeepExistingImage', 'true');
    }
    formData.append('JobType', job.jobType);
    formData.append('ExpiringDate', job.expiringDate);
    formData.append('CreatedBy', job.createdBy);
    formData.append('WorkMode', job.workMode);
    formData.append('KeyResponsibilities', job.keyResponsibilities);
    formData.append('EducationalBackground', job.educationalBackground);
    formData.append('TechnicalSkills', job.technicalSkills);
    formData.append('Experience', job.experience);
    formData.append('SoftSkills', job.softSkills);
    formData.append('QuizIds', job.quizIds.join(','));

    try {
      // Send PUT request to update job
      const response = await axios.put(`https://localhost:5031/api/jobs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Job updated successfully!');
      navigate('/admin/jobview');
    } catch (error) {
      // Log detailed error information
      console.error('Error updating job:', {
        message: error.message,
        code: error.code,
        config: error.config,
        request: error.request ? { status: error.request.status, statusText: error.request.statusText } : 'No request',
        response: error.response ? { status: error.response.status, data: error.response.data } : 'No response',
      });
      // Display error message
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Unknown error';
      alert('Failed to update job: ' + errorMessage);
    }
  };

  // Navigate back to job view
  const handleCancel = () => {
    navigate('/admin/jobview');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#005b7c] via-[#008eab] to-[#01bcc6] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-12 h-12 border-4 border-[#01bcc6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Render edit job form
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 ml-64 pt-20 p-4 sm:p-6 lg:p-8 bg-[#E6EFF2] flex items-center justify-center h-screen overflow-hidden">
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-[#d5d1ca]/20 animate-fadeIn">
            <h2 className="text-3xl font-bold text-[#005b7c] mb-8 text-center bg-gradient-to-r from-[#005b7c] to-[#008eab] bg-clip-text text-transparent">
              Edit Job
            </h2>
            <div className="max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[#005b7c] font-medium mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={job.title}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.title ? 'border-red-500' : 'border-[#d5d1ca]'
                    } focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50`}
                    placeholder="Enter job title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-[#005b7c] font-medium mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={job.description}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.description ? 'border-red-500' : 'border-[#d5d1ca]'
                    } focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50 resize-y`}
                    rows="4"
                    placeholder="Enter job description"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-[#005b7c] font-medium mb-2">Current Image</label>
                  {job.existingImageUrl && (
                    <div className="mt-2">
                      <img
                        src={job.existingImageUrl}
                        alt="Current Job Image"
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.target.src = '/img/placeholder.jpg';
                        }}
                      />
                      <p className="text-gray-600 text-sm mt-2 break-all">
                        Current Image URL:{' '}
                        <a
                          href={job.existingImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#008eab] hover:underline ml-1"
                        >
                          {job.existingImageUrl}
                        </a>
                      </p>
                    </div>
                  )}
                  <label className="block text-[#005b7c] font-medium mb-2 mt-4">Upload New Image (Optional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-3 rounded-lg border border-[#d5d1ca] focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#008eab] file:text-white hover:file:bg-[#005b7c]"
                    />
                    <FaUpload className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#01bcc6]" />
                  </div>
                  {job.imageFile && (
                    <div className="mt-3 relative inline-block">
                      <img
                        src={URL.createObjectURL(job.imageFile)}
                        alt="Preview New Image"
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={removeNewImage}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-all duration-300"
                      >
                        <FaTimes size={16} />
                      </button>
                      <p className="text-gray-600 text-sm mt-2">New image selected (will replace current image)</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[#005b7c] font-medium mb-2" htmlFor="keyResponsibilities">
                    Key Responsibilities
                  </label>
                  <textarea
                    id="keyResponsibilities"
                    name="keyResponsibilities"
                    value={job.keyResponsibilities}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#d5d1ca] focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50 resize-y"
                    rows="4"
                    placeholder="Enter key responsibilities (e.g., - Manage projects\n- Lead team)"
                  />
                </div>

                <div>
                  <label className="block text-[#005b7c] font-medium mb-2" htmlFor="educationalBackground">
                    Educational Background
                  </label>
                  <textarea
                    id="educationalBackground"
                    name="educationalBackground"
                    value={job.educationalBackground}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#d5d1ca] focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50 resize-y"
                    rows="4"
                    placeholder="Enter required educational background (e.g., Bachelor's in Computer Science)"
                  />
                </div>

                <div>
                  <label className="block text-[#005b7c] font-medium mb-2" htmlFor="technicalSkills">
                    Technical Skills
                  </label>
                  <textarea
                    id="technicalSkills"
                    name="technicalSkills"
                    value={job.technicalSkills}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#d5d1ca] focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50 resize-y"
                    rows="4"
                    placeholder="Enter technical skills (e.g., - JavaScript\n- Python\n- AWS)"
                  />
                </div>

                <div>
                  <label className="block text-[#005b7c] font-medium mb-2" htmlFor="experience">
                    Experience
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={job.experience}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#d5d1ca] focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50 resize-y"
                    rows="4"
                    placeholder="Enter experience requirements (e.g., 5+ years in software development)"
                  />
                </div>

                <div>
                  <label className="block text-[#005b7c] font-medium mb-2" htmlFor="softSkills">
                    Soft Skills
                  </label>
                  <textarea
                    id="softSkills"
                    name="softSkills"
                    value={job.softSkills}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#d5d1ca] focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50 resize-y"
                    rows="4"
                    placeholder="Enter soft skills (e.g., - Communication\n- Teamwork\n- Problem-solving)"
                  />
                </div>

                <div>
                  <label className="block text-[#005b7c] font-medium mb-2" htmlFor="jobType">
                    Job Type
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={job.jobType}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.jobType ? 'border-red-500' : 'border-[#d5d1ca]'
                    } focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c]`}
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                  {errors.jobType && <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>}
                </div>

                <div>
                  <label className="block text-[#005b7c] font-medium mb-2" htmlFor="workMode">
                    Work Mode
                  </label>
                  <select
                    id="workMode"
                    name="workMode"
                    value={job.workMode}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border ${
                      errors.workMode ? 'border-red-500' : 'border-[#d5d1ca]'
                    } focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c]`}
                  >
                    <option value="remote">Remote</option>
                    <option value="online">Online</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  {errors.workMode && <p className="text-red-500 text-sm mt-1">{errors.workMode}</p>}
                </div>

                <div>
                  <label className="block text-[#005b7c] font-medium mb-2" htmlFor="expiringDate">
                    Expiring Date
                  </label>
                  <input
                    type="date"
                    id="expiringDate"
                    name="expiringDate"
                    value={job.expiringDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full p-3 rounded-lg border ${
                      errors.expiringDate ? 'border-red-500' : 'border-[#d5d1ca]'
                    } focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c]`}
                  />
                  {errors.expiringDate && <p className="text-red-500 text-sm mt-1">{errors.expiringDate}</p>}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setIsQuizzesOpen(!isQuizzesOpen)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-[#d5d1ca] bg-white/70 text-[#005b7c] hover:bg-[#005b7c] hover:text-white transition-all duration-300"
                  >
                    <span>Assign Quizzes</span>
                    <FaChevronDown className={`transform transition-transform ${isQuizzesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isQuizzesOpen && (
                    <div className="space-y-2 mt-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {mockQuizzes.map(quiz => (
                        <button
                          key={quiz.id}
                          type="button"
                          onClick={() => handleQuizToggle(quiz.id)}
                          className={`w-full flex items-center p-2 rounded-lg border ${job.quizIds.includes(quiz.id.toString()) ? 'bg-[#008eab] text-white' : 'bg-white/70 text-[#005b7c] border-[#d5d1ca]'} hover:bg-[#005b7c] hover:text-white transition-all duration-300`}
                        >
                          <FaChevronDown className="mr-2" />
                          {quiz.quizName}
                        </button>
                      ))}
                    </div>
                  )}
                  {job.quizIds.length > 0 && (
                    <div className="mt-2 p-2 bg-[#e6eff2] rounded-lg">
                      <p className="text-[#005b7c] font-medium">Selected Quizzes:</p>
                      <ul className="list-disc pl-5">
                        {job.quizIds.map(id => {
                          const selectedQuiz = mockQuizzes.find(quiz => quiz.id === parseInt(id));
                          return selectedQuiz ? (
                            <li key={id} className="text-[#008eab]">
                              {selectedQuiz.quizName}
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-between gap-4">
                  <button
                    type="button"
                    className="w-1/2 bg-gradient-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500/50 transition-all duration-300"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-gradient-to-r from-[#005b7c] to-[#008eab] text-white p-3 rounded-lg hover:from-[#008eab] hover:to-[#01bcc6] focus:outline-none focus:ring-4 focus:ring-[#01bcc6]/50 transition-all duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
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

export default EditJob;