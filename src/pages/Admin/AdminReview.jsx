import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiZoomIn,
  FiZoomOut,
} from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL || 'https://localhost:5031';

const AdminReview = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reviewContext, setReviewContext] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/userprofile/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      const data = await response.json();
      setUsers(
        data
          .filter((u) => u.role !== 'Admin')
          .map((user) => ({
            ...user,
            UserId: user.username || 'Unnamed User',
            profile: {
              profilePicture: user.profile?.profilePicture || null,
              education: user.profile?.education || { text: '', evidence: [], status: 'pending' },
              workExperience: user.profile?.workExperience || { text: '', evidence: [], status: 'pending' },
              skills: user.profile?.skills || { text: '', evidence: [], status: 'pending' },
            },
          }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleViewFile = async (file, field) => {
    if (!selectedUser) return;
    setFileLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}/api/userprofile/evidence/download/${encodeURIComponent(file)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch file');
      const blob = await response.blob();

      const fileUrl = URL.createObjectURL(blob);
      setReviewContext({
        fileUrl,
        filename: file,
        field,
        userId: selectedUser.id,
        mimeType: blob.type,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setFileLoading(false);
    }
  };

  const handleFileStatusUpdate = async (status) => {
    const token = localStorage.getItem('token');
    if (!token || !reviewContext) return;

    setIsLoading(true);
    try {
      const body = {
        userId: reviewContext.userId,
        field: reviewContext.field,
        status: status,
      };

      console.log('Sending review update:', body); // ✅ For debugging

      const response = await fetch(`${API_BASE}/api/userprofile/evidence/review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Review failed: ${text}`);
      }

      alert(`File marked as ${status}`);
      URL.revokeObjectURL(reviewContext.fileUrl);
      setReviewContext(null);
      fetchUsers(); // Refresh
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseReview = () => {
    if (reviewContext?.fileUrl) URL.revokeObjectURL(reviewContext.fileUrl);
    setReviewContext(null);
    setZoomLevel(1);
  };

  const filteredUsers = users.filter((u) =>
    u.UserId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClass = 'w-full p-2 rounded border border-gray-300 text-black';

  return (
    <div className="min-h-screen bg-[#efefee] text-black p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Document Review</h2>

      {isLoading && (
        <div className="flex justify-center">
          <FiLoader className="animate-spin text-4xl text-[#005b7c]" />
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by User ID..."
          className={`${inputClass} pl-10`}
        />
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const totalFiles =
            user.profile.education.evidence.length +
            user.profile.workExperience.evidence.length +
            user.profile.skills.evidence.length;

          return (
            <div
              key={user.id}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleUserSelect(user)}
              title={`User: ${user.UserId}`}
            >
              {user.profile.profilePicture ? (
                <img
                  src={user.profile.profilePicture}
                  alt={user.UserId}
                  className="w-12 h-12 rounded-full mb-2 object-cover"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              ) : (
                <div className="w-12 h-12 rounded-full mb-2 bg-gray-400 flex items-center justify-center text-white text-xs">
                  {user.UserId.charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="text-md font-semibold">{user.UserId}</h3>
              <p className="text-xs text-gray-600">{totalFiles} files uploaded</p>
            </div>
          );
        })}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Review Files - {selectedUser.UserId}</h3>

            {['education', 'workExperience', 'skills'].map((field) => (
              <div key={field} className="mb-4">
                <h4 className="capitalize font-medium">{field.replace('workExperience', 'Work Experience')}</h4>
                <p className="text-sm mb-1">{selectedUser.profile[field]?.text || 'No text provided'}</p>
                <p className="text-xs text-gray-600 mb-1">
                  Status:{' '}
                  <span className="font-semibold capitalize">
                    {selectedUser.profile[field]?.status || 'pending'}
                  </span>
                </p>
                {selectedUser.profile[field]?.evidence?.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm">
                    {selectedUser.profile[field].evidence.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href="#"
                          className="text-blue-600 underline"
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewFile(file, field);
                          }}
                        >
                          <FiDownload className="inline mr-1" />
                          {file}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No files uploaded.</p>
                )}
              </div>
            ))}

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 bg-[#005b7c] text-white px-4 py-2 rounded hover:bg-[#008eab]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {reviewContext && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90vw] max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-semibold mb-4">
              Review: {reviewContext.filename}
            </h3>

            {fileLoading ? (
              <FiLoader className="animate-spin text-4xl text-[#005b7c]" />
            ) : reviewContext.mimeType?.includes('pdf') ? (
              <iframe
                src={reviewContext.fileUrl}
                className="w-full h-[70vh] border"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: '0 0' }}
              />
            ) : (
              <img
                src={reviewContext.fileUrl}
                className="w-full max-h-[70vh] object-contain"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: '0 0' }}
              />
            )}

            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 2))}
                  className="bg-gray-600 text-white px-2 py-1 rounded"
                >
                  <FiZoomIn />
                </button>
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))}
                  className="bg-gray-600 text-white px-2 py-1 rounded"
                >
                  <FiZoomOut />
                </button>
                <span className="text-sm">Zoom: {Math.round(zoomLevel * 100)}%</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFileStatusUpdate('approved')}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-800"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleFileStatusUpdate('pending')}
                  className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-800"
                >
                  Pending
                </button>
                <button
                  onClick={() =>
                    window.confirm('Are you sure you want to reject this evidence?') &&
                    handleFileStatusUpdate('declined')
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                >
                  Reject
                </button>
                <button
                  onClick={handleCloseReview}
                  className="bg-[#005b7c] text-white px-3 py-1 rounded hover:bg-[#008eab]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReview;
