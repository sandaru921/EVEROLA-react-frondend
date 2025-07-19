import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaUpload, FaPlus, FaChevronDown } from 'react-icons/fa';
import Autosuggest from 'react-autosuggest';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';

const jobTypeSuggestions = ['Full-time', 'Part-time', 'Contract'];
const workModeSuggestions = ['On-site', 'Remote', 'Hybrid'];
const titleSuggestions = ['Software Engineer', 'Data Analyst', 'Project Manager', 'UI/UX Designer', 'DevOps Engineer', 'Product Manager', 'Web Developer', 'Mobile Developer'];
const technicalSkillsSuggestions = ['JavaScript', 'Python', 'Java', 'C#', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'GraphQL'];
const softSkillsSuggestions = ['Communication', 'Teamwork', 'Problem-solving', 'Leadership', 'Adaptability', 'Time Management', 'Creativity', 'Empathy'];
const educationalBackgroundSuggestions = [
  'Bachelor\'s in Computer Science',
  'Master\'s in Business Administration',
  'Bachelor\'s in Engineering',
  'Master\'s in Data Science',
  'PhD in AI',
  'Bachelor\'s in Design',
  'Bachelor\'s in Information Technology',
  'Bachelor\'s in Software Engineering',
  'Bachelor\'s in Cybersecurity',
  'Bachelor\'s in Information Systems',
  'Master\'s in Computer Science',
  'Master\'s in Information Technology',
  'Associate\'s Degree in IT',
  'Diploma in Software Development',
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Data Science',
  'Cybersecurity',
  'Network Engineering',
  'Cloud Computing',
  'Artificial Intelligence',
  'Machine Learning',
];
const keyResponsibilitiesSuggestions = ['Manage projects', 'Lead team', 'Develop software', 'Design UI/UX', 'Analyze data', 'Deploy applications', 'Coordinate with stakeholders'];

