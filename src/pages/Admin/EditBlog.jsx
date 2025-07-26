"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminNavbar from "../../components/AdminNavbar"
import RichTextEditor from "../../components/RichTextEditor"
import { API_URLS } from "../../config/api"

//Handle navigation and extract blog ID from the URL
const EditBlog = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  //Stores the data from a form
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Software",
    image: null,
    imagePreview: null,
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEditMode)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const categories = ["Software", "Quality Assurance", "IT", "Accounting", "Digital", "Business"]

  useEffect(() => {
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          const response = await fetch(API_URLS.blogById(id), {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT token
            },
          })
          if (!response.ok) {
            throw new Error(`Failed to fetch blog data: ${response.statusText}`) //Checks if the request was successful.
          }
          //Makes sure the response is valid JSON.
          const contentType = response.headers.get("content-type")
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid response format from server")
          }
          //Parses the response data as JSON.
          const blogData = await response.json()
          //Sets the form fields to the values fetched from the blog post
          setFormData({
            title: blogData.title,
            content: blogData.content,
            category: blogData.category,
            image: null,
            imagePreview: blogData.imageUrl || null, // Use Blob Storage URL directly
          })
        } catch (err) {
          setError("Failed to load blog data. Please try again.")
          console.error(err)
        } finally {
          setFetchLoading(false)
        }
      }
      fetchBlog()
    } else {
      setFetchLoading(false)
    }
    // Cleanup imagePreview URLs on component unmount
    return () => {
      if (formData.imagePreview && formData.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(formData.imagePreview)
      }
    }
  }, [id, isEditMode])

  // Handles changes in form fields
  // Updates the formData state with the new values
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle rich text editor content changes
  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content: content,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate image type and size
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!validTypes.includes(file.type)) {
        setError("Only JPEG, PNG, and GIF images are allowed.")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.")
        return
      }

      // Revoke previous blob URL if exists
      if (formData.imagePreview && formData.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(formData.imagePreview)
      }

      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      })
    }
  }

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("content", formData.content)
      formDataToSend.append("category", formData.category)
      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }

      const url = isEditMode ? API_URLS.blogById(id) : API_URLS.blogs
      const method = isEditMode ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT token
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = `Failed to ${isEditMode ? "update" : "add"} blog post`
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        }
        throw new Error(errorMessage)
      }

      setSuccess(`Blog post ${isEditMode ? "updated" : "added"} successfully!`)
      //Checks if the component is not in edit mode
      if (!isEditMode) {
        // Revoke imagePreview URL if it exists
        if (formData.imagePreview && formData.imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(formData.imagePreview)
        }
        setFormData({
          title: "",
          content: "",
          category: "Software",
          image: null,
          imagePreview: null,
        })
      }

      // Redirect to the blogs list after a successful operation
      // Wait for 2 seconds before redirecting to allow the success message to be seen
      setTimeout(() => {
        navigate("/admin/blogs")
      }, 2000)
    } catch (err) {
      setError(err.message || `An error occurred while ${isEditMode ? "updating" : "adding"} the blog post`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Handles blog post deletion
  // Confirms with the user before deleting the blog post
  const handleDelete = async () => {
    if (!isEditMode) return

    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    // Sends a DELETE request to the server to delete the blog post
    try {
      const response = await fetch(API_URLS.blogById(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT token
        },
      })

      // Checks if the response is not ok
      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = "Failed to delete blog post"
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        }
        throw new Error(errorMessage)
      }

      setSuccess("Blog post deleted successfully!")

      setTimeout(() => {
        navigate("/admin/blogs")
      }, 2000)
    } catch (err) {
      setError(err.message || "An error occurred while deleting the blog post")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Show loading spinner while fetching blog data
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto p-6 flex justify-center items-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#005B7C] border-r-transparent"></div>
          <p className="ml-2">Loading blog data...</p>
        </div>
      </div>
    )
  }

  // Render the form for adding or editing a blog post
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-[#005B7C] mb-6">
            {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
          </h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your blog content here..."
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/gif"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
              />
              {formData.imagePreview && (
                <div className="mt-2">
                  <img
                    src={formData.imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="h-40 object-cover rounded-md"
                    onError={(e) => (e.target.src = "/placeholder.svg")} // Fallback for broken images
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => navigate("/admin/blogs")}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={loading}
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#005B7C] text-white rounded-md hover:bg-[#004d66] disabled:opacity-50"
              >
                {loading ? (isEditMode ? "Updating..." : "Adding...") : isEditMode ? "Save" : "Add Blog Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditBlog
