"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminNavbar from "../../components/AdminNavbar"
import AdminSidebar from "../../components/AdminSidebar"
import RichTextEditor from "../../components/RichTextEditor"


import { API_URLS } from "../../config/api"

const AddBlog = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Software",
    image: null,
    imagePreview: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [contentError, setContentError] = useState("")

  const categories = ["Software", "Quality Assurance", "IT", "Accounting", "Digital", "Business"]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content: content,
    })
    // Clear content error when user starts typing
    if (contentError) {
      setContentError("")
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    setContentError("")

    // Validate content
    const contentText = formData.content.replace(/<[^>]*>/g, '').trim()
    if (!contentText) {
      setContentError("Blog content is required")
      setLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("content", formData.content)
      formDataToSend.append("category", formData.category)
      if (formData.image) {
        formDataToSend.append("image", formData.image)
      }

      const response = await fetch(API_URLS.blogs, {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to add blog post")
      }

      const data = await response.json()
      setSuccess("Blog post added successfully!")
      setFormData({
        title: "",
        content: "",
        category: "Software",
        image: null,
        imagePreview: null,
      })

      setTimeout(() => {
        navigate("/admin/blogs")
      }, 2000)
    } catch (err) {
      setError(err.message || "An error occurred while adding the blog post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="pt-20">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 ml-64 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-[#005B7C] mb-6">Add New Blog Post</h1>

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blog Content <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      placeholder="Write your blog content here..."
                    />
                    {contentError && (
                      <div className="mt-1 text-sm text-red-600">{contentError}</div>
                    )}
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
                      accept="image/*"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
                    />
                    {formData.imagePreview && (
                      <div className="mt-2">
                        <img
                          src={formData.imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-40 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/blogs")}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-[#005B7C] text-white rounded-md hover:bg-[#004d66] disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "Add Blog Post"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddBlog

