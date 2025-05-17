import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/bgImage.jpg';
import Navbar from "../../components/Navbar";

const UserJobView = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios
                .get('http://localhost:5031/api/jobs', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    console.log('Fetched jobs:', response.data);
                    setJobs(response.data || []);
                    setIsAuthenticated(true);
                    try {
                        const decodedToken = JSON.parse(atob(token.split('.')[1]));
                        setIsAdmin(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin');
                    } catch (error) {
                        console.error('Error decoding token:', error);
                        setIsAuthenticated(false);
                        localStorage.removeItem('token');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching jobs:', error.response?.data || error.message);
                    setError('Failed to fetch jobs. Check console for details.');
                    setIsAuthenticated(false);
                    localStorage.removeItem('token');
                });
        }
    }, []);

    const handleDeleteJob = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5031/api/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(jobs.filter((job) => job.id !== id));
        } catch (error) {
            console.error('Error deleting job:', error);
            setError('Failed to delete job. Check console for details.');
        }
    };

    const filteredJobs = jobs.filter((job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    );

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
            <main className="pt-36 px-4">
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                <div className="flex items-center bg-[#01bcc6] p-3 rounded-full shadow-md max-w-3xl mx-auto mb-6">
                    <input
                        type="text"
                        placeholder="Search Jobs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-white placeholder-white text-lg px-2"
                    />
                    <FaSearch className="text-white ml-4 cursor-pointer" />
                </div>

                {isAdmin && isAuthenticated && (
                    <button
                        onClick={() => navigate('/admin/upload')}
                        className="bg-[#005b7c] text-white px-6 py-2 rounded-full hover:bg-[#008eab] mb-6 mx-auto block transition duration-200"
                    >
                        Post Job ➤
                    </button>
                )}

                <div className="text-center mb-6">
                    <div className="inline-block bg-[#008eab] text-white text-xl px-6 py-2 border-2 border-white rounded-md">
                        {searchTerm.trim() === '' ? (
                            <p>All</p>
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => <div key={job.id}>{job.title}</div>)
                        ) : (
                            <p>No jobs found.</p>
                        )}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto flex flex-wrap gap-6 justify-center">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white p-4 rounded-lg shadow-md w-72 text-center hover:-translate-y-1 transition-transform border border-[#d5d1ca]"
                            >
                                <h3 className="text-lg font-semibold text-[#005b7c]">
                                    {job.title || 'Untitled'}
                                </h3>
                                <div className="flex justify-center gap-2 my-2">
                                    <span className="bg-[#efefee] text-black px-2 py-1 rounded-md text-xs">
                                        {job.jobType || 'N/A'}
                                    </span>
                                </div>
                                <img
                                    src={job.imageUrl || '/default-image.jpg'}
                                    alt={job.title || 'Job Image'}
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                    onError={(e) => { e.target.src = '/default-image.jpg'; }}
                                />
                                <p className="text-sm my-2 text-gray-600">{job.description || 'No description available'}</p>
                                <p className="text-gray-800">
                                    <strong>Expires:</strong> {job.expiringDate ? new Date(job.expiringDate).toLocaleDateString() : 'N/A'}
                                </p>

                                {isAdmin && isAuthenticated ? (
                                    <div className="flex justify-between gap-2 mt-4">
                                        <button
                                            onClick={() => navigate(`/admin/edit-job/${job.id}`)}
                                            className="bg-[#008eab] text-white px-3 py-1 rounded-full hover:bg-[#005b7c] text-sm transition duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 text-sm transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="bg-[#005b7c] text-white px-4 py-2 rounded-full hover:bg-[#008eab] mt-4 transition duration-200"
                                    >
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-red-600 text-lg font-bold text-center w-full">
                            {error || 'No jobs found.'}
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserJobView;
