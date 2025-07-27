"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminNavbar from "../../components/AdminNavbar"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import API_BASE_URL, { API_URLS } from "../../config/api"
import AdminSidebar from "../../components/AdminSidebar"

const ManageBlogs = () => {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Fetch blogs when the component mounts
  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URLS.blogs)
      if (!response.ok) {
        throw new Error("Failed to fetch blogs")
      }
      const data = await response.json()
      setBlogs(data)
      setError("")
    } catch (err) {
      console.error("Error fetching blogs:", err)
      setError(err.message || "An error occurred while fetching blogs")
    } finally {
      setLoading(false)
    }
  }

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(API_URLS.blogById(deleteId), {
        method: "DELETE",
      })

      
      if (!response.ok) {
        throw new Error("Failed to delete blog")
      }

      setBlogs(blogs.filter((blog) => blog.id !== deleteId))
      setShowDeleteModal(false)
      setError("")
    } catch (err) {
      console.error("Error deleting blog:", err)
      setError(err.message || "An error occurred while deleting the blog")
    }
  }

  const handleAddBlog = () => {
    navigate("/admin/blogs/add")
  }

  const handleEditBlog = (id) => {
    navigate(`/admin/blogs/edit/${id}`)
  }

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <AdminSidebar />
      <div className="container mx-auto p-6 ml-64 pt-30 transition-all duration-300 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#005B7C]">Manage Blogs</h1>
          <button
            onClick={handleAddBlog}
            className="flex items-center px-4 py-2 bg-[#005B7C] text-white rounded-md hover:bg-[#004d66]"
          >
            <FaPlus className="mr-2" /> Add Blog
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#005B7C] border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <p className="text-gray-600 mb-4">No blogs found.</p>
            <button
              onClick={handleAddBlog}
              className="inline-flex items-center px-4 py-2 bg-[#005B7C] text-white rounded-md hover:bg-[#004d66]"
            >
              <FaPlus className="mr-2" /> Add Your First Blog
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={blog.imageUrl || "/placeholder.svg?height=50&width=50"}
                          alt={blog.title}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=50&width=50"
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                        <div className="text-xs text-blue-500">
                          <a href={`/blogs/${createSlug(blog.title)}`} target="_blank" rel="noopener noreferrer">
                            View Live
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditBlog(blog.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <FaEdit className="inline mr-1" /> Edit
                        </button>
                        <button onClick={() => handleDeleteClick(blog.id)} className="text-red-600 hover:text-red-900">
                          <FaTrash className="inline mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageBlogs
