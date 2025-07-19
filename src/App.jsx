
import "./App.css";
import "./pages/User/HomePage.css"; // Keep CSS import from incoming
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
import QuizDash from "./pages/Admin/QuizDash.jsx";
import AddQuiz from "./pages/Admin/NewQuiz.jsx";
import TryOutQuiz from "./pages/Admin/TryOutQuiz.jsx";
import HomePage from "./pages/User/HomePage.jsx";
import AttemptQuiz from './pages/User/AttemptQuiz.jsx'






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
        <Route path="/attemptquiz/:id" element={<AttemptQuiz />} />
        
        
        

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
          {/* Add more nested routes if needed */}
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;