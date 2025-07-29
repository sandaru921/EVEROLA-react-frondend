import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import UserDashboard from "./pages/User/UserDashboard";
import UserActivities from "./pages/User/UserActivities";
import Invite from "./pages/User/Invite";
import Support from "./pages/User/Support";
import Chat from "./pages/User/Chat";
import JobLanding from "./pages/JobLanding.jsx";
import Contact from "./pages/User/Contact";
import Privacy from "./pages/User/Privacy";
import UserProfile from "./pages/User/UserProfile";
// Admin-related imports
import AdminChat from "./pages/Admin/AdminChat"; // From incoming
import AdminDashboard from "./pages/Admin/AdminDashboard";
import QuizDash from "./pages/Admin/QuizDash.jsx";
import AddQuiz from "./pages/Admin/NewQuiz.jsx";
import TryOutQuiz from "./pages/Admin/TryOutQuiz.jsx";
import LoginPage from "./pages/User/LoginPage";
import RegisterPage from "./pages/User/RegisterPage";
import ForgotPasswordPage from "./pages/User/ForgotPasswordPage";
import HomePage from "./pages/User/HomePage";
import SampleQuestions01 from "./pages/User/SampleQuestion01";
import SampleQuestions02 from "./pages/User/SampleQuestion02";
import ToastWrapper from "./components/ToastWrapper";
import AuthInterceptor from "@components/AuthInterceptor.jsx";
import PermissionManager from "./pages/Admin/PermissionManager.jsx";
import ProtectedRoute from "@components/ProtectedRoute.jsx";
import AdminSearchBar from "@components/AdminSearchBar.jsx";

function App() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <BrowserRouter>
            <AuthInterceptor/> {/* Interceptor safely inside router context */}

            {/* Admin Search Bar (only show for logged-in admins) */}
            {user?.permissions?.includes("admin") && <AdminSearchBar/>}

            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/login/forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/sample-question-01" element={<SampleQuestions01/>}/>
                <Route path="/sample-question-02" element={<SampleQuestions02/>}/>
                <Route path="/userdashboard"
                       element={
                           <ProtectedRoute>
                               <UserDashboard/>
                           </ProtectedRoute>
                       }/>
                <Route path="/activities"
                       element={
                           <ProtectedRoute>
                               <UserActivities/>
                           </ProtectedRoute>
                       }/>
                <Route path="/support"
                       element={
                           <ProtectedRoute>
                               <Support/>
                           </ProtectedRoute>
                       }/>
                <Route path="/invite"
                       element={
                           <ProtectedRoute>
                               <Invite/>
                           </ProtectedRoute>
                       }/>
                <Route path="/chat"
                       element={
                           <ProtectedRoute>
                               <Chat/>
                           </ProtectedRoute>
                       }/>
                <Route path="/Joblanding" element={<JobLanding/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/privacy" element={<Privacy/>}/>
                <Route path="/profile" element={<UserProfile/>}/>
                <Route path="/adminchat" element={<AdminChat/>}/>
                <Route path="/admindashboard" element={<AdminDashboard/>}/>
                <Route path="/admin" element={<AdminDashboard/>}>
                    <Route path="/admin/quizzes" element={<QuizDash/>}/>
                    <Route path="/admin/addNewQuiz" element={<AddQuiz/>}/>
                    <Route path="/admin/tryout/:id" element={<TryOutQuiz/>}/>
                    {/* Add more nested routes if needed */}
                </Route>
                <Route
                    path="/permission-manager"
                    element={
                        <ProtectedRoute allowedRole="Admin">
                            <PermissionManager/>
                        </ProtectedRoute>}/>
            </Routes>
            <ToastWrapper/>
        </BrowserRouter>
    );
}

export default App;
