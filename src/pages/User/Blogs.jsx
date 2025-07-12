

// "use client"

// import { useState } from "react"
// import BlogHeader from "../../assets/blog.jpg"
// import blog1 from "../../assets/security.jpeg"
// import blog2 from "../../assets/agile.png"
// import { Link } from "react-router-dom"
// import Navbar from "../../components/NavBar"

// const categories = [
//   { name: "Software", path: "software" },
//   { name: "Quality Assurance", path: "quality-assurance" },
//   { name: "IT", path: "it" },
//   { name: "Accounting", path: "accounting" },
//   { name: "Digital", path: "digital" },
//   { name: "Business", path: "business" },
// ]

// // Updated blogs object with slugs for easier routing
// const blogs = {
//   Software: [
//     {
//       id: 1,
//       title: "How To Tackle Security Testing And Challenges",
//       date: "April 07, 2023",
//       img: blog1,
//       slug: "how-to-tackle-security-testing-and-challenges",
//     },
//     {
//       id: 2,
//       title: "Agile Testing: It's a new age of testing",
//       date: "November 23, 2022",
//       img: blog2,
//       slug: "agile-testing-its-a-new-age-of-testing",
//     },
//   ],
//   "Quality Assurance": [
//     {
//       id: 3,
//       title: "CIA Triad of Security – Why does it matter?",
//       date: "June 26, 2023",
//       img: "/blog-post-2.png",
//       slug: "cia-triad-of-security-why-does-it-matter",
//     },
//   ],
//   IT: [
//     {
//       id: 4,
//       title: "Agile Testing: It's a new age of testing",
//       date: "November 23, 2022",
//       img: "/blog-post-3.png",
//       slug: "agile-testing-its-a-new-age-of-testing",
//     },
//   ],
//   Accounting: [],
//   Digital: [],
//   Business: [],
// }

// const Blog = () => {
//   const [activeCategory, setActiveCategory] = useState("Software")

//   return (
//     <div className="w-full">
//       <Navbar />

//       {/* Blog Header Image */}
//       <div className="relative w-full mt-16">
//         <img
//           src={BlogHeader || "/placeholder.svg"}
//           alt="Blog Header"
//           className="w-full h-[355px] object-cover opacity-75"
//         />
//       </div>

//       {/* Blog Title */}
//       <div className="container mx-auto p-4">
//         <h1 className="text-[64px] font-roboto text-[#005B7C] font-bold text-center my-6">Our Blog</h1>

//         {/* Category Navigation */}
//         <div className="w-full bg-[#005B7C] flex justify-center p-4">
//           <div className="flex gap-6 flex-wrap">
//             {categories.map((cat) => (
//               <button
//                 key={cat.name}
//                 onClick={() => setActiveCategory(cat.name)}
//                 className={`px-6 py-2 text-lg font-semibold transition-all duration-200 rounded-md ${
//                   activeCategory === cat.name
//                     ? "bg-white text-black"
//                     : "text-white bg-transparent hover:bg-white hover:text-black"
//                 }`}
//               >
//                 {cat.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Blog Posts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
//           {blogs[activeCategory].length > 0 ? (
//             blogs[activeCategory].map((blog) => (
//               <div key={blog.id} className="max-w-[344px] border rounded-lg shadow-md overflow-hidden bg-white mx-auto">
//                 {/* Blog Image */}
//                 <img src={blog.img || "/placeholder.svg"} alt={blog.title} className="w-full h-[180px] object-cover" />

//                 {/* Blog Content */}
//                 <div className="p-4">
//                   <h2 className="text-lg font-semibold">{blog.title}</h2>
//                   <p className="text-sm text-gray-500">{blog.date}</p>

//                   {/* Read More Button */}
//                   <Link
//                     to={`/blogs/${blog.slug}`}
//                     className="text-[#005B7C] font-semibold mt-2 inline-block hover:underline flex items-center"
//                   >
//                     Read More →
//                   </Link>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600 text-center col-span-3">No blogs available for this category.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Blog


"use client"

import { useState, useEffect } from "react"
import BlogHeader from "../../assets/blog.jpg"
import { Link } from "react-router-dom"

// import { API_URLS } from "../../config/api"
// import { API_BASE_URL } from "../../config/api" // Import API_BASE_URL
import API_BASE_URL, { API_URLS } from "../../config/api"
import Navbar from "../../components/Navbar"

const categories = [
  { name: "Software", path: "software" },
  { name: "Quality Assurance", path: "quality-assurance" },
  { name: "IT", path: "it" },
  { name: "Accounting", path: "accounting" },
  { name: "Digital", path: "digital" },
  { name: "Business", path: "business" },
]

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("Software")
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlogsByCategory(activeCategory)
  }, [activeCategory])

  const fetchBlogsByCategory = async (category) => {
    setLoading(true)
    try {
      const response = await fetch(API_URLS.blogsByCategory(category))
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs for category: ${category}`)
      }
      const data = await response.json()

      // Transform the data to include slugs
      const blogsWithSlugs = data.map((blog) => ({
        ...blog,
        slug: createSlug(blog.title),
      }))

      setBlogs(blogsWithSlugs)
      setError(null)
    } catch (err) {
      console.error("Error fetching blogs:", err)
      setError("Failed to load blogs. Please try again later.")
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  // Function to create a slug from a title
  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  return (
    <div className="w-full bg-white">
      <Navbar />

      {/* Blog Header Image */}
      <div className="relative w-full mt-16">
        <img
          src={BlogHeader || "/placeholder.svg?height=355&width=1200"}
          alt="Blog Header"
          className="w-full h-[355px] object-cover opacity-75"
        />
      </div>

      {/* Blog Title */}
      <div className="container mx-auto p-4">
        <h1 className="text-[64px] font-roboto text-[#005B7C] font-bold text-center my-6">Our Blog</h1>

        {/* Category Navigation */}
        <div className="w-full bg-[#005B7C] flex justify-center p-4">
          <div className="flex gap-6 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-6 py-2 text-lg font-semibold transition-all duration-200 rounded-md ${
                  activeCategory === cat.name
                    ? "bg-white text-black"
                    : "text-white bg-transparent hover:bg-white hover:text-black"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {loading ? (
            <div className="col-span-3 flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#005B7C]"></div>
            </div>
          ) : error ? (
            <div className="col-span-3 text-center py-10">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => fetchBlogsByCategory(activeCategory)}
                className="mt-4 px-4 py-2 bg-[#005B7C] text-white rounded-md hover:bg-[#004d66]"
              >
                Try Again
              </button>
            </div>
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog.id} className="max-w-[344px] border rounded-lg shadow-md overflow-hidden bg-white mx-auto">
                {/* Blog Image */}
                <img
                  src={blog.imageUrl ? `${API_BASE_URL}${blog.imageUrl}` : "/placeholder.svg?height=180&width=344"}
                  alt={blog.title}
                  className="w-full h-[180px] object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg?height=180&width=344"
                  }}
                />

                {/* Blog Content */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{blog.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {/* Read More Button */}
                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="text-[#005B7C] font-semibold mt-2 inline-block hover:underline flex items-center"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-3">No blogs available for this category.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog
