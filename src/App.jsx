
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

// User-related imports from incoming

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

import "./pages/User/HomePage.css";
import AdminChat from "./pages/Admin/AdminChat";
import Blog from "./pages/User/Blogs.jsx";
import BlogDetail from "./pages/User/BlogDetail.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

import Blog from "./pages/User/Blogs";
import BlogDetail from "./pages/User/BlogDetail";

// Admin-related imports
import AdminChat from "./pages/Admin/AdminChat"; // From incoming
import ManageBlogs from "./pages/Admin/ManageBlogs"; // From current
import EditBlog from "./pages/Admin/EditBlog"; // From current
import AdminDashboard from "./pages/Admin/AdminDashboard";



// import Blog from "./pages/User/Blogs.jsx";
// import BlogDetail from "./pages/User/BlogDetail.jsx";
// import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

import QuizDash from "./pages/Admin/QuizDash.jsx";
import AddQuiz from "./pages/Admin/NewQuiz.jsx";
import TryOutQuiz from "./pages/Admin/TryOutQuiz.jsx";
import Home from "./pages/User/Home.jsx";
import AttemptQuiz from "./pages/User/AttemptQuiz.jsx";
import QuizSummary from "./pages/Admin/QuizResultUser.jsx";
import EditQuiz from "./pages/Admin/EditQuiz.jsx";
import EditQuizRoute from "./pages/Admin/EditQuiz.jsx";



function App() {

    const user = JSON.parse(localStorage.getItem("user"));


  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}

        <Route path="/" element={<Home />} />

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

        <Route path="/attemptquiz/:id" element = {<AttemptQuiz/>}/>
         <Route path="/results/:quizResultId" element = {<QuizSummary/>}/>
        
        


        {/* Blog Routes */}
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />

        {/* Admin Routes */}

        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/adminchat" element={<AdminChat />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="/admin/quizzes" element={<QuizDash />} />
          <Route path="/admin/addNewQuiz" element={<AddQuiz />} />
          <Route path="/admin/tryout/:id" element={<TryOutQuiz />} />
          <Route path="/admin/editQuiz/:id" element={<EditQuiz />} />

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


          {/* Add more nested routes if needed */}
        </Route> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;