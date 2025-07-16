import "./App.css";

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
import AdminDashboard from "./pages/Admin/AdminDashboard";

import AdminChat from "./pages/Admin/AdminChat";

import Blog from "./pages/User/Blogs.jsx";
import BlogDetail from "./pages/User/BlogDetail.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import QuizDash from "./pages/Admin/QuizDash.jsx";
import AddQuiz from "./pages/Admin/NewQuiz.jsx";
import TryOutQuiz from "./pages/Admin/TryOutQuiz.jsx";


import ToastWrapper from "./components/ToastWrapper";
import AuthInterceptor from "@components/AuthInterceptor.jsx";
import PermissionManager from "./pages/Admin/PermissionManager.jsx";
import ProtectedRoute from "@components/ProtectedRoute.jsx";
import AdminSearchBar from "@components/AdminSearchBar.jsx";

function App() {
    const user = JSON.parse(localStorage.getItem("user"));

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


        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
    return (
        <BrowserRouter>
            <AuthInterceptor /> {/* Interceptor safely inside router context */}

            {/* Admin Search Bar (only show for logged-in admins) */}
            {user?.permissions?.includes("admin") && <AdminSearchBar />}

            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/login/forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/userdashboard" element={<UserDashboard/>}/>
                <Route path="/activities" element={<UserActivities/>}/>
                <Route path="/support" element={<Support/>}/>
                <Route path="/invite" element={<Invite/>}/>
                <Route path="/chat" element={<Chat/>}/>
                <Route path="/Joblanding" element={<JobLanding/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/privacy" element={<Privacy/>}/>
                <Route path="/profile" element={<UserProfile/>}/>
                <Route path="/adminchat" element={<AdminChat/>}/>
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/admin" element={<AdminDashboard />}>
                    <Route path="/admin/quizzes" element={<QuizDash />} />
                    <Route path="/admin/addNewQuiz" element={<AddQuiz />} />
                    <Route path="/admin/tryout/:id" element={<TryOutQuiz />} />
          {/* Add more nested routes if needed */}
                </Route>
                <Route
                    path="/permission-manager"
                    element={
                    <ProtectedRoute allowedRole="Admin">
                        <PermissionManager/>
                    </ProtectedRoute>}/>
            </Routes>
            <ToastWrapper />
        </BrowserRouter>
    );

}

export default App;