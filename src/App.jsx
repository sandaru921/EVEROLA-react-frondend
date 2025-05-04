






import "./App.css";
import "./pages/User/HomePage.css"; // Keep CSS import from incoming
import { BrowserRouter, Route, Routes } from "react-router-dom";

// User-related imports from incoming
import HomePage from "./pages/User/HomePage";
import LoginPage from "./pages/User/LoginPage";
import RegisterPage from "./pages/User/RegisterPage";
import ForgotPasswordPage from "./pages/User/ForgotPasswordPage";
import UserDashboard from "./pages/User/UserDashboard";
import UserActivities from "./pages/User/UserActivities";
import Invite from "./pages/User/Invite";
import Support from "./pages/User/Support";
import Chat from "./pages/User/Chat";
import JobLanding from "./pages/JobLanding.jsx";
import Contact from "./pages/User/Contact";
import Privacy from "./pages/User/Privacy";
import UserProfile from "./pages/User/UserProfile";

// Blog-related imports from current
import Blog from "./pages/User/Blogs";
import BlogDetail from "./pages/User/BlogDetail";

// Admin-related imports
import AdminChat from "./pages/Admin/AdminChat"; // From incoming
import ManageBlogs from "./pages/Admin/ManageBlogs"; // From current
import EditBlog from "./pages/Admin/EditBlog"; // From current

function App() {
  console.log("App component is rendering"); // Keep debug log from current

  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/activities" element={<UserActivities />} />
        <Route path="/support" element={<Support />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/joblanding" element={<JobLanding />} /> {/* Normalized to lowercase */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Blog Routes */}
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />

        {/* Admin Routes */}
        <Route path="/adminchat" element={<AdminChat />} />
        <Route path="/admin/blogs" element={<ManageBlogs />} />
        <Route path="/admin/blogs/add" element={<EditBlog />} />
        <Route path="/admin/blogs/edit/:id" element={<EditBlog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;