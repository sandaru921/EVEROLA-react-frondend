// Import necessary React hooks and components
import { useState, useEffect } from 'react'; // useState for state management, useEffect for side effects like fetching data
import { useNavigate } from 'react-router-dom'; // useNavigate for redirecting to other routes (e.g., login page)
import UserSidebar from '../../components/UserSidebar.jsx'; // Sidebar component for navigation
import { FiEdit, FiMail, FiSave } from 'react-icons/fi'; // Icons for edit, mail, and save actions
import { FaLinkedin } from 'react-icons/fa'; // LinkedIn icon for social link

const UserProfile = () => {
  // State for sidebar visibility (open/closed)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls whether the sidebar is visible
  // State for dark mode toggle
  const [darkMode, setDarkMode] = useState(false); // Toggles between light and dark theme
  // State for user profile data, aligned with backend UserProfile model
  const [user, setUser] = useState({
    profilePicture: 'https://via.placeholder.com/150.png?text=User', // Default profile picture URL
    education: '', // User's education details (string)
    workExperience: '', // User's work experience (string)
    skills: '', // User's skills (string)
    name: '', // User's name
    age: null, // User's age (nullable integer)
    gender: '', // User's gender
    linkedIn: '', // LinkedIn profile URL
  });
  // State to track which section is being edited (e.g., 'basic', 'skills')
  const [editSection, setEditSection] = useState(null); // Null when not editing, set to section name when editing
  // State for loading indicator during API calls
  const [isLoading, setIsLoading] = useState(false); // Shows loading state during fetch requests
  // State for error messages to display to the user
  const [error, setError] = useState(null); // Stores error messages to show in UI
  // Hook to navigate to other routes (e.g., redirect to login)
  const navigate = useNavigate();

  // Effect to fetch user profile data when the component mounts
  useEffect(() => {
    // Async function to fetch user profile from the backend
    const fetchUserProfile = async () => {
      // Get the JWT token from localStorage (set during login)
      const token = localStorage.getItem('token');
      // If token is missing, redirect to login page
      if (!token) {
        console.error('No token found, user not authenticated.');
        navigate('/login'); // Redirect to login page
        return;
      }

      // Set loading state to true while fetching data
      setIsLoading(true);
      // Clear any previous errors
      setError(null);

      try {
        // Make a GET request to the backend to fetch user profile
        const response = await fetch('http://localhost:5031/api/UserProfile', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include JWT token in the Authorization header
            'Content-Type': 'application/json', // Specify that we're expecting JSON
          },
        });

        // Check if the response is not OK (e.g., 401, 404, 500)
        if (!response.ok) {
          // Get the response body as text for debugging
          const errorText = await response.text();
          console.error(`Failed to fetch user profile: ${response.status} ${response.statusText}`, errorText);
          // If the response is 401 (Unauthorized), the token might be invalid or expired
          if (response.status === 401) {
            localStorage.removeItem('token'); // Remove invalid token
            navigate('/login'); // Redirect to login page
            return;
          }
          // Throw an error to be caught in the catch block
          throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
        }

        // Parse the response as JSON
        const data = await response.json();
        // Update the user state with the fetched data
        setUser((prev) => ({ ...prev, ...data }));
      } catch (err) {
        // Log the error to the console for debugging
        console.error('Error fetching user data:', err);
        // Set an error message to display to the user
        setError('Failed to load profile. Please try again later.');
      } finally {
        // Set loading state to false after the request completes
        setIsLoading(false);
      }
    };

    // Call the fetch function
    fetchUserProfile();
  }, [navigate]); // Dependency array includes navigate to satisfy React's rules

  // Function to handle profile picture upload
  const handleProfilePictureChange = (e) => {
    // Get the selected file from the input
    const file = e.target.files[0];
    // If a file is selected
    if (file) {
      // Create a FileReader to read the file
      const reader = new FileReader();
      // When the file is read, set the profile picture as a base64 string
      reader.onloadend = () => {
        setUser({ ...user, profilePicture: reader.result }); // Update profilePicture in state
      };
      // Read the file as a data URL (base64)
      reader.readAsDataURL(file);
    }
  };

  // Function to handle saving the updated profile data
  const handleSave = async (section) => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    // If token is missing, redirect to login page
    if (!token) {
      console.error('No token found, user not authenticated.');
      navigate('/login'); // Redirect to login page
      return;
    }

    // Log the data being sent for debugging
    console.log('Saving data:', user);
    // Set loading state to true while saving
    setIsLoading(true);
    // Clear any previous errors
    setError(null);

    try {
      // Make a POST request to the backend to update the user profile
      const response = await fetch('http://localhost:5031/api/UserProfile/update', {
        method: 'POST', // Use POST method to update data
        headers: {
          'Authorization': `Bearer ${token}`, // Include JWT token in the Authorization header
          'Content-Type': 'application/json', // Specify that we're sending JSON
        },
        body: JSON.stringify(user), // Convert the user object to JSON string
      });

      // Check if the response is not OK
      if (!response.ok) {
        // Get the response body as text for debugging
        const errorText = await response.text();
        console.error(`Failed to update profile: ${response.status} ${response.statusText}`, errorText);
        // If the response is 401 (Unauthorized), the token might be invalid or expired
        if (response.status === 401) {
          localStorage.removeItem('token'); // Remove invalid token
          navigate('/login'); // Redirect to login page
          return;
        }
        // Throw an error to be caught in the catch block
        throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
      }

      // Parse the response as JSON
      const data = await response.json();
      // Log the response for debugging
      console.log('Update response:', data);
      // Show a success alert to the user
      alert(`${section} updated successfully!`);
      // Exit edit mode by resetting editSection
      setEditSection(null);
    } catch (err) {
      // Log the error to the console for debugging
      console.error('Error updating profile:', err);
      // Set an error message to display to the user
      setError('Failed to save profile. Please try again.');
    } finally {
      // Set loading state to false after the request completes
      setIsLoading(false);
    }
  };

  // Render the component UI
  return (
    // Main container with dynamic background based on dark mode
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#005B66]' : 'bg-[#D3E0E2]'}`}>
      {/* Sidebar component for navigation */}
      <UserSidebar
        darkMode={darkMode} // Pass darkMode state to sidebar
        setDarkMode={setDarkMode} // Pass function to toggle dark mode
        isOpen={isSidebarOpen} // Pass sidebar open state
        setIsOpen={setIsSidebarOpen} // Pass function to toggle sidebar
        user={user} // Pass user data to sidebar
      />
      {/* Main content area */}
      <div className="md:ml-64 p-6">
        {/* Page title */}
        <h2 className="text-2xl font-semibold text-[#005B66] dark:text-[#D3E0E2] mb-6">Profile</h2>
        {/* Show loading indicator while fetching data */}
        {isLoading && <p className="text-[#005B66] dark:text-[#D3E0E2]">Loading...</p>}
        {/* Show error message if there's an error */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {/* Main layout with two columns (profile picture/info and details) */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Profile Picture and Basic Info */}
          <div className="w-full md:w-1/3 bg-white dark:bg-[#000000] p-6 rounded-lg shadow-sm">
            {/* Conditional rendering: Edit mode or view mode */}
            {editSection === 'basic' ? (
              <div>
                {/* Profile picture display */}
                <div className="flex justify-center mb-4">
                  <img
                    src={user.profilePicture} // Show the profile picture
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-2 border-[#A0B3B5] dark:border-[#D3E0E2]"
                  />
                </div>
                {/* File input to upload a new profile picture */}
                <input
                  type="file"
                  accept="image/*" // Accept only image files
                  onChange={handleProfilePictureChange} // Handle file selection
                  className="mb-4 w-full text-[#005B66] dark:text-[#D3E0E2]"
                />
                {/* Input for LinkedIn URL */}
                <input
                  type="text"
                  value={user.linkedIn || ''} // Display current LinkedIn URL or empty string
                  onChange={(e) => setUser({ ...user, linkedIn: e.target.value })} // Update LinkedIn in state
                  className="w-full p-2 mb-2 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  placeholder="LinkedIn URL"
                />
                {/* Input for Name */}
                <input
                  type="text"
                  value={user.name || ''} // Display current name or empty string
                  onChange={(e) => setUser({ ...user, name: e.target.value })} // Update name in state
                  className="w-full p-2 mb-2 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  placeholder="Name"
                />
                {/* Input for Age */}
                <input
                  type="number"
                  value={user.age || ''} // Display current age or empty string
                  onChange={(e) => setUser({ ...user, age: parseInt(e.target.value) || null })} // Update age in state (convert to integer or null)
                  className="w-full p-2 mb-2 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  placeholder="Age"
                />
                {/* Input for Gender */}
                <input
                  type="text"
                  value={user.gender || ''} // Display current gender or empty string
                  onChange={(e) => setUser({ ...user, gender: e.target.value })} // Update gender in state
                  className="w-full p-2 mb-4 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  placeholder="Gender"
                />
                {/* Save button to save changes */}
                <button
                  onClick={() => handleSave('Basic Info')} // Call handleSave when clicked
                  disabled={isLoading} // Disable button while saving
                  className="w-full p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                >
                  <FiSave className="mr-2" /> Save
                </button>
              </div>
            ) : (
              <div>
                {/* Display profile picture in view mode */}
                <div className="flex justify-center mb-4">
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-2 border-[#A0B3B5] dark:border-[#D3E0E2]"
                  />
                </div>
                {/* Display LinkedIn link if available */}
                <div className="mt-4">
                  <p className="flex items-center text-[#000000] dark:text-[#D3E0E2] mb-2">
                    <FaLinkedin className="mr-2 text-[#A0B3B5]" />{' '}
                    {user.linkedIn ? (
                      <a href={user.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {user.name || 'Name not set'} {/* Show name in the link */}
                      </a>
                    ) : (
                      'LinkedIn not set'
                    )}
                  </p>
                  {/* Display name */}
                  <p className="text-[#000000] dark:text-[#D3E0E2] mb-2">
                    <span className="font-medium text-[#005B66] dark:text-[#D3E0E2]">Name:</span> {user.name || 'Not set'}
                  </p>
                  {/* Display age */}
                  <p className="text-[#000000] dark:text-[#D3E0E2] mb-2">
                    <span className="font-medium text-[#005B66] dark:text-[#D3E0E2]">Age:</span> {user.age || 'Not set'}
                  </p>
                  {/* Display gender */}
                  <p className="text-[#000000] dark:text-[#D3E0E2] mb-4">
                    <span className="font-medium text-[#005B66] dark:text-[#D3E0E2]">Gender:</span> {user.gender || 'Not set'}
                  </p>
                </div>
                {/* Edit button to enter edit mode */}
                <button
                  onClick={() => setEditSection('basic')} // Set editSection to 'basic' to enter edit mode
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
              {/* Section header with title and edit/save button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#005B66] dark:text-[#D3E0E2]">Skills</h3>
                {editSection === 'skills' ? (
                  <button
                    onClick={() => handleSave('Skills')} // Call handleSave when clicked
                    disabled={isLoading} // Disable button while saving
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center disabled:opacity-50"
                  >
                    <FiSave className="mr-2" /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditSection('skills')} // Set editSection to 'skills' to enter edit mode
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                )}
              </div>
              {/* Conditional rendering: Edit mode or view mode */}
              {editSection === 'skills' ? (
                <textarea
                  value={user.skills || ''} // Display current skills or empty string
                  onChange={(e) => setUser({ ...user, skills: e.target.value })} // Update skills in state
                  className="w-full p-3 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  rows="4"
                  placeholder="Enter skills, one per line"
                />
              ) : (
                <ul className="text-[#000000] dark:text-[#D3E0E2]">
                  {user.skills ? (
                    user.skills.split('\n').map((skill, index) => ( // Split skills by newline and display as list
                      <li key={index} className="mb-1">{skill}</li>
                    ))
                  ) : (
                    <li>Not set</li> // Show placeholder if no skills
                  )}
                </ul>
              )}
            </div>

            {/* Experience Section */}
            <div className="bg-white dark:bg-[#A0B3B5] p-6 rounded-lg shadow-sm">
              {/* Section header with title and edit/save button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#005B66] dark:text-[#D3E0E2]">Experience</h3>
                {editSection === 'experience' ? (
                  <button
                    onClick={() => handleSave('Experience')} // Call handleSave when clicked
                    disabled={isLoading} // Disable button while saving
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center disabled:opacity-50"
                  >
                    <FiSave className="mr-2" /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditSection('experience')} // Set editSection to 'experience' to enter edit mode
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                )}
              </div>
              {/* Conditional rendering: Edit mode or view mode */}
              {editSection === 'experience' ? (
                <textarea
                  value={user.workExperience || ''} // Display current work experience or empty string
                  onChange={(e) => setUser({ ...user, workExperience: e.target.value })} // Update workExperience in state
                  className="w-full p-3 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  rows="4"
                  placeholder="Enter experience, one per line"
                />
              ) : (
                <ul className="text-[#000000] dark:text-[#D3E0E2]">
                  {user.workExperience ? (
                    user.workExperience.split('\n').map((exp, index) => ( // Split experience by newline and display as list
                      <li key={index} className="mb-1">{exp}</li>
                    ))
                  ) : (
                    <li>Not set</li> // Show placeholder if no experience
                  )}
                </ul>
              )}
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-[#A0B3B5] p-6 rounded-lg shadow-sm">
              {/* Section header with title and edit/save button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#005B66] dark:text-[#D3E0E2]">Education</h3>
                {editSection === 'education' ? (
                  <button
                    onClick={() => handleSave('Education')} // Call handleSave when clicked
                    disabled={isLoading} // Disable button while saving
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center disabled:opacity-50"
                  >
                    <FiSave className="mr-2" /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditSection('education')} // Set editSection to 'education' to enter edit mode
                    className="p-2 bg-[#A0B3B5] text-[#005B66] dark:text-[#D3E0E2] rounded-lg hover:bg-[#D3E0E2] dark:hover:bg-[#005B66] transition-all duration-200 flex items-center"
                  >
                    <FiEdit className="mr-2" /> Edit
                  </button>
                )}
              </div>
              {/* Conditional rendering: Edit mode or view mode */}
              {editSection === 'education' ? (
                <textarea
                  value={user.education || ''} // Display current education or empty string
                  onChange={(e) => setUser({ ...user, education: e.target.value })} // Update education in state
                  className="w-full p-3 border border-[#A0B3B5] rounded-lg dark:bg-[#005B66] dark:border-[#D3E0E2] dark:text-[#D3E0E2] focus:outline-none focus:ring-2 focus:ring-[#A0B3B5]"
                  rows="4"
                  placeholder="Enter education, one per line"
                />
              ) : (
                <ul className="text-[#000000] dark:text-[#D3E0E2]">
                  {user.education ? (
                    user.education.split('\n').map((edu, index) => ( // Split education by newline and display as list
                      <li key={index} className="mb-1">{edu}</li>
                    ))
                  ) : (
                    <li>Not set</li> // Show placeholder if no education
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component for use in other parts of the app
export default UserProfile;