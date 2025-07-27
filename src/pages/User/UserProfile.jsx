import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../../components/UserSidebar.jsx';
import { FiUpload, FiEdit2 } from 'react-icons/fi';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'https://localhost:5031';

const UserProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({
    profilePicture: '',
    education: { text: '', evidence: [], status: 'pending' },
    workExperience: { text: '', evidence: [], status: 'pending' },
    skills: { text: '', evidence: [], status: 'pending' },
    name: '',
    role: 'User',
    age: null,
    gender: '',
    linkedIn: '',
    title: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/userprofile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.clear();
        setError('Session expired. Please log in again.');
        navigate('/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to load profile');
      const data = await response.json();
      setUser(prev => ({
        ...prev,
        ...data,
        education: { ...prev.education, ...data.education },
        workExperience: { ...prev.workExperience, ...data.workExperience },
        skills: { ...prev.skills, ...data.skills },
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser(prev => ({ ...prev, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleEvidenceUpload = async (field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in.');

    const formData = new FormData();
    formData.append('evidence', file);
    formData.append('field', field);

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/userprofile/evidence/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await res.json();
      setUser(prev => ({
        ...prev,
        [field]: { ...prev[field], evidence: [...prev[field].evidence, data.filename], status: 'pending' },
      }));
      alert('Evidence uploaded for review!');
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/userprofile/update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${errorText}`);
      }

      const updated = await response.json();
      setUser(prev => ({ ...prev, ...updated }));
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (field) => {
    setCurrentField(field);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentField(null);
  };

  const handleDeleteFile = async (field, fileName) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/userprofile/evidence/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Field: field, FileName: fileName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Deletion failed: ${errorText}`);
      }

      // Update local state after successful deletion
      setUser(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          evidence: prev[field].evidence.filter(f => f !== fileName),
        },
      }));
      alert('Evidence deleted successfully!');
    } catch (err) {
      alert(`Failed to delete evidence: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full p-2 rounded border border-gray-300 text-black dark:bg-black dark:text-white';

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-black text-white' : 'bg-[#efefee] text-black'}`}>
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
      />
      <div className="md:ml-64 p-6">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>

        {isLoading && <p className="text-[#005b7c]">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className={`${darkMode ? 'bg-[#1a1a1a]' : 'bg-[#dedcd9]'} p-6 rounded-xl shadow-md`}>
            <div className="text-center">
              <img
                src={user.profilePicture || ''}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto border-4 border-[#008eab] mb-4 object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <label className="block cursor-pointer">
                <input type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
                <div className="bg-[#005b7c] hover:bg-[#008eab] text-white py-1 px-4 rounded-full inline-flex items-center justify-center">
                  <FiUpload className="mr-2" /> Upload Photo
                </div>
              </label>
              <h3 className="text-xl font-semibold mt-4">{user.name || 'Guest'}</h3>
              <p className="text-sm text-[#005b7c]">{user.title || 'No title set'}</p>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div className={`${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-6 rounded-lg shadow`}>
              <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className={inputClass}
                  placeholder="Name (optional)"
                  value={user.name || ''}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <input
                  className={inputClass}
                  type="number"
                  placeholder="Age (optional)"
                  value={user.age || ''}
                  onChange={(e) => setUser({ ...user, age: parseInt(e.target.value) || null })}
                />
                <input
                  className={inputClass}
                  placeholder="Gender (optional)"
                  value={user.gender || ''}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Title (optional)"
                  value={user.title || ''}
                  onChange={(e) => setUser({ ...user, title: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="LinkedIn URL (optional)"
                  value={user.linkedIn || ''}
                  onChange={(e) => setUser({ ...user, linkedIn: e.target.value })}
                />
              </div>
            </div>

            {/* Education */}
            <div className={`${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-6 rounded-lg shadow`}>
              <h3 className="text-lg font-semibold mb-2">Education</h3>
              <textarea
                className={inputClass}
                rows="3"
                placeholder="Your education (optional)..."
                value={user.education.text || ''}
                onChange={(e) => setUser({ ...user, education: { ...user.education, text: e.target.value } })}
              />
              <label className="block mt-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleEvidenceUpload('education', e)}
                  className="hidden"
                />
                <div className="bg-[#005b7c] hover:bg-[#008eab] text-white py-1 px-4 rounded-full inline-flex items-center justify-center">
                  <FiUpload className="mr-2" /> Upload Evidences
                </div>
              </label>
              {user.education.evidence.length > 0 && (
                <p className="text-sm mt-2">
                  {user.education.evidence.length} file(s) uploaded, waiting for admin approval.{' '}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); openModal('education'); }}
                    className="text-blue-600 underline ml-2"
                  >
                    <FiEdit2 className="inline mr-1" /> Edit
                  </a>
                  {user.education.status === 'approved' && (
                    <span className="text-green-600 ml-2">Approved <FaCheckCircle /></span>
                  )}
                  {user.education.status === 'declined' && (
                    <span className="text-red-600 ml-2">Declined <FaTimesCircle /> - <button
                      onClick={() => setUser({ ...user, education: { ...user.education, evidence: [], status: 'pending' } })}
                      className="text-blue-600 underline"
                    >Upload Again</button></span>
                  )}
                </p>
              )}
            </div>

            {/* Experience */}
            <div className={`${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-6 rounded-lg shadow`}>
              <h3 className="text-lg font-semibold mb-2">Experience</h3>
              <textarea
                className={inputClass}
                rows="3"
                placeholder="Your experience (optional)..."
                value={user.workExperience.text || ''}
                onChange={(e) => setUser({ ...user, workExperience: { ...user.workExperience, text: e.target.value } })}
              />
              <label className="block mt-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleEvidenceUpload('workExperience', e)}
                  className="hidden"
                />
                <div className="bg-[#005b7c] hover:bg-[#008eab] text-white py-1 px-4 rounded-full inline-flex items-center justify-center">
                  <FiUpload className="mr-2" /> Upload Evidences
                </div>
              </label>
              {user.workExperience.evidence.length > 0 && (
                <p className="text-sm mt-2">
                  {user.workExperience.evidence.length} file(s) uploaded, waiting for admin approval.{' '}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); openModal('workExperience'); }}
                    className="text-blue-600 underline ml-2"
                  >
                    <FiEdit2 className="inline mr-1" /> Edit
                  </a>
                  {user.workExperience.status === 'approved' && (
                    <span className="text-green-600 ml-2">Approved <FaCheckCircle /></span>
                  )}
                  {user.workExperience.status === 'declined' && (
                    <span className="text-red-600 ml-2">Declined <FaTimesCircle /> - <button
                      onClick={() => setUser({ ...user, workExperience: { ...user.workExperience, evidence: [], status: 'pending' } })}
                      className="text-blue-600 underline"
                    >Upload Again</button></span>
                  )}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className={`${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-6 rounded-lg shadow`}>
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <textarea
                className={inputClass}
                rows="3"
                placeholder="Your skills (optional)..."
                value={user.skills.text || ''}
                onChange={(e) => setUser({ ...user, skills: { ...user.skills, text: e.target.value } })}
              />
              <label className="block mt-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleEvidenceUpload('skills', e)}
                  className="hidden"
                />
                <div className="bg-[#005b7c] hover:bg-[#008eab] text-white py-1 px-4 rounded-full inline-flex items-center justify-center">
                  <FiUpload className="mr-2" /> Upload Evidences
                </div>
              </label>
              {user.skills.evidence.length > 0 && (
                <p className="text-sm mt-2">
                  {user.skills.evidence.length} file(s) uploaded, waiting for admin approval.{' '}
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); openModal('skills'); }}
                    className="text-blue-600 underline ml-2"
                  >
                    <FiEdit2 className="inline mr-1" /> Edit
                  </a>
                  {user.skills.status === 'approved' && (
                    <span className="text-green-600 ml-2">Approved <FaCheckCircle /></span>
                  )}
                  {user.skills.status === 'declined' && (
                    <span className="text-red-600 ml-2">Declined <FaTimesCircle /> - <button
                      onClick={() => setUser({ ...user, skills: { ...user.skills, evidence: [], status: 'pending' } })}
                      className="text-blue-600 underline"
                    >Upload Again</button></span>
                  )}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="bg-[#005b7c] text-white px-4 py-2 rounded hover:bg-[#008eab]"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal for Editing Evidence */}
        {isModalOpen && currentField && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-[#1a1a1a]' : 'bg-white'} p-6 rounded-lg shadow-lg w-96`}>
              <h3 className="text-lg font-semibold mb-4">Edit Uploaded Files - {currentField.charAt(0).toUpperCase() + currentField.slice(1)}</h3>
              {user[currentField].evidence.length === 0 ? (
                <p>No files uploaded.</p>
              ) : (
                <ul className="list-disc pl-5">
                  {user[currentField].evidence.map((file, index) => (
                    <li key={index} className="flex justify-between items-center py-2">
                      <span>{file}</span>
                      <button
                        onClick={() => handleDeleteFile(currentField, file)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={closeModal}
                className="mt-4 bg-[#005b7c] text-white px-4 py-2 rounded hover:bg-[#008eab]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;