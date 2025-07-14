import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../../components/UserSidebar.jsx';
import { FiEdit, FiUpload, FiX, FiCheck } from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'https://localhost:5031';

const UserProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({
    profilePicture: 'https://via.placeholder.com/150.png?text=User',
    education: '',
    workExperience: '',
    skills: '',
    name: '',
    role: 'User',
    age: null,
    gender: '',
    linkedIn: '',
  });
  const [editSection, setEditSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/api/UserProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          localStorage.clear();
          return navigate('/login');
        }

        if (!response.ok) throw new Error('Failed to fetch profile.');

        const data = await response.json();
        setUser(prev => ({
          ...prev,
          ...data,
          role: localStorage.getItem('role') || 'User',
        }));
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleProfilePictureChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      const updatedUser = { ...user, profilePicture: base64Image };
      setUser(updatedUser); // Update local state
      await saveProfilePicture(updatedUser); // Auto-save to backend
    };
    reader.readAsDataURL(file);
  }
};

// Helper function to save profile picture to backend
const saveProfilePicture = async (updatedUser) => {
  const token = localStorage.getItem('token');
  if (!token) return navigate('/login');

  try {
    const response = await fetch(`${API_BASE}/api/UserProfile/update`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) throw new Error('Failed to update profile picture');

    const savedData = await response.json();
    setUser(prev => ({ ...prev, ...savedData }));
  } catch (err) {
    alert('Profile picture upload failed.');
    console.error(err);
  }
};


  const handleSave = async (section) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    if (
      section === 'basic' &&
      user.linkedIn &&
      !user.linkedIn.startsWith('https://www.linkedin.com/')
    ) {
      alert('Please enter a valid LinkedIn URL starting with https://www.linkedin.com/');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/UserProfile/update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.status === 401) {
        localStorage.clear();
        return navigate('/login');
      }

      if (!response.ok) throw new Error('Failed to update profile.');

      const data = await response.json();
      setUser(prev => ({ ...prev, ...data }));

      alert(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
      setEditSection(null);
      setConfirmEdit(false);
    } catch (err) {
      setError('Failed to save profile. Please log in again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRequest = (section) => {
    setEditSection(section);
    setConfirmEdit(true);
  };

  const cancelEdit = () => {
    setConfirmEdit(false);
    setEditSection(null);
  };

  const inputClass = 'w-full p-2 rounded border border-gray-300 dark:bg-[#00383d] dark:text-white';

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#00383d]' : 'bg-[#e0f4f5]'}`}>
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
      />
      <div className="md:ml-64 p-6">
        <h2 className="text-2xl font-bold text-[#005B66] dark:text-white mb-6">User Profile</h2>
        {isLoading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1a2c2d] rounded-xl p-6 shadow">
            <div className="text-center">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto border-4 border-[#A0B3B5] mb-4"
              />
              <label className="block w-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <div className="bg-[#005B66] hover:bg-[#00383d] text-white py-1 px-4 rounded-full inline-flex items-center">
                  <FiUpload className="mr-2" /> Upload New Photo
                </div>
              </label>
              <h3 className="text-xl font-semibold text-[#005B66] dark:text-white mt-4">
                {user.name || 'Guest'}
              </h3>
              <p className="text-gray-500 dark:text-gray-300">{user.role}</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {['basic', 'skills', 'workExperience', 'education'].map((section) => (
              <div key={section} className="bg-white dark:bg-[#1a2c2d] p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold capitalize text-[#005B66] dark:text-white">
                    {section === 'workExperience' ? 'Experience' : section}
                  </h3>
                  {editSection === section && confirmEdit ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(section)} className="text-green-600 hover:text-green-800">
                        <FiCheck size={20} />
                      </button>
                      <button onClick={cancelEdit} className="text-red-500 hover:text-red-700">
                        <FiX size={20} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditRequest(section)}
                      className="text-[#005B66] dark:text-[#D3E0E2] hover:underline"
                    >
                      <FiEdit size={18} /> Edit
                    </button>
                  )}
                </div>

                {editSection === section && confirmEdit ? (
                  <>
                    {section === 'basic' ? (
                      <div className="space-y-2">
                        <input
                          value={user.name || ''}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                          placeholder="Name"
                          className={inputClass}
                        />
                        <input
                          type="number"
                          value={user.age || ''}
                          onChange={(e) => setUser({ ...user, age: parseInt(e.target.value) || null })}
                          placeholder="Age"
                          className={inputClass}
                        />
                        <input
                          value={user.gender || ''}
                          onChange={(e) => setUser({ ...user, gender: e.target.value })}
                          placeholder="Gender"
                          className={inputClass}
                        />
                        <input
                          value={user.linkedIn || ''}
                          onChange={(e) => setUser({ ...user, linkedIn: e.target.value })}
                          placeholder="LinkedIn URL"
                          className={inputClass}
                        />
                      </div>
                    ) : (
                      <textarea
                        rows="4"
                        value={user[section] || ''}
                        onChange={(e) => setUser({ ...user, [section]: e.target.value })}
                        className={inputClass}
                        placeholder={`Enter your ${section === 'workExperience' ? 'experience' : section} here...`}
                      />
                    )}
                  </>
                ) : section === 'basic' ? (
                  <div className="space-y-1 text-[#00383d] dark:text-white">
                    <div><strong>Name:</strong> {user.name || 'Not set'}</div>
                    <div><strong>Age:</strong> {user.age !== null ? user.age : 'Not set'}</div>
                    <div><strong>Gender:</strong> {user.gender || 'Not set'}</div>
                    <div>
                      <strong>LinkedIn:</strong>{' '}
                      {user.linkedIn ? (
                        <a
                          href={user.linkedIn}
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {user.linkedIn}
                        </a>
                      ) : (
                        'Not set'
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-[#00383d] dark:text-white whitespace-pre-line">
                    {user[section] ? user[section] : 'Not set'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
