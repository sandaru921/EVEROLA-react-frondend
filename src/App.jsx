import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserDashboard from "./pages/User/UserDashboard";
import UserActivities from "./pages/User/UserActivities";
import Invite from "./pages/User/Invite";
import Support from "./pages/User/Support";
import Chat from "./pages/User/Chat";
import Contact from "./pages/User/Contact";
import Privacy from "./pages/User/Privacy";
import UserProfile from "./pages/User/UserProfile";
import LoginPage from "./pages/User/LoginPage";
import RegisterPage from "./pages/User/RegisterPage";
import ForgotPasswordPage from "./pages/User/ForgotPasswordPage";
import HomePage from "./pages/User/HomePage";
import "./pages/User/HomePage.css";
import AdminChat from "./pages/Admin/AdminChat";
import PostJob from "./pages/Admin/postjob";
import AdminJobview from "./pages/Admin/AdminJobview";
import EditJob from "./pages/Admin/EditJob";
import UserJobview from "./pages/User/UserJobView";
import JobQuizDetails from "./pages/User/JobQuizDetails";





function App() {

  return (

    <BrowserRouter>
      <Routes>
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
        <Route path="/adminchat" element={<AdminChat />} />

        <Route path="/User/Jobview" element={<UserJobview/>} />
         <Route path="/User/Jobquizdetails/:id" element={<JobQuizDetails/>} />
        <Route path="/Admin/Jobview" element={<AdminJobview />} />
        <Route path="/Admin/Jobupload" element={<PostJob/>} />
      <Route path="/Admin/edit-job/:id" element={<EditJob />} />

        
      </Routes>
    </BrowserRouter>

  );
}

export default App;
