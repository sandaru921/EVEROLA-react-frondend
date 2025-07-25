"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { API_URLS } from "../../config/api"
import DOMPurify from "dompurify"



// ✅ Allow specific inline styles
DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
  if (data.attrName === "style") {
    const allowedStyles = ["color", "background-color", "font-size", "text-align", "text-decoration"]
    const filteredStyles = data.attrValue
      .split(";")
      .map((s) => s.trim())
      .filter((s) => allowedStyles.some((allowed) => s.startsWith(allowed)))
      .join("; ")
    data.attrValue = filteredStyles
    return data
  }
})

const BlogDetail = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const currentUrl = window.location.href

  useEffect(() => {
    const fetchBlogBySlug = async () => {
      setLoading(true)
      try {
        const response = await fetch(API_URLS.blogBySlug(slug))
        if (!response.ok) throw new Error("Failed to fetch blog")
        const data = await response.json()

        // ✅ Sanitize content safely
        data.content = DOMPurify.sanitize(data.content, {
          ALLOWED_TAGS: [
            "p", "br", "b", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
            "strong", "em", "i", "u", "span", "div", "a", "img", "blockquote"
          ],
          ALLOWED_ATTR: ["style", "href", "src", "alt", "class"],
          ALLOWED_STYLES: {
    "*": ["color", "background-color", "font-size", "text-align", "text-decoration"]
  }
 
        })

        setBlog(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching blog:", err)
        setError("Failed to load blog. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogBySlug()
  }, [slug])

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#005B7C]"></div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold text-red-500">Blog post not found</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <Link to="/blogs" className="text-[#005B7C] font-semibold mt-4 inline-block hover:underline">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#005B7C] text-white py-6">
        <div className="container mx-auto px-6">
          <Link to="/blogs" className="inline-flex items-center text-white hover:underline mb-4">
            ← Back to Blog
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{blog.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="max-w-none text-gray-700 leading-relaxed blog-content">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
            <div>
              <img
                src={blog.imageUrl || "/placeholder.svg?height=400&width=600"}
                alt={blog.title}
                className="w-full h-auto rounded-lg object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=400&width=600"
                }}
              />
            </div>
          </div>

          <div className="border-t p-6 flex flex-wrap justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                Published on{" "}
                <span className="font-semibold">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </p>
              {blog.updatedAt && (
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={shareOnLinkedIn}
                className="flex items-center space-x-2 bg-[#0077B5] text-white px-4 py-2 rounded-md hover:bg-[#005582] transition-colors"
              >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-linkedin"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                </svg>
                <span>Share</span>
              </button>

              <button
                onClick={shareOnFacebook}
                className="flex items-center space-x-2 bg-[#1877F2] text-white px-4 py-2 rounded-md hover:bg-[#166fe5] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-facebook"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for typography and inline styles */}
      <style>{`
        .blog-content ul {
          list-style-type: disc;
          margin: 1rem 0 1rem 2rem;
        }
        .blog-content ol {
          list-style-type: decimal;
          margin: 1rem 0 1rem 2rem;
        }
        .blog-content li {
          margin: 0.5rem 0;
        }
        .blog-content h1,
        .blog-content h2,
        .blog-content h3 {
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .blog-content h1 { font-size: 2rem; }
        .blog-content h2 { font-size: 1.5rem; }
        .blog-content h3 { font-size: 1.25rem; }

      
        .blog-content span[style*="background-color"] {
          background-color: inherit;
        }
       
      
}
      `}</style>
    </div>
  )
}

export default BlogDetail
