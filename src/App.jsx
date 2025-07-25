import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// User-related imports
import HomePage from "./pages/User/HomePage";
import LoginPage from "./pages/User/LoginPage";
import RegisterPage from "./pages/User/RegisterPage";
import ForgotPasswordPage from "./pages/User/ForgotPasswordPage";
import UserDashboard from "./pages/User/UserDashboard";
import UserActivities from "./pages/User/UserActivities";
import Invite from "./pages/User/Invite";
import Support from "./pages/User/Support";
import Chat from "./pages/User/Chat";
import Contact from "./pages/User/Contact";
import Privacy from "./pages/User/Privacy";
import UserProfile from "./pages/User/UserProfile";
import UserJobview from "./pages/User/UserJobView";
import JobQuizDetails from "./pages/User/JobQuizDetails";
import AttemptQuiz from "./pages/User/AttemptQuiz";

// Blog-related imports
import Blog from "./pages/User/Blogs";
import BlogDetail from "./pages/User/BlogDetail";

// Admin-related imports
import AdminChat from "./pages/Admin/AdminChat";
import PostJob from "./pages/Admin/postjob";
import AdminJobview from "./pages/Admin/AdminJobview";
import EditJob from "./pages/Admin/EditJob";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageBlogs from "./pages/Admin/ManageBlogs";
import EditBlog from "./pages/Admin/EditBlog";
import QuizDash from "./pages/Admin/QuizDash";
import AddQuiz from "./pages/Admin/NewQuiz";
import TryOutQuiz from "./pages/Admin/TryOutQuiz";
import AdminDashboardquiz from "./pages/Admin/AdminDashboardquiz";

// Component imports
import ToastWrapper from "./components/ToastWrapper";
import AuthInterceptor from "./components/AuthInterceptor";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminSearchBar from "./components/AdminSearchBar";

import "./pages/User/HomePage.css";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <AuthInterceptor /> {/* Interceptor safely inside router context */}

      {/* Admin Search Bar (only show for logged-in admins) */}
      {user?.permissions?.includes("admin") && <AdminSearchBar />}

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
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/joblanding" element={<JobLanding />} />
        <Route path="/user/jobview" element={<UserJobview />} />
        <Route path="/user/jobquizdetails/:id" element={<JobQuizDetails />} />
        <Route path="/attemptquiz/:id" element={<AttemptQuiz />} />

        {/* Blog Routes */}
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />

        {/* Admin Routes */}
        <Route path="/adminchat" element={<AdminChat />} />
        <Route path="/admin/jobview" element={<AdminJobview />} />
        <Route path="/admin/jobupload" element={<PostJob />} />
        <Route path="/admin/edit-job/:id" element={<EditJob />} />
        <Route path="/admin/blogs" element={<ManageBlogs />} />
        <Route path="/admin/blogs/add" element={<EditBlog />} />
        <Route path="/admin/blogs/edit/:id" element={<EditBlog />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route path="quizzes" element={<QuizDash />} />
          <Route path="addNewQuiz" element={<AddQuiz />} />
          <Route path="tryout/:id" element={<TryOutQuiz />} />
        </Route>
        <Route path="/admin/dashboardquiz" element={<AdminDashboardquiz />} />
        <Route
          path="/permission-manager"
          element={
            <ProtectedRoute allowedRole="Admin">
              <PermissionManager />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastWrapper />
    </BrowserRouter>
  );
}

export default App;