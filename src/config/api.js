// Base API URL configuration
const API_BASE_URL = "https://localhost:5031"

export const API_URLS = {
  blogs: `${API_BASE_URL}/api/blogs`,
  blogsByCategory: (category) => `${API_BASE_URL}/api/blogs/category/${category}`,
  blogById: (id) => `${API_BASE_URL}/api/blogs/${id}`,
  blogBySlug: (slug) => `${API_BASE_URL}/api/blogs/slug/${slug}`,
}

export default API_BASE_URL

