import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar" ; // Adjust path as needed

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    location: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isAuthenticated] = useState(true); // Assume admin is authenticated
  const [isAdmin] = useState(true); // Assume admin role

  const API_URL = "https://localhost:5031/api/jobs"; // Match your backend port

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to post a job.");
return;
  }

    // Create FormData object for multipart/form-data request
    const data = new FormData();
    data.append("title", formData.title);
    data.append("type", formData.type);
    data.append("location", formData.location);
    data.append("description", formData.description);
    if (image) {
      data.append("image", image);
    }

    try {
      await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // On success, redirect back to Joblanding
      navigate("/");
    } catch (err) {
      console.error("Error posting job:", err);
      setError("Failed to post job. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-repeat" style={{ backgroundImage: "url('/img/adminbackground.jpg')" }}>
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />

      <main className="pt-36 px-4">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Post a New Job</h2>

          {error && (
            <p className="text-red-600 text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008CBA]"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Job Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008CBA]"
                required
              >
                <option value="">Select Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008CBA]"
                required
              >
                <option value="">Select Location</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008CBA]"
                rows="4"
                placeholder="Enter job description..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Job Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="bg-[#008CBA] text-white px-6 py-2 rounded-full hover:bg-[#007399]"
              >
                Post Job
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PostJob;