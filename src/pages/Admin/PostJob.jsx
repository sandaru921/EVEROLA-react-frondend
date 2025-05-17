import React, { useState } from 'react';
import axios from 'axios';

const AdminJobUpload = () => {
    const [job, setJob] = useState({
        title: '',
        description: '',
        imageFile: null,
        jobType: '',
        expiringDate: '',
        createdBy: 'admin1'
    });

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setJob({ ...job, imageFile: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Title', job.title);
        formData.append('Description', job.description);
        formData.append('ImageFile', job.imageFile);
        formData.append('JobType', job.jobType);
        formData.append('ExpiringDate', job.expiringDate);
        formData.append('CreatedBy', job.createdBy);

        const token = localStorage.getItem('token');
        if (!token) {
            alert('No authentication token found. Please log in.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5031/api/jobs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Job uploaded successfully!');
            setJob({
                title: '',
                description: '',
                imageFile: null,
                jobType: '',
                expiringDate: '',
                createdBy: 'admin1'
            });
        } catch (error) {
            console.error('Error uploading job:', {
                message: error.message,
                code: error.code,
                request: error.request ? { status: error.request.status, statusText: error.request.statusText } : 'No request',
                response: error.response?.data
            });
            alert('Failed to upload job: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div
            className="h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/img/adminbackground.jpg')" }}
        >
            <div className="min-h-screen bg-[#efefee] bg-opacity-90 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
                    <h2 className="text-2xl font-bold text-[#005b7c] mb-6 text-center">
                        Upload a Job
                    </h2>
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
                                required
                                className="w-full p-3 border border-[#d5d1ca] rounded-md focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition duration-200"
                                placeholder="Enter job title"
                            />
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
                                required
                                className="w-full p-3 border border-[#d5d1ca] rounded-md focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition duration-200 resize-y"
                                rows="4"
                                placeholder="Enter job description"
                            />
                        </div>

                        <div>
                            <label className="block text-[#005b7c] font-medium mb-2" htmlFor="image">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                                className="w-full p-3 border border-[#d5d1ca] rounded-md focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition duration-200"
                            />
                            {job.imageFile && (
                                <div className="mt-2">
                                    <img
                                        src={URL.createObjectURL(job.imageFile)}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                </div>
                            )}
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
                                required
                                className="w-full p-3 border border-[#d5d1ca] rounded-md focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition duration-200 bg-white"
                            >
                                <option value="">Select Job Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                            </select>
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
                                required
                                className="w-full p-3 border border-[#d5d1ca] rounded-md focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition duration-200"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#005b7c] text-white p-3 rounded-md hover:bg-[#008eab] focus:outline-none focus:ring-2 focus:ring-[#01bcc6] transition duration-200"
                        >
                            Upload Job
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminJobUpload;