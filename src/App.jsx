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
import LoginPage from "./pages/User/LoginPage";
import RegisterPage from "./pages/User/RegisterPage";
import ForgotPasswordPage from "./pages/User/ForgotPasswordPage";
import HomePage from "./pages/User/HomePage";
import "./pages/User/HomePage.css";
import AdminChat from "./pages/Admin/AdminChat";
import ToastWrapper from "./components/ToastWrapper";
import Sample from "./pages/User/Sample";
import AuthInterceptor from "@components/AuthInterceptor.jsx";
import PermissionManager from "./pages/Admin/PermissionManager.jsx";
import ProtectedRoute from "@components/ProtectedRoute.jsx";
import AdminSearchBar from "@components/AdminSearchBar.jsx";

function App() {
    const user = JSON.parse(localStorage.getItem("user"));

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
                <Route path="/sample" element={<Sample/>}/>
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
