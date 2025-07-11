import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a context to share user profile data across components
export const UserProfileContext = createContext();

// Provider component to fetch and provide user profile data
export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({}); // State to store user profile data
  const [loading, setLoading] = useState(true); // State to indicate loading status
  const [error, setError] = useState(null); // State to store any errors

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get JWT token from localStorage
    if (!token) {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
      return;
    }

    // Create an Axios instance with the token for authenticated requests
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:5031',
      headers: { Authorization: `Bearer ${token}` },
    });

    // Function to fetch user profile from the backend
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/userprofile');
        setUserProfile(response.data); // Update state with fetched profile data
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile.'); // Set error message on failure
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchUserProfile(); // Call the fetch function on component mount
  }, []); // Empty dependency array ensures this runs only once on mount

  // Provide the context value to child components
  return (
    <UserProfileContext.Provider value={{ userProfile, loading, error }}>
      {children}
    </UserProfileContext.Provider>
  );
};
