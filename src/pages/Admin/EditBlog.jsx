// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import AdminNavbar from "../../components/AdminNavbar"

// const EditBlog = () => {
//   const navigate = useNavigate()
//   const { id } = useParams()
//   const isEditMode = !!id

//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     category: "Software",
//     image: null,
//     imagePreview: null,
//   })
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(isEditMode)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")

//   const categories = ["Software", "Quality Assurance", "IT", "Accounting", "Digital", "Business"]

//   useEffect(() => {
//     // If in edit mode, fetch the blog data
//     if (isEditMode) {
//       const fetchBlog = async () => {
//         try {
//           const response = await fetch(`https://your-api-url/api/blogs/${id}`)
//           if (!response.ok) {
//             throw new Error("Failed to fetch blog data")
//           }
//           const blogData = await response.json()

//           setFormData({
//             title: blogData.title,
//             content: blogData.content,
//             category: blogData.category,
//             image: null,
//             imagePreview: blogData.imageUrl,
//           })
//         } catch (err) {
//           setError("Failed to load blog data. Please try again.")
//           console.error(err)
//         } finally {
//           setFetchLoading(false)
//         }
//       }

//       fetchBlog()
//     }
//   }, [id, isEditMode])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value,
//     })
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setFormData({
//         ...formData,
//         image: file,
//         imagePreview: URL.createObjectURL(file),
//       })
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError("")
//     setSuccess("")

//     try {
//       const formDataToSend = new FormData()
//       formDataToSend.append("title", formData.title)
//       formDataToSend.append("content", formData.content)
//       formDataToSend.append("category", formData.category)
//       if (formData.image) {
//         formDataToSend.append("image", formData.image)
//       }

//       const url = isEditMode ? `https://your-api-url/api/blogs/${id}` : "https://your-api-url/api/blogs"

//       const method = isEditMode ? "PUT" : "POST"

//       const response = await fetch(url, {
//         method: method,
//         body: formDataToSend,
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to ${isEditMode ? "update" : "add"} blog post`)
//       }

//       setSuccess(`Blog post ${isEditMode ? "updated" : "added"} successfully!`)

//       // Reset form after successful submission if adding new blog
//       if (!isEditMode) {
//         setFormData({
//           title: "",
//           content: "",
//           category: "Software",
//           image: null,
//           imagePreview: null,
//         })
//       }

//       // Redirect to blog management page after 2 seconds
//       setTimeout(() => {
//         navigate("/admin/blogs")
//       }, 2000)
//     } catch (err) {
//       setError(err.message || `An error occurred while ${isEditMode ? "updating" : "adding"} the blog post`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (!isEditMode) return

//     if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
//       return
//     }

//     setLoading(true)

//     try {
//       const response = await fetch(`https://your-api-url/api/blogs/${id}`, {
//         method: "DELETE",
//       })

//       if (!response.ok) {
//         throw new Error("Failed to delete blog post")
//       }

//       setSuccess("Blog post deleted successfully!")

//       // Redirect to blog management page after 2 seconds
//       setTimeout(() => {
//         navigate("/admin/blogs")
//       }, 2000)
//     } catch (err) {
//       setError(err.message || "An error occurred while deleting the blog post")
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (fetchLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <AdminNavbar />
//         <div className="container mx-auto p-6 flex justify-center items-center">
//           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#005B7C] border-r-transparent"></div>
//           <p className="ml-2">Loading blog data...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AdminNavbar />
//       <div className="container mx-auto p-6 max-w-4xl">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h1 className="text-2xl font-bold text-[#005B7C] mb-6">
//             {isEditMode ? "Edit Blog Post" : "Add New Blog Post"}
//           </h1>

//           {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

//           {success && (
//             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                 Blog Title
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
//                 placeholder="Enter blog title"
//               />
//             </div>

//             <div>
//               <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
//                 Category
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
//               >
//                 {categories.map((category) => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
//                 Blog Content
//               </label>
//               <textarea
//                 id="content"
//                 name="content"
//                 value={formData.content}
//                 onChange={handleChange}
//                 required
//                 rows={10}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
//                 placeholder="Write your blog content here..."
//               />
//             </div>

//             <div>
//               <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
//                 Blog Image
//               </label>
//               <input
//                 type="file"
//                 id="image"
//                 name="image"
//                 onChange={handleImageChange}
//                 accept="image/*"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
//               />
//               {formData.imagePreview && (
//                 <div className="mt-2">
//                   <img
//                     src={formData.imagePreview || "/placeholder.svg?height=150&width=150"}
//                     alt="Preview"
//                     className="h-40 object-cover rounded-md"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end space-x-2">
//               <button
//                 type="button"
//                 onClick={() => navigate("/admin/blogs")}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//               >
//                 Cancel
//               </button>

//               {isEditMode && (
//                 <button
//                   type="button"
//                   onClick={handleDelete}
//                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                   disabled={loading}
//                 >
//                   Delete
//                 </button>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-4 py-2 bg-[#005B7C] text-white rounded-md hover:bg-[#004d66] disabled:opacity-50"
//               >
//                 {loading ? (isEditMode ? "Updating..." : "Adding...") : isEditMode ? "Save" : "Add Blog Post"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditBlog




"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminNavbar from "../../components/AdminNavbar"
import API_BASE_URL, { API_URLS } from "../../config/api"

const EditBlog = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

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
    // If in edit mode, fetch the blog data
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          const response = await fetch(API_URLS.blogById(id))
          if (!response.ok) {
            throw new Error("Failed to fetch blog data")
          }
          const blogData = await response.json()

          setFormData({
            title: blogData.title,
            content: blogData.content,
            category: blogData.category,
            image: null,
            imagePreview: blogData.imageUrl ? `${API_BASE_URL}${blogData.imageUrl}` : null,
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
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
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
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "add"} blog post`)
      }

      setSuccess(`Blog post ${isEditMode ? "updated" : "added"} successfully!`)

      // Reset form after successful submission if adding new blog
      if (!isEditMode) {
        setFormData({
          title: "",
          content: "",
          category: "Software",
          image: null,
          imagePreview: null,
        })
      }

      // Redirect to blog management page after 2 seconds
      setTimeout(() => {
        navigate("/admin/blogs")
      }, 2000)
    } catch (err) {
      setError(err.message || `An error occurred while ${isEditMode ? "updating" : "adding"} the blog post`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!isEditMode) return

    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(API_URLS.blogById(id), {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete blog post")
      }

      setSuccess("Blog post deleted successfully!")

      // Redirect to blog management page after 2 seconds
      setTimeout(() => {
        navigate("/admin/blogs")
      }, 2000)
    } catch (err) {
      setError(err.message || "An error occurred while deleting the blog post")
    } finally {
      setLoading(false)
    }
  }

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
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005B7C]"
                placeholder="Write your blog content here... You can use HTML tags like <h2>, <p>, <ul>, <li>, etc."
              />
              <p className="text-sm text-gray-500 mt-1">
                Tip: Use &lt;h2&gt; tags for section headings and &lt;p&gt; tags for paragraphs.
              </p>
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
