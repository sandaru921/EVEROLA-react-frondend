



// import "./App.css"
// import { BrowserRouter, Route, Routes } from "react-router-dom"
// import Home from "./pages/User/Home"
// import UserDashboard from "./pages/User/UserDashboard"
// import UserActivities from "./pages/User/UserActivities"
// import Invite from "./pages/User/Invite"
// import Support from "./pages/User/Support"
// import Chat from "./pages/User/Chat"
// import Blog from "./pages/User/Blogs"
// import BlogDetail from "./pages/User/BlogDetail"

// // Admin routes
// import ManageBlogs from "./pages/Admin/ManageBlogs"
// import EditBlog from "./pages/Admin/EditBlog"

// function App() {
//   console.log("App component is rendering") // Debug log

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/dashboard" element={<UserDashboard />} />
//         <Route path="/activities" element={<UserActivities />} />
//         <Route path="/support" element={<Support />} />
//         <Route path="/invite" element={<Invite />} />
//         <Route path="/chat" element={<Chat />} />

//         <Route path="/blogs" element={<Blog />} />
//         <Route path="/blogs/:slug" element={<BlogDetail />} />

//         {/* Admin Routes */}
//         <Route path="/admin/blogs" element={<ManageBlogs />} />
//         <Route path="/admin/blogs/add" element={<EditBlog />} />
//         <Route path="/admin/blogs/edit/:id" element={<EditBlog />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App



import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/User/Home"
import UserDashboard from "./pages/User/UserDashboard"
import UserActivities from "./pages/User/UserActivities"
import Invite from "./pages/User/Invite"
import Support from "./pages/User/Support"
import Chat from "./pages/User/Chat"
import Blog from "./pages/User/Blogs"
import BlogDetail from "./pages/User/BlogDetail"

// Admin routes
import ManageBlogs from "./pages/Admin/ManageBlogs"
import EditBlog from "./pages/Admin/EditBlog"

function App() {
  console.log("App component is rendering") // Debug log

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/activities" element={<UserActivities />} />
        <Route path="/support" element={<Support />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/chat" element={<Chat />} />

        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/blogs" element={<ManageBlogs />} />
        <Route path="/admin/blogs/add" element={<EditBlog />} />
        <Route path="/admin/blogs/edit/:id" element={<EditBlog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