const PostJob = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: '',
    description: '',
    imageFile: null,
    jobType: '',
    expiringDate: '',
    createdBy: 'admin1',
    workMode: 'remote',
    keyResponsibilities: [], // Array for multiple selections
    educationalBackground: [], // Array for multiple selections
    technicalSkills: [], // Array for multiple selections
    experience: '',
    softSkills: [], // Array for multiple selections
    quizIds: [], // Array to store selected quiz IDs for display only
  });
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState({
    title: [],
    technicalSkills: [],
    softSkills: [],
    educationalBackground: [],
    keyResponsibilities: [],
  });
  const [quizzes, setQuizzes] = useState([]); // State to hold fetched quizzes

  // States to manage input values for Autosuggest that are not yet added to the main job state
  const [currentKeyResponsibilityInput, setCurrentKeyResponsibilityInput] = useState('');
  const [currentEducationalBackgroundInput, setCurrentEducationalBackgroundInput] = useState('');
  const [currentTechnicalSkillsInput, setCurrentTechnicalSkillsInput] = useState('');
  const [currentSoftSkillsInput, setCurrentSoftSkillsInput] = useState('');
  const [isQuizzesOpen, setIsQuizzesOpen] = useState(false); // State to toggle quiz list visibility

  // Fetch quizzes from the database
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('https://localhost:5031/api/Quiz');
        const quizData = response.data?.['$values'] || response.data || [];
        setQuizzes(quizData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setQuizzes([]); // Default to empty array on error
      }
    };
    fetchQuizzes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
    const newErrors = { ...errors };
    if (!value && ['title', 'description', 'jobType', 'expiringDate', 'workMode'].includes(name)) {
      newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJob({ ...job, imageFile: file });
      setErrors({ ...errors, imageFile: '' });
    }
  };

  const removeImage = () => {
    setJob({ ...job, imageFile: null });
    setErrors({ ...errors, imageFile: 'Image is required' });
  };

  const getSuggestions = (value, suggestionList) => {
    const inputValue = value.trim().toLowerCase();
    return inputValue.length === 0
      ? suggestionList
      : suggestionList.filter(s => s.toLowerCase().includes(inputValue));
  };

  const onSuggestionsFetchRequested = ({ value }, field) => {
    let currentSuggestionList;
    if (field === 'title') currentSuggestionList = titleSuggestions;
    else if (field === 'technicalSkills') currentSuggestionList = technicalSkillsSuggestions;
    else if (field === 'softSkills') currentSuggestionList = softSkillsSuggestions;
    else if (field === 'educationalBackground') currentSuggestionList = educationalBackgroundSuggestions;
    else if (field === 'keyResponsibilities') currentSuggestionList = keyResponsibilitiesSuggestions;

    setSuggestions({
      ...suggestions,
      [field]: getSuggestions(value, currentSuggestionList)
    });
  };

  const onSuggestionsClearRequested = (field) => {
    setSuggestions({ ...suggestions, [field]: [] });
  };

  const onSuggestionSelected = (field, { suggestionValue }) => {
    // For single-select (like title)
    if (field === 'title') {
      setJob({ ...job, [field]: suggestionValue });
      setErrors({ ...errors, [field]: '' });
    } else { // For multi-select fields
      addMultiSelectItem(field, suggestionValue);
    }
  };

  // New function to handle adding items to multi-select arrays
  const addMultiSelectItem = (field, value) => {
    if (value && !job[field].includes(value)) {
      setJob({ ...job, [field]: [...job[field], value] });
    }
    // Clear the specific input field after adding
    if (field === 'keyResponsibilities') setCurrentKeyResponsibilityInput('');
    else if (field === 'educationalBackground') setCurrentEducationalBackgroundInput('');
    else if (field === 'technicalSkills') setCurrentTechnicalSkillsInput('');
    else if (field === 'softSkills') setCurrentSoftSkillsInput('');
  };

  // Function to remove items from multi-select arrays
  const removeMultiSelectItem = (field, valueToRemove) => {
    setJob({
      ...job,
      [field]: job[field].filter(item => item !== valueToRemove)
    });
  };

  const renderSuggestion = (suggestion, { isHighlighted }) => (
    <div
      style={{
        backgroundColor: isHighlighted ? '#008eab' : 'transparent',
        color: isHighlighted ? 'white' : '#005b7c',
        padding: '5px 10px',
        cursor: 'pointer',
      }}
    >
      {suggestion}
    </div>
  );

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

  const validateForm = () => {
    const newErrors = {};
    if (!job.title) newErrors.title = 'Title is required';
    if (!job.description) newErrors.description = 'Description is required';
    if (!job.imageFile) newErrors.imageFile = 'Image is required';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(job)) {
      if (value !== null && key !== 'imageFile' && key !== 'quizIds') {
        if (Array.isArray(value)) {
          // Append each item in the array with a bracket notation for backend to parse
          value.forEach((item) => formData.append(`${key.charAt(0).toUpperCase() + key.slice(1)}`, item));
        } else {
          formData.append(key.charAt(0).toUpperCase() + key.slice(1), value);
        }
      }
      if (key === 'imageFile' && value) formData.append('ImageFile', value);
      // quizIds is intentionally omitted from formData
    }
    console.log('FormData entries:', Array.from(formData.entries())); // Debug log
    try {
      await axios.post('https://localhost:5031/api/jobs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Job uploaded successfully!');
      setJob({
        title: '',
        description: '',
        imageFile: null,
        jobType: '',
        expiringDate: '',
        createdBy: 'admin1',
        workMode: 'remote',
        keyResponsibilities: [],
        educationalBackground: [],
        technicalSkills: [],
        experience: '',
        softSkills: [],
        quizIds: [],
      });
      setErrors({});
      // Clear autosuggest input states
      setCurrentKeyResponsibilityInput('');
      setCurrentEducationalBackgroundInput('');
      setCurrentTechnicalSkillsInput('');
      setCurrentSoftSkillsInput('');
      navigate('/admin/jobview');
    } catch (error) {
      console.error('Error uploading job:', error.response?.data || error.message);
      alert(`Failed to upload job: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancel = () => {
    navigate('/admin/jobview');
  };

  const getInputProps = (field) => ({
    id: field,
    name: field,
    value: job[field], // For single-value fields like title
    onChange: (event, { newValue }) => {
      setJob({ ...job, [field]: newValue });
      const newErrors = { ...errors };
      if (!newValue && ['title'].includes(field)) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      } else {
        delete newErrors[field];
      }
      setErrors(newErrors);
    },
    className: `w-full p-3 rounded-lg border ${errors[field] ? 'border-red-500' : 'border-[#d5d1ca]'} focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50`,
    placeholder: `Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
  });

  // getInputProps for multi-select Autosuggest fields
  const getMultiSelectInputProps = (field, currentValue, setCurrentValue) => ({
    id: field,
    name: field,
    value: currentValue, // Use the separate state for input value
    onChange: (event, { newValue }) => {
      setCurrentValue(newValue);
    },
    onBlur: () => { // When focus leaves the input, add the current value if it's not empty
      if (currentValue.trim()) {
        addMultiSelectItem(field, currentValue.trim());
      }
    },
    onKeyDown: (e) => { // Add item on Enter key press
      if (e.key === 'Enter' && currentValue.trim()) {
        e.preventDefault(); // Prevent form submission if in a form
        addMultiSelectItem(field, currentValue.trim());
      }
    },
    className: `w-full p-3 rounded-lg border border-[#d5d1ca] focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50`,
    placeholder: `Add ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AdminNavbar />

      {/* Main content with Sidebar and PostJob form */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Form container */}
        <div className="flex-1 ml-64 pt-20 p-4 sm:p-6 lg:p-8 bg-[#E6EFF2] flex items-center justify-center h-screen overflow-hidden">
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 max-w-lg w-full border border-[#d5d1ca]/20 animate-fadeIn max-h-[90vh] overflow-auto">
            <h2 className="text-3xl font-bold text-[#005b7c] mb-8 text-center bg-gradient-to-r from-[#005b7c] to-[#008eab] bg-clip-text text-transparent">
              Upload a Job
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title with Autosuggest */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="title">Title</label>
                <Autosuggest
                  suggestions={suggestions.title}
                  onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'title')}
                  onSuggestionsClearRequested={() => onSuggestionsClearRequested('title')}
                  getSuggestionValue={suggestion => suggestion}
                  renderSuggestion={renderSuggestion}
                  onSuggestionSelected={(event, { suggestionValue }) => onSuggestionSelected('title', { suggestionValue })}
                  inputProps={getInputProps('title')}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={job.description}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-[#d5d1ca]'} focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50 resize-y`}
                  rows="3"
                  placeholder="Enter job description"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Key Responsibilities */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="keyResponsibilities">Key Responsibilities</label>
                <Autosuggest
                  suggestions={suggestions.keyResponsibilities}
                  onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'keyResponsibilities')}
                  onSuggestionsClearRequested={() => onSuggestionsClearRequested('keyResponsibilities')}
                  getSuggestionValue={suggestion => suggestion}
                  renderSuggestion={renderSuggestion}
                  onSuggestionSelected={(event, { suggestionValue }) => onSuggestionSelected('keyResponsibilities', { suggestionValue })}
                  inputProps={getMultiSelectInputProps('keyResponsibilities', currentKeyResponsibilityInput, setCurrentKeyResponsibilityInput)}
                />
                {job.keyResponsibilities.length > 0 && (
                  <div className="mt-2 p-2 bg-[#e6eff2] rounded-lg">
                    <p className="text-[#005b7c] font-medium mb-2">Selected Responsibilities:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.keyResponsibilities.map((resp, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-[#008eab] text-white px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {resp}
                          <button
                            type="button"
                            onClick={() => removeMultiSelectItem('keyResponsibilities', resp)}
                            className="ml-2 text-white hover:text-red-300"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Educational Background */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="educationalBackground">Educational Background</label>
                <Autosuggest
                  suggestions={suggestions.educationalBackground}
                  onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'educationalBackground')}
                  onSuggestionsClearRequested={() => onSuggestionsClearRequested('educationalBackground')}
                  getSuggestionValue={suggestion => suggestion}
                  renderSuggestion={renderSuggestion}
                  onSuggestionSelected={(event, { suggestionValue }) => onSuggestionSelected('educationalBackground', { suggestionValue })}
                  inputProps={getMultiSelectInputProps('educationalBackground', currentEducationalBackgroundInput, setCurrentEducationalBackgroundInput)}
                />
                {job.educationalBackground.length > 0 && (
                  <div className="mt-2 p-2 bg-[#e6eff2] rounded-lg">
                    <p className="text-[#005b7c] font-medium mb-2">Selected Backgrounds:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.educationalBackground.map((edu, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-[#008eab] text-white px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {edu}
                          <button
                            type="button"
                            onClick={() => removeMultiSelectItem('educationalBackground', edu)}
                            className="ml-2 text-white hover:text-red-300"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Skills */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="technicalSkills">Technical Skills</label>
                <Autosuggest
                  suggestions={suggestions.technicalSkills}
                  onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'technicalSkills')}
                  onSuggestionsClearRequested={() => onSuggestionsClearRequested('technicalSkills')}
                  getSuggestionValue={suggestion => suggestion}
                  renderSuggestion={renderSuggestion}
                  onSuggestionSelected={(event, { suggestionValue }) => onSuggestionSelected('technicalSkills', { suggestionValue })}
                  inputProps={getMultiSelectInputProps('technicalSkills', currentTechnicalSkillsInput, setCurrentTechnicalSkillsInput)}
                />
                {job.technicalSkills.length > 0 && (
                  <div className="mt-2 p-2 bg-[#e6eff2] rounded-lg">
                    <p className="text-[#005b7c] font-medium mb-2">Selected Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.technicalSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-[#008eab] text-white px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeMultiSelectItem('technicalSkills', skill)}
                            className="ml-2 text-white hover:text-red-300"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Soft Skills */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="softSkills">Soft Skills</label>
                <Autosuggest
                  suggestions={suggestions.softSkills}
                  onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'softSkills')}
                  onSuggestionsClearRequested={() => onSuggestionsClearRequested('softSkills')}
                  getSuggestionValue={suggestion => suggestion}
                  renderSuggestion={renderSuggestion}
                  onSuggestionSelected={(event, { suggestionValue }) => onSuggestionSelected('softSkills', { suggestionValue })}
                  inputProps={getMultiSelectInputProps('softSkills', currentSoftSkillsInput, setCurrentSoftSkillsInput)}
                />
                {job.softSkills.length > 0 && (
                  <div className="mt-2 p-2 bg-[#e6eff2] rounded-lg">
                    <p className="text-[#005b7c] font-medium mb-2">Selected Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.softSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="flex items-center bg-[#008eab] text-white px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeMultiSelectItem('softSkills', skill)}
                            className="ml-2 text-white hover:text-red-300"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="experience">Experience</label>
                <textarea
                  id="experience"
                  name="experience"
                  value={job.experience}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-[#d5d1ca] focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c] placeholder-[#008eab]/50 resize-y"
                  rows="3"
                  placeholder="Enter experience requirements (e.g., 5+ years in software development)"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="image">Upload Image</label>
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
                {errors.imageFile && <p className="text-red-500 text-sm mt-1">{errors.imageFile}</p>}
                {job.imageFile && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={URL.createObjectURL(job.imageFile)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-all duration-300"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Job Type Dropdown */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="jobType">Job Type</label>
                <select
                  id="jobType"
                  name="jobType"
                  value={job.jobType}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${errors.jobType ? 'border-red-500' : 'border-[#d5d1ca]'} focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c]`}
                >
                  <option value="">Select Job Type</option>
                  {jobTypeSuggestions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.jobType && <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>}
              </div>

              {/* Work Mode Dropdown */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="workMode">Work Mode</label>
                <select
                  id="workMode"
                  name="workMode"
                  value={job.workMode}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border ${errors.workMode ? 'border-red-500' : 'border-[#d5d1ca]'} focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c]`}
                >
                  <option value="">Select Work Mode</option>
                  {workModeSuggestions.map(mode => (
                    <option key={mode} value={mode.toLowerCase()}>{mode}</option>
                  ))}
                </select>
                {errors.workMode && <p className="text-red-500 text-sm mt-1">{errors.workMode}</p>}
              </div>

              {/* Expiring Date */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="expiringDate">Expiring Date</label>
                <input
                  type="date"
                  id="expiringDate"
                  name="expiringDate"
                  value={job.expiringDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full p-3 rounded-lg border ${errors.expiringDate ? 'border-red-500' : 'border-[#d5d1ca]'} focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition-all duration-300 bg-white/70 text-[#005b7c]`}
                />
                {errors.expiringDate && <p className="text-red-500 text-sm mt-1">{errors.expiringDate}</p>}
              </div>

              {/* Assign Quizzes */}
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
                    {quizzes.map(quiz => (
                      <button
                        key={quiz.Id}
                        type="button"
                        onClick={() => handleQuizToggle(quiz.Id)}
                        className={`w-full flex items-center p-2 rounded-lg border ${job.quizIds.includes(quiz.Id.toString()) ? 'bg-[#008eab] text-white' : 'bg-white/70 text-[#005b7c] border-[#d5d1ca]'} hover:bg-[#005b7c] hover:text-white transition-all duration-300`}
                      >
                        <FaPlus className="mr-2" />
                        {quiz.QuizName}
                      </button>
                    ))}
                  </div>
                )}
                {job.quizIds.length > 0 && (
                  <div className="mt-2 p-2 bg-[#e6eff2] rounded-lg">
                    <p className="text-[#005b7c] font-medium">Selected Quizzes:</p>
                    <ul className="list-disc pl-5">
                      {job.quizIds.map(id => {
                        const selectedQuiz = quizzes.find(quiz => quiz.Id === parseInt(id));
                        return selectedQuiz ? (
                          <li key={id} className="text-[#008eab]">
                            {selectedQuiz.QuizName}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#005b7c] text-white rounded-lg font-semibold hover:bg-[#004a63] transition"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;