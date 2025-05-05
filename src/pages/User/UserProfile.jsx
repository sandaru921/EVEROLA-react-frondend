import { useState, useEffect } from 'react';
import UserSidebar from '../../components/UserSidebar.jsx';
import { FiEdit, FiMail, FiSave } from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa';

const UserProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({
    username: 'Sandaru71',
    email: 'rohanasandaru@gmail.com',
    role: 'Front End Developer',
    userId: 'Sandaru71',
    profilePicture: 'https://via.placeholder.com/150.png?text=User',
    education: 'BSc Information Technology\nOracle Certified Professional\nAWS Certified Developer',
    workExperience: 'SE in ABC Company - 3 years\nSE in XYZ Company - 2 years\nSE Intern in ABC Company - 1 year',
    skills: 'Core Technical Skills\nBuild Tools\nAPI Integration',
    name: 'Sandaru Rohana',
    age: 23,
    gender: 'Male',
    linkedIn: 'https://linkedin.com/in/sandaru-rohana'
  });
  const [editSection, setEditSection] = useState(null); // Track which section is being edited

  // Fetch user data on mount
  useEffect(() => {
    fetch(`http://localhost:5031/api/user?userId=${user.userId}`)
      .then(res => res.json())
      .then(data => setUser(prev => ({ ...prev, ...data })))
      .catch(err => console.error('Error fetching user data:', err));
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (section) => {
    fetch('http://localhost:5031/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        alert(`${section} updated successfully!`);
        setEditSection(null); // Exit edit mode
      })
      .catch(err => console.error('Error updating profile:', err));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#005B66]' : 'bg-[#D3E0E2]'}`}>
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
      />
      <div className="md:ml-64 p-6">
        <h2 className="text-2xl font-semibold text-[#005B66] dark:text-[#D3E0E2] mb-6">Profile</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Profile Picture and Basic Info */}
          <div className="w-full md:w-1/3 bg-white dark:bg-[#000000] p-6 rounded-lg shadow-sm">
            {editSection === 'basic' ? (
              <div>
                <div className="flex justify-center mb-4">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-2 border-[#A0B3B5] dark:border-[#D3E0E2]"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="mb-4 w-full text-[#005B66] dark:text-[#D3E0E2]"
                />
                <input
                  type="text"
                  value={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  className="w-full p-2 mb-2 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  placeholder="Role"
                />
                <input
                  type="text"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full p-2 mb-2 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={user.linkedIn}
                  onChange={(e) => setUser({ ...user, linkedIn: e.target.value })}
                  className="w-full p-2 mb-2 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  placeholder="LinkedIn URL"
                />
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full p-2 mb-2 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  placeholder="Name"
                />
                <input
                  type="number"
                  value={user.age || ''}
                  onChange={(e) => setUser({ ...user, age: parseInt(e.target.value) || null })}
                  className="w-full p-2 mb-2 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  placeholder="Age"
                />
                <input
                  type="text"
                  value={user.gender}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                  className="w-full p-2 mb-4 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  placeholder="Gender"
                />
                <button
                  onClick={() => handleSave('Basic Info')}
                  className="w-full p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center justify-center"
                >
                  <FiSave className="mr-2" /> Save
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-center mb-4">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-2 border-[#A0B3B5] dark:border-[#D3E0E2]"
                  />
                </div>
                <h3 className="text-lg font-medium text-[#005B66] dark:text-[#D3E0E2] text-center">{user.role}</h3>
                <div className="mt-4">
                  <p className="flex items-center text-[#000000] dark:text-[#D3E0E2] mb-2">
                    <FiMail className="mr-2 text-[#A0B3B5]" /> {user.email}
                  </p>
                  <p className="flex items-center text-[#000000] dark:text-[#D3E0E2] mb-2">
                    <FaLinkedin className="mr-2 text-[#A0B3B5]" />{' '}
                    <a href={user.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {user.name}
                    </a>
                  </p>
                  <p className="text-[#000000] dark:text-[#D3E0E2] mb-2">
                    <span className="font-medium text-[#005B66] dark:text-[#D3E0E2]">Name:</span> {user.name}
                  </p>
                  <p className="text-[#000000] dark:text-[#D3E0E2] mb-2">
                    <span className="font-medium text-[#005B66] dark:text-[#D3E0E2]">Age:</span> {user.age}
                  </p>
                  <p className="text-[#000000] dark:text-[#D3E0E2] mb-4">
                    <span className="font-medium text-[#005B66] dark:text-[#D3E0E2]">Gender:</span> {user.gender}
                  </p>
                </div>
                <button
                  onClick={() => setEditSection('basic')}
                  className="w-full p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center justify-center"
                >
                  <FiEdit className="mr-2" /> Edit
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Skills, Experience, Education */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Skills Section */}
            <div className="bg-white dark:bg-[#A0B3B5] p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#005B66] dark:text-[#D3E0E2]">Skills</h3>
                {editSection === 'skills' ? (
                  <button
                    onClick={() => handleSave('Skills')}
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center"
                  >
                    <FiSave className="mr-2" /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditSection('skills')}
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                )}
              </div>
              {editSection === 'skills' ? (
                <textarea
                  value={user.skills}
                  onChange={(e) => setUser({ ...user, skills: e.target.value })}
                  className="w-full p-3 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  rows="4"
                  placeholder="Enter skills, one per line"
                />
              ) : (
                <ul className="text-[#000000] dark:text-[#D3E0E2]">
                  {user.skills.split('\n').map((skill, index) => (
                    <li key={index} className="mb-1">{skill}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-[#A0B3B5] p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#005B66] dark:text-[#D3E0E2]">Experience</h3>
                {editSection === 'experience' ? (
                  <button
                    onClick={() => handleSave('Experience')}
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center"
                  >
                    <FiSave className="mr-2" /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditSection('experience')}
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                )}
              </div>
              {editSection === 'experience' ? (
                <textarea
                  value={user.workExperience}
                  onChange={(e) => setUser({ ...user, workExperience: e.target.value })}
                  className="w-full p-3 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  rows="4"
                  placeholder="Enter experience, one per line"
                />
              ) : (
                <ul className="text-[#000000] dark:text-[#D3E0E2]">
                  {user.workExperience.split('\n').map((exp, index) => (
                    <li key={index} className="mb-1">{exp}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-[#A0B3B5] p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#005B66] dark:text-[#D3E0E2]">Education</h3>
                {editSection === 'education' ? (
                  <button
                    onClick={() => handleSave('Education')}
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center"
                  >
                    <FiSave className="mr-2" /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditSection('education')}
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                )}
              </div>
              {editSection === 'education' ? (
                <textarea
                  value={user.education}
                  onChange={(e) => setUser({ ...user, education: e.target.value })}
                  className="w-full p-3 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  rows="4"
                  placeholder="Enter education, one per line"
                />
              ) : (
                <ul className="text-[#000000] dark:text-[#D3E0E2]">
                  {user.education.split('\n').map((edu, index) => (
                    <li key={index} className="mb-1">{edu}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;