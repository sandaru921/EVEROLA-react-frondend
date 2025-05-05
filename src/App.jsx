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
import UsersList from "./pages/Admin/UsersList";
import UserDetails from "./pages/Admin/UserDetails";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function App() {

  return (
    
    <BrowserRouter>
      <Routes>
      
      <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/login/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>

        
        <Route path="/dashboard" element={<UserDashboard/>}/>
        <Route path="/activities" element={<UserActivities/>}/>
        <Route path="/support" element={<Support />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/Joblanding" element={<Joblanding />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy/>}/>
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/adminchat" element={<AdminChat />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<UserDetails />} />

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
