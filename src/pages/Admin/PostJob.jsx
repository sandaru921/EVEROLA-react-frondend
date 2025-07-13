import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaUpload } from 'react-icons/fa';
import Autosuggest from 'react-autosuggest';
import AdminNavbar from '../../components/AdminNavbar'; 
import AdminSidebar from '../../components/AdminSidebar';

const jobTypeSuggestions = ['Full-time', 'Part-time', 'Contract'];
const workModeSuggestions = ['On-site', 'Remote', 'Hybrid'];
const titleSuggestions = ['Software Engineer', 'Data Analyst', 'Project Manager', 'UI/UX Designer', 'DevOps Engineer', 'Product Manager', 'Web Developer', 'Mobile Developer'];
const technicalSkillsSuggestions = ['JavaScript', 'Python', 'Java', 'C#', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'TypeScript', 'GraphQL'];
const softSkillsSuggestions = ['Communication', 'Teamwork', 'Problem-solving', 'Leadership', 'Adaptability', 'Time Management', 'Creativity', 'Empathy'];
const educationalBackgroundSuggestions = ['Bachelor\'s in Computer Science', 'Master\'s in Business Administration', 'Bachelor\'s in Engineering', 'Master\'s in Data Science', 'PhD in AI', 'Bachelor\'s in Design'];

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
    keyResponsibilities: '',
    educationalBackground: '',
    technicalSkills: '',
    experience: '',
    softSkills: '',
  });
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState({
    title: [],
    technicalSkills: [],
    softSkills: [],
    educationalBackground: [],
  });

  // Handle input changes (same as before)
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

  // Handle file input (same as before)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJob({ ...job, imageFile: file });
      setErrors({ ...errors, imageFile: '' });
    }
  };

  // Remove selected image (same as before)
  const removeImage = () => {
    setJob({ ...job, imageFile: null });
    setErrors({ ...errors, imageFile: 'Image is required' });
  };

  // Autosuggest handlers (same as before)
  const getSuggestions = (value, suggestionList) => {
    const inputValue = value.trim().toLowerCase();
    return inputValue.length === 0
      ? suggestionList
      : suggestionList.filter(s => s.toLowerCase().includes(inputValue));
  };

  const onSuggestionsFetchRequested = ({ value }, field) => {
    setSuggestions({
      ...suggestions,
      [field]: getSuggestions(value, field === 'title' ? titleSuggestions :
        field === 'technicalSkills' ? technicalSkillsSuggestions :
        field === 'softSkills' ? softSkillsSuggestions :
        educationalBackgroundSuggestions)
    });
  };

  const onSuggestionsClearRequested = (field) => {
    setSuggestions({ ...suggestions, [field]: [] });
  };

  const onSuggestionSelected = (field, { suggestionValue }) => {
    setJob({ ...job, [field]: suggestionValue });
    setErrors({ ...errors, [field]: '' });
  };

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  // Validate form (same as before)
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

  // Handle form submission (same as before)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    const formData = new FormData();
    formData.append('Title', job.title);
    formData.append('Description', job.description);
    formData.append('ImageFile', job.imageFile);
    formData.append('JobType', job.jobType);
    formData.append('ExpiringDate', job.expiringDate);
    formData.append('CreatedBy', job.createdBy);
    formData.append('WorkMode', job.workMode);
    formData.append('KeyResponsibilities', job.keyResponsibilities);
    formData.append('EducationalBackground', job.educationalBackground);
    formData.append('TechnicalSkills', job.technicalSkills);
    formData.append('Experience', job.experience);
    formData.append('SoftSkills', job.softSkills);

    try {
      const response = await axios.post('https://localhost:5031/api/jobs', formData, {
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
        keyResponsibilities: '',
        educationalBackground: '',
        technicalSkills: '',
        experience: '',
        softSkills: '',
      });
      setErrors({});
      navigate('/admin/jobview');
    } catch (error) {
      console.error('Error uploading job:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to upload job: ${errorMessage}`);
    }
  };

  const handleCancel = () => {
    navigate('/admin/jobview');
  };

  const getInputProps = (field) => ({
    id: field,
    name: field,
    value: job[field],
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <AdminNavbar />

      {/* Main content with Sidebar and PostJob form */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar />

        {/* PostJob form content */}
        <div className="flex-1 ml-64 pt-20 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#D9EAE8] via-[#008eab] to-[#D9EAE8] flex items-center justify-center">
          <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-[#d5d1ca]/20 animate-fadeIn">
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
                  rows="4"
                  placeholder="Enter job description"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Key Responsibilities */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="keyResponsibilities">Key Responsibilities</label>
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

              {/* Educational Background with Autosuggest */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="educationalBackground">Educational Background</label>
                <Autosuggest
                  suggestions={suggestions.educationalBackground}
                  onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'educationalBackground')}
                  onSuggestionsClearRequested={() => onSuggestionsClearRequested('educationalBackground')}
                  getSuggestionValue={suggestion => suggestion}
                  renderSuggestion={renderSuggestion}
                  inputProps={getInputProps('educationalBackground')}
                />
              </div>

              {/* Technical Skills with Autosuggest */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="technicalSkills">Technical Skills</label>
                <Autosuggest
                  suggestions={suggestions.technicalSkills}
                  onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'technicalSkills')}
                  onSuggestionsClearRequested={() => onSuggestionsClearRequested('technicalSkills')}
                  getSuggestionValue={suggestion => suggestion}
                  renderSuggestion={renderSuggestion}
                  inputProps={getInputProps('technicalSkills')}
                />
              </div>

              {/* Soft Skills with Autosuggest */}
              <div>
                <label className="block text-[#005b7c] font-medium mb-2" htmlFor="softSkills">Soft Skills</label>
                <Autosuggest
                  suggestions={suggestions.softSkills}
                  onSuggestionsFetchRequested={({ value }) => onSuggestionsFetchRequested({ value }, 'softSkills')}
                  onSuggestionsClearRequested={() => onSuggestionsClearRequested('softSkills')}
                  getSuggestionValue={suggestion => suggestion}
                  renderSuggestion={renderSuggestion}
                  inputProps={getInputProps('softSkills')}
                />
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
                  rows="4"
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

              {/* Form Buttons */}
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
                  Upload Job
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